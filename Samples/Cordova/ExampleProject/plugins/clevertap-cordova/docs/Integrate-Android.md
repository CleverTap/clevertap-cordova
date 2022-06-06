# 👩‍💻 Android Integration

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

  [Please see the example AndroidManifest.xml here](https://github.com/CleverTap/clevertap-cordova/blob/master/Samples/Cordova/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

+ **Add Dependencies**

  Make sure your build.gradle file includes the play-services and support library dependencies:

  ```groovy
      dependencies {
          implementation fileTree(dir: 'libs', include: '*.jar'  )
          debugCompile(project(path: "CordovaLib", configuration: "debug"))
          releaseCompile(project(path: "CordovaLib", configuration: "release"))
          // SUB-PROJECT DEPENDENCIES START
          implementation "com.google.firebase:firebase-core:+"
          implementation "com.google.firebase:firebase-messaging:22.0.0"
          implementation 'androidx.core:core:1.3.0'
          implementation 'androidx.fragment:fragment:1.3.6'
          implementation "com.android.installreferrer:installreferrer:2.2" //Mandatory for v2.1.8 and above
          //MANDATORY for App Inbox
          implementation 'androidx.appcompat:appcompat:1.3.1'
          implementation 'androidx.recyclerview:recyclerview:1.2.1'
          implementation 'androidx.viewpager:viewpager:1.0.0'
          implementation 'com.google.android.material:material:1.4.0'
          implementation 'com.github.bumptech.glide:glide:4.12.0'
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


+ **Supporting push notifications from FCM:**
  + Add the following Preference in `config.xml` file : `<preference name="GradlePluginGoogleServicesEnabled" value="true" />`
  + Register your app with a firebase project and put `google-services.json` inside `platforms/android/app` folder




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

See [example AndroidManifest.xml](https://github.com/CleverTap/clevertap-cordova/blob/master/Samples/Cordova/ExampleProject/platforms/android/app/src/main/AndroidManifest.xml).

## Push Notifications Channels

Notification Channels are now mandatory if your app supports Android Oreo and above

#### Creating Notification Channel

Use the following to create a Notification Channel

```javascript 
this.clevertap.createNotificationChannel('channelID_1234', 'Notification Channel', 'channelDescription', 1, true);      
```

#### Delete Notification Channel

Use the following to delete a Notification Channel

```javascript 
this.clevertap.deleteNotificationChannel('channelID_1234');   
```

#### Creating a group notification channel

Use the following to create a Notification Channel Group

```javascript 
this.clevertap.createNotificationChannelGroup('groupID_5678', 'Channel Group Name');    
```

#### Delete a group notification channel

Use the following to delete a Notification Channel Group

```javascript 
this.clevertap.deleteNotificationChannelGroup('groupID_5678');      
```


## Integrate Javascript with the Plugin

All calls to the CleverTap plugin should be made from your Javascript.  
You can refer to our [Usage.md](/docs/Usage.md) for implementation.
