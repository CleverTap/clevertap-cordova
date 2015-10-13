//
//  CleverTapPlugin.java
//  Copyright (C) 2015 CleverTap 
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//
//

package com.clevertap.cordova;


import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.exceptions.CleverTapMetaDataNotFoundException;
import com.clevertap.android.sdk.exceptions.CleverTapPermissionsNotSatisfied;

public class CleverTapPlugin extends CordovaPlugin {

    private static final String TAG = "CLEVERTAP_PLUGIN";
    private static String CLEVERTAP_API_ERROR;
    private static CleverTapAPI cleverTap;

    private boolean checkCleverTapInitialized() {
        boolean initialized = (cleverTap != null);
        if(!initialized) {
            Log.d(TAG, "CleverTap API not initialized: " + CLEVERTAP_API_ERROR);
        }
        return initialized;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        try {
            cleverTap = CleverTapAPI.getInstance(cordova.getActivity().getApplicationContext());
        } catch (CleverTapMetaDataNotFoundException e) {
            CLEVERTAP_API_ERROR = e.getLocalizedMessage();
            //Log.d(TAG, e.getLocalizedMessage());
        } catch (CleverTapPermissionsNotSatisfied e) {
            CLEVERTAP_API_ERROR = e.getLocalizedMessage();
            //Log.d(TAG, e.getLocalizedMessage());
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

        Log.d(TAG, "handling action " + action);

        String errorMsg = "unhandled CleverTapPlugin action";

        if (!this.checkCleverTapInitialized()) {
            PluginResult result = new PluginResult(PluginResult.Status.ERROR, "CleverTap API not initialized");
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            return true;
        }

        if (action.equals("setDebugLevel")){
            int level = (args.length() == 1? args.getInt(0) : -1);
            if(level >= 0) {
                CleverTapAPI.setDebugLevel(level);
                PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
                return true;
            }

        } else if (action.equals("enablePersonalization")) {
            cleverTap.enablePersonalization();
            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            return true;

        } else if (action.equals("recordEventWithName")) {
            String eventName = (args.length() == 1? args.getString(0) : null);
            if(eventName != null) {
                cleverTap.event.push(eventName);
                PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
                return true;
            } else {
                errorMsg = "eventName cannot be null";
            }
        }

        PluginResult result = new PluginResult(PluginResult.Status.ERROR, errorMsg);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
        return true;
    }

}

