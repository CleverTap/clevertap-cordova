# 👩‍💻 iOS Integration

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

