
// Hosts that replace Cordova's app delegate (Capacitor, for one) ship the Cordova
// compat headers without CDVAppDelegate.h, so this category is compiled out rather
// than missing. Nothing then forwards the device token or an incoming push, and
// those hosts have to post CTRemoteNotificationDidRegister and
// CTDidReceiveNotification from their own delegate. See docs/Integrate-iOS.md.
#if __has_include(<Cordova/CDVAppDelegate.h>)

#import <Cordova/CDVAppDelegate.h>

@interface CDVAppDelegate (CleverTapPlugin)

@end

#endif
