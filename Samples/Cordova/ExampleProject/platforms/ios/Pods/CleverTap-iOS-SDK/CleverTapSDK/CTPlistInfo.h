#import <Foundation/Foundation.h>

@interface CTPlistInfo : NSObject

@property (nonatomic, strong, readonly, nullable) NSString *accountId;
@property (nonatomic, strong, readonly, nullable) NSString *accountToken;
@property (nonatomic, strong, readonly, nullable) NSString *accountRegion;
@property (nonatomic, strong, readonly, nullable) NSString *proxyDomain;
@property (nonatomic, strong, readonly, nullable) NSString *spikyProxyDomain;
@property (nonatomic, strong, readonly, nullable) NSArray<NSString*>* registeredUrlSchemes;
@property (nonatomic, assign, readonly) BOOL disableAppLaunchedEvent;
@property (nonatomic, assign, readonly) BOOL useCustomCleverTapId;
@property (nonatomic, assign, readonly) BOOL beta;
@property (nonatomic, assign, readonly) BOOL disableIDFV;

+ (instancetype _Nullable)sharedInstance;
- (void)setCredentialsWithAccountID:(NSString * _Nonnull)accountID token:(NSString * _Nonnull)token region:(NSString * _Nullable)region;
- (void)setCredentialsWithAccountID:(NSString * _Nonnull)accountID token:(NSString * _Nonnull)token proxyDomain:(NSString * _Nonnull)proxyDomain;
- (void)setCredentialsWithAccountID:(NSString * _Nonnull)accountID token:(NSString * _Nonnull)token proxyDomain:(NSString * _Nonnull)proxyDomain spikyProxyDomain:(NSString * _Nonnull)spikyProxyDomain;

@end
