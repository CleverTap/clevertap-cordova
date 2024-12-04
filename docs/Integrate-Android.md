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
          implementation "com.google.firebase:firebase-messaging:23.0.6"
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
          implementation 'com.google.android.exoplayer:exoplayer:2.19.1'
          implementation 'com.google.android.exoplayer:exoplayer-hls:2.19.1'
          implementation 'com.google.android.exoplayer:exoplayer-ui:2.19.1'
          // SUB-PROJECT DEPENDENCIES END 
  ```
  
### Migrating from `Exoplayer` to `AndroidX Media3` (Optional)

Clevertap Cordova SDK supports `AndroidX Media3` from `v3.3.0+` to replace the deprecated `ExoPlayer` libraries. For migration change the following dependencies.

|         Old Dependency | New Dependency      |
|-----------------------:|:--------------------|
|     `com.google.android.exoplayer:exoplayer:2.19.1` | `androidx.media3:media3-exoplayer:1.1.1`     |
| `com.google.android.exoplayer:exoplayer-hls:2.19.1` | `androidx.media3:media3-exoplayer-hls:1.1.1` |
|  `com.google.android.exoplayer:exoplayer-ui:2.19.1` | `androidx.media3:media3-ui:1.1.1`  |  

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

## Setup encryption for PII data
PII data is stored across the SDK and could be sensitive information. 
From Cordova SDK `v2.7.1`. onwards, you can enable encryption for PII data wiz. **Email, Identity, Name and Phone**.  
  
Currently 2 levels of encryption are supported i.e None(0) and Medium(1). Encryption level is None by default.  

**None** - All stored data is in plaintext    
**Medium** - PII data is encrypted completely. 
   
Add encryption level in the `AndroidManifest.xml` as following,

```xml
<meta-data
    android:name="CLEVERTAP_ENCRYPTION_LEVEL"
    android:value="1" />
```

## Integrate Custom Proxy Domain
The custom proxy domain feature allows to proxy all events raised from the CleverTap SDK through your required domain, ideal for handling or relaying CleverTap events and Push Impression events with your application server. Refer following steps to configure the custom proxy domain(s) in the manifest file From Cordova SDK `v2.7.2` onwards:

#### Configure Custom Proxy Domain(s) using Manifest file
1. Add your CleverTap Account credentials in the Manifest file against the `CLEVERTAP_ACCOUNT_ID` and `CLEVERTAP_TOKEN` keys.
2. Add the **CLEVERTAP_PROXY_DOMAIN** key with the proxy domain value for handling events through the custom proxy domain.
3. Add the **CLEVERTAP_SPIKY_PROXY_DOMAIN** key with proxy domain value for handling push impression events.

```xml
        <meta-data
            android:name="CLEVERTAP_ACCOUNT_ID"
            android:value="YOUR ACCOUNT ID" />
        <meta-data
            android:name="CLEVERTAP_TOKEN"
            android:value="YOUR ACCOUNT TOKEN" />
        <meta-data
            android:name="CLEVERTAP_PROXY_DOMAIN"
            android:value="YOUR PROXY DOMAIN"/>  <!-- e.g., analytics.sdktesting.xyz -->
        <meta-data
            android:name="CLEVERTAP_SPIKY_PROXY_DOMAIN"
            android:value="YOUR SPIKY PROXY DOMAIN"/>  <!-- e.g., spiky-analytics.sdktesting.xyz -->
```

## Integrate Javascript with the Plugin

All calls to the CleverTap plugin should be made from your Javascript.  
You can refer to our [Usage.md](/docs/Usage.md) for implementation.
