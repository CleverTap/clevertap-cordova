# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`clevertap-cordova` is a Cordova/PhoneGap plugin that bridges the CleverTap iOS and Android SDKs to JavaScript. It has three layers: a JS API (`www/CleverTap.js`), iOS native (`src/ios/`), and Android native (`src/android/`).

## Build & Test

There is no build step for the plugin itself — it ships as source. There are no automated tests.

To test changes, use the sample Cordova app which already references this plugin as a local path:

```sh
cd Samples/Cordova/ExampleProject
cordova platform add ios      # or android
cordova run ios               # or android
```

iOS native dependencies are managed via CocoaPods (declared in `plugin.xml` as `<podspec>`). Android dependencies are declared as `<framework>` Gradle entries in `plugin.xml`. Neither requires manual invocation — Cordova's build toolchain handles both.

## Architecture

### JS → Native Dispatch

`www/CleverTap.js` calls `cordova.exec(successCb, errorCb, "CleverTapPlugin", "methodName", [args])` for every API. On Android, `CleverTapPlugin.java#execute()` routes via `CleverTapFunction.fromString(action)` (an enum in `CleverTapFunction.java`). On iOS, `CleverTapPlugin.m` has one selector per method name.

`convertDateToEpochInProperties()` in `CleverTap.js` converts JS `Date` objects to CleverTap's `$D_<epoch>` format before any property payload crosses the bridge.

### Native → JS Events

Both platforms fire events by injecting `cordova.fireDocumentEvent('eventName', payload)` into the WebView:

- **Android**: `CleverTapEventEmitter.java` holds a static `CordovaWebView` reference and calls `loadUrl("javascript:cordova.fireDocumentEvent(...)")` on the UI thread.
- **iOS**: `[self.commandDelegate evalJs:]` in `CleverTapPlugin.m`.

All event names are defined as an enum in `CleverTapEvent.java` (Android) and as string constants in `CleverTapPlugin.h` (iOS).

JS consumers subscribe with `document.addEventListener('eventName', handler, false)`.

### iOS-Specific: AppDelegate Category Pattern

`AppDelegate+CleverTapPlugin.m` is an Objective-C category on the host app's AppDelegate. It intercepts push token registration, push receipt, and deep link open URLs, then re-broadcasts them via `NSNotificationCenter` using constants from `CleverTapPlugin.h` (`CTRemoteNotificationDidRegister`, `CTDidReceiveNotification`, `CTHandleOpenURLNotification`). `CleverTapPlugin.m` observes these notifications. This avoids requiring the consumer to modify their AppDelegate directly.

`CleverTapPlugin` initializes its CleverTap instance by observing `UIApplicationDidFinishLaunchingNotification` in `+load` (runs at app start before `main()`), then wires delegates in `-pluginInitialize` (Cordova lifecycle).

### Android-Specific: After-Add Hook

`scripts/androidAfterPluginAdd.js` runs automatically on `after_plugin_add`. It sets `android:name="com.clevertap.android.sdk.Application"` on the `<application>` element in `AndroidManifest.xml` and copies FCM credentials from `src/android/google-services.json` into `strings.xml`. If Android push is broken, check this hook ran correctly.

### Custom In-App Templates

Both platforms support custom code templates registered from JSON asset files:

- **iOS**: `CleverTapPluginCustomTemplates.m` reads bundle JSON and registers via `CleverTapPluginTemplatePresenter` / `CleverTapPluginAppFunctionPresenter`. Presenters fire events to JS via `NSNotificationCenter` posting `CTSendEvent`.
- **Android**: `CleverTapCustomTemplates.java` reads from Android assets and registers via `CleverTapAPI.registerCustomInAppTemplates(...)`.

## SDK Version Matrix

| Platform | SDK | Declared in |
|---|---|---|
| iOS | CleverTap iOS SDK 7.8.0 | `plugin.xml` `<podspec>` (CocoaPods) and root `Package.swift` (SPM) |
| Android | clevertap-android-sdk 8.1.0 | `plugin.xml` `<framework>` |

`plugin.xml` is the source of truth for the CocoaPods and Android native dependency versions. iOS supports both CocoaPods and Swift Package Manager: cordova-ios 8+ uses SPM (via `package="swift"` on the iOS `<platform>` + root `Package.swift`), while older cordova-ios uses the `<podspec>` pod, which carries `nospm="true"` so it is skipped when SPM is active. Keep the iOS SDK version identical in both `plugin.xml` and `Package.swift`. The iOS ObjC sources use `#if __has_include(<CleverTapSDK/...>)` conditional imports so the same source compiles on both paths.

## Public API Surface

`www/CleverTap.js` is the public API. Every exported method maps 1:1 to a string in `CleverTapFunction.java` (Android) and a selector in `CleverTapPlugin.m` (iOS). Adding a new method requires changes to all three files plus `CleverTap.js`. Renaming or removing any method is a breaking change for consumers.
