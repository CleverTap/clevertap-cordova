CleverTap Cordova Plugin
========
[![npm version](https://badge.fury.io/js/clevertap-cordova.svg)](https://badge.fury.io/js/clevertap-cordova)

## Supported Versions

Tested on Cordova 8.0.0

- [CleverTap Android SDK version 3.5.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/3.5.1)
- [CleverTap iOS SDK version 3.7.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.7.1)

## Install

To integrate CleverTap for Cordova:

1. Sign up

2. Set up and register for Push notifications, if required.

3. Integrate your Javascript with the CleverTap Plugin.

### 1. Sign up

[Sign up](http://www.clevertap.com/sign-up/) for a free account.  

When you create your CleverTap account, you will also automatically get a -Test account.  Use the -Test account for development and the main account for production.

### Install the Plugin

Grab the Account ID and Token values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings.

#### For Android *Important*
Starting with v2.0.0, the plugin uses FCM rather than GCM.  To configure FCM, add your google-services.json to the root of your cordova project **before you add the plugin**.  
The plugin uses an `after plugin add` hook script to configure your project for FCM.  
If the google-services.json file is not present in your project when the script runs, FCM will not be configured properly and will not work.

#### Using Cordova  

```
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP ACCOUNT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP ACCOUNT TOKEN"
```


#### Using Ionic  

```
ionic cordova plugin add clevertap-cordova@latest --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP ACCOUNT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP ACCOUNT TOKEN"
```

##### For Ionic3
```
npm install @ionic-native/clevertap --save 
```
- [see the included Ionic3 Example project for usage](https://github.com/CleverTap/clevertap-cordova/blob/master/Ionic3Example/src/app/app.component.ts).

- be sure to [add CleverTap as a provider in your app module](https://github.com/CleverTap/clevertap-cordova/blob/master/Ionic3Example/src/app/app.module.ts). 
```
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, clevertap: CleverTap) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      ...
      clevertap.setDebugLevel(2);
      clevertap.profileGetCleverTapID((id) => {console.log(id)});
      ...
    });
  }
}

```

#### Using PhoneGap Build

**Starting with v2.0.0, the plugin drops official support for PhoneGap Build.**
This is because PhoneGap Build does not support install hooks and a hook is required to configure FCM.
It might be possible by forking this plugin and replacing the placeholder google-services.json in src/android with yours, and then hard coding your google app id and api key in plugin.xml, but you're on your own there.

When using the plugin with PhoneGap Build:

Add the following to your `www/config.xml` file:

```
<preference name="android-build-tool" value="gradle" />

<gap:plugin name="clevertap-cordova" source="npm">
    <param name="CLEVERTAP_ACCOUNT_ID" value="YOUR CLEVERTAP ACCOUNT ID" />
    <param name="CLEVERTAP_TOKEN" value="YOUR CLEVERTAP ACCOUNT TOKEN" />
    <param name="GCM_PROJECT_NUMBER" value="YOUR GCM PROJECT NUMBER" /> // for v1.2.5 and lower of the plugin
</gap:plugin>
```            

*For PhoneGap Build Android projects*:  **Extremely Important**:  add `CleverTap.notifyDeviceReady();` to your onDeviceReady callback in `www/js/index.js`:

```
onDeviceReady: function() {
    app.receivedEvent('deviceready');
    CleverTap.notifyDeviceReady();
    ...
},
```

#### Android

Check that the following is inside the `<application></application>` tags of your AndroidManifest.xml:  

    <meta-data  
        android:name="CLEVERTAP_ACCOUNT_ID"  
        android:value="Your CleverTap Account ID"/>  
    <meta-data  
        android:name="CLEVERTAP_TOKEN"  
        android:value="Your CleverTap Account Token"/>

Replace "Your CleverTap Account ID" and "Your CleverTap Account Token" with actual values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings.

**Set the Lifecycle Callback**

IMPORTANT!

Check the `android:name` property of the `<application>` tag of our AndroidManifest.xml:

    <application
        android:name="com.clevertap.android.sdk.Application">

**Note:** The above step is **extremely important** and enables CleverTap to track notification opens, display in-app notifications, track deep links, and other important **user behaviour**.

**Add Permissions**

Please ensure that you're requesting the following permissions for your app:

    <!-- Required to allow the app to send events -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <!-- Recommended so that we can be smart about when to send the data -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK" />

[Please see the example AndroidManifest.xml here](https://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

**Add Dependencies**

Make sure your build.gradle file includes the play-services and support library dependencies:

    dependencies {
        compile fileTree(dir: 'libs', include: '*.jar'  )
        debugCompile(project(path: "CordovaLib", configuration: "debug"))
        releaseCompile(project(path: "CordovaLib", configuration: "release"))
        // SUB-PROJECT DEPENDENCIES START
        compile "com.google.firebase:firebase-core:+"
        compile "com.google.firebase:firebase-messaging:+"
        compile "com.google.android.gms:play-services-base:+"
        compile "com.android.support:support-v4:+"
        // SUB-PROJECT DEPENDENCIES END   

**NOTE**

Cordova Android 7.+ doesn't support Android Pie (28) libraries and hence to use this plugin, you will have to add one more plugin to your app

    cordova plugin add cordova-android-support-gradle-release

This plugin will manage the dependencies to the highest version available in your app and make sure the app builds correctly. CleverTap supports Tabs in the App Inbox but needs the Android design library to be on v28.0.0. Since this is not possible currently on Cordova, Tabs will not be available in this release. Once Cordova starts supporting Android Pie(28), we will be updating our Cordova SDK so that it can support Tabs.

### 2. Set up and register for push notifications and deep links

#### iOS

[Set up push notifications for your app](https://developer.apple.com/library/mac/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6).

If you plan on using deep links, [please register your custom url scheme as described here](https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html#//apple_ref/doc/uid/TP40007072-CH6-SW1).

Call the following from your Javascript.

    CleverTap.registerPush();


#### Android

The `FCMTokenListenerService` of the CleverTap Android SDK registers push tokens automatically. No action is required from the Javascript side. Hence, Android does not require the `CleverTap.registerPush()` method.

Add your custom url scheme to the AndroidManifest.xml.

	 <intent-filter android:label="@string/app_name">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="clevertapstarter" />
     </intent-filter>


See [example AndroidManifest.xml](ihttps://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

### 3. Integrate Javascript with the Plugin

After integrating, all calls to the CleverTap SDK should be made from your Javascript.

Start by adding the following listeners to your Javascript:

    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false); // optional: to be notified of CleverTap user profile synchronization updates
    document.addEventListener('onCleverTapProfileDidInitialize', this.onCleverTapProfileDidInitialize, false); // optional, to be notified when the CleverTap user profile is initialized
    document.addEventListener('onCleverTapInAppNotificationDismissed', this.onCleverTapInAppNotificationDismissed, false); // optional, to be receive a callback with custom in-app notification click data
    document.addEventListener('onDeepLink', this.onDeepLink, false); // optional, register to receive deep links.
    document.addEventListener('onPushNotification', this.onPushNotification, false); // optional, register to receive push notification payloads.


    // deep link handling  
    onDeepLink: function(e) {
        console.log(e.deeplink);  
    },  

    // push notification data handling
    onPushNotification: function(e) {
        console.log(JSON.stringify(e.notification));
    },


Then:  

- [see the included iOS Example Cordova project for usage](https://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/ios/www/js/index.js).   

- [see the included Android Example Cordova project for usage](https://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/android/app/src/main/assets/www/js/index.js).  

- [see the included Ionic3 Example project for usage](https://github.com/CleverTap/clevertap-cordova/blob/master/Ionic3Example/src/app/app.component.ts).  
