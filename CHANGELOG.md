Change Log
==========

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

