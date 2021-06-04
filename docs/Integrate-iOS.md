# 👩‍💻 iOS Integration

After creating CleverTap Account, grab the Project ID and Project Token values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings.

## To install CleverTap plugin use the following commands

+ Using [Cordova](https://cordova.apache.org/docs/en/latest/)  

```sh
# ensure npm is installed: npm -g install npm
cordova plugin add https://github.com/CleverTap/clevertap-cordova.git --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP PROJECT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP PROJECT TOKEN"
```

+ Using [Ionic](https://ionicframework.com/docs)  

```sh
ionic cordova plugin add clevertap-cordova@latest --variable CLEVERTAP_ACCOUNT_ID="YOUR CLEVERTAP PROJECT ID" --variable CLEVERTAP_TOKEN="YOUR CELVERTAP PROJECT TOKEN"
```
  + For Ionic 5
  
    ```sh
    npm install @ionic-native/clevertap --save 
    ```
    - [See the included Ionic 5 Example project for usage](/Samples/IonicCordova/IonicCordovaAngularProject/src/app/app.component.ts).

    - Be sure to [add CleverTap as a provider in your app module](/Samples/IonicCordova/IonicCordovaAngularProject/src/app/app.module.ts). 
    ```javascript
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

## Set up and register for push notifications and deep links

[Set up push notifications for your app](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns).

If you plan on using deep links, [please register your custom url scheme as described here](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app).

Call the following from your Javascript.

```javascript
CleverTap.registerPush();
```

### Integrate CleverTap plugin using Javascript

All calls to the CleverTap SDK should be made from your Javascript.

Start by adding the following listeners to your Javascript:

```javascript
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false); // optional: to be notified of CleverTap user profile synchronization updates
    document.addEventListener('onCleverTapProfileDidInitialize', this.onCleverTapProfileDidInitialize, false); // optional, to be notified when the CleverTap user profile is initialized
    document.addEventListener('onCleverTapInAppNotificationDismissed', this.onCleverTapInAppNotificationDismissed, false); // optional, to be receive a callback with custom in-app notification click data
    document.addEventListener('onDeepLink', this.onDeepLink, false); // optional, register to receive deep links.
    document.addEventListener('onPushNotification', this.onPushNotification, false); // optional, register to receive push notification payloads.
    document.addEventListener('onCleverTapInboxDidInitialize', this.onCleverTapInboxDidInitialize, false); // optional, to check if CleverTap Inbox intialized
    document.addEventListener('onCleverTapInboxMessagesDidUpdate', this.onCleverTapInboxMessagesDidUpdate, false); // optional, to check if CleverTap Inbox Messages were updated
    document.addEventListener('onCleverTapInboxButtonClick', this.onCleverTapInboxButtonClick, false); // optional, to check if Inbox button was clicked with custom payload
    document.addEventListener('onCleverTapInAppButtonClick', this.onCleverTapInAppButtonClick, false); // optional, to check if InApp button was clicked with custom payload
    document.addEventListener('onCleverTapFeatureFlagsDidUpdate', this.onCleverTapFeatureFlagsDidUpdate, false); // optional, to check if Feature Flags were updated
    document.addEventListener('onCleverTapProductConfigDidInitialize', this.onCleverTapProductConfigDidInitialize, false); // optional, to check if Product Config was initialized
    document.addEventListener('onCleverTapProductConfigDidFetch', this.onCleverTapProductConfigDidFetch, false); // optional, to check if Product Configs were updated
    document.addEventListener('onCleverTapProductConfigDidActivate', this.onCleverTapProductConfigDidActivate, false); // optional, to check if Product Configs were activated
    document.addEventListener('onCleverTapExperimentsUpdated', this.onCleverTapExperimentsUpdated, false); // optional, to check if Dynamic Variable Experiments were updated
    document.addEventListener('onCleverTapDisplayUnitsLoaded', this.onCleverTapDisplayUnitsLoaded, false); // optional, to check if Native Display units were loaded


    // deep link handling  
    onDeepLink: function(e) {
        console.log(e.deeplink);  
    },

    // push notification data handling
    onPushNotification: function(e) {
        console.log(JSON.stringify(e.notification));
    },
    onCleverTapInboxDidInitialize: function() {
        CleverTap.showInbox({"navBarTitle":"My App Inbox","tabs": ["tag1", "tag2"],"navBarColor":"#FF0000"});
    },
    
    onCleverTapInboxMessagesDidUpdate: function() {
        CleverTap.getInboxMessageUnreadCount(function(val) {console.log("Inbox unread message count"+val);})
        CleverTap.getInboxMessageCount(function(val) {console.log("Inbox read message count"+val);});
    },

    onCleverTapInAppButtonClick: function(e) {
        console.log("onCleverTapInAppButtonClick");
        console.log(e.customExtras);
    },

    onCleverTapInboxButtonClick: function(e) {
        console.log("onCleverTapInboxButtonClick");
        console.log(e.customExtras);
    },

    onCleverTapFeatureFlagsDidUpdate: function() {
        console.log("onCleverTapFeatureFlagsDidUpdate");
    },

    onCleverTapProductConfigDidInitialize: function() {
        console.log("onCleverTapProductConfigDidInitialize");
    },

    onCleverTapProductConfigDidFetch: function() {
        console.log("onCleverTapProductConfigDidFetch");
    },

    onCleverTapProductConfigDidActivate: function() {
        console.log("onCleverTapProductConfigDidActivate");
    },

    onCleverTapExperimentsUpdated: function() {
        console.log("onCleverTapExperimentsUpdated");
    },

    onCleverTapDisplayUnitsLoaded: function(e) {
        console.log("onCleverTapDisplayUnitsLoaded");
        console.log(e.units);
    },
```

- [See the included Example Cordova project for usage](/Samples/Cordova/ExampleProject/www/js/index.js).  

- [See the included Ionic Example project for usage](/Samples/IonicCordova/IonicCordovaAngularProject/src/app/app.component.ts).

## ⁉️ Questions? #

 If you have questions or concerns, you can reach out to the CleverTap support team from the CleverTap Dashboard. 
 
