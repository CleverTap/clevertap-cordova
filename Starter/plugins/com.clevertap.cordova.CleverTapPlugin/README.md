CleverTap Cordova Plugin
========

## Supported Versions

Tested on Cordova v3.9.1

- [CleverTap Android SDK version 2.0.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/2.0.1)
- [CleverTap iOS SDK version 2.0.2, Xcode 7 only](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/2.0.2)

## Install

```
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git
```

## Integration

To integrate CleverTap for Cordova:

1. Sign up 

2. Set up and register for Push notifications, if required.

3. Integrate your Javascript with the CleverTap Plugin.

### 1. Sign up

[Sign up](http://www.clevertap.com/sign-up/) for a free account.  

When you create your CleverTap account, you will also automatically get a -Test account.  Use the -Test account for development and the main account for production.

#### iOS

Update your .plist file:

* Create a key called CleverTapAccountID with a string value
* Create a key called CleverTapToken with a string value
* Insert the values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings -> Integration Details.


![plist account values](http://staging.support.wizrocket.com.s3-website-eu-west-1.amazonaws.com/images/integration/plist-account.png)

#### Android

Add the following inside the `<application></application>` tags of your AndroidManifest.xml:  

    <meta-data  
        android:name="CLEVERTAP_ACCOUNT_ID"  
        android:value="Your CleverTap Account ID"/>  
    <meta-data  
        android:name="CLEVERTAP_TOKEN"  
        android:value="Your CleverTap Account Token"/>

Replace "Your CleverTap Account ID" and "Your CleverTap Account Token" with actual values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings -> Integration -> Account ID, SDK's.

### 2. Set up and register for push notifications

#### iOS

[Follow Steps 1 and 2 in these instructions to set up push notifications for your app.](https://support.clevertap.com/messaging/push-notifications/#ios)

Please note that The CleverTapPlugin relies on "CDVRemoteNotification", "CDVRemoteNotificationError" and "CDVPluginHandleOpenURLNotification" broadcasted by Cordova's AppDelegate.m class to handle user push notification permissioning. If you change the AppDelegate, ensure to re-broadcast these events from the appropriate handlers. [See the included example Starter Project](https://github.com/CleverTap/clevertap-cordova/blob/master/Starter/platforms/ios/CleverTapStarter/Classes/AppDelegate.m).

Afterwards, call the following from your Javascript.

    CleverTap.registerPush();


To register the user push token please replace the default Cordova behavior in the AppDelegate.m in the `application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken` as follows:

    // replace default Cordova token handling; send raw token to CleverTap Plugin directly
    
    CleverTapPlugin *CleverTap = [self.viewController getCommandInstance:@"CleverTapPlugin"];
    [CleverTap setPushToken:deviceToken];
    
    /*
    // re-post ( broadcast )
    NSString* token = [[[[deviceToken description]
        stringByReplacingOccurrencesOfString:@"<" withString:@""]
        stringByReplacingOccurrencesOfString:@">" withString:@""]
        stringByReplacingOccurrencesOfString:@" " withString:@""];
    [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
    */
    

[See the included example Starter Cordova project](https://github.com/CleverTap/clevertap-cordova/blob/master/Starter/platforms/ios/CleverTapStarter/Classes/AppDelegate.m).


#### Android

[Follow these instructions to set up push notifications for your app.](https://support.clevertap.com/messaging/push-notifications/#android)

Afterwards, call the following from your Javascript.

    CleverTap.registerPush();


### 3. Integrate Javascript with the Plugin

After integrating, all calls to to the CleverTap SDK should be made from your Javascript.

Start by adding the following listener to your Javascript:

    document.addEventListener('deviceready', this.onDeviceReady, false);

Then [see the included Starter Cordova project for example usage](https://github.com/CleverTap/clevertap-cordova/blob/master/Starter/platforms/ios/www/js/index.js).
