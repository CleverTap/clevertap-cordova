//
//  CleverTapPlugin.m
//  Copyright (C) 2015 CleverTap
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//
//

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@import UserNotifications;
#endif

#import "CleverTapPlugin.h"

#import "CleverTap.h"
#import "CleverTap+Inbox.h"
#import "CleverTapUTMDetail.h"
#import "CleverTapEventDetail.h"
#import "CleverTap+DisplayUnit.h"
#import "CleverTapSyncDelegate.h"
#import "CleverTap+FeatureFlags.h"
#import "CleverTap+ProductConfig.h"
#import "CleverTapPushNotificationDelegate.h"
#import "CleverTapInAppNotificationDelegate.h"
#import "CleverTap+InAppNotifications.h"
#import "CleverTap+CTVar.h"
#import "CTVar.h"
#import "CTLocalInApp.h"
#import "Clevertap+PushPermission.h"
#import "CTTemplateContext.h"

#if __has_include(<CleverTapLocation/CTLocationManager.h>)
#import <CleverTapLocation/CTLocationManager.h>
#endif

static CleverTap *clevertap;
static NSURL *launchDeepLink;
static NSDictionary *launchNotification;
static NSDateFormatter *dateFormatter;
static NSMutableDictionary *allVariables;

@interface CleverTapPlugin () <CleverTapSyncDelegate, CleverTapInAppNotificationDelegate, CleverTapDisplayUnitDelegate, CleverTapFeatureFlagsDelegate, CleverTapProductConfigDelegate, CleverTapPushNotificationDelegate> {
}

@end

@implementation CleverTapPlugin


#pragma mark - Private

+ (void)load {
    
    // Listen for UIApplicationDidFinishLaunchingNotification to get a hold of launchOptions
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDidFinishLaunchingNotification:) name:UIApplicationDidFinishLaunchingNotification object:nil];
    
    // Listen to re-broadcast events from Cordova's AppDelegate
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDidFailToRegisterForRemoteNotificationsWithError:) name:CTRemoteNotificationRegisterError object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onHandleRegisterForRemoteNotification:) name:CTRemoteNotificationDidRegister object:nil];
    
}

+ (void)onDidFinishLaunchingNotification:(NSNotification *)notification {
    
    clevertap = [CleverTap sharedInstance];
    
    NSDictionary *launchOptions = notification.userInfo;
    if (!launchOptions) return;
    
    if (launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey]) {
        [clevertap handleNotificationWithData:launchOptions];
        launchNotification = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    }
    
    if (launchOptions[UIApplicationLaunchOptionsURLKey]) {
        launchDeepLink = launchOptions[UIApplicationLaunchOptionsURLKey];
    }
}

+ (void)onDidFailToRegisterForRemoteNotificationsWithError:(NSNotification *)notification {
    
    //Log Failures
    NSLog(@"onRemoteRegisterFail: %@", notification.object);
}

+ (void)onHandleRegisterForRemoteNotification:(NSNotification *)notification {
    
    [clevertap setPushTokenAsString:notification.object];
}

- (void)onHandleOpenURLNotification:(NSNotification *)notification {
    
    [clevertap handleOpenURL:notification.object sourceApplication:nil];
    [self handleDeepLink:notification.object];
}

- (void)onHandleNotification:(NSNotification *)notification {
    
    [clevertap handleNotificationWithData:notification.object];
    [self notifyPushNotification:notification.object];
}

- (void)pluginInitialize {
    
    [super pluginInitialize];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendEvent:) name:CTSendEvent object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onHandleOpenURLNotification:) name: CTHandleOpenURLNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onHandleNotification:) name:CTDidReceiveNotification object:nil];
    
    [clevertap setSyncDelegate:self];
    [clevertap setDisplayUnitDelegate:self];
    [[clevertap featureFlags] setDelegate:self];
    [[clevertap productConfig] setDelegate:self];
    [clevertap setPushNotificationDelegate:self];
    [clevertap setInAppNotificationDelegate:self];
    [self setLibrary];    
    
}

- (NSDictionary*)_eventDetailToDict:(CleverTapEventDetail*)detail {
    
    NSMutableDictionary *_dict = [NSMutableDictionary new];
    
    if(detail) {
        if(detail.eventName) {
            [_dict setObject:detail.eventName forKey:@"eventName"];
        }
        
        if(detail.firstTime){
            [_dict setObject:@(detail.firstTime) forKey:@"firstTime"];
        }
        
        if(detail.lastTime){
            [_dict setObject:@(detail.lastTime) forKey:@"lastTime"];
        }
        
        if(detail.count){
            [_dict setObject:@(detail.count) forKey:@"count"];
        }
    }
    
    return _dict;
}

- (NSDictionary*)_utmDetailToDict:(CleverTapUTMDetail*)detail {
    
    NSMutableDictionary *_dict = [NSMutableDictionary new];
    
    if(detail) {
        if(detail.source) {
            [_dict setObject:detail.source forKey:@"source"];
        }
        
        if(detail.medium) {
            [_dict setObject:detail.medium forKey:@"medium"];
        }
        
        if(detail.campaign) {
            [_dict setObject:detail.campaign forKey:@"campaign"];
        }
    }
    
    return _dict;
}

- (NSString *)_dictToJson:(NSDictionary *)dict {
    
    NSData *jsonData;
    NSError *error;
    
    @try {
        jsonData = [NSJSONSerialization dataWithJSONObject:dict options:0 error:&error];
    }
    @catch (NSException *exception) {
        return nil;
    }
    
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (NSDictionary *)formatProfile:(NSDictionary *)profile {
    
    NSMutableDictionary *_profile = [NSMutableDictionary new];
    
    for (NSString *key in [profile keyEnumerator]) {
        id value = [profile objectForKey:key];
        
        if([key isEqualToString:@"DOB"]) {
            
            NSDate *dob = nil;
            
            if([value isKindOfClass:[NSString class]]) {
                
                if(!dateFormatter) {
                    dateFormatter = [[NSDateFormatter alloc] init];
                    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
                }
                
                dob = [dateFormatter dateFromString:value];
                
            }
            else if ([value isKindOfClass:[NSNumber class]]) {
                dob = [NSDate dateWithTimeIntervalSince1970:[value doubleValue]];
            }
            
            if(dob) {
                value = dob;
            }
        }
        
        [_profile setObject:value forKey:key];
    }
    
    return _profile;
}

// custom helper method to fire push data into the Cordova WebView
- (void)notifyPushNotification:(id)notification {
    
    NSDictionary * _notification;
    if ([notification isKindOfClass:[UILocalNotification class]]) {
        _notification = [((UILocalNotification *) notification) userInfo];
    } else if ([notification isKindOfClass:[NSDictionary class]]) {
        _notification = notification;
    }
    
    NSError *err;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:_notification options:0 error:&err];
    
    if(err == nil) {
        NSString *json = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onPushNotification', {'notification':%@})", json];
        [self.commandDelegate evalJs:js];
    }
}

/// Helper method to get json array from CleverTapInboxMessage array
/// @param inboxMessages: NSArray
- (NSArray*)cleverTapInboxMessagesToArray:(NSArray*) inboxMessages {
    NSMutableArray *returnArray = [NSMutableArray new];
    for(CleverTapInboxMessage *unit in inboxMessages){
        [returnArray addObject:unit.json];
    }
    return returnArray;
}

/// Helper method to get json array from CleverTapDisplayUnit array
/// @param displayUnits: NSArray
- (NSArray*)cleverTapDisplayUnitsToArray:(NSArray*) displayUnits {
    NSMutableArray *returnArray = [NSMutableArray new];
    for(CleverTapDisplayUnit *unit in displayUnits){
        [returnArray addObject:unit.json];
    }
    return returnArray;
}

#pragma mark - CleverTapInAppNotificationDelegate

/**
 Call back for In App Notification Dismissal
 */
- (void)inAppNotificationDismissedWithExtras:(NSDictionary *)extras andActionExtras:(NSDictionary *)actionExtras {
    
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    
    if (extras != nil) {
        jsonDict[@"extras"] = extras;
    }
    
    if (actionExtras != nil) {
        jsonDict[@"actionExtras"] = actionExtras;
    }
    
    NSString *jsonString = [self _dictToJson:jsonDict];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInAppNotificationDismissed', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}

/**
 Call back for In App Notification Dismissal with Extra Buttons
 */
- (void)inAppNotificationButtonTappedWithCustomExtras:(NSDictionary *)customExtras {
    
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    
    if (customExtras != nil) {
        jsonDict[@"customExtras"] = customExtras;
    }
    
    NSString *jsonString = [self _dictToJson:jsonDict];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInAppButtonClick', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}

- (void)disableInAppNotificationDisplay {
    //Not Handlingshowinbox
}

#pragma mark - CleverTapSyncDelegate

- (void)profileDidInitialize:(NSString*)CleverTapID {
    
    if(!CleverTapID) {
        return ;
    }
    
    NSString *jsonString = [self _dictToJson:@{@"CleverTapID":CleverTapID}];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapProfileDidInitialize', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
    
}

- (void)profileDataUpdated:(NSDictionary *)updates {
    
    if(!updates) {
        return ;
    }
    
    NSString *jsonString = [self _dictToJson:@{@"updates":updates}];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapProfileSync', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}


#pragma mark - Public

- (void)sendEvent:(NSNotification *)notification {
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('%@', %@)", notification.object, [self _dictToJson:notification.userInfo[@"result"]]];
    [self.commandDelegate evalJs:js];
}

# pragma mark Launch

- (void)notifyDeviceReady:(CDVInvokedUrlCommand *)command {
    
    if (launchNotification) {
        [self notifyPushNotification:[launchNotification copy]];
        // notify push notification tapped with custom extras
        NSMutableDictionary *mutableNotification = [NSMutableDictionary dictionaryWithDictionary:launchNotification];
        [mutableNotification removeObjectForKey:@"aps"];
        [self pushNotificationTappedWithCustomExtras:[mutableNotification copy]];
        launchNotification = nil;
    }
    
    if (launchDeepLink) {
        [self handleDeepLink:[launchDeepLink copy]];
        launchDeepLink = nil;
    }
}


#pragma mark - Push

- (void)registerPush:(CDVInvokedUrlCommand *)command {
    [UNUserNotificationCenter currentNotificationCenter].delegate = [UIApplication sharedApplication].delegate;
    
    if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_9_x_Max) {
        if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
            UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound);
            UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
            [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
            [[UIApplication sharedApplication] registerForRemoteNotifications];
        } else {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
#pragma GCC diagnostic pop
        }
    } else {
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
        // IOS 10
        UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert | UNAuthorizationOptionSound| UNAuthorizationOptionBadge;
        [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
            if (granted) {
                dispatch_async(dispatch_get_main_queue(), ^(void) {
                    [[UIApplication sharedApplication] registerForRemoteNotifications];
                });
            }
        }];
#endif
    }
}

- (void)setPushTokenAsString:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *token = [command argumentAtIndex:0];
        if (token != nil && [token isKindOfClass:[NSString class]]) {
            [clevertap setPushTokenAsString:token];
        }
    }];
}

- (void)setPushBaiduTokenAsString:(CDVInvokedUrlCommand *)command {
    NSLog(@"BaiduToken is no-op in iOS");
}

- (void)setPushHuaweiTokenAsString:(CDVInvokedUrlCommand *)command {
    NSLog(@"HuaweiToken is no-op in iOS");
}

- (void)setPushToken:(NSData*)pushToken {
    
    [clevertap setPushToken:pushToken];
}

- (void)handleNotification:(id)notification {
    
    [clevertap handleNotificationWithData:notification];
    [self notifyPushNotification:notification];
}

- (void)handleDeepLink:(NSURL *)url {
    
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onDeepLink', {'deeplink':'%@'});", url.description];
    [self.commandDelegate evalJs:js];
}

- (void)createNotification:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotification is no-op in iOS");
}

- (void)createNotificationChannel:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotificationChannel is no-op in iOS");
}

- (void)createNotificationChannelWithSound:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotificationChannelWithSound is no-op in iOS");
}

- (void)createNotificationChannelWithGroupId:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotificationChannelWithGroupId is no-op in iOS");
}

- (void)createNotificationChannelWithGroupIdAndSound:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotificationChannelWithGroupIdAndSound is no-op in iOS");
}

- (void)createNotificationChannelGroup:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"createNotificationChannelGroup is no-op in iOS");
}

- (void)deleteNotificationChannel:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"deleteNotificationChannel is no-op in iOS");
}

- (void)deleteNotificationChannelGroup:(CDVInvokedUrlCommand *)command {
    
    NSLog(@"deleteNotificationChannelGroup is no-op in iOS");
}

#pragma mark - InApp Notification Controls

- (void)suspendInAppNotifications {
    [clevertap suspendInAppNotifications];
}

- (void)discardInAppNotifications {
    [clevertap discardInAppNotifications];
}

- (void)resumeInAppNotifications {
    [clevertap resumeInAppNotifications];
}


#pragma mark - Push Notification Delegate

- (void)pushNotificationTappedWithCustomExtras:(NSDictionary *)customExtras {
    
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    
    if (customExtras != nil) {
        jsonDict[@"customExtras"] = customExtras;
    }
    
    NSString *jsonString = [self _dictToJson:jsonDict];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapPushNotificationTappedWithCustomExtras', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}


#pragma mark - Developer Options

- (void)setDebugLevel:(CDVInvokedUrlCommand *)command {
    
    NSNumber *level = [command argumentAtIndex:0];
    if (level != nil && [level isKindOfClass:[NSNumber class]]) {
        [CleverTap setDebugLevel:[level intValue]];
    }
}

#pragma mark - Personalization

- (void)enablePersonalization:(CDVInvokedUrlCommand *)command {
    
    [CleverTap enablePersonalization];
}

- (void)disablePersonalization:(CDVInvokedUrlCommand *)command {
    
    [CleverTap disablePersonalization];
}

#pragma mark - Offline API

- (void)setOffline:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL isOffline = [[command argumentAtIndex:0] boolValue];
        [clevertap setOffline:isOffline];
    }];
}

#pragma mark - OptOut API

- (void)setOptOut:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL isOptOut = [[command argumentAtIndex:0] boolValue];
        [clevertap setOptOut:isOptOut];
    }];
}

- (void)enableDeviceNetworkInfoReporting:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL isNetworkInfoReporting = [[command argumentAtIndex:0] boolValue];
        [clevertap enableDeviceNetworkInfoReporting:isNetworkInfoReporting];
    }];
}


#pragma mark - Event API

- (void)recordScreenView:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *screenName = [command argumentAtIndex:0];
        if (screenName != nil && [screenName isKindOfClass:[NSString class]]) {
            [clevertap recordScreenView:screenName];
        }
    }];
}

- (void)recordEventWithName:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            [clevertap recordEvent:eventName];
        }
    }];
}

- (void)recordEventWithNameAndProps:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        NSDictionary *eventProps = [command argumentAtIndex:1];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]] && eventProps != nil && [eventProps isKindOfClass:[NSDictionary class]]) {
            [clevertap recordEvent:eventName withProps:eventProps];
        }
    }];
}

- (void)recordChargedEventWithDetailsAndItems:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *details = [command argumentAtIndex:0];
        NSArray *items = [command argumentAtIndex:1];
        
        if (details != nil && [details isKindOfClass:[NSDictionary class]] && items != nil && [items isKindOfClass:[NSArray class]]) {
            [clevertap recordChargedEventWithDetails:details andItems:items];
        }
    }];
}

- (void)eventGetFirstTime:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            NSTimeInterval first = [clevertap eventGetFirstTime:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:first];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)eventGetLastTime:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            NSTimeInterval last = [clevertap eventGetLastTime:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:last];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)eventGetOccurrences:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            int num = [clevertap eventGetOccurrences:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:num];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)eventGetDetails:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            CleverTapEventDetail *detail = [clevertap eventGetDetail:eventName];
            NSDictionary * res = [self _eventDetailToDict:detail];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:res];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)getEventHistory:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *history = [clevertap userGetEventHistory];
        
        NSMutableDictionary *_history = [NSMutableDictionary new];
        
        for (NSString *eventName in [history keyEnumerator]) {
            CleverTapEventDetail *detail = [history objectForKey:eventName];
            NSDictionary * _inner = [self _eventDetailToDict:detail];
            [_history setObject:_inner forKey:eventName];
        }
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:_history];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


#pragma mark - Profile API

/**
 Note: the call to CleverTapSDK must be made on the main thread due to start the LocationManager, but thereafter the CleverTapSDK method itself is non-blocking.
 */

- (void)getLocation:(CDVInvokedUrlCommand *)command {
    
#if __has_include(<CleverTapLocation/CTLocationManager.h>)
    [CTLocationManager getLocationWithSuccess:^(CLLocationCoordinate2D loc){
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"lat":@(loc.latitude), @"lon":@(loc.longitude)}];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    } andError:^(NSString *error) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
#else
    NSString *error = @"Please install the pod CleverTapLocation or intregrate the CleverTapLocation project manually to use the getLocation method. For more details, please refer to the link: https://github.com/CleverTap/clevertap-ios-sdk/blob/location-api/docs/CleverTapLocation.md";
    NSLog(@"%@", error);
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
#endif
}

- (void)setLocation:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        @try {
            double lat = [[command argumentAtIndex:0] doubleValue];
            double lon = [[command argumentAtIndex:1] doubleValue];
            CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(lat,lon);
            [CleverTap setLocation:coordinate];
        }
        @catch (NSException *exception) {
            NSLog(@"error setting location %@", exception.reason);
            return ;
        }
    }];
}

- (void)onUserLogin:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *profile = [command argumentAtIndex:0];
        if (profile != nil && [profile isKindOfClass:[NSDictionary class]]) {
            NSDictionary *_profile = [self formatProfile:profile];
            [clevertap onUserLogin:_profile];
        }
    }];
}

- (void)profileSet:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *profile = [command argumentAtIndex:0];
        if (profile != nil && [profile isKindOfClass:[NSDictionary class]]) {
            NSDictionary *_profile = [self formatProfile:profile];
            [clevertap profilePush:_profile];
        }
    }];
}

- (void)profileGetProperty:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *propertyName = [command argumentAtIndex:0];
        CDVPluginResult *pluginResult;
        
        if (propertyName != nil && [propertyName isKindOfClass:[NSString class]]) {
            id prop = [clevertap profileGet:propertyName];
            
            if(prop == nil) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
            }
            
            else if([prop isKindOfClass:[NSString class]]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:prop];
            }
            
            else if([prop isKindOfClass:[NSDate class]]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:[prop timeIntervalSince1970]];
            }
            
            else if([prop isKindOfClass:[NSNumber class]]) {
                BOOL isFloat = CFNumberIsFloatType((CFNumberRef)prop);
                
                if (isFloat) {
                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:[prop doubleValue]];
                    
                }
                else {
                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:[prop intValue]];
                };
            }
            
            else if([prop isKindOfClass:[NSDictionary class]]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:prop];
            }
            
            else if([prop isKindOfClass:[NSArray class]]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:prop];
            }
        }
        
        if(!pluginResult) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)profileGetCleverTapAttributionIdentifier:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        
        NSString *attributionID = [clevertap profileGetCleverTapAttributionIdentifier];
        
        if(attributionID == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        }
        
        else  {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:attributionID];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)profileGetCleverTapID:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        
        NSString *cleverTapID = [clevertap profileGetCleverTapID];
        
        if(cleverTapID == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        }
        
        else  {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:cleverTapID];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getCleverTapID:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult *pluginResult;
        
        NSString *cleverTapID = [clevertap profileGetCleverTapID];
        
        if(cleverTapID == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        }
        
        else  {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:cleverTapID];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)profileRemoveValueForKey:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        if (key != nil && [key isKindOfClass:[NSString class]]) {
            [clevertap profileRemoveValueForKey:key];
        }
    }];
    
}

- (void)profileSetMultiValues:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSArray *values = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && values != nil && [values isKindOfClass:[NSArray class]]) {
            [clevertap profileSetMultiValues:values forKey:key];
        }
    }];
    
}

- (void)profileAddMultiValue:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSString *value = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && value != nil && [value isKindOfClass:[NSString class]]) {
            [clevertap profileAddMultiValue:value forKey:key];
        }
    }];
}

- (void)profileAddMultiValues:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSArray *values = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && values != nil && [values isKindOfClass:[NSArray class]]) {
            [clevertap profileAddMultiValues:values forKey:key];
        }
    }];
}

- (void)profileRemoveMultiValue:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSString *value = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && value != nil && [value isKindOfClass:[NSString class]]) {
            [clevertap profileRemoveMultiValue:value forKey:key];
        }
    }];
}

- (void)profileRemoveMultiValues:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSArray *values = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && values != nil && [values isKindOfClass:[NSArray class]]) {
            [clevertap profileRemoveMultiValues:values forKey:key];
        }
    }];
}

- (void)profileIncrementValueBy:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSNumber *value = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && value != nil && [value isKindOfClass:[NSNumber class]]) {
            [clevertap profileIncrementValueBy:value forKey:key];
        }
    }];
}

- (void)profileDecrementValueBy:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSNumber *value = [command argumentAtIndex:1];
        if (key != nil && [key isKindOfClass:[NSString class]] && value != nil && [value isKindOfClass:[NSNumber class]]) {
            [clevertap profileDecrementValueBy:value forKey:key];
        }
    }];
}

#pragma mark Session API

- (void)sessionGetTimeElapsed:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSTimeInterval elapsed = [clevertap sessionGetTimeElapsed];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:elapsed];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)sessionGetTotalVisits:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        int total = [clevertap userGetTotalVisits];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:total];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)sessionGetScreenCount:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        int count = [clevertap userGetScreenCount];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:count];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)sessionGetPreviousVisitTime:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSTimeInterval previous = [clevertap userGetPreviousVisitTime];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:previous];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)sessionGetUTMDetails:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        CleverTapUTMDetail *detail = [clevertap sessionGetUTMDetails];
        NSDictionary * _detail = [self _utmDetailToDict:detail];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:_detail];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }];
}

- (void)pushInstallReferrer:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *source = [command argumentAtIndex:0];
        NSString *medium = [command argumentAtIndex:1];
        NSString *campaign = [command argumentAtIndex:2];
        [clevertap pushInstallReferrerSource:source medium:medium campaign:campaign];
    }];
}


#pragma mark - Inbox

- (void)initializeInbox:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap initializeInboxWithCallback:^(BOOL success) {
            NSLog(@"Inbox initialized %d", success);
            NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInboxDidInitialize')"];
            [self.commandDelegate evalJs:js];
            [self inboxMessagesDidUpdate];
        }];
    }];
}

- (void)inboxMessagesDidUpdate {
    
    [self.commandDelegate runInBackground:^{
        [clevertap registerInboxUpdatedBlock:^{
            NSLog(@"Inbox Messages updated");
            NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInboxMessagesDidUpdate')"];
            [self.commandDelegate evalJs:js];
        }];
    }];
}

- (void)getInboxMessageUnreadCount:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSUInteger unreadMessageCount = [clevertap getInboxMessageUnreadCount];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)unreadMessageCount];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Get Inbox Message Count
 */
- (void)getInboxMessageCount:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSUInteger messageCount = [clevertap getInboxMessageCount];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:(int)messageCount];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Show Inbox
 */
- (void)showInbox:(CDVInvokedUrlCommand *)command {
    
    NSDictionary *configStyle = [command argumentAtIndex:0];
    CleverTapInboxViewController *inboxController = [clevertap newInboxViewControllerWithConfig:[self _dictToInboxStyleConfig:configStyle? configStyle : nil] andDelegate:(id <CleverTapInboxViewControllerDelegate>)self];
    if (inboxController) {
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:inboxController];
        [self.viewController presentViewController:navigationController animated:YES completion:nil];
    }
}

/**
 Get All Inbox Messages
 */
- (void)getAllInboxMessages:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSArray<CleverTapInboxMessage *> *messageList = [clevertap getAllInboxMessages];
        NSArray *inboxMessages = [self cleverTapInboxMessagesToArray: messageList];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:inboxMessages];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Get Unread Messages From Inbox
 */
- (void)getUnreadInboxMessages:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSArray<CleverTapInboxMessage *> *messageList = [clevertap getUnreadInboxMessages];
        NSArray *unreadInboxMessages = [self cleverTapInboxMessagesToArray: messageList];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:unreadInboxMessages];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Get Inbox Message For Message ID
 */
- (void)getInboxMessageForId:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *messageId = [command argumentAtIndex:0];
        CleverTapInboxMessage *inboxMessage = [clevertap getInboxMessageForId:messageId];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:inboxMessage.json];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Delete message from the Inbox. Message id must be a String
 */
- (void)deleteInboxMessageForId:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *messageId = [command argumentAtIndex:0];
        [clevertap deleteInboxMessageForID: messageId];
    }];
}

/**
 Delete messages from the Inbox. Message id must be a String
 */
- (void)deleteInboxMessagesForIds:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSArray *messageIds = [command argumentAtIndex:0];
        [clevertap deleteInboxMessagesForIDs: messageIds];
    }];
}

/**
 Mark Message as Read
 */
- (void)markReadInboxMessageForId:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *messageId = [command argumentAtIndex:0];
        [clevertap markReadInboxMessageForID: messageId];
    }];
}

/**
 Mark Messages as Read in bulk
 */
- (void)markReadInboxMessagesForIds:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *messageIds = [command argumentAtIndex:0];
        [clevertap markReadInboxMessagesForIDs: messageIds];
    }];
}

/**
 Dismisses Appinbox 
 */
- (void)dismissInbox:(CDVInvokedUrlCommand *)command {
    [clevertap dismissAppInbox];
}

/**
 Record Inbox Notification Viewed for MessageID
 */
- (void)pushInboxNotificationViewedEventForId:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *messageId = [command argumentAtIndex:0];
        [clevertap recordInboxNotificationViewedEventForID: messageId];
    }];
}

/**
 Record Inbox Notification Clicked for MessageID
 */
- (void)pushInboxNotificationClickedEventForId:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *messageId = [command argumentAtIndex:0];
        [clevertap recordInboxNotificationClickedEventForID: messageId];
    }];
}

#pragma mark Inbox Callback
- (void)messageButtonTappedWithCustomExtras:(NSDictionary *_Nullable)customExtras {
    
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    
    if (customExtras != nil) {
        jsonDict[@"customExtras"] = customExtras;
    }
    
    NSString *jsonString = [self _dictToJson:jsonDict];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInboxButtonClick', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}

- (void)messageDidSelect:(CleverTapInboxMessage *_Nonnull)message atIndex:(int)index withButtonIndex:(int)buttonIndex{
    
    NSMutableDictionary *jsonObject = [NSMutableDictionary new];
    if ([message json] != nil) {
        jsonObject[@"data"] = [NSMutableDictionary dictionaryWithDictionary:[message json]];
    } else {
        jsonObject[@"data"] = [NSMutableDictionary new];
    }
    jsonObject[@"contentPageIndex"] = @(index);
    jsonObject[@"buttonIndex"] = @(buttonIndex);
    
    if (jsonObject != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapInboxItemClick', %@);", jsonObject];
        [self.commandDelegate evalJs:js];
    }
}

#pragma mark - Native Display

/**
 Get All Display Units
 */
- (void)getAllDisplayUnits:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSArray *displayUnits = [clevertap getAllDisplayUnits];
        NSArray *displayUnitsArray = [self cleverTapDisplayUnitsToArray: displayUnits];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: displayUnitsArray];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Get Display Unit  For ID
 */
- (void)getDisplayUnitForId:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *unitID = [command argumentAtIndex:0];
        CleverTapDisplayUnit *displayUnit = [clevertap getDisplayUnitForID:unitID];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:displayUnit.json];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

/**
 Record Display Unit Viewed Event For ID
 */
- (void)pushDisplayUnitViewedEventForID:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *unitID = [command argumentAtIndex:0];
        [clevertap recordDisplayUnitViewedEventForID:unitID];
    }];
}

- (void)pushDisplayUnitClickedEventForID:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *unitID = [command argumentAtIndex:0];
        [clevertap recordDisplayUnitClickedEventForID:unitID];
    }];
}

- (void)displayUnitsUpdated:(NSArray<CleverTapDisplayUnit *>*_Nonnull)displayUnits {
    
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    
    if (displayUnits != nil) {
        NSMutableArray *items = [[NSMutableArray alloc] init];
        for (CleverTapDisplayUnit *item in displayUnits) {
            [items addObject: item.json];
        }
        jsonDict[@"units"] = items;
    }
    
    NSString *jsonString = [self _dictToJson:jsonDict];
    
    if (jsonString != nil) {
        NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapDisplayUnitsLoaded', %@);", jsonString];
        [self.commandDelegate evalJs:js];
    }
}


#pragma mark - Product Experience

#pragma mark Feature Flag
//---Fetch Value of Given Feature Flag key and default value
- (void)getFeatureFlag: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *varName = [command argumentAtIndex:0];
        BOOL defaultValue = [command argumentAtIndex:1];
        BOOL flagValue = [[clevertap featureFlags] get:varName withDefaultValue:defaultValue];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:flagValue];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


#pragma mark Feature Flag Deleagte

- (void)ctFeatureFlagsUpdated {
    
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapFeatureFlagsDidUpdate')"];
    [self.commandDelegate evalJs:js];
}


#pragma mark Product Config

- (void)setDefaultsMap: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *jsonDict = [command argumentAtIndex:0];
        [[clevertap productConfig]setDefaults:jsonDict];
    }];
}

- (void)fetch: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [[clevertap productConfig] fetch];
    }];
}

- (void)fetchWithMinimumFetchIntervalInSeconds: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSTimeInterval interval = [[command argumentAtIndex:0] doubleValue];
        [[clevertap productConfig]fetchWithMinimumInterval: interval];
    }];
}

- (void)activate: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [[clevertap productConfig] activate];
    }];
}

- (void)fetchAndActivate: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [[clevertap productConfig] fetchAndActivate];
    }];
}

- (void)setMinimumFetchIntervalInSeconds: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSTimeInterval interval = [[command argumentAtIndex:0] doubleValue];
        [[clevertap productConfig] setMinimumFetchInterval:interval];
    }];
}

- (void)getLastFetchTimeStampInMillis: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSTimeInterval value = [[[clevertap productConfig] getLastFetchTimeStamp] timeIntervalSince1970] * 1000;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:value];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}


- (void)getString: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        NSString *keyValue = [[clevertap productConfig] get:key].stringValue;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:keyValue];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getBoolean: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        BOOL keyValue = [[clevertap productConfig] get:key].boolValue;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:keyValue];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getLong: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        long keyValue = [[clevertap productConfig] get:key].numberValue.longValue;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:keyValue];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getDouble: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *key = [command argumentAtIndex:0];
        double keyValue = [[clevertap productConfig] get:key].numberValue.doubleValue;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:keyValue];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)reset {
    
    [self.commandDelegate runInBackground:^{
        [[clevertap productConfig] reset];
    }];
}

- (void)setLibrary {
    NSString *libName = @"Cordova";
    int libVersion = 30300;
    [clevertap setLibrary:libName];
    [clevertap setCustomSdkVersion:libName version:libVersion];
}


#pragma mark Product Config Delegate

- (void)ctProductConfigFetched {
    
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapProductConfigDidFetch')"];
    [self.commandDelegate evalJs:js];
}

- (void)ctProductConfigActivated {
    
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapProductConfigDidActivate')"];
    [self.commandDelegate evalJs:js];
}

- (void)ctProductConfigInitialized {
    
    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapProductConfigDidInitialize')"];
    [self.commandDelegate evalJs:js];
}

#pragma mark Product Experience

- (void)syncVariables: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap syncVariables];
    }];
}

- (void)syncVariablesinProd: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL isProduction = [[command argumentAtIndex:0] boolValue];
        [clevertap syncVariables:isProduction];
    }];
}

- (void)fetchVariables:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap fetchVariables:^(BOOL success){
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:(BOOL)success];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
}

- (void)defineVariables: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *variables = [command argumentAtIndex:0];
        if (!allVariables){
            allVariables = [NSMutableDictionary new];
        }

        if(variables == nil){
            return;
        }
        [variables enumerateKeysAndObjectsUsingBlock:^(NSString*  _Nonnull key, id  _Nonnull value, BOOL * _Nonnull stop) {
            CTVar *var = [self createVarForName:key andValue:value];

            if (var) {
                allVariables[key] = var;
            }
        }];
    }];
}

- (void)getVariable:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *name = [command argumentAtIndex:0];
        CTVar *var = allVariables[name];

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:var.value];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getVariables:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *varValues = [self getVariableValues];

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varValues];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)onVariablesChanged:(CDVInvokedUrlCommand *)command {
    
        [self.commandDelegate runInBackground:^{
            [clevertap onVariablesChanged:^{
                NSMutableDictionary *varValues = [self getVariableValues];
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varValues];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }];
        }];
}

- (void)onOneTimeVariablesChanged:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap onceVariablesChanged:^{
            NSMutableDictionary *varValues = [self getVariableValues];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varValues];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
}

- (void)onVariablesChangedAndNoDownloadsPending:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap onVariablesChangedAndNoDownloadsPending:^{
            NSMutableDictionary *varValues = [self getVariableValues];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varValues];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
}

- (void)onceVariablesChangedAndNoDownloadsPending:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap onceVariablesChangedAndNoDownloadsPending:^{
            NSMutableDictionary *varValues = [self getVariableValues];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varValues];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
}

- (void)onValueChanged:(CDVInvokedUrlCommand *)command {
    
        [self.commandDelegate runInBackground:^{
            NSString *name = [command argumentAtIndex:0];
            CTVar *var = allVariables[name];
            if (var) {
                [var onValueChanged:^{
                    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:var.value];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                }];
            }
        }];
}

- (void)onFileValueChanged:(CDVInvokedUrlCommand *)command {
    
        [self.commandDelegate runInBackground:^{
            NSString *name = [command argumentAtIndex:0];
            CTVar *var = allVariables[name];
            if (var) {
                [var onFileIsReady:^{
                    NSDictionary *varFileResult = @{
                        var.name: var.value
                    };
                    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:varFileResult];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                }];
            }
        }];
}

- (void)defineFileVariable: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *fileVariable = [command argumentAtIndex:0];
        if (!allVariables){
            allVariables = [NSMutableDictionary new];
        }

        if(fileVariable == nil){
            return;
        }
        CTVar *fileVar = [clevertap defineFileVar:fileVariable];
        if (fileVar) {
            allVariables[fileVariable] = fileVar;
        }
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

#pragma mark Push primer

- (CTLocalInApp*)_localInAppConfigFromReadableMap: (NSDictionary *)json {
    CTLocalInApp *inAppBuilder;
    CTLocalInAppType inAppType = HALF_INTERSTITIAL;
    //Required parameters
    NSString *titleText = nil, *messageText = nil, *followDeviceOrientation = nil, *positiveBtnText = nil, *negativeBtnText = nil;
    //Additional parameters
    NSString *fallbackToSettings = nil, *backgroundColor = nil, *btnBorderColor = nil, *titleTextColor = nil, *messageTextColor = nil, *btnTextColor = nil, *imageUrl = nil, *btnBackgroundColor = nil, *btnBorderRadius = nil;
    
    if ([json[@"inAppType"]  isEqual: @"half-interstitial"]){
        inAppType = HALF_INTERSTITIAL;
    }
    else {
        inAppType = ALERT;
    }
    if (json[@"titleText"]) {
        titleText = [json valueForKey:@"titleText"];
    }
    if (json[@"messageText"]) {
        messageText = [json valueForKey:@"messageText"];
    }
    if (json[@"followDeviceOrientation"]) {
        followDeviceOrientation = [json valueForKey:@"followDeviceOrientation"];
    }
    if (json[@"positiveBtnText"]) {
        positiveBtnText = [json valueForKey:@"positiveBtnText"];
    }
    
    if (json[@"negativeBtnText"]) {
        negativeBtnText = [json valueForKey:@"negativeBtnText"];
    }
    
    //creates the builder instance with all the required parameters
    inAppBuilder = [[CTLocalInApp alloc] initWithInAppType:inAppType
                                                 titleText:titleText
                                               messageText:messageText
                                   followDeviceOrientation:followDeviceOrientation
                                           positiveBtnText:positiveBtnText
                                           negativeBtnText:negativeBtnText];
    
    //adds optional parameters to the builder instance
    if (json[@"fallbackToSettings"]) {
        fallbackToSettings = [json valueForKey:@"fallbackToSettings"];
        [inAppBuilder setFallbackToSettings:fallbackToSettings];
    }
    if (json[@"backgroundColor"]) {
        backgroundColor = [json valueForKey:@"backgroundColor"];
        [inAppBuilder setBackgroundColor:backgroundColor];
    }
    if (json[@"btnBorderColor"]) {
        btnBorderColor = [json valueForKey:@"btnBorderColor"];
        [inAppBuilder setBtnBorderColor:btnBorderColor];
    }
    if (json[@"titleTextColor"]) {
        titleTextColor = [json valueForKey:@"titleTextColor"];
        [inAppBuilder setTitleTextColor:titleTextColor];
    }
    if (json[@"messageTextColor"]) {
        messageTextColor = [json valueForKey:@"messageTextColor"];
        [inAppBuilder setMessageTextColor:messageTextColor];
    }
    if (json[@"btnTextColor"]) {
        btnTextColor = [json valueForKey:@"btnTextColor"];
        [inAppBuilder setBtnTextColor:btnTextColor];
    }
    if (json[@"imageUrl"]) {
        imageUrl = [json valueForKey:@"imageUrl"];
        [inAppBuilder setImageUrl:imageUrl];
    }
    if (json[@"btnBackgroundColor"]) {
        btnBackgroundColor = [json valueForKey:@"btnBackgroundColor"];
        [inAppBuilder setBtnBackgroundColor:btnBackgroundColor];
    }
    if (json[@"btnBorderRadius"]) {
        btnBorderRadius = [json valueForKey:@"btnBorderRadius"];
        [inAppBuilder setBtnBorderRadius:btnBorderRadius];
    }
    return inAppBuilder;
}

- (void)promptForPushPermission: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL showFallbackSettings = [[command argumentAtIndex:0] boolValue];
        [clevertap promptForPushPermission:showFallbackSettings];
    }];
}

- (void)promptPushPrimer: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *json = [command argumentAtIndex:0];
        if(json == nil){
            return;
        }
        CTLocalInApp *localInAppBuilder = [self _localInAppConfigFromReadableMap:json];
        [clevertap promptPushPrimer:localInAppBuilder.getLocalInAppSettings];
    }];
}

- (void)isPushPermissionGranted:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        if (@available(iOS 10.0, *)) {
        [clevertap getNotificationPermissionStatusWithCompletionHandler:^(UNAuthorizationStatus status) {
                BOOL result = (status == UNAuthorizationStatusAuthorized);
                NSLog(@"[CleverTap isPushPermissionGranted: %i]", result);
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:result];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }];
        } else {
        // Fallback on earlier versions
        NSLog(@"Push Notification is available from iOS v10.0 or later");
        }   
    }];
}

#pragma mark - CleverTapPushPermissionDelegate

- (void)onPushPermissionResponse:(BOOL)accepted {

    NSMutableDictionary *json = [NSMutableDictionary new];
    json[@"accepted"] = [NSNumber numberWithBool:accepted];

    NSString *js = [NSString stringWithFormat:@"cordova.fireDocumentEvent('onCleverTapPushPermissionResponseReceived', %@);", json];
    [self.commandDelegate evalJs:js]; 
}

#pragma mark - Locale methods

- (void)setLocale:(CDVInvokedUrlCommand *)command {
    if (![[command argumentAtIndex:0] isKindOfClass:[NSString class]]) {
        return;
    }
    
    NSString *localeIdentifier = [command argumentAtIndex:0];
    if (localeIdentifier != nil && localeIdentifier.length > 0) {
        NSLocale *userLocale = [NSLocale localeWithLocaleIdentifier:localeIdentifier];
        [clevertap setLocale:userLocale];
    }
}

#pragma mark - InApp Controls

- (void)clearInAppResources:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        BOOL expiredOnly = [[command argumentAtIndex:0] boolValue];
        [clevertap clearInAppResources:expiredOnly];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)fetchInApps:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        [clevertap fetchInApps:^(BOOL success){
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:(BOOL)success];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    }];
}

- (void)clearFileResources:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        BOOL expiredOnly = [[command argumentAtIndex:0] boolValue];
        [clevertap clearInAppResources:expiredOnly];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

# pragma mark - Custom Code Templates

- (void)syncCustomTemplates: (CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [clevertap syncCustomTemplates];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)syncCustomTemplatesInProd: (CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        BOOL isProduction = [[command argumentAtIndex:0] boolValue];
        [clevertap syncCustomTemplates:isProduction];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)customTemplateSetDismissed:(CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    
    [self resolveWithTemplateContext:templateName
                             success:^(NSString *result) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        [context dismissed];
        return nil;
    }];
}

- (void)customTemplateSetPresented: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    
    [self resolveWithTemplateContext:templateName
                             success:^(NSString *result) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        [context presented];
        return nil;
    }];
}

- (void)customTemplateRunAction:(CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(NSString *result) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        [context triggerActionNamed:argName];
        return nil;
    }];
}

- (void)customTemplateGetStringArg: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        NSString *str = [context stringNamed:argName];
        return str ? str : [NSNull null];
    }];
}

- (void)customTemplateGetNumberArg: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        NSNumber *number = [context numberNamed:argName];
        return number ? number : [NSNull null];
    }];
}

- (void)customTemplateGetBooleanArg: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        NSNumber *result = [NSNumber numberWithBool:[context boolNamed:argName]];
        return result;
    }];
}

- (void)customTemplateGetFileArg: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        NSString *filePath = [context fileNamed:argName];
        return filePath ? filePath : [NSNull null];
    }];
}

- (void)customTemplateGetObjectArg: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    NSString *argName = [command.arguments objectAtIndex:1];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        NSDictionary *dictionary = [context dictionaryNamed:argName];
        return dictionary ? dictionary : [NSNull null];
    }];
}

- (void)customTemplateContextToString: (CDVInvokedUrlCommand *)command {
    NSString *templateName = [command.arguments objectAtIndex:0];
    
    [self resolveWithTemplateContext:templateName
                             success:^(id result) {
        [self sendPluginResult:result withCommand:command];
    }
                             failure:^(NSString *errorMessage) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
                               block:^id(CTTemplateContext *context) {
        return [context debugDescription];
    }];
}

#pragma mark Helper methods

- (void)resolveWithTemplateContext:(NSString *)templateName
                           success:(void (^)(id result))success
                           failure:(void (^)(NSString *errorMessage))failure
                             block:(id (^)(CTTemplateContext *context))blockName {
    [self.commandDelegate runInBackground:^{
        if (!clevertap) {
            failure(@"CleverTap is not initialized");
            return;
        }
        
        CTTemplateContext *context = [clevertap activeContextForTemplate:templateName];
        if (!context) {
            NSString *errorMessage = [NSString stringWithFormat:@"Custom template: %@ is not currently being presented", templateName];
            failure(errorMessage);
            return;
        }
        
        success(blockName(context));
    }];
}

- (void)sendPluginResult:(id)result withCommand:(CDVInvokedUrlCommand *)command {
    if (result != nil && ![result isKindOfClass:[NSNull class]]) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Argument not found"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}


- (CTVar *)createVarForName:(NSString *)name andValue:(id)value {

    if ([value isKindOfClass:[NSString class]]) {
        return [clevertap defineVar:name withString:value];
    }
    if ([value isKindOfClass:[NSDictionary class]]) {
        return [clevertap defineVar:name withDictionary:value];
    }
    if ([value isKindOfClass:[NSNumber class]]) {
        if ([self isBoolNumber:value]) {
            return [clevertap defineVar:name withBool:value];
        }
        return [clevertap defineVar:name withNumber:value];
    }
    return nil;
}

- (BOOL)isBoolNumber:(NSNumber *)number {
    CFTypeID boolID = CFBooleanGetTypeID();
    CFTypeID numID = CFGetTypeID(CFBridgingRetain(number));
    return (numID == boolID);
}

- (NSMutableDictionary *)getVariableValues {
    NSMutableDictionary *varValues = [NSMutableDictionary dictionary];
    [allVariables enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, CTVar*  _Nonnull var, BOOL * _Nonnull stop) {
        varValues[key] = var.value;
    }];
    return varValues;
}

- (CleverTapInboxStyleConfig*)_dictToInboxStyleConfig: (NSDictionary *)dict {
    
    CleverTapInboxStyleConfig *_config = [CleverTapInboxStyleConfig new];
    NSString *title = [dict valueForKey:@"navBarTitle"];
    if (title) {
        _config.title = title;
    }
    NSArray *messageTags = [dict valueForKey:@"tabs"];
    if (messageTags) {
        _config.messageTags = messageTags;
    }
    NSString *backgroundColor = [dict valueForKey:@"inboxBackgroundColor"];
    if (backgroundColor) {
        _config.backgroundColor = [self ct_colorWithHexString:backgroundColor alpha:1.0];
    }
    NSString *navigationBarTintColor = [dict valueForKey:@"navBarColor"];
    if (navigationBarTintColor) {
        _config.navigationBarTintColor = [self ct_colorWithHexString:navigationBarTintColor alpha:1.0];
    }
    NSString *navigationTintColor = [dict valueForKey:@"navBarTitleColor"];
    if (navigationTintColor) {
        _config.navigationTintColor = [self ct_colorWithHexString:navigationTintColor alpha:1.0];
    }
    NSString *tabBackgroundColor = [dict valueForKey:@"tabBackgroundColor"];
    if (tabBackgroundColor) {
        _config.navigationBarTintColor = [self ct_colorWithHexString:tabBackgroundColor alpha:1.0];
    }
    NSString *tabSelectedBgColor = [dict valueForKey:@"tabSelectedBgColor"];
    if (tabSelectedBgColor) {
        _config.tabSelectedBgColor = [self ct_colorWithHexString:tabSelectedBgColor alpha:1.0];
    }
    NSString *tabSelectedTextColor = [dict valueForKey:@"tabSelectedTextColor"];
    if (tabSelectedTextColor) {
        _config.tabSelectedTextColor = [self ct_colorWithHexString:tabSelectedTextColor alpha:1.0];
    }
    NSString *tabUnSelectedTextColor = [dict valueForKey:@"tabUnSelectedTextColor"];
    if (tabUnSelectedTextColor) {
        _config.tabUnSelectedTextColor = [self ct_colorWithHexString:tabUnSelectedTextColor alpha:1.0];
    }
    return _config;
}

- (UIColor *)ct_colorWithHexString:(NSString *)string alpha:(CGFloat)alpha {
    
    if (![string isKindOfClass:[NSString class]] || [string length] == 0) {
        return [UIColor colorWithRed:0.0f green:0.0f blue:0.0f alpha:1.0f];
    }
    unsigned int hexint = 0;
    NSScanner *scanner = [NSScanner scannerWithString:string];
    [scanner setCharactersToBeSkipped:[NSCharacterSet
                                       characterSetWithCharactersInString:@"#"]];
    [scanner scanHexInt:&hexint];
    UIColor *color =
    [UIColor colorWithRed:((CGFloat) ((hexint & 0xFF0000) >> 16))/255
                    green:((CGFloat) ((hexint & 0xFF00) >> 8))/255
                     blue:((CGFloat) (hexint & 0xFF))/255
                    alpha:alpha];
    return color;
}


@end

