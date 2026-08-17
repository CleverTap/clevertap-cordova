
#if __has_include(<Cordova/CDVAppDelegate.h>)
#import <Cordova/CDVAppDelegate.h>
#else
#import <Cordova/AppDelegate.h>
#define CDVAppDelegate AppDelegate
#endif

@interface CDVAppDelegate (CleverTapPlugin)

@end
