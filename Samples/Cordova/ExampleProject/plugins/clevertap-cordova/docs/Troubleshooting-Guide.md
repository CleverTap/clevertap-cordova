## Troubleshooting Guide for common integration issues in Codova plugin

### Android 

**1. Header and Footer In-app are not shown in clevertap-cordova >= 2.3.1**

**How In-apps Work in SDK:**

   All of our In-apps require the activity to be a subclass of FragmentActivity in order to render.
   Header & Footer in-apps uses application’s Mainactivity to render.
   Rest other templates uses CT SDK InappNotificationActivity(which is an instance of FramentActivity)

**Why the issue is coming:**

  In case of Cordova, the application’s Mainactivity is a subclass of CordovaActivity which is not an instance of FragmentActivity, 
  due to which Header & Footer fails to render.Ideally, Cordova framework should update the CordovaActivity to be a subclass of 
  FragmentActivity in accordance with latest Android-X support.

**Suggestion:**

  Cordova SDK has planned to support this in Cordova v10.0.0.Code changes are already done & a [PR](https://github.com/apache/cordova-android/pull/1052) is raised for the same.
  We recommended to use other supported in-apps in place of headers/footers, until Cordova 10.0.0 is released.
  We recommend to use other templates( other than header and footer) which will work absolutely fine.
  Also we have tried a [plugin](https://github.com/ReallySmallSoftware/cordova-plugin-android-fragmentactivity) which is working fine to render Header/Footer In-apps.
  We don’t recommend to use this library, as we are not sure about the impacts.




