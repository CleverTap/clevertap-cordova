#import "CTUtils.h"

@implementation CTUtils

+ (NSString *)urlEncodeString:(NSString*)s {
    
    if (!s) return nil;    
    NSMutableString *output = [NSMutableString string];
    const unsigned char *source = (const unsigned char *) [s UTF8String];
    int sourceLen = (int) strlen((const char *) source);
    for (int i = 0; i < sourceLen; ++i) {
        const unsigned char thisChar = source[i];
        if (thisChar == ' ') {
            [output appendString:@"+"];
        } else if (thisChar == '.' || thisChar == '-' || thisChar == '_' || thisChar == '~' ||
                   (thisChar >= 'a' && thisChar <= 'z') ||
                   (thisChar >= 'A' && thisChar <= 'Z') ||
                   (thisChar >= '0' && thisChar <= '9')) {
            [output appendFormat:@"%c", thisChar];
        } else {
            [output appendFormat:@"%%%02X", thisChar];
        }
    }
    return output;
}

+ (BOOL)doesString:(NSString *)s startWith:(NSString *)prefix {
    @try {
        if (s.length < prefix.length) return NO;
        
        if (s != nil && ![s isEqualToString:@""] && prefix != nil && ![prefix isEqualToString:@""]) {
            return [[s substringToIndex:prefix.length] isEqualToString:prefix];
        }
    }
    @catch (NSException *exception) {
        // no-op
    }
    return NO;
}

+ (NSString *)deviceTokenStringFromData:(NSData *)tokenData {
    const unsigned *tokenBytes = [tokenData bytes];
    NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                          ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                          ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                          ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    NSString *deviceTokenString = [NSString stringWithFormat:@"%@", hexToken];
    return deviceTokenString;
}

+ (double)toTwoPlaces:(double)x {
    double result = x * 100;
    result = round(result);
    result = result / 100;
    return result;
}

+ (BOOL)isNullOrEmpty:(id)obj
{
    // Need to check for NSString to support RubyMotion.
    // Ruby String respondsToSelector(count) is true for count: in RubyMotion
    return obj == nil
    || ([obj respondsToSelector:@selector(length)] && [obj length] == 0)
    || ([obj respondsToSelector:@selector(count)]
        && ![obj isKindOfClass:[NSString class]] && [obj count] == 0);
}

+ (NSString *)jsonObjectToString:(id)object {
    if ([object isKindOfClass:[NSString class]]) {
        return object;
    }
    @try {
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object
                                                           options:0
                                                             error:&error];
        if (error) {
            return @"";
        }
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        return jsonString;
    }
    @catch (NSException *exception) {
        return @"";
    }
}

@end
