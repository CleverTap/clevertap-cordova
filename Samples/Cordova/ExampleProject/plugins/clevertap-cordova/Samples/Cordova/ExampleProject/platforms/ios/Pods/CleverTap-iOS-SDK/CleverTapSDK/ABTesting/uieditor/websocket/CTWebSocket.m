//   Based in part on Copyright 2012 Square Inc.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//


#import "CTWebSocket.h"
#import "CTConstants.h"
#import <CommonCrypto/CommonDigest.h>
#import <Security/SecRandom.h>

#if TARGET_OS_IPHONE
#define HAS_ICU
#endif

#ifdef HAS_ICU
#import <unicode/utf8.h>
#endif

#if TARGET_OS_IPHONE
#import <Endian.h>
#else
#import <CoreServices/CoreServices.h>
#endif

#if OS_OBJECT_USE_OBJC_RETAIN_RELEASE
#define CT_dispatch_retain(x)
#define CT_dispatch_release(x)
#define maybe_bridge(x) ((__bridge void *) x)
#else
#define CT_dispatch_retain(x) dispatch_retain(x)
#define CT_dispatch_release(x) dispatch_release(x)
#define maybe_bridge(x) (x)
#endif

typedef NS_OPTIONS(unsigned int, CTOpCode)  {
    CTOpCodeTextFrame = 0x1,
    CTOpCodeBinaryFrame = 0x2,
    // 3-7 reserved.
    CTOpCodeConnectionClose = 0x8,
    CTOpCodePing = 0x9,
    CTOpCodePong = 0xA,
    // B-F reserved.
};

typedef NS_ENUM(unsigned int, CTStatusCode) {
    CTStatusCodeNormal = 1000,
    CTStatusCodeGoingAway = 1001,
    CTStatusCodeProtocolError = 1002,
    CTStatusCodeUnhandledType = 1003,
    // 1004 reserved.
    CTStatusNoStatusReceived = 1005,
    // 1004-1006 reserved.
    CTStatusCodeInvalidUTF8 = 1007,
    CTStatusCodePolicyViolated = 1008,
    CTStatusCodeMessageTooBig = 1009,
};

typedef struct {
    BOOL fin;
    //  BOOL rsv1;
    //  BOOL rsv2;
    //  BOOL rsv3;
    uint8_t opcode;
    BOOL masked;
    uint64_t payload_length;
} frame_header;

static NSString *const CTWebSocketAppendToSecKeyString = @"258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

static inline int32_t validate_dispatch_data_partial_string(NSData *data);

@interface NSData (CTWebSocket)

- (NSString *)stringBySHA1ThenBase64Encoding;

@end


@interface NSString (CTWebSocket)

- (NSString *)stringBySHA1ThenBase64Encoding;

@end


@interface NSURL (CTWebSocket)

// The origin isn't really applicable for a native application.
// So instead, just map ws -> http and wss -> https.
- (NSString *)CT_origin;

@end


@interface _CTRunLoopThread : NSThread

@property (nonatomic, readonly) NSRunLoop *runLoop;

@end


static NSData *newSHA1(const char *bytes, size_t length) {
    uint8_t md[CC_SHA1_DIGEST_LENGTH];
    
    CC_SHA1(bytes, (uint)length, md);
    
    return [NSData dataWithBytes:md length:CC_SHA1_DIGEST_LENGTH];
}

@implementation NSData (CTWebSocket)

- (NSString *)stringBySHA1ThenBase64Encoding
{
    return [newSHA1(self.bytes, self.length) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

@end


@implementation NSString (CTWebSocket)

- (NSString *)stringBySHA1ThenBase64Encoding
{
    return [newSHA1(self.UTF8String, self.length) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

@end

NSString *const CTWebSocketErrorDomain = @"com.clevertap.error.WebSocket";

// Returns number of bytes consumed. Returning 0 means you didn't match.
// Sends bytes to callback handler;
typedef size_t (^stream_scanner)(NSData *collected_data);

typedef void (^data_callback)(CTWebSocket *webSocket,  NSData *data);

@interface CTIOConsumer : NSObject {
    stream_scanner _scanner;
    data_callback _handler;
    size_t _bytesNeeded;
    BOOL _readToCurrentFrame;
    BOOL _unmaskBytes;
}
@property (nonatomic, copy, readonly) stream_scanner consumer;
@property (nonatomic, copy, readonly) data_callback handler;
@property (nonatomic, assign) size_t bytesNeeded;
@property (nonatomic, assign, readonly) BOOL readToCurrentFrame;
@property (nonatomic, assign, readonly) BOOL unmaskBytes;

@end

// This class is not thread-safe, and is expected to always be run on the same queue.
@interface CTIOConsumerPool : NSObject

- (instancetype)initWithBufferCapacity:(NSUInteger)poolSize;

- (CTIOConsumer *)consumerWithScanner:(stream_scanner)scanner handler:(data_callback)handler bytesNeeded:(size_t)bytesNeeded readToCurrentFrame:(BOOL)readToCurrentFrame unmaskBytes:(BOOL)unmaskBytes;
- (void)returnConsumer:(CTIOConsumer *)consumer;

@end

@interface CTWebSocket ()  <NSStreamDelegate>

- (void)_writeData:(NSData *)data;
- (void)_closeWithProtocolError:(NSString *)message;
- (void)_failWithError:(NSError *)error;

- (void)_disconnect;

- (void)_readFrameNew;
- (void)_readFrameContinue;

- (void)_pumpScanner;

- (void)_pumpWriting;

- (void)_addConsumerWithScanner:(stream_scanner)consumer callback:(data_callback)callback;
- (void)_addConsumerWithDataLength:(size_t)dataLength callback:(data_callback)callback readToCurrentFrame:(BOOL)readToCurrentFrame unmaskBytes:(BOOL)unmaskBytes;
- (void)_addConsumerWithScanner:(stream_scanner)consumer callback:(data_callback)callback dataLength:(size_t)dataLength;
- (void)_readUntilBytes:(const void *)bytes length:(size_t)length callback:(data_callback)dataHandler;
- (void)_readUntilHeaderCompleteWithCallback:(data_callback)dataHandler;

- (void)_sendFrameWithOpcode:(CTOpCode)opcode data:(id)data;

- (BOOL)_checkHandshake:(CFHTTPMessageRef)httpMessage;
- (void)_commonInit;

- (void)_initializeStreams;
- (void)_connect;

@property (nonatomic) CTWebSocketReadyState readyState;

@property (nonatomic) NSOperationQueue *delegateOperationQueue;
@property (nonatomic) dispatch_queue_t delegateDispatchQueue;

@end


@implementation CTWebSocket {
    NSInteger _webSocketVersion;
    
    NSOperationQueue *_delegateOperationQueue;
    dispatch_queue_t _delegateDispatchQueue;
    
    dispatch_queue_t _workQueue;
    NSMutableArray *_consumers;
    
    NSInputStream *_inputStream;
    NSOutputStream *_outputStream;
    
    NSMutableData *_readBuffer;
    NSUInteger _readBufferOffset;
    
    NSMutableData *_outputBuffer;
    NSUInteger _outputBufferOffset;
    
    uint8_t _currentFrameOpcode;
    size_t _currentFrameCount;
    size_t _readOpCount;
    uint32_t _currentStringScanPosition;
    NSMutableData *_currentFrameData;
    
    NSString *_closeReason;
    
    NSString *_secKey;
    
    BOOL _pinnedCertFound;
    
    uint8_t _currentReadMaskKey[4];
    size_t _currentReadMaskOffset;
    
    BOOL _consumerStopped;
    
    BOOL _closeWhenFinishedWriting;
    BOOL _failed;
    
    BOOL _secure;
    NSURLRequest *_urlRequest;
    
    CFHTTPMessageRef _receivedHTTPHeaders;
    
    BOOL _sentClose;
    BOOL _didFail;
    BOOL _cleanupScheduled;
    int _closeCode;
    
    BOOL _isPumping;
    
    NSMutableSet *_scheduledRunloops;
    
    // We use this to retain ourselves.
    __strong CTWebSocket *_selfRetain;
    
    NSArray *_requestedProtocols;
    CTIOConsumerPool *_consumerPool;
}

@synthesize delegate = _delegate;
@synthesize url = _url;
@synthesize readyState = _readyState;
@synthesize protocol = _protocol;

static __strong NSData *CRLFCRLF;

+ (void)initialize {
    CRLFCRLF = [[NSData alloc] initWithBytes:"\r\n\r\n" length:4];
}

- (instancetype)initWithURLRequest:(NSURLRequest *)request protocols:(NSArray *)protocols {
    self = [super init];
    if (self) {
        assert(request.URL);
        _url = request.URL;
        _urlRequest = request;
        
        _requestedProtocols = [protocols copy];
        
        [self _commonInit];
    }
    
    return self;
}

- (instancetype)initWithURLRequest:(NSURLRequest *)request {
    return [self initWithURLRequest:request protocols:nil];
}

- (instancetype)initWithURL:(NSURL *)url {
    return [self initWithURL:url protocols:nil];
}

- (instancetype)initWithURL:(NSURL *)url protocols:(NSArray *)protocols {
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    return [self initWithURLRequest:request protocols:protocols];
}

- (NSString*)description {
    return @"CTWebSocket";
}

- (void)_commonInit {
    NSString *scheme = _url.scheme.lowercaseString;
    assert([scheme isEqualToString:@"ws"] || [scheme isEqualToString:@"http"] || [scheme isEqualToString:@"wss"] || [scheme isEqualToString:@"https"]);
    
    if ([scheme isEqualToString:@"wss"] || [scheme isEqualToString:@"https"]) {
        _secure = YES;
    }
    
    _readyState = CTWebSocketStateConnecting;
    _consumerStopped = YES;
    _webSocketVersion = 13;
    
    _workQueue = dispatch_queue_create(NULL, DISPATCH_QUEUE_SERIAL);
    
    // Going to set a specific on the queue so we can validate we're on the work queue
    dispatch_queue_set_specific(_workQueue, (__bridge void *)self, maybe_bridge(_workQueue), NULL);
    
    _delegateDispatchQueue = dispatch_get_main_queue();
    CT_dispatch_retain(_delegateDispatchQueue);
    
    _readBuffer = [[NSMutableData alloc] init];
    _outputBuffer = [[NSMutableData alloc] init];
    
    _currentFrameData = [[NSMutableData alloc] init];
    
    _consumers = [NSMutableArray array];
    
    _consumerPool = [[CTIOConsumerPool alloc] init];
    
    _scheduledRunloops = [NSMutableSet set];
    
    [self _initializeStreams];
    
    // default handlers
}

- (void)assertOnWorkQueue {
    assert(dispatch_get_specific((__bridge void *)self) == maybe_bridge(_workQueue));
}

- (void)dealloc {
    _inputStream.delegate = nil;
    _outputStream.delegate = nil;
    
    [_inputStream close];
    [_outputStream close];
    
    if (_workQueue) {
        CT_dispatch_release(_workQueue);
        _workQueue = NULL;
    }
    
    if (_receivedHTTPHeaders) {
        CFRelease(_receivedHTTPHeaders);
        _receivedHTTPHeaders = NULL;
    }
    
    if (_delegateDispatchQueue) {
        CT_dispatch_release(_delegateDispatchQueue);
        _delegateDispatchQueue = NULL;
    }
}

#ifndef NDEBUG

- (void)setReadyState:(CTWebSocketReadyState)aReadyState {
    [self willChangeValueForKey:@"readyState"];
    assert(aReadyState > _readyState);
    _readyState = aReadyState;
    [self didChangeValueForKey:@"readyState"];
}

#endif

- (void)open {
    assert(_url);
    NSAssert(_readyState == CTWebSocketStateConnecting, @"Cannot call -(void)open on CTWebSocket more than once");
    
    _selfRetain = self;
    
    [self _connect];
}

// Calls block on delegate queue
- (void)_performDelegateBlock:(dispatch_block_t)block {
    if (_delegateOperationQueue) {
        [_delegateOperationQueue addOperationWithBlock:block];
    } else {
        assert(_delegateDispatchQueue);
        dispatch_async(_delegateDispatchQueue, block);
    }
}

- (void)setDelegateDispatchQueue:(dispatch_queue_t)queue {
    if (queue) {
        CT_dispatch_retain(queue);
    }
    
    if (_delegateDispatchQueue) {
        CT_dispatch_release(_delegateDispatchQueue);
    }
    
    _delegateDispatchQueue = queue;
}

- (BOOL)_checkHandshake:(CFHTTPMessageRef)httpMessage {
    NSString *acceptHeader = CFBridgingRelease(CFHTTPMessageCopyHeaderFieldValue(httpMessage, CFSTR("Sec-WebSocket-Accept")));
    
    if (acceptHeader == nil) {
        return NO;
    }
    
    NSString *concatenatedString = [_secKey stringByAppendingString:CTWebSocketAppendToSecKeyString];
    NSString *expectedAccept = [concatenatedString stringBySHA1ThenBase64Encoding];
    
    return [acceptHeader isEqualToString:expectedAccept];
}

- (void)_HTTPHeadersDidFinish {
    NSInteger responseCode = CFHTTPMessageGetResponseStatusCode(_receivedHTTPHeaders);
    
    if (responseCode >= 400) {
        CleverTapLogStaticInternal(@"%@: Request failed with response code %ld", self, (long)responseCode);
        [self _failWithError:[NSError errorWithDomain:CTWebSocketErrorDomain code:2132 userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"received bad response code from server %ld", (long)responseCode]}]];
        return;
        
    }
    
    if (![self _checkHandshake:_receivedHTTPHeaders]) {
        [self _failWithError:[NSError errorWithDomain:CTWebSocketErrorDomain code:2133 userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Invalid Sec-WebSocket-Accept response"]}]];
        return;
    }
    
    NSString *negotiatedProtocol = CFBridgingRelease(CFHTTPMessageCopyHeaderFieldValue(_receivedHTTPHeaders, CFSTR("Sec-WebSocket-Protocol")));
    if (negotiatedProtocol) {
        // Make sure we requested the protocol
        if ([_requestedProtocols indexOfObject:negotiatedProtocol] == NSNotFound) {
            [self _failWithError:[NSError errorWithDomain:CTWebSocketErrorDomain code:2133 userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Server specified Sec-WebSocket-Protocol that wasn't requested"]}]];
            return;
        }
        
        _protocol = negotiatedProtocol;
    }
    
    self.readyState = CTWebSocketStateOpen;
    
    if (!_didFail) {
        [self _readFrameNew];
    }
    
    [self _performDelegateBlock:^{
        if ([self.delegate respondsToSelector:@selector(webSocketDidOpen:)]) {
            [self.delegate webSocketDidOpen:self];
        }
    }];
}


- (void)_readHTTPHeader {
    if (_receivedHTTPHeaders == NULL) {
        _receivedHTTPHeaders = CFHTTPMessageCreateEmpty(NULL, NO);
    }
    
    [self _readUntilHeaderCompleteWithCallback:^(CTWebSocket *websocket,  NSData *data) {
        CFHTTPMessageAppendBytes(websocket->_receivedHTTPHeaders, (const UInt8 *)data.bytes, (CFIndex)data.length);
        
        if (CFHTTPMessageIsHeaderComplete(websocket->_receivedHTTPHeaders)) {
            CleverTapLogStaticInternal(@"%@: Finished reading headers %@", self, CFBridgingRelease(CFHTTPMessageCopyAllHeaderFields(websocket->_receivedHTTPHeaders)));
            [websocket _HTTPHeadersDidFinish];
        } else {
            [websocket _readHTTPHeader];
        }
    }];
}

- (void)didConnect {
    CleverTapLogStaticInternal(@"%@: Connected", self);
    CFHTTPMessageRef request = CFHTTPMessageCreateRequest(NULL, CFSTR("GET"), (__bridge CFURLRef)_url, kCFHTTPVersion1_1);
    
    // Set host first so it defaults
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Host"), (__bridge CFStringRef)(_url.port != nil ? [NSString stringWithFormat:@"%@:%@", _url.host, _url.port] : _url.host));
    
    NSMutableData *keyBytes = [[NSMutableData alloc] initWithLength:16];
    int result = SecRandomCopyBytes(kSecRandomDefault, keyBytes.length, keyBytes.mutableBytes);
    if (result != 0) {
        CleverTapLogStaticInternal(@"%@: Failed to generate random bytes with status: %d", self, result);
    }
    _secKey = [keyBytes base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
    assert(_secKey.length == 24);
    
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Upgrade"), CFSTR("websocket"));
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Connection"), CFSTR("Upgrade"));
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Sec-WebSocket-Key"), (__bridge CFStringRef)_secKey);
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Sec-WebSocket-Version"), (__bridge CFStringRef)[NSString stringWithFormat:@"%ld", (long)_webSocketVersion]);
    
    CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Origin"), (__bridge CFStringRef)_url.CT_origin);
    
    if (_requestedProtocols) {
        CFHTTPMessageSetHeaderFieldValue(request, CFSTR("Sec-WebSocket-Protocol"), (__bridge CFStringRef)[_requestedProtocols componentsJoinedByString:@", "]);
    }
    
    [_urlRequest.allHTTPHeaderFields enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        CFHTTPMessageSetHeaderFieldValue(request, (__bridge CFStringRef)key, (__bridge CFStringRef)obj);
    }];
    
    NSData *message = CFBridgingRelease(CFHTTPMessageCopySerializedMessage(request));
    
    CFRelease(request);
    
    [self _writeData:message];
    [self _readHTTPHeader];
}

- (void)_initializeStreams {
    NSInteger port = _url.port.integerValue;
    if (port == 0) {
        if (!_secure) {
            port = 80;
        } else {
            port = 443;
        }
    }
    NSString *host = _url.host;
    
    CFReadStreamRef readStream = NULL;
    CFWriteStreamRef writeStream = NULL;
    
    CFStreamCreatePairWithSocketToHost(NULL, (__bridge CFStringRef)host, (UInt32)port, &readStream, &writeStream);
    
    _outputStream = CFBridgingRelease(writeStream);
    _inputStream = CFBridgingRelease(readStream);
    
    
    if (_secure) {
        NSMutableDictionary *SSLOptions = [NSMutableDictionary dictionary];
        
        [_outputStream setProperty:(__bridge id)kCFStreamSocketSecurityLevelNegotiatedSSL forKey:(__bridge id)kCFStreamPropertySocketSecurityLevel];
        
        // If we're using pinned certs, don't validate the certificate chain
        if ([_urlRequest CT_SSLPinnedCertificates].count) {
            [SSLOptions setValue:@NO forKey:(__bridge id)kCFStreamSSLValidatesCertificateChain];
        }
        
#if DEBUG
        [SSLOptions setValue:@NO forKey:(__bridge id)kCFStreamSSLValidatesCertificateChain];
        CleverTapLogStaticInternal(@"%@: In debug mode.  Allowing connection to any root cert", self);
#endif
        
        [_outputStream setProperty:SSLOptions
                            forKey:(__bridge id)kCFStreamPropertySSLSettings];
    }
    
    _inputStream.delegate = self;
    _outputStream.delegate = self;
}

- (void)_connect {
    if (!_scheduledRunloops.count) {
        [self scheduleInRunLoop:[NSRunLoop CT_networkRunLoop] forMode:NSDefaultRunLoopMode];
    }
    
    
    [_outputStream open];
    [_inputStream open];
}

- (void)scheduleInRunLoop:(NSRunLoop *)aRunLoop forMode:(NSString *)mode {
    [_outputStream scheduleInRunLoop:aRunLoop forMode:mode];
    [_inputStream scheduleInRunLoop:aRunLoop forMode:mode];
    
    [_scheduledRunloops addObject:@[aRunLoop, mode]];
}

- (void)unscheduleFromRunLoop:(NSRunLoop *)aRunLoop forMode:(NSString *)mode {
    [_outputStream removeFromRunLoop:aRunLoop forMode:mode];
    [_inputStream removeFromRunLoop:aRunLoop forMode:mode];
    
    [_scheduledRunloops removeObject:@[aRunLoop, mode]];
}

- (void)close {
    [self closeWithCode:CTStatusCodeNormal reason:nil];
}

- (void)closeWithCode:(NSInteger)code reason:(NSString *)reason {
    assert(code);
    dispatch_async(_workQueue, ^{
        if (self.readyState == CTWebSocketStateClosing || self.readyState == CTWebSocketStateClosed) {
            return;
        }
        
        BOOL wasConnecting = self.readyState == CTWebSocketStateConnecting;
        
        self.readyState = CTWebSocketStateClosing;
        
        CleverTapLogStaticInternal(@"%@: Closing with code %ld reason %@", self, (long)code, reason);
        
        if (wasConnecting) {
            [self _disconnect];
            return;
        }
        
        size_t maxMsgSize = [reason maximumLengthOfBytesUsingEncoding:NSUTF8StringEncoding];
        NSMutableData *mutablePayload = [[NSMutableData alloc] initWithLength:sizeof(uint16_t) + maxMsgSize];
        NSData *payload = mutablePayload;
        
        ((uint16_t *)mutablePayload.mutableBytes)[0] = EndianU16_BtoN(code);
        
        if (reason) {
            NSRange remainingRange = NSMakeRange(0, 0);
            NSUInteger usedLength = 0;
            
            BOOL success = [reason getBytes:(char *)mutablePayload.mutableBytes + sizeof(uint16_t) maxLength:payload.length - sizeof(uint16_t) usedLength:&usedLength encoding:NSUTF8StringEncoding options:NSStringEncodingConversionExternalRepresentation range:NSMakeRange(0, reason.length) remainingRange:&remainingRange];
            
            assert(success);
            assert(remainingRange.length == 0);
            
            if (usedLength != maxMsgSize) {
                payload = [payload subdataWithRange:NSMakeRange(0, usedLength + sizeof(uint16_t))];
            }
        }
        
        [self _sendFrameWithOpcode:CTOpCodeConnectionClose data:payload];
    });
}

- (void)_closeWithProtocolError:(NSString *)message {
    // Need to shunt this on the _callbackQueue first to see if they received any messages
    [self _performDelegateBlock:^{
        [self closeWithCode:CTStatusCodeProtocolError reason:message];
        dispatch_async(self->_workQueue, ^{
            [self _disconnect];
        });
    }];
}

- (void)_failWithError:(NSError *)error {
    dispatch_async(_workQueue, ^{
        if (self.readyState != CTWebSocketStateClosed) {
            self->_failed = YES;
            [self _performDelegateBlock:^{
                if ([self.delegate respondsToSelector:@selector(webSocket:didFailWithError:)]) {
                    [self.delegate webSocket:self didFailWithError:error];
                }
            }];
            
            self.readyState = CTWebSocketStateClosed;
            
            CleverTapLogStaticInternal(@"%@: Failing with error %@", self, error.localizedDescription);
            
            [self _disconnect];
            [self _scheduleCleanup];
        }
    });
}

- (void)_writeData:(NSData *)data {
    [self assertOnWorkQueue];
    
    if (_closeWhenFinishedWriting) {
        return;
    }
    [_outputBuffer appendData:data];
    [self _pumpWriting];
}

- (void)send:(id)data {
    NSAssert(self.readyState != CTWebSocketStateConnecting, @"Invalid State: Cannot call send: until connection is open");
    // TODO: maybe not copy this for performance
    data = [data copy];
    dispatch_async(_workQueue, ^{
        if ([data isKindOfClass:[NSString class]]) {
            [self _sendFrameWithOpcode:CTOpCodeTextFrame data:[(NSString *)data dataUsingEncoding:NSUTF8StringEncoding]];
        } else if ([data isKindOfClass:[NSData class]]) {
            [self _sendFrameWithOpcode:CTOpCodeBinaryFrame data:data];
        } else if (data == nil) {
            [self _sendFrameWithOpcode:CTOpCodeTextFrame data:data];
        } else {
            assert(NO);
        }
    });
}

- (void)handlePing:(NSData *)pingData {
    // Need to pingpong this off _callbackQueue first to make sure messages happen in order
    [self _performDelegateBlock:^{
        dispatch_async(self->_workQueue, ^{
            [self _sendFrameWithOpcode:CTOpCodePong data:pingData];
        });
    }];
}

- (void)handlePong {
    // NOOP
}

- (void)_handleMessage:(id)message {
    CleverTapLogStaticInternal(@"Received message");
    [self _performDelegateBlock:^{
        [self.delegate webSocket:self didReceiveMessage:message];
    }];
}


static inline BOOL closeCodeIsValid(int closeCode) {
    if (closeCode < 1000) {
        return NO;
    }
    
    if (closeCode >= 1000 && closeCode <= 1011) {
        if (closeCode == 1004 ||
            closeCode == 1005 ||
            closeCode == 1006) {
            return NO;
        }
        return YES;
    }
    
    if (closeCode >= 3000 && closeCode <= 3999) {
        return YES;
    }
    
    if (closeCode >= 4000 && closeCode <= 4999) {
        return YES;
    }
    
    return NO;
}

//  Note from RFC:
//
//  If there is a body, the first two
//  bytes of the body MUST be a 2-byte unsigned integer (in network byte
//  order) representing a status code with value /code/ defined in
//  Section 7.4.  Following the 2-byte integer the body MAY contain UTF-8
//  encoded data with value /reason/, the interpretation of which is not
//  defined by this specification.

- (void)handleCloseWithData:(NSData *)data {
    size_t dataSize = data.length;
    __block uint16_t closeCode = 0;
    
    CleverTapLogStaticInternal(@"Received close frame");
    
    if (dataSize == 1) {
        // TODO handle error
        [self _closeWithProtocolError:@"Payload for close must be larger than 2 bytes"];
        return;
    } else if (dataSize >= 2) {
        [data getBytes:&closeCode length:sizeof(closeCode)];
        _closeCode = EndianU16_BtoN(closeCode);
        if (!closeCodeIsValid(_closeCode)) {
            [self _closeWithProtocolError:[NSString stringWithFormat:@"Cannot have close code of %d", _closeCode]];
            return;
        }
        if (dataSize > 2) {
            _closeReason = [[NSString alloc] initWithData:[data subdataWithRange:NSMakeRange(2, dataSize - 2)] encoding:NSUTF8StringEncoding];
            if (!_closeReason) {
                [self _closeWithProtocolError:@"Close reason MUST be valid UTF-8"];
                return;
            }
        }
    } else {
        _closeCode = CTStatusNoStatusReceived;
    }
    
    [self assertOnWorkQueue];
    
    if (self.readyState == CTWebSocketStateOpen) {
        [self closeWithCode:CTStatusCodeNormal reason:nil];
    }
    dispatch_async(_workQueue, ^{
        [self _disconnect];
    });
}

- (void)_disconnect {
    [self assertOnWorkQueue];
    CleverTapLogStaticInternal(@"Trying to disconnect");
    _closeWhenFinishedWriting = YES;
    [self _pumpWriting];
}

- (void)_handleFrameWithData:(NSData *)frameData opCode:(NSInteger)opcode {
    // Check that the current data is valid UTF8
    
    BOOL isControlFrame = (opcode == CTOpCodePing || opcode == CTOpCodePong || opcode == CTOpCodeConnectionClose);
    if (!isControlFrame) {
        [self _readFrameNew];
    } else {
        dispatch_async(_workQueue, ^{
            [self _readFrameContinue];
        });
    }
    
    switch (opcode) {
        case CTOpCodeTextFrame: {
            NSString *str = [[NSString alloc] initWithData:frameData encoding:NSUTF8StringEncoding];
            if (str == nil && frameData) {
                [self closeWithCode:CTStatusCodeInvalidUTF8 reason:@"Text frames must be valid UTF-8"];
                dispatch_async(_workQueue, ^{
                    [self _disconnect];
                });
                
                return;
            }
            [self _handleMessage:str];
            break;
        }
        case CTOpCodeBinaryFrame:
            [self _handleMessage:[frameData copy]];
            break;
        case CTOpCodeConnectionClose:
            [self handleCloseWithData:frameData];
            break;
        case CTOpCodePing:
            [self handlePing:frameData];
            break;
        case CTOpCodePong:
            [self handlePong];
            break;
        default:
            [self _closeWithProtocolError:[NSString stringWithFormat:@"Unknown opcode %ld", (long)opcode]];
            // TODO: Handle invalid opcode
            break;
    }
}

- (void)_handleFrameHeader:(frame_header)frame_header curData:(NSData *)curData {
    NSParameterAssert(frame_header.opcode != 0);
    
    if (self.readyState != CTWebSocketStateOpen) {
        return;
    }
    
    
    BOOL isControlFrame = (frame_header.opcode == CTOpCodePing || frame_header.opcode == CTOpCodePong || frame_header.opcode == CTOpCodeConnectionClose);
    
    if (isControlFrame && !frame_header.fin) {
        [self _closeWithProtocolError:@"Fragmented control frames not allowed"];
        return;
    }
    
    if (isControlFrame && frame_header.payload_length >= 126) {
        [self _closeWithProtocolError:@"Control frames cannot have payloads larger than 126 bytes"];
        return;
    }
    
    if (!isControlFrame) {
        _currentFrameOpcode = frame_header.opcode;
        _currentFrameCount += 1;
    }
    
    if (frame_header.payload_length == 0) {
        if (isControlFrame) {
            [self _handleFrameWithData:curData opCode:frame_header.opcode];
        } else {
            if (frame_header.fin) {
                [self _handleFrameWithData:_currentFrameData opCode:frame_header.opcode];
            } else {
                // TODO add assert that opcode is not a control;
                [self _readFrameContinue];
            }
        }
    } else {
        [self _addConsumerWithDataLength:(size_t)frame_header.payload_length callback:^(CTWebSocket *websocket, NSData *newData) {
            if (isControlFrame) {
                [websocket _handleFrameWithData:newData opCode:frame_header.opcode];
            } else {
                if (frame_header.fin) {
                    [websocket _handleFrameWithData:websocket->_currentFrameData opCode:frame_header.opcode];
                } else {
                    // TODO add assert that opcode is not a control;
                    [websocket _readFrameContinue];
                }
                
            }
        } readToCurrentFrame:!isControlFrame unmaskBytes:frame_header.masked];
    }
}

/* From RFC:
 
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
 */

static const uint8_t CTFinMask          = 0x80;
static const uint8_t CTOpCodeMask       = 0x0F;
static const uint8_t CTRsvMask          = 0x70;
static const uint8_t CTMaskMask         = 0x80;
static const uint8_t CTPayloadLenMask   = 0x7F;


- (void)_readFrameContinue {
    assert((_currentFrameCount == 0 && _currentFrameOpcode == 0) || (_currentFrameCount > 0 && _currentFrameOpcode > 0));
    
    [self _addConsumerWithDataLength:2 callback:^(CTWebSocket *websocket, NSData *data) {
        __block frame_header header = { .fin = NO, .opcode = 0, .masked = NO, .payload_length = 0 };
        
        const uint8_t *headerBuffer = data.bytes;
        assert(data.length >= 2);
        
        if (headerBuffer[0] & CTRsvMask) {
            [websocket _closeWithProtocolError:@"Server used RSV bits"];
            return;
        }
        
        uint8_t receivedOpcode = (CTOpCodeMask & headerBuffer[0]);
        
        BOOL isControlFrame = (receivedOpcode == CTOpCodePing || receivedOpcode == CTOpCodePong || receivedOpcode == CTOpCodeConnectionClose);
        
        if (!isControlFrame && receivedOpcode != 0 && websocket->_currentFrameCount > 0) {
            [websocket _closeWithProtocolError:@"all data frames after the initial data frame must have opcode 0"];
            return;
        }
        
        if (receivedOpcode == 0 && websocket->_currentFrameCount == 0) {
            [websocket _closeWithProtocolError:@"cannot continue a message"];
            return;
        }
        
        header.opcode = receivedOpcode == 0 ? websocket->_currentFrameOpcode : receivedOpcode;
        
        header.fin = !!(CTFinMask & headerBuffer[0]);
        
        
        header.masked = !!(CTMaskMask & headerBuffer[1]);
        header.payload_length = CTPayloadLenMask & headerBuffer[1];
        
        if (header.masked) {
            [websocket _closeWithProtocolError:@"Client must receive unmasked data"];
        }
        
        size_t extra_bytes_needed = header.masked ? sizeof(websocket->_currentReadMaskKey) : 0;
        
        if (header.payload_length == 126) {
            extra_bytes_needed += sizeof(uint16_t);
        } else if (header.payload_length == 127) {
            extra_bytes_needed += sizeof(uint64_t);
        }
        
        if (extra_bytes_needed == 0) {
            [websocket _handleFrameHeader:header curData:websocket->_currentFrameData];
        } else {
            [websocket _addConsumerWithDataLength:extra_bytes_needed callback:^(CTWebSocket *websocket2, NSData *data2) {
                size_t mapped_size = data2.length;
                const void *mapped_buffer = data2.bytes;
                size_t offset = 0;
                
                if (header.payload_length == 126) {
                    assert(mapped_size >= sizeof(uint16_t));
                    uint16_t newLen = EndianU16_BtoN(*(uint16_t *)(mapped_buffer));
                    header.payload_length = newLen;
                    offset += sizeof(uint16_t);
                } else if (header.payload_length == 127) {
                    assert(mapped_size >= sizeof(uint64_t));
                    header.payload_length = EndianU64_BtoN(*(uint64_t *)(mapped_buffer));
                    offset += sizeof(uint64_t);
                } else {
                    assert(header.payload_length < 126 && header.payload_length >= 0);
                }
                
                
                if (header.masked) {
                    assert(mapped_size >= sizeof(websocket2->_currentReadMaskOffset) + offset);
                    memcpy(websocket2->_currentReadMaskKey, ((uint8_t *)mapped_buffer) + offset, sizeof(websocket2->_currentReadMaskKey));
                }
                
                [websocket2 _handleFrameHeader:header curData:websocket2->_currentFrameData];
            } readToCurrentFrame:NO unmaskBytes:NO];
        }
    } readToCurrentFrame:NO unmaskBytes:NO];
}

- (void)_readFrameNew {
    dispatch_async(_workQueue, ^{
        self->_currentFrameData.length = 0;
        
        self->_currentFrameOpcode = 0;
        self->_currentFrameCount = 0;
        self->_readOpCount = 0;
        self->_currentStringScanPosition = 0;
        
        [self _readFrameContinue];
    });
}

- (void)_pumpWriting {
    [self assertOnWorkQueue];
    
    NSUInteger dataLength = _outputBuffer.length;
    if (dataLength - _outputBufferOffset > 0 && _outputStream.hasSpaceAvailable) {
        NSInteger bytesWritten = [_outputStream write:((const uint8_t *)_outputBuffer.bytes + _outputBufferOffset) maxLength:(dataLength - _outputBufferOffset)];
        if (bytesWritten == -1) {
            [self _failWithError:[NSError errorWithDomain:CTWebSocketErrorDomain code:2145 userInfo:@{NSLocalizedDescriptionKey: @"Error writing to stream"}]];
            return;
        }
        
        _outputBufferOffset += (NSUInteger) bytesWritten;
        
        if (_outputBufferOffset > 4096 && _outputBufferOffset > (_outputBuffer.length >> 1)) {
            _outputBuffer = [[NSMutableData alloc] initWithBytes:((char *)_outputBuffer.bytes + _outputBufferOffset) length:(_outputBuffer.length - _outputBufferOffset)];
            _outputBufferOffset = 0;
        }
    }
    
    if (_closeWhenFinishedWriting &&
        _outputBuffer.length - _outputBufferOffset == 0 &&
        (_inputStream.streamStatus != NSStreamStatusNotOpen &&
         _inputStream.streamStatus != NSStreamStatusClosed) &&
        !_sentClose) {
        _sentClose = YES;
        
        @synchronized(self) {
            [_outputStream close];
            [_inputStream close];
            
            
            for (NSArray *runLoop in [_scheduledRunloops copy]) {
                [self unscheduleFromRunLoop:runLoop[0] forMode:runLoop[1]];
            }
        }
        
        if (!_failed) {
            [self _performDelegateBlock:^{
                if ([self.delegate respondsToSelector:@selector(webSocket:didCloseWithCode:reason:wasClean:)]) {
                    [self.delegate webSocket:self didCloseWithCode:self->_closeCode reason:self->_closeReason wasClean:YES];
                }
            }];
        }
        
        [self _scheduleCleanup];
    }
}

- (void)_addConsumerWithScanner:(stream_scanner)consumer callback:(data_callback)callback {
    [self assertOnWorkQueue];
    [self _addConsumerWithScanner:consumer callback:callback dataLength:0];
}

- (void)_addConsumerWithDataLength:(size_t)dataLength callback:(data_callback)callback readToCurrentFrame:(BOOL)readToCurrentFrame unmaskBytes:(BOOL)unmaskBytes {
    [self assertOnWorkQueue];
    assert(dataLength);
    
    [_consumers addObject:[_consumerPool consumerWithScanner:nil handler:callback bytesNeeded:dataLength readToCurrentFrame:readToCurrentFrame unmaskBytes:unmaskBytes]];
    [self _pumpScanner];
}

- (void)_addConsumerWithScanner:(stream_scanner)consumer callback:(data_callback)callback dataLength:(size_t)dataLength {
    [self assertOnWorkQueue];
    [_consumers addObject:[_consumerPool consumerWithScanner:consumer handler:callback bytesNeeded:dataLength readToCurrentFrame:NO unmaskBytes:NO]];
    [self _pumpScanner];
}

- (void)_scheduleCleanup {
    @synchronized(self) {
        if (_cleanupScheduled) {
            return;
        }
        
        _cleanupScheduled = YES;
        
        // Cleanup NSStream delegate's in the same RunLoop used by the streams themselves:
        // This way we'll prevent race conditions between handleEvent and SRWebsocket's dealloc
        NSTimer *timer = [NSTimer timerWithTimeInterval:0.f
                                                 target:self
                                               selector:@selector(_cleanupSelfReference)
                                               userInfo:nil
                                                repeats:NO];
        
        [[NSRunLoop CT_networkRunLoop] addTimer:timer
                                        forMode:NSDefaultRunLoopMode];
    }
}

- (void)_cleanupSelfReference {
    @synchronized(self) {
        // Remove the delegates for each stream so we don't fire any events on
        // close or error
        _inputStream.delegate = nil;
        _outputStream.delegate = nil;
        
        // Close the streams, which will immediately remove them from the run
        // loop.
        [_inputStream close];
        [_outputStream close];
    }
    
    // Cleanup self reference in the same GCD queue as usual
    dispatch_async(_workQueue, ^{
        self->_selfRetain = nil;
    });
}


static const char CRLFCRLFBytes[] = {'\r', '\n', '\r', '\n'};

- (void)_readUntilHeaderCompleteWithCallback:(data_callback)dataHandler {
    [self _readUntilBytes:CRLFCRLFBytes length:sizeof(CRLFCRLFBytes) callback:dataHandler];
}

- (void)_readUntilBytes:(const void *)bytes length:(size_t)length callback:(data_callback)dataHandler {
    // TODO optimize so this can continue from where we last searched
    stream_scanner consumer = ^size_t(NSData *data) {
        __block size_t found_size = 0;
        __block size_t match_count = 0;
        
        size_t size = data.length;
        const unsigned char *buffer = data.bytes;
        for (size_t i = 0; i < size; i++ ) {
            if (buffer[i] == ((const unsigned char *)bytes)[match_count]) {
                match_count += 1;
                if (match_count == length) {
                    found_size = i + 1;
                    break;
                }
            } else {
                match_count = 0;
            }
        }
        return found_size;
    };
    [self _addConsumerWithScanner:consumer callback:dataHandler];
}


// Returns true if did work
- (BOOL)_innerPumpScanner {
    
    BOOL didWork = NO;
    
    if (self.readyState >= CTWebSocketStateClosing) {
        return didWork;
    }
    
    if (!_consumers.count) {
        return didWork;
    }
    
    size_t curSize = _readBuffer.length - _readBufferOffset;
    if (!curSize) {
        return didWork;
    }
    
    CTIOConsumer *consumer = _consumers[0];
    
    size_t bytesNeeded = consumer.bytesNeeded;
    
    size_t foundSize = 0;
    if (consumer.consumer) {
        NSData *tempView = [NSData dataWithBytesNoCopy:(char *)_readBuffer.bytes + _readBufferOffset length:_readBuffer.length - _readBufferOffset freeWhenDone:NO];
        foundSize = consumer.consumer(tempView);
    } else {
        assert(consumer.bytesNeeded);
        if (curSize >= bytesNeeded) {
            foundSize = bytesNeeded;
        } else if (consumer.readToCurrentFrame) {
            foundSize = curSize;
        }
    }
    
    NSData *slice = nil;
    if (consumer.readToCurrentFrame || foundSize) {
        NSRange sliceRange = NSMakeRange(_readBufferOffset, foundSize);
        slice = [_readBuffer subdataWithRange:sliceRange];
        
        _readBufferOffset += foundSize;
        
        if (_readBufferOffset > 4096 && _readBufferOffset > (_readBuffer.length >> 1)) {
            _readBuffer = [[NSMutableData alloc] initWithBytes:(char *)_readBuffer.bytes + _readBufferOffset length:_readBuffer.length - _readBufferOffset];            _readBufferOffset = 0;
        }
        
        if (consumer.unmaskBytes) {
            NSMutableData *mutableSlice = [slice mutableCopy];
            
            NSUInteger len = mutableSlice.length;
            uint8_t *bytes = mutableSlice.mutableBytes;
            
            for (NSUInteger i = 0; i < len; i++) {
                bytes[i] = bytes[i] ^ _currentReadMaskKey[_currentReadMaskOffset % sizeof(_currentReadMaskKey)];
                _currentReadMaskOffset += 1;
            }
            
            slice = mutableSlice;
        }
        
        if (consumer.readToCurrentFrame) {
            [_currentFrameData appendData:slice];
            
            _readOpCount += 1;
            
            if (_currentFrameOpcode == CTOpCodeTextFrame) {
                // Validate UTF8 stuff.
                size_t currentDataSize = _currentFrameData.length;
                if (_currentFrameOpcode == CTOpCodeTextFrame && currentDataSize > 0) {
                    // TODO: Optimize the crap out of this.  Don't really have to copy all the data each time
                    
                    size_t scanSize = currentDataSize - _currentStringScanPosition;
                    
                    NSData *scan_data = [_currentFrameData subdataWithRange:NSMakeRange(_currentStringScanPosition, scanSize)];
                    int32_t valid_utf8_size = validate_dispatch_data_partial_string(scan_data);
                    
                    if (valid_utf8_size == -1) {
                        [self closeWithCode:CTStatusCodeInvalidUTF8 reason:@"Text frames must be valid UTF-8"];
                        dispatch_async(_workQueue, ^{
                            [self _disconnect];
                        });
                        return didWork;
                    } else {
                        _currentStringScanPosition += (uint32_t)valid_utf8_size;
                    }
                }
            }
            
            consumer.bytesNeeded -= foundSize;
            
            if (consumer.bytesNeeded == 0) {
                [_consumers removeObjectAtIndex:0];
                consumer.handler(self, nil);
                [_consumerPool returnConsumer:consumer];
                didWork = YES;
            }
        } else if (foundSize) {
            [_consumers removeObjectAtIndex:0];
            consumer.handler(self, slice);
            [_consumerPool returnConsumer:consumer];
            didWork = YES;
        }
    }
    return didWork;
}

- (void)_pumpScanner {
    [self assertOnWorkQueue];
    
    if (!_isPumping) {
        _isPumping = YES;
    } else {
        return;
    }
    
    while ([self _innerPumpScanner]) {
        
    }
    
    _isPumping = NO;
}

//#define NOMASK

static const size_t CTFrameHeaderOverhead = 32;

- (void)_sendFrameWithOpcode:(CTOpCode)opcode data:(id)data {
    [self assertOnWorkQueue];
    
    NSAssert(data == nil || [data isKindOfClass:[NSData class]] || [data isKindOfClass:[NSString class]], @"Function expects nil, NSString or NSData");
    
    size_t payloadLength = [data isKindOfClass:[NSString class]] ? [(NSString *)data lengthOfBytesUsingEncoding:NSUTF8StringEncoding] : [(NSData *)data length];
    
    NSMutableData *frame = [[NSMutableData alloc] initWithLength:payloadLength + CTFrameHeaderOverhead];
    if (!frame) {
        [self closeWithCode:CTStatusCodeMessageTooBig reason:@"Message too big"];
        return;
    }
    uint8_t *frame_buffer = (uint8_t *)frame.mutableBytes;
    
    // set fin
    frame_buffer[0] = CTFinMask | opcode;
    
    BOOL useMask = YES;
#ifdef NOMASK
    useMask = NO;
#endif
    
    if (useMask) {
        // set the mask and header
        frame_buffer[1] |= CTMaskMask;
    }
    
    size_t frame_buffer_size = 2;
    
    const uint8_t *unmasked_payload = NULL;
    if ([data isKindOfClass:[NSData class]]) {
        unmasked_payload = (uint8_t *)[data bytes];
    } else if ([data isKindOfClass:[NSString class]]) {
        unmasked_payload =  (const uint8_t *)[data UTF8String];
    } else {
        assert(NO);
    }
    
    if (payloadLength < 126) {
        frame_buffer[1] |= payloadLength;
    } else if (payloadLength <= UINT16_MAX) {
        frame_buffer[1] |= 126;
        *((uint16_t *)(frame_buffer + frame_buffer_size)) = EndianU16_BtoN((uint16_t)payloadLength);
        frame_buffer_size += sizeof(uint16_t);
    } else {
        frame_buffer[1] |= 127;
        *((uint64_t *)(frame_buffer + frame_buffer_size)) = EndianU64_BtoN((uint64_t)payloadLength);
        frame_buffer_size += sizeof(uint64_t);
    }
    
    if (!useMask) {
        for (size_t i = 0; i < payloadLength; i++) {
            frame_buffer[frame_buffer_size] = unmasked_payload[i];
            frame_buffer_size += 1;
        }
    } else {
        uint8_t *mask_key = frame_buffer + frame_buffer_size;
        int result = SecRandomCopyBytes(kSecRandomDefault, sizeof(uint32_t), mask_key);
        if (result != 0) {
            CleverTapLogStaticInternal(@"Failed to generate random bytes with status: %d", result);
        }
        frame_buffer_size += sizeof(uint32_t);
        
        // TODO: could probably optimize this with SIMD
        for (size_t i = 0; i < payloadLength; i++) {
            frame_buffer[frame_buffer_size] = unmasked_payload[i] ^ mask_key[i % sizeof(uint32_t)];
            frame_buffer_size += 1;
        }
    }
    
    assert(frame_buffer_size <= frame.length);
    frame.length = frame_buffer_size;
    
    [self _writeData:frame];
}

- (void)stream:(NSStream *)aStream handleEvent:(NSStreamEvent)eventCode {
    if (_secure && !_pinnedCertFound && (eventCode == NSStreamEventHasBytesAvailable || eventCode == NSStreamEventHasSpaceAvailable)) {
        
        NSArray *sslCerts = [_urlRequest CT_SSLPinnedCertificates];
        if (sslCerts) {
            SecTrustRef secTrust = (__bridge SecTrustRef)[aStream propertyForKey:(__bridge id)kCFStreamPropertySSLPeerTrust];
            if (secTrust) {
                NSInteger numCerts = SecTrustGetCertificateCount(secTrust);
                for (NSInteger i = 0; i < numCerts && !_pinnedCertFound; i++) {
                    SecCertificateRef cert = SecTrustGetCertificateAtIndex(secTrust, i);
                    NSData *certData = CFBridgingRelease(SecCertificateCopyData(cert));
                    
                    for (id ref in sslCerts) {
                        SecCertificateRef trustedCert = (__bridge SecCertificateRef)ref;
                        NSData *trustedCertData = CFBridgingRelease(SecCertificateCopyData(trustedCert));
                        
                        if ([trustedCertData isEqualToData:certData]) {
                            _pinnedCertFound = YES;
                            break;
                        }
                    }
                }
            }
            
            if (!_pinnedCertFound) {
                dispatch_async(_workQueue, ^{
                    [self _failWithError:[NSError errorWithDomain:CTWebSocketErrorDomain code:23556 userInfo:@{NSLocalizedDescriptionKey: [NSString stringWithFormat:@"Invalid server cert"]}]];
                });
                return;
            }
        }
    }
    
    dispatch_async(_workQueue, ^{
        switch (eventCode) {
            case NSStreamEventOpenCompleted: {
                if (self.readyState >= CTWebSocketStateClosing) {
                    return;
                }
                assert(self->_readBuffer);
                
                if (self.readyState == CTWebSocketStateConnecting && aStream == self->_inputStream) {
                    [self didConnect];
                }
                [self _pumpWriting];
                [self _pumpScanner];
                break;
            }
                
            case NSStreamEventErrorOccurred: {
                /// TODO specify error better!
                [self _failWithError:aStream.streamError];
                self->_readBufferOffset = 0;
                [self->_readBuffer setLength:0];
                break;
            }
                
            case NSStreamEventEndEncountered: {
                [self _pumpScanner];
                if (aStream.streamError) {
                    [self _failWithError:aStream.streamError];
                } else {
                    if (self.readyState != CTWebSocketStateClosed) {
                        self.readyState = CTWebSocketStateClosed;
                        [self _scheduleCleanup];
                    }
                    
                    if (!self->_sentClose && !self->_failed) {
                        self->_sentClose = YES;
                        // If we get closed in this state it's probably not clean because we should be sending this when we send messages
                        [self _performDelegateBlock:^{
                            if ([self.delegate respondsToSelector:@selector(webSocket:didCloseWithCode:reason:wasClean:)]) {
                                [self.delegate webSocket:self didCloseWithCode:CTStatusCodeGoingAway reason:@"Stream end encountered" wasClean:NO];
                            }
                        }];
                    }
                }
                
                break;
            }
                
            case NSStreamEventHasBytesAvailable: {
                const int bufferSize = 2048;
                uint8_t buffer[bufferSize];
                
                while (self->_inputStream.hasBytesAvailable) {
                    NSInteger bytes_read = [self->_inputStream read:buffer maxLength:bufferSize];
                    
                    if (bytes_read > 0) {
                        [self->_readBuffer appendBytes:buffer length:(NSUInteger)bytes_read];
                    } else if (bytes_read < 0) {
                        [self _failWithError:self->_inputStream.streamError];
                    }
                    
                    if (bytes_read != bufferSize) {
                        break;
                    }
                }
                [self _pumpScanner];
                break;
            }
                
            case NSStreamEventHasSpaceAvailable: {
                [self _pumpWriting];
                break;
            }
                
            default:
                break;
        }
    });
}

@end


@implementation CTIOConsumer

@synthesize bytesNeeded = _bytesNeeded;
@synthesize consumer = _scanner;
@synthesize handler = _handler;
@synthesize readToCurrentFrame = _readToCurrentFrame;
@synthesize unmaskBytes = _unmaskBytes;

- (void)setupWithScanner:(stream_scanner)scanner handler:(data_callback)handler bytesNeeded:(size_t)bytesNeeded readToCurrentFrame:(BOOL)readToCurrentFrame unmaskBytes:(BOOL)unmaskBytes {
    _scanner = [scanner copy];
    _handler = [handler copy];
    _bytesNeeded = bytesNeeded;
    _readToCurrentFrame = readToCurrentFrame;
    _unmaskBytes = unmaskBytes;
    assert(_scanner || _bytesNeeded);
}


@end


@implementation CTIOConsumerPool {
    NSUInteger _poolSize;
    NSMutableArray *_bufferedConsumers;
}

- (instancetype)initWithBufferCapacity:(NSUInteger)poolSize {
    self = [super init];
    if (self) {
        _poolSize = poolSize;
        _bufferedConsumers = [NSMutableArray arrayWithCapacity:poolSize];
    }
    return self;
}

- (instancetype)init {
    return [self initWithBufferCapacity:8];
}

- (CTIOConsumer *)consumerWithScanner:(stream_scanner)scanner handler:(data_callback)handler bytesNeeded:(size_t)bytesNeeded readToCurrentFrame:(BOOL)readToCurrentFrame unmaskBytes:(BOOL)unmaskBytes {
    CTIOConsumer *consumer = nil;
    if (_bufferedConsumers.count) {
        consumer = _bufferedConsumers.lastObject;
        [_bufferedConsumers removeLastObject];
    } else {
        consumer = [[CTIOConsumer alloc] init];
    }
    
    [consumer setupWithScanner:scanner handler:handler bytesNeeded:bytesNeeded readToCurrentFrame:readToCurrentFrame unmaskBytes:unmaskBytes];
    
    return consumer;
}

- (void)returnConsumer:(CTIOConsumer *)consumer {
    if (_bufferedConsumers.count < _poolSize) {
        [_bufferedConsumers addObject:consumer];
    }
}

@end


@implementation  NSURLRequest (CTCertificateAdditions)

- (NSArray *)CT_SSLPinnedCertificates {
    return [NSURLProtocol propertyForKey:@"CT_SSLPinnedCertificates" inRequest:self];
}

@end

@implementation  NSMutableURLRequest (CTCertificateAdditions)

- (NSArray *)CT_SSLPinnedCertificates {
    return [NSURLProtocol propertyForKey:@"CT_SSLPinnedCertificates" inRequest:self];
}

- (void)setCT_SSLPinnedCertificates:(NSArray *)pinnedCertificates {
    [NSURLProtocol setProperty:pinnedCertificates forKey:@"CT_SSLPinnedCertificates" inRequest:self];
}

@end

@implementation NSURL (CTWebSocket)

- (NSString *)CT_origin {
    NSString *scheme = self.scheme.lowercaseString;
    
    if ([scheme isEqualToString:@"wss"]) {
        scheme = @"https";
    } else if ([scheme isEqualToString:@"ws"]) {
        scheme = @"http";
    }
    
    if (self.port != nil) {
        return [NSString stringWithFormat:@"%@://%@:%@/", scheme, self.host, self.port];
    } else {
        return [NSString stringWithFormat:@"%@://%@/", scheme, self.host];
    }
}

@end

#ifdef HAS_ICU

static inline int32_t validate_dispatch_data_partial_string(NSData *data) {
    const void * contents = data.bytes;
    long size = (long)data.length;
    
    const uint8_t *str = (const uint8_t *)contents;
    
    UChar32 codepoint = 1;
    int32_t offset = 0;
    int32_t lastOffset = 0;
    while (offset < size && codepoint > 0)  {
        lastOffset = offset;
        U8_NEXT(str, offset, size, codepoint);
    }
    
    if (codepoint == -1) {
        // Check to see if the last byte is valid or whether it was just continuing
        if (!U8_IS_LEAD(str[lastOffset]) || U8_COUNT_TRAIL_BYTES(str[lastOffset]) + lastOffset < (int32_t)size) {
            
            size = -1;
        } else {
            uint8_t leadByte = str[lastOffset];
            U8_MASK_LEAD_BYTE(leadByte, U8_COUNT_TRAIL_BYTES(leadByte));
            
            for (NSInteger i = lastOffset + 1; i < offset; i++) {
                if (U8_IS_SINGLE(str[i]) || U8_IS_LEAD(str[i]) || !U8_IS_TRAIL(str[i])) {
                    size = -1;
                }
            }
            
            if (size != -1) {
                size = lastOffset;
            }
        }
    }
    
    if (size != -1 && ![[NSString alloc] initWithBytesNoCopy:(char *)data.bytes length:(NSUInteger)size encoding:NSUTF8StringEncoding freeWhenDone:NO]) {
        size = -1;
    }
    
    return (int32_t)size;
}

#else

// This is a hack, and probably not optimal
static inline int32_t validate_dispatch_data_partial_string(NSData *data) {
    static const int maxCodepointSize = 3;
    
    for (NSInteger i = 0; i < maxCodepointSize; i++) {
        NSString *str = [[NSString alloc] initWithBytesNoCopy:(char *)data.bytes length:data.length - i encoding:NSUTF8StringEncoding freeWhenDone:NO];
        if (str) {
            return data.length - i;
        }
    }
    
    return -1;
}

#endif

static _CTRunLoopThread *networkThread = nil;
static NSRunLoop *networkRunLoop = nil;

@implementation NSRunLoop (CTWebSocket)

+ (NSRunLoop *)CT_networkRunLoop {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        networkThread = [[_CTRunLoopThread alloc] init];
        networkThread.name = @"com.clevertap.WebSocket.NetworkThread";
        [networkThread start];
        networkRunLoop = networkThread.runLoop;
    });
    
    return networkRunLoop;
}

@end


@implementation _CTRunLoopThread {
    dispatch_group_t _waitGroup;
}

@synthesize runLoop = _runLoop;

- (void)dealloc
{
    CT_dispatch_release(_waitGroup);
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _waitGroup = dispatch_group_create();
        dispatch_group_enter(_waitGroup);
    }
    return self;
}

- (void)main;
{
    @autoreleasepool {
        _runLoop = [NSRunLoop currentRunLoop];
        dispatch_group_leave(_waitGroup);
        
        // Add an empty run loop source to prevent runloop from spinning.
        CFRunLoopSourceContext sourceCtx = {
            .version = 0,
            .info = NULL,
            .retain = NULL,
            .release = NULL,
            .copyDescription = NULL,
            .equal = NULL,
            .hash = NULL,
            .schedule = NULL,
            .cancel = NULL,
            .perform = NULL
        };
        CFRunLoopSourceRef source = CFRunLoopSourceCreate(NULL, 0, &sourceCtx);
        CFRunLoopAddSource(CFRunLoopGetCurrent(), source, kCFRunLoopDefaultMode);
        CFRelease(source);
        
        while ([_runLoop runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]]) {
            
        }
        assert(NO);
    }
}

- (NSRunLoop *)runLoop
{
    dispatch_group_wait(_waitGroup, DISPATCH_TIME_FOREVER);
    return _runLoop;
}

@end
