
#import "AppDelegate+CleverTapPlugin.h"
#import "CleverTapPlugin.h"

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@import UserNotifications;
#endif

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@interface CDVAppDelegate () <UNUserNotificationCenterDelegate>
@end
#endif

@implementation CDVAppDelegate (CleverTapPlugin)

- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken {
    
    const unsigned *tokenBytes = [deviceToken bytes];
    NSString *token = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                       ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                       ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                       ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    NSString *deviceTokenString = [NSString stringWithFormat:@"%@", token];
    [[NSNotificationCenter defaultCenter] postNotificationName:CTRemoteNotificationDidRegister object:deviceTokenString];
}

- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {
    
    [[NSNotificationCenter defaultCenter] postNotificationName:CTRemoteNotificationRegisterError object:error];
}

- (void) application:(UIApplication*)application didReceiveLocalNotification:(UILocalNotification*)notification {
    
    [[NSNotificationCenter defaultCenter] postNotificationName:CTDidReceiveNotification object:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    
    [[NSNotificationCenter defaultCenter] postNotificationName:CTDidReceiveNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    [[NSNotificationCenter defaultCenter] postNotificationName:CTDidReceiveNotification object:userInfo];
}

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    completionHandler(UNNotificationPresentationOptionSound
                      | UNNotificationPresentationOptionAlert
                      | UNNotificationPresentationOptionBadge);
}

// Without this, UIKit has nowhere to deliver a notification tap and answers the
// system with "response-not-possible", silently dropping it. That is the only
// callback for a tap from the background or a terminated state.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler {
    [[NSNotificationCenter defaultCenter] postNotificationName:CTDidReceiveNotificationResponse
                                                        object:response.notification.request.content.userInfo];
    completionHandler();
}
#endif

@end
