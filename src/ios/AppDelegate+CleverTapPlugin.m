
#import "AppDelegate+CleverTapPlugin.h"
#import "CleverTapPlugin.h"

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@import UserNotifications;
#endif

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end
#endif

@implementation AppDelegate (CleverTapPlugin)

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
#endif

- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation {
    
    if (!url) {
        return NO;
    }
    // FOR KILLED STATE, THIS NOTIFICATION GETS BROADCASTED BEFORE OBSERVERS ARE SET INSIDE THE CODROVA PLUGIN, HENCE A SLIGHT DELAY IS ADDED
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTHandleOpenURLNotification object:url]];
    });
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    
    if (!url) {
        return NO;
    }
    // FOR KILLED STATE, THIS NOTIFICATION GETS BROADCASTED BEFORE OBSERVERS ARE SET INSIDE THE CODROVA PLUGIN, HENCE A SLIGHT DELAY IS ADDED
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTHandleOpenURLNotification object:url]];
    });
    return YES;
}

- (void)openURL:(NSURL*)url options:(NSDictionary<NSString *, id> *)options completionHandler:(void (^ __nullable)(BOOL success))completion {
    
    // FOR KILLED STATE, THIS NOTIFICATION GETS BROADCASTED BEFORE OBSERVERS ARE SET INSIDE THE CODROVA PLUGIN, HENCE A SLIGHT DELAY IS ADDED
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CTHandleOpenURLNotification object:url]];
    });
}


@end
