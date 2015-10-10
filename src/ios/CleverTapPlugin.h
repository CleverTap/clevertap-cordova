//
//  CleverTapPlugin.h
//  Copyright (C) 2015 CleverTap 
//
//  This code is provided under a comercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//
//


#import <Cordova/CDVPlugin.h>

@interface CleverTapPlugin : CDVPlugin

# pragma mark Developer Options
- (void) setDebugLevel:(CDVInvokedUrlCommand *)command;

# pragma mark enable Personalization API
- (void) enablePersonalization:(CDVInvokedUrlCommand *)command;

#pragma mark Push Notifications
- (void) registerPush:(CDVInvokedUrlCommand *)command;
- (void) setPushToken:(NSData*)pushToken;
- (void) handleNotification:(id)notification;

#pragma mark Event API
- (void) recordEventWithName:(CDVInvokedUrlCommand *)command;
- (void) recordEventWithNameAndProps:(CDVInvokedUrlCommand *)command;
- (void) recordChargedEventWithDetailsAndItems:(CDVInvokedUrlCommand *)command;
- (void) eventGetFirstTime:(CDVInvokedUrlCommand *)command;
- (void) eventGetLastTime:(CDVInvokedUrlCommand *)command;
- (void) eventGetOccurrences:(CDVInvokedUrlCommand *)command;
- (void) eventGetDetails:(CDVInvokedUrlCommand *)command;
- (void) getEventHistory:(CDVInvokedUrlCommand *)command;


#pragma mark Profile API
- (void) profileSet:(CDVInvokedUrlCommand *)command;
- (void) profileSetGraphUser:(CDVInvokedUrlCommand *)command;
- (void) profileSetGooglePlusUser:(CDVInvokedUrlCommand *)command;
- (void) profileGetProperty:(CDVInvokedUrlCommand *)command;

#pragma mark Session API
- (void) sessionGetTimeElapsed:(CDVInvokedUrlCommand *)command;
- (void) sessionGetTotalVisits:(CDVInvokedUrlCommand *)command;
- (void) sessionGetScreenCount:(CDVInvokedUrlCommand *)command;
- (void) sessionGetPreviousVisitTime:(CDVInvokedUrlCommand *)command;
- (void) sessionGetUTMDetails:(CDVInvokedUrlCommand *)command;

@end
