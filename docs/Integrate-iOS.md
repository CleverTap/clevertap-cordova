# 👩‍💻 iOS Integration

## Project setup

Install the plugin with your CleverTap credentials:

```sh
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git \
  --variable CLEVERTAP_ACCOUNT_ID="YOUR_ACCOUNT_ID" \
  --variable CLEVERTAP_TOKEN="YOUR_TOKEN"
```

This automatically injects `CleverTapAccountID` and `CleverTapToken` into your app's `Info.plist`. If your account uses a specific region, pass it as an additional variable:

```sh
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git \
  --variable CLEVERTAP_ACCOUNT_ID="YOUR_ACCOUNT_ID" \
  --variable CLEVERTAP_TOKEN="YOUR_TOKEN" \
  --variable CLEVERTAP_REGION="YOUR_REGION_CODE"
```

Refer to [CleverTap region codes](https://developer.clevertap.com/docs/idc) for valid values.

## iOS dependency management

The plugin supports two dependency managers depending on your cordova-ios version - no manual configuration is required:

| cordova-ios | Dependency manager | iOS minimum | SDK version |
|---|---|---|---|
| 8.0+ | Swift Package Manager (SPM) | 13 | CleverTap iOS SDK 7.8.2 |
| < 8.0 | CocoaPods | - | CleverTap iOS SDK 7.8.2 |

Cordova's build toolchain picks the right path automatically. On cordova-ios 8+, the root `Package.swift` resolves the SDK via SPM. After your first build, Xcode locks the resolved versions in `Package.resolved` inside your generated Xcode project.

## Upgrading to cordova-ios 8 (SPM)

When you upgrade to cordova-ios 8+, the plugin switches from CocoaPods to SPM automatically. No manual dependency configuration is needed.

To upgrade your iOS platform:

```sh
cordova platform update ios@8
```

For a clean install (recommended if the update fails):

```sh
cordova platform rm ios && cordova platform add ios@8
```

**Ionic + Cordova apps** follow the same upgrade path - Ionic uses cordova-ios under the hood, so the SPM transition is identical.

**Capacitor apps** use a separate dependency path. Capacitor 6+ supports SPM as an option, and Capacitor 8 made SPM the default for iOS. Capacitor's SPM resolves dependencies through `capacitor-swift-pm` (not `cordova-ios`), so the root `Package.swift` in this repo does not apply to Capacitor projects. For Capacitor apps still using CocoaPods, the plugin's podspec in plugin.xml continues to work. For Capacitor apps using SPM, Capacitor auto-generates a `Package.swift` for Cordova plugins - but you cannot mix CocoaPods and SPM in the same Capacitor project.

### Troubleshooting

If SPM resolution fails after upgrading:

1. Remove and re-add the iOS platform:
   ```sh
   cordova platform rm ios && cordova platform add ios@8
   ```
2. Delete Xcode derived data:
   ```sh
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

## Set up and register for push notifications and deep links

- [Set up push notifications for your app](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns).

- If you plan on using deep links, [please register your custom url scheme as described here](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app).

- Call the following from your Javascript.

```javascript
CleverTap.registerPush();
```

## Setup encryption for PII data
PII data is stored across the SDK and could be sensitive information. 
From Cordova SDK `v2.7.1`. onwards, you can enable encryption for PII data wiz. **Email, Identity, Name and Phone**.  
  
Currently 2 levels of encryption are supported i.e None(0) and Medium(1). Encryption level is None by default.  

**None** - All stored data is in plaintext    
**Medium** - PII data is encrypted completely. 
   
The only way to set encryption level is from the info.plist. Add the `CleverTapEncryptionLevel` String key to `info.plist` file where value 1 means Medium and 0 means None. Encryption Level will be None if any other value is provided.

## Integrate Custom Proxy Domain
The custom proxy domain feature allows to proxy all events raised from the CleverTap SDK through your required domain, ideal for handling or relaying CleverTap events and Push Impression events with your application server. Refer following steps to configure the custom proxy domain(s) in the `Info.plist` file.

#### Configure Custom Proxy Domain(s) using Info.plist file
1. Add your CleverTap Account credentials in the *Info.plist* file against the `CleverTapAccountID` and `CleverTapToken` keys, if they are empty/do not exist.
2. Add the `CleverTapProxyDomain` key with the proxy domain value for handling events through the custom proxy domain e.g., *analytics.sdktesting.xyz*.
3. Add the `CleverTapSpikyProxyDomain` key with proxy domain value for handling push impression events e.g., *spiky-analytics.sdktesting.xyz*.

## Integrate Javascript with the Plugin

- Refer to our [Usage Documentation](/docs/Usage.md) for implementation.

