//
//  CleverTapPlugin.m
//  Copyright (C) 2015 CleverTap
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//
//

#import "CleverTapPlugin.h"
#import <CleverTapSDK/CleverTap.h>

static NSDateFormatter *dateFormatter;

@interface CleverTapPlugin() {
    
}
+ (CleverTap *)push;
+ (CleverTap *)event;
+ (CleverTap *)profile;
+ (CleverTap *)session;

@end

@implementation CleverTapPlugin

#pragma mark Private

+ (void)load {
    // Listen for UIApplicationDidFinishLaunchingNotification to get a hold of launchOptions
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDidFinishLaunchingNotification:) name:UIApplicationDidFinishLaunchingNotification object:nil];
    
    // Listen to re-broadcast events from Cordova's AppDelegate
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDidRegisterForRemoteNotificationWithDeviceToken:) name:CDVRemoteNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDidFailToRegisterForRemoteNotificationsWithError:) name:CDVRemoteNotificationError object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onHandleOpenURLNotification:) name:CDVPluginHandleOpenURLNotification object:nil];
   
}

+ (void)onDidFinishLaunchingNotification:(NSNotification *)notification {
    NSDictionary *launchOptions = notification.userInfo;
    if (launchOptions && launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey]) {
        [CleverTap handleNotificationWithData:launchOptions];
    }
    NSLog(@"launchOptions %@", launchOptions);
    [CleverTap notifyApplicationLaunchedWithOptions:launchOptions];
}

+ (void)onDidRegisterForRemoteNotificationWithDeviceToken:(NSNotification *)notification {
    NSLog(@"onRemoteRegister: %@", notification.object);
    [CleverTap setPushTokenFromString:notification.object];
}

+ (void)onDidFailToRegisterForRemoteNotificationsWithError:(NSNotification *)notification {
    //Log Failures
    NSLog(@"onRemoteRegisterFail: %@", notification.object);
}

+ (void)onHandleOpenURLNotification:(NSNotification *)notification {
    [CleverTap handleNotificationWithData:notification];
}

+ (CleverTap *)push {
    return [CleverTap push];
}

+ (CleverTap *)event {
    return [CleverTap event];
}

+ (CleverTap *)profile {
    return [CleverTap profile];
}

+ (CleverTap *)session {
    return [CleverTap session];
}

-(NSDictionary*)_eventDetailToDict:(CleverTapEventDetail*)detail {
    
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

-(NSDictionary*)_utmDetailToDict:(CleverTapUTMDetail*)detail {
    
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

#pragma mark Public

#pragma mark Push

- (void)registerPush:(CDVInvokedUrlCommand *)command {
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound);
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
    } else {
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
    }
}

#pragma mark Developer Options

- (void)setDebugLevel:(CDVInvokedUrlCommand *)command {
    NSNumber *level = [command argumentAtIndex:0];
    if (level != nil && [level isKindOfClass:[NSNumber class]]) {
        [CleverTap setDebugLevel:[level intValue]];
    }
}


#pragma mark Personalization

-(void) enablePersonalization:(CDVInvokedUrlCommand *)command {
    [CleverTap enablePersonalization];
}

#pragma mark Event API
- (void)recordEventWithName:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            [[CleverTap push] eventName:eventName];
        }
    }];
}

- (void)recordEventWithNameAndProps:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        NSDictionary *eventProps = [command argumentAtIndex:1];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]] && eventProps != nil && [eventProps isKindOfClass:[NSDictionary class]]) {
            [[CleverTap push] eventName:eventName eventProps:eventProps];
        }
    }];
}

- (void)recordChargedEventWithDetailsAndItems:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *details = [command argumentAtIndex:0];
        NSArray *items = [command argumentAtIndex:1];
        
        if (details != nil && [details isKindOfClass:[NSDictionary class]] && items != nil && [items isKindOfClass:[NSArray class]]) {
            [[CleverTap push] chargedEventWithDetails:details andItems:items];
        }
    }];
}

- (void) eventGetFirstTime:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            NSTimeInterval first = [[CleverTap event] getFirstTime:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:first];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void) eventGetLastTime:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            NSTimeInterval last = [[CleverTap event] getLastTime:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:last];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void) eventGetOccurrences:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            int num = [[CleverTap event] getOccurrences:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:num];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
    
}

- (void) eventGetDetails:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            CleverTapEventDetail *detail = [[CleverTap event] getEventDetail:eventName];
            NSDictionary * res = [self _eventDetailToDict:detail];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:res];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void) getEventHistory:(CDVInvokedUrlCommand *)command {
    
    [self.commandDelegate runInBackground:^{
        NSDictionary *history = [[CleverTap event] getHistory];
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

#pragma mark Profile API
- (void)profileSet:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSDictionary *profile = [command argumentAtIndex:0];
        if (profile != nil && [profile isKindOfClass:[NSDictionary class]]) {
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
            
            [[CleverTap push] profile:_profile];
        }
    }];
}

- (void)profileSetGraphUser:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSDictionary *profile = [command argumentAtIndex:0];
        if (profile != nil && [profile isKindOfClass:[NSDictionary class]]) {
            [[CleverTap push] graphUser:profile];
        }
    }];
}

- (void)profileSetGooglePlusUser:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSDictionary *profile = [command argumentAtIndex:0];
        if (profile != nil && [profile isKindOfClass:[NSDictionary class]]) {
            [[CleverTap push] googlePlusUser:profile];
        }
    }];
}

- (void) profileGetProperty:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *propertyName = [command argumentAtIndex:0];
        CDVPluginResult *pluginResult;
        
        if (propertyName != nil && [propertyName isKindOfClass:[NSString class]]) {
            id prop = [[CleverTap profile] getProperty:propertyName];
            
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

#pragma mark Session API
- (void) sessionGetTimeElapsed:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSTimeInterval elapsed = [[CleverTap session] getTimeElapsed];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:elapsed];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) sessionGetTotalVisits:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        int total = [[CleverTap session] getTotalVisits];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:total];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) sessionGetScreenCount:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        int count = [[CleverTap session] getScreenCount];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:count];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) sessionGetPreviousVisitTime:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSTimeInterval previous = [[CleverTap session] getPreviousVisitTime];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:previous];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) sessionGetUTMDetails:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        CleverTapUTMDetail *detail = [[CleverTap session] getUTMDetails];
        NSDictionary * _detail = [self _utmDetailToDict:detail];
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:_detail];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }];
}

@end
