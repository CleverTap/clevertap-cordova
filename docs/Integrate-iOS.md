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
