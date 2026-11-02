
// Hosts that replace Cordova's app delegate (Capacitor, for one) ship the Cordova
// compat headers without CDVAppDelegate.h. Those hosts own their delegate and
// forward push themselves, so this category is compiled out rather than missing.
#if __has_include(<Cordova/CDVAppDelegate.h>)

#import <Cordova/CDVAppDelegate.h>

@interface CDVAppDelegate (CleverTapPlugin)

@end

#endif
