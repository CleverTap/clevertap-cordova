package com.clevertap.ionic.capacitor.angular.starter;

import android.app.Application;
import android.app.NotificationManager;
import com.clevertap.android.pushtemplates.PushTemplateNotificationHandler;
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.CleverTapAPI.LogLevel;
import com.clevertap.android.sdk.interfaces.NotificationHandler;

public class MyApplication extends Application {

  @Override
  public void onCreate() {
    CleverTapAPI.setDebugLevel(LogLevel.VERBOSE);
    ActivityLifecycleCallback.register(this);
    CleverTapAPI.setNotificationHandler((NotificationHandler) new PushTemplateNotificationHandler());

    super.onCreate();

    CleverTapAPI.createNotificationChannel(
      this, "BRTesting", "Core",
      "Core notifications", NotificationManager.IMPORTANCE_MAX, true
    );
    CleverTapAPI.createNotificationChannel(
      this, "PTTesting", "Push templates",
      "All push templates", NotificationManager.IMPORTANCE_MAX, true
    );
  }
}
