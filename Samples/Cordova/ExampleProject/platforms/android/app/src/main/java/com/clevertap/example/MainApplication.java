package com.clevertap.example;


import com.clevertap.android.sdk.Application;
import com.clevertap.cordova.CleverTapCustomTemplates;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        CleverTapCustomTemplates.registerCustomTemplates(this, "templates.json");
        super.onCreate();
    }
}
