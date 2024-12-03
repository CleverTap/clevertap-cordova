<p align="center">
 <img src="https://github.com/CleverTap/clevertap-ios-sdk/blob/master/docs/images/clevertap-logo.png" width = "50%"/>
</p>

# CleverTap Cordova Plugin

[![npm version](https://badge.fury.io/js/clevertap-cordova.svg)](https://badge.fury.io/js/clevertap-cordova)
<a href="https://github.com/CleverTap/clevertap-cordova/releases">
    <img src="https://img.shields.io/github/release/CleverTap/clevertap-cordova.svg" />
</a>
[![npm downloads](https://img.shields.io/npm/dm/clevertap-cordova.svg)](https://www.npmjs.com/package/clevertap-cordova)

## 👋 Introduction
The CleverTap Cordova Plugin for Mobile Customer Engagement and Analytics solutions.

For more information check out our [website](https://clevertap.com/ "CleverTap") and [documentation](https://developer.clevertap.com/docs/ "CleverTap Technical Documentation").

To get started, sign up [here](https://clevertap.com/live-product-demo/).

## ✅ Supported Versions

- [CleverTap Android SDK version 7.0.3](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev7.0.3)
- [CleverTap iOS SDK version 7.0.3](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/7.0.3)

## 🚀 Installation and Quick Start

To install CleverTap for Cordova, follow the steps mentioned below:

When you create your CleverTap account, you will also get a -Test account.  Use the -Test account for development and the main account for production.

#### Install the Plugin

Grab the Account ID and Token values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings.

##### For Android *Important*
Starting with v2.0.0, the plugin uses FCM rather than GCM.  To configure FCM, add your google-services.json to the root of your cordova project **before you add the plugin**.  
The plugin uses an `after plugin add` hook script to configure your project for FCM.  
If the google-services.json file is not present in your project when the script runs, FCM will not be configured properly and will not work.

##### Using Cordova  

```sh
# ensure npm is installed: npm -g install npm
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP ACCOUNT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP ACCOUNT TOKEN"
```

##### Using Ionic  

```sh
ionic cordova plugin add clevertap-cordova@latest --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP ACCOUNT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP ACCOUNT TOKEN"
```

##### For Ionic 5

```sh
npm install @ionic-native/clevertap --save 
```
- Be sure to [add CleverTap as a provider in your app module](/Samples/IonicCordova/IonicAngularProject/src/app/app.component.ts). 
```javascript
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, clevertap: CleverTap) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      ...
      clevertap.setDebugLevel(2);
      clevertap.getCleverTapID()((id) => {console.log(id)});
      ...
    });
  }
}

```

## 🛠 Integration

See our [Technical Documentation for Android](docs/Integrate-Android.md) and [Technical Documentation for iOS](docs/Integrate-iOS.md) for instructions on integrating CleverTap into your app.


## 📑 Documentation & Example

- [See our CleverTap Plugin Usage Documentation](docs/Usage.md)

- [See the included Example Cordova project for usage](/Samples/Cordova/ExampleProject/www/js/index.js).  

- [See the included Ionic Example project for usage](/Samples/IonicCordova/IonicAngularProject/src/app/app.component.ts).


## ⁉️ Questions? #

 If you have questions or concerns, you can reach out to the CleverTap support team from the CleverTap Dashboard. 
 
**TroubleShooting Guide:** Please refer [here](docs/Troubleshooting-Guide.md) if you are facing common integration issues.
