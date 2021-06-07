# 👩‍💻 Android Integration

After creating CleverTap Account, grab the Project ID and Project Token values from your CleverTap [Dashboard](https://dashboard.clevertap.com) -> Settings.

#### **Important Note**

>>>>
Starting with v2.0.0, the plugin uses FCM rather than GCM. To configure FCM, add your google-services.json to the root of your cordova project **before you add the plugin**.  
The plugin uses an `after plugin add` hook script to configure your project for FCM.  
If the google-services.json file is not present in your project when the script runs, FCM will not be configured properly and will not work.
>>>>


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
    - [See the included Ionic 5 Example project for usage](Samples/IonicCordova/IonicAngularProject).

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

## Project Setup    
    
+ Check that the following is inside the `<application></application>` tags of your AndroidManifest.xml:  

  ```xml
      <meta-data  
          android:name="CLEVERTAP_ACCOUNT_ID"  
          android:value="Your CleverTap Project ID"/>  
      <meta-data  
          android:name="CLEVERTAP_TOKEN"  
          android:value="Your CleverTap Project Token"/>
  ```

+ **Set the Lifecycle Callback**

  Check the `android:name` property of the `<application>` tag of our AndroidManifest.xml:

  ```xml
      <application
          android:name="com.clevertap.android.sdk.Application">
  ```

  **Note:** The above step is **extremely important** and enables CleverTap to track notification opens, display in-app notifications, track deep links, and other important **user behaviour**.

+ **Add Permissions**

  Please ensure that you're requesting the following permissions for your app:

  ```xml
      <!-- Required to allow the app to send events -->
      <uses-permission android:name="android.permission.INTERNET"/>
      <!-- Recommended so that we can be smart about when to send the data -->
      <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
      <uses-permission android:name="android.permission.WAKE_LOCK" />
  ```

  [Please see the example AndroidManifest.xml here](https://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

+ **Add Dependencies**

  Make sure your build.gradle file includes the play-services and support library dependencies:

  ```groovy
      dependencies {
          implementation fileTree(dir: 'libs', include: '*.jar'  )
          debugCompile(project(path: "CordovaLib", configuration: "debug"))
          releaseCompile(project(path: "CordovaLib", configuration: "release"))
          // SUB-PROJECT DEPENDENCIES START
          implementation "com.google.firebase:firebase-core:+"
          implementation "com.google.firebase:firebase-messaging:20.2.4"
          implementation 'androidx.core:core:1.3.0'
          implementation 'androidx.fragment:fragment:1.1.0'
          implementation "com.android.installreferrer:installreferrer:2.1" //Mandatory for v2.1.8 and above
          //MANDATORY for App Inbox
          implementation 'androidx.appcompat:appcompat:1.2.0'
          implementation 'androidx.recyclerview:recyclerview:1.1.0'
          implementation 'androidx.viewpager:viewpager:1.0.0'
          implementation 'com.google.android.material:material:1.2.1'
          implementation 'com.github.bumptech.glide:glide:4.11.0'
          //Optional ExoPlayer Libraries for Audio/Video Inbox Messages. Audio/Video messages will be dropped without these dependencies
          implementation 'com.google.android.exoplayer:exoplayer:2.11.5'
          implementation 'com.google.android.exoplayer:exoplayer-hls:2.11.5'
          implementation 'com.google.android.exoplayer:exoplayer-ui:2.11.5'
          // SUB-PROJECT DEPENDENCIES END 
  ```  

+ **Support AndroidX**

  To support AndroidX libraries, add the following to your `config.xml` file -

  ```xml
      <preference name="AndroidXEnabled" value="true" />
  ```

  Also ensure that your app supports `cordova-android@9.0.0`


## Set up and register for push notifications and deep links

The `FCMTokenListenerService` of the CleverTap Android SDK registers push tokens automatically. No action is required from the Javascript side. Hence, Android does not require the `CleverTap.registerPush()` method.

Add your custom url scheme to the AndroidManifest.xml.

```xml
	 <intent-filter android:label="@string/app_name">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="clevertapstarter" />
     </intent-filter>
```

See [example AndroidManifest.xml](ihttps://github.com/CleverTap/clevertap-cordova/blob/master/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

 
