Change Log
==========

Version 3.3.0 *(December 3, 2024)*
-------------------------------------------
#### New Features
**Android Specific**
* Supports [CleverTap Android SDK v7.0.3](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-703-november-29-2024). 
* Removes character limit of maximum 3 lines from AppInbox messages
* Adds support for `AndroidX Media3` in lieu of the [deprecation](https://developer.android.com/media/media3/exoplayer/migration-guide) of `ExoPlayer`. While Clevertap continues to support `ExoPlayer`, migration is recommended. For migration refer [here](docs/Integrate-Android.md#migrating-from-exoplayer-to-androidx-media3-optional).

**iOS specific**
* Supports [CleverTap iOS SDK v7.0.3](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-703-november-29-2024).

**Common for both Android and iOS**
* Adds support for triggering InApps based on user attribute changes.
* Adds support for File Type Variables in Remote Config. Please refer to the [Remote Config Variables](docs/Variables.md) doc to read more on how to integrate this in your app.
* Adds support for Custom Code Templates. Please refer to the [CustomCodeTemplates](docs/CustomCodeTemplates.md) doc to read more on how to integrate this in your app.
* Changes campaign triggering evaluation of event names, event properties, and profile properties to ignore letter case and whitespace. 
* Adds support for previewing in-apps created through the new dashboard advanced builder.
* Adds support for custom handshake domain configuration.

#### Bug Fixes
**Android Specific**
* Fixes an ANR caused by extremely old InApp campaigns.
* Fixes an issue where incorrect callbacks were sent for InApps when the phone was rotated.
* Fixes an issue where an InApp was displayed even after all the campaigns were stopped.
* Fixes an issue where the InApp image was not shown when the phone was rotated to landscape.
* Fixes an issue where certain URLs loaded incorrectly in custom HTML InApp templates.


Version 3.2.0 *(August 12, 2024)*
-------------------------------------------
#### New Features
**Android Specific**
* Supports [CleverTap Android SDK v6.2.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev6.2.1).
* Supports Android 14, made it compliant with Android 14 requirements. Details [here](https://developer.android.com/about/versions/14/summary).
* Extends the push primer callback to notify permission denial when cancel button is clicked on `PromptForSettings` alert dialog.
* Adds Accessibility ids for UI components of SDK.
* Migrates `JobScheduler` to `WorkManager` for [Pull Notifications](https://developer.clevertap.com/docs/android-push#pull-notification).

#### Bug Fixes
**Android Specific**
* Fixes [#239](https://github.com/CleverTap/clevertap-cordova/issues/239), an issue where the `onPushNotification` callback was not triggered when notification was tapped from the `killed` state on `capacitor` apps.
* Fixes InApps crash in a rare activity destroyed race condition.
* Fixes Potential ANR in a race condition of SDK initialisation in multithreaded setup.
* Fixes a bug in Client Side InApps with regards to frequency limits.
* Fixes a crash due to `NullPointerException` related to `deviceInfo.deviceId`.
* Fixes an ANR related to `isMainProcess` check.
* Fixes an ANR due to eager initialisation of `CtApi` triggered by DeviceId generation.

#### Breaking API Changes
* Removes all `Xiaomi` related public methods as the `Xiaomi` SDK has been discontinued. Details [here](https://developer.clevertap.com/docs/discontinuation-of-xiaomi-push-service).

Version 3.1.0 *(April 27, 2024)*
-------------------------------------------
#### New Features
**iOS specific**
* Supports [CleverTap iOS SDK v6.2.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/6.2.1).
* Adds privacy manifests.

#### Bug Fixes
**iOS specific**
* Fixes crash due to out of bounds in NSLocale implementation.
* Fixes a bug where client side in-apps were not discarded when rendering status is set to "discard".

Version 3.0.0 *(April 17, 2024)*
-------------------------------------------
#### New Features
**Android specific**
* Supports [CleverTap Android SDK v6.0.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev6.0.0_ptv1.2.2).
* Adds support for exoplayer `v2.19.1`.

**iOS specific**
* Supports [CleverTap iOS SDK v6.0.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/6.0.0).
* Adds support for client-side in-apps.

**Common for both android and iOS**
* Adds new public APIs, `fetchInApps` and `clearInAppResources` to support client-side in-apps.

#### Bug Fixes
**Android specific**
* Fixes no empty message for app inbox without tabs 
* Removes onClickListener for Image of Cover InApp

**iOS specific**
* Fixes a bug where some in-apps were not being dismissed

Version 2.7.2 *(December 5, 2023)*
-------------------------------------------
#### New Features

**Android specific**
* Supports [CleverTap Android SDK v5.2.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev5.2.1_xpsv1.5.4). This supported version includes support for Custom Proxy Domain functionality. Check usage for cordova android [here](docs/Integrate-Android.md#integrate-custom-proxy-domain).

**iOS specific**
* Supports [CleverTap iOS SDK v5.2.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.2.2). This supported version includes support for Custom Proxy Domain functionality. Check usage for cordova ios [here](docs/Integrate-iOS.md#integrate-custom-proxy-domain).

#### Bug Fixes
* Fixes a crash in iOS 17/Xcode 15 related to alert inapps.

**Common for both android and iOS**
* Adds new public API `setLocale(String locale)` for in-built support to send the custom locale(i.e.language and country) data to the dashboard.
* Adds support for Integration Debugger to view errors and events on the dashboard when the debugLevel is set to 3.

Version 2.7.1 *(August 17, 2023)*
-------------------------------------------
#### New Features

**Android specific**
* Supports [CleverTap Android SDK v5.2.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev5.2.0_hmsv1.3.3_xpsv1.5.3). This supported version includes encryption feature for PII data. Check encryption usage for cordova android [here](docs/Integrate-Android.md#setup-encryption-for-pii-data).

**iOS specific**
* Supports [CleverTap iOS SDK v5.2.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.2.0). This supported version includes encryption feature for PII data. Check encryption usage for cordova ios [here](docs/Integrate-iOS.md#setup-encryption-for-pii-data).

#### Bug Fixes
* Fixes `NSInvalidArgumentException` for `getDisplayUnitForId` and `getInboxMessageForId` in iOS.

Version 2.7.0 *(August 2, 2023)*
-------------------------------------------
#### New Features

**Android specific**
* Supports [CleverTap Android SDK v5.1.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev5.1.0_ptv1.1.0).
* Supports [cordova android 12.0.0](https://cordova.apache.org/announcements/2023/05/22/cordova-android-12.0.0.html)
* `deleteInboxMessagesForIds(messageIDs)` is now supported in Android as well.
* New callback `onCleverTapInAppNotificationShow(JSONObject)` 
* **Behavioral change of `onCleverTapInboxItemClick`**:
  - Previously, the callback was raised when the App Inbox Item is clicked.
  - Now, it is also raised when the App Inbox button and Item is clicked.


**iOS specific**
* Supports [CleverTap iOS SDK v5.1.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.1.2).
* Supports [cordova ios 7.0.0](https://cordova.apache.org/announcements/2023/07/10/cordova-ios-7.0.0.html)

**Common for both android and iOS**
* Adds below new public APIs for supporting [Android 13 notification runtime permission](https://developer.android.com/develop/ui/views/notifications/notification-permission)
  * `isPushPermissionGranted(successCallback)` [Usage can be found here](docs/pushprimer.md#get-the-push-notification-permission-status)
  * `promptPushPrimer(JSONObject)` [Usage can be found here](docs/pushprimer.md#push-primer-using-half-interstitial-local-in-app)
  * `promptForPushPermission(boolean)` [Usage can be found here](docs/pushprimer.md#prompt-the-notification-permission-dialog-without-push-primer)
  * New callback `onCleverTapPushPermissionResponseReceived` available which returns after user Allows/Denies notification permission [Usage can be found here](docs/pushprimer.md#available-callbacks-for-push-primer)
* Adds support for Remote Config Variables. Please refer to the [Variables.md](docs/Variables.md) file to
  read more on how to integrate this to your app.
* Adds new API, `markReadInboxMessagesForIds(messageIDs)` to mark read an array of
  Inbox Messages.
* Adds new API, `dismissInbox()` to dismiss the App Inbox.

#### API Changes

* **Deprecated:** The following methods and callbacks related to Product Config and Feature Flags have
  been marked as deprecated in this release, instead use new remote config variables feature. These
  methods and callbacks will be removed in the future versions with prior notice.
    * Product config
        - `setDefaultsMap()`
        - `fetch()`
        - `fetchWithMinimumFetchIntervalInSeconds()`
        - `activate()`
        - `fetchAndActivate()`
        - `setMinimumFetchIntervalInSeconds()`
        - `getLastFetchTimeStampInMillis()`
        - `getString()`
        - `getBoolean()`
        - `getLong()`
        - `getDouble()`
        - `reset()`
        - callback `onCleverTapProductConfigDidInitialize`
        - callback `onCleverTapProductConfigDidFetch`
        - callback `onCleverTapProductConfigDidActivate`
 
    * Feature flags
        - `getFeatureFlag()`
        - callback `onCleverTapFeatureFlagsDidUpdate`

#### Breaking API Changes

* **Return value change of `onCleverTapInboxItemClick` callback in android and `messageDidSelect` callback in iOS**: callback returns `JSONObject` with below entries
    - `data` corresponds to the payload of clicked inbox item
    - The `contentPageIndex` corresponds to the page index of the content, which ranges from 0 to the total number of pages for carousel templates. For non-carousel templates, the value is always 0, as they only have one page of content.
    - The `buttonIndex` represents the index of the App Inbox button clicked (0, 1, or 2). A value of -1 indicates the App Inbox item is clicked.

#### Bug fixes
* Fixes an XSS vulnerability - https://fluidattacks.com/advisories/maiden/ We recommend all users to update to v2.7.0 or above.

Version 2.6.2 *(April 18, 2023)*
-------------------------------------------
- Fixed compilation errors in xcode 14.3+ in iOS.
- Supports [CleverTap iOS SDK v4.2.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.2.2).

Version 2.6.1 *(January 25, 2023)*
-------------------------------------------
- Fixes a compilation error with iOS app inbox callback method `messageDidSelect`.

Version 2.6.0 *(December 29, 2022)*
-------------------------------------------
- Supports [CleverTap Android SDK v4.6.6](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev4.6.6)
- Supports [cordova android 11.0.0](https://cordova.apache.org/announcements/2022/07/12/cordova-android-release-11.0.0.html)
- Supports Android exoplayer [`v2.17.1`](https://github.com/google/ExoPlayer/releases/tag/r2.17.1). Note : this upgrade will result in minor ui changes for interstitial in app and inbox notifications that uses exoplayer.
- Adds new callback `onCleverTapInboxItemClick` to receive inbox item click.
- Breaks Android `setPushXiaomiToken()` API where new changes adds `region` as second mandatory parameter to specify server region.If you are using this method make sure you pass region while calling `setPushXiaomiToken()`.
- Supports [CleverTap iOS SDK v4.2.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.2.0).
- Adds a public method `deleteInboxMessagesForIds()` for deleting multiple App Inbox messages by passing a collection of messageIDs. Please note that this is only for iOS, and NO-OP for Android as of now.

Version 2.5.2 *(July 29, 2022)*
-------------------------------------------
- Fixes an iOS bug where `onDeepLink` callback wasn't being called when triggered from killed state.
- Supports [CleverTap iOS SDK v4.1.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.1.1).

Version 2.5.1 *(June 7, 2022)*
-------------------------------------------
- Supports [CleverTap Android SDK v4.4.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.4.0) .
- Support for Android 12.
- Support for [Android Push Templates](https://github.com/CleverTap/clevertap-cordova/blob/master/docs/Troubleshooting-Guide.md#supporting-clevertap-push-templates) .
- Fixes an iOS bug where push notifications were not being rendered in the foreground and notification clicked events were fired automatically.
- Supports [CleverTap iOS SDK v4.0.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.0.1).

Version 2.4.0 *(January 31, 2022)*
-------------------------------------------
- Adds public methods for suspending, discarding & resuming InApp Notifications
- Adds public methods to increment/decrement values set via User properties
- Deprecates `profileGetCleverTapID()` and `profileGetCleverTapAttributionIdentifier()` methods
- Adds a new public method `getCleverTapID()` as an alternative to above deprecated methods
- Supports [CleverTap iOS SDK v3.10.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.10.0)
- Supports [CleverTap Android SDK v4.2.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.2.0)

Version 2.3.6 *(23rd November 2021)*
-------------------------------------------
- Fixes a bug where DOB was not getting respected in Android as profile property

Version 2.3.5 *(9th June 2021)*
-------------------------------------------
- Supports CleverTap Android SDK v4.1.1
- Supports CleverTap iOS SDK v3.9.4
- Removes Product A/B Testing (Dynamic Variables) code
- Removes `profileSetGraphUser` and `profileSetGooglePlusUser` method

Version 2.3.4 *(27th April 2021)*
-------------------------------------------
- Update and Freeze CleverTap Cordova Plugin Podspec to a specific version of a CleverTap iOS SDK

Version 2.3.3 *(24 February, 2021)*
-------------------------------------------
* Added Push Notification with Custom Extras callback support in the killed state 
* Update for CleverTap iOS SDK v3.9.2

Version 2.3.2 *(07 January, 2021)*
-------------------------------------------
* Added support for Push Notification Click Callbacks
* Added CleverTap iOS SDK dependency via CocoaPods in the plugin.xml
* Update for CleverTap Android SDK v4.0.2

Version 2.3.1 *(11 November, 2020)*
-------------------------------------------
* Fixed a NPE on `getAllDisplayUnits` method
* Update for CleverTap iOS SDK v3.9.1

Version 2.3.0 *(15 October, 2020)*
-------------------------------------------
* Update for CleverTap Android SDK v4.0.0

Version 2.2.1 *(20 May, 2020)*
-------------------------------------------
* Bug Fixes and enhancements

Version 2.2.0 *(19 May, 2020)*
-------------------------------------------
* Bug Fixes and enhancements

Version 2.1.9 *(16 May, 2020)*
-------------------------------------------
* Adds support for Custom Inbox, InApp and Inbox Click callbacks
* Adds support for Native Display & Dynamic Variables
* Adds support for Product Config and Feature Flags
* Adds support for Xiaomi, Baidu & Huawei Push
* Update for CleverTap Android SDK v 3.8.0
* Update for CleverTap iOS SDK v 3.8.0

Version 2.1.8 *(26 February, 2020)*
-------------------------------------------
* Revert Google Play Install Referrer Library to v1.0
* Update for CleverTap Android v3.6.4

Version 2.1.7 *(24 February, 2020)*
-------------------------------------------
* Adds support for new Google Play Install Referrer API
* Update for CleverTap Android v3.6.3

Version 2.1.6 *(20 January, 2020)*
-------------------------------------------
* Fixing after install scripts

Version 2.1.5 *(11 December, 2019)*
-------------------------------------------
* Update for CleverTap Android v 3.6.1

Version 2.1.4 *(7 November, 2019)*
-------------------------------------------
* Update for CleverTap Android v 3.5.1

Version 2.1.3 *(4 November, 2019)*
-------------------------------------------
* Update for CleverTap iOS SDK v 3.7.1

Version 2.1.2 *(29 May, 2019)*
-------------------------------------------
* Update for CleverTap Android SDK v 3.5.1
* Update for CleverTap iOS SDK v 3.5.0

Version 2.1.1 *(08 February, 2019)*
-------------------------------------------
* Update for CleverTap Android SDK v 3.4.2
* Update for CleverTap iOS SDK v 3.4.1

Version 2.0.16 *(13 October, 2018)*
-------------------------------------------
* Update for CleverTap Android SDK v 3.3.2

Version 2.0.15 *(31 October, 2018)*
-------------------------------------------
* Update for CleverTap iOS SDK v 3.3.0
* Update to CleverTap Android SDK v3.3.1

Version 2.0.14 *(26 September, 2018)*
-------------------------------------------
* Update for CleverTap iOS SDK v 3.2.2

Version 2.0.13 *(11 September, 2018)*
-------------------------------------------
* Update to CleverTap Android SDK v3.2.0
Update to CleverTap iOS SDK v3.2.0

Version 2.0.12 *(5 September, 2018)*
-------------------------------------------
* fix android sdk version

Version 2.0.11 *(29 July, 2018)*
-------------------------------------------
* fix android package name

Version 2.0.10 *(25 July, 2018)*
-------------------------------------------
* Conform plugin id

Version 2.0.9 *(24 July, 2018)*
-------------------------------------------
* Update Android post install script for Cordova 8.0.0

Version 2.0.8 *(15 May, 2018)*
-------------------------------------------
* fixes CleverTapSDK.framework install issues (removes symlinks)

Version 2.0.7 *(11 May, 2018)*
-------------------------------------------
* Update for Android support library version
* Update for CleverTap Android SDK v 3.1.9
* Update for CleverTap iOS SDK v 3.1.7
* Support for Android O Notification Channels with custom sound
* New APIs for GDPR compliance
* Adds Android support for recordScreenView API

Version 2.0.5 *(04 January, 2018)*
-------------------------------------------
* Update for CleverTap Android SDK v 3.1.8

Version 2.0.4 *(13 October, 2017)*
-------------------------------------------
* Update for CleverTap iOS SDK v 3.1.6

Version 2.0.3 *(10 October, 2017)*
-------------------------------------------
* Update for CleverTapAndroidSDK v 3.1.7

Version 2.0.2 *(21 September, 2017)*
-------------------------------------------
* Supports CleverTap 3.1.5/3.1.6

