# 👩‍💻 iOS Integration

## Set up and register for push notifications and deep links

[Set up push notifications for your app](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns).

If you plan on using deep links, [please register your custom url scheme as described here](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app).

Call the following from your Javascript.

```javascript
CleverTap.registerPush();
```

## Integrate Javascript with the Plugin

All calls to the CleverTap plugin should be made from your Javascript.  
You can checkout [Usage.md](https://github.com/CleverTap/clevertap-cordova/blob/update-example/docs/Usage.md) for implementation.

