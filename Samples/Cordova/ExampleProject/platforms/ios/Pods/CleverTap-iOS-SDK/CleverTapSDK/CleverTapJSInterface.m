#import "CleverTapJSInterface.h"
#import "CleverTap.h"
#import "CleverTapInstanceConfig.h"
#import "CleverTapInstanceConfigPrivate.h"
#import "CleverTapJSInterfacePrivate.h"

@interface CleverTapJSInterface (){}

@property (nonatomic, strong) CleverTapInstanceConfig *config;
@end

@implementation CleverTapJSInterface

- (instancetype)initWithConfig:(CleverTapInstanceConfig *)config {
    if (self = [super init]) {
        _config = config;
        _wv_init = YES;
        [self initUserContentController];
    }
    return self;
}

- (instancetype)initWithConfigForInApps:(CleverTapInstanceConfig *)config {
    if (self = [super init]) {
        _config = config;
        [self initUserContentController];
    }
    return self;
}

- (void)initUserContentController {
    _userContentController = [[WKUserContentController alloc] init];
    [_userContentController addScriptMessageHandler:self name:@"clevertap"];
}

- (void)userContentController:(nonnull WKUserContentController *)userContentController didReceiveScriptMessage:(nonnull WKScriptMessage *)message {
    if ([message.body isKindOfClass:[NSDictionary class]]) {
        CleverTap *cleverTap;
        if (!self.config || self.config.isDefaultInstance){
            cleverTap = [CleverTap sharedInstance];
        } else {
            cleverTap = [CleverTap instanceWithConfig:self.config];
        }
        if (cleverTap) {
            if (_wv_init) {
                cleverTap.config.wv_init = YES;
            }
            [self handleMessageFromWebview:message.body forInstance:cleverTap];
        }
    }
}

- (void)handleMessageFromWebview:(NSDictionary<NSString *,id> *)message forInstance:(CleverTap *)cleverTap {
    NSString *action = [message objectForKey:@"action"];
    if ([action isEqual:@"recordEventWithProps"]) {
        [cleverTap recordEvent: message[@"event"] withProps: message[@"properties"]];
    } else if ([action isEqual: @"profilePush"]) {
        [cleverTap profilePush: message[@"properties"]];
    } else if ([action isEqual: @"profileSetMultiValues"]) {
        [cleverTap profileSetMultiValues: message[@"values"] forKey: message[@"key"]];
    } else if ([action isEqual: @"profileAddMultiValue"]) {
        [cleverTap profileAddMultiValue: message[@"value"] forKey: message[@"key"]];
    } else if ([action isEqual: @"profileAddMultiValues"]) {
        [cleverTap profileAddMultiValues: message[@"values"] forKey: message[@"key"]];
    } else if ([action isEqual: @"profileRemoveValueForKey"]) {
        [cleverTap profileRemoveValueForKey: message[@"key"]];
    } else if ([action isEqual: @"profileRemoveMultiValue"]) {
        [cleverTap profileRemoveMultiValue: message[@"value"] forKey: message[@"key"]];
    } else if ([action isEqual: @"profileRemoveMultiValues"]) {
        [cleverTap profileRemoveMultiValues: message[@"values"] forKey: message[@"key"]];
    }
    else if ([action isEqual: @"recordChargedEvent"]) {
        [cleverTap recordChargedEventWithDetails: message[@"chargeDetails"] andItems: message[@"items"]];
    }else if ([action isEqual: @"onUserLogin"]) {
        [cleverTap onUserLogin: message[@"properties"]];
    }else if ([action isEqual: @"profileIncrementValueBy"]) {
        [cleverTap profileIncrementValueBy: message[@"value"] forKey: message[@"key"]];
    }else if ([action isEqual: @"profileDecrementValueBy"]) {
        [cleverTap profileDecrementValueBy: message[@"value"] forKey: message[@"key"]];
    }
}

@end
