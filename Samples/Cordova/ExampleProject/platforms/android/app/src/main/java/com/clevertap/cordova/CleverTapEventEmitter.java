package com.clevertap.cordova;

import android.util.Log;
import org.apache.cordova.CordovaWebView;

public class CleverTapEventEmitter {

    private static final String LOG_TAG = "CleverTapEventEmitter";

    private static CordovaWebView cordovaWebView;

    public static void setCordovaWebView(CordovaWebView webView) {
        cordovaWebView = webView;
    }

    public static void sendEvent(String event) {
        sendEvent(event, "");
    }

    public static void sendEvent(String event, String json) {
        if (cordovaWebView == null) {
            Log.e(LOG_TAG, "Sending event " + event + " failed. WebView is null");
            return;
        }

        Log.i(LOG_TAG, "Sending event " + event);
        cordovaWebView
                .getView()
                .post(() -> cordovaWebView.loadUrl("javascript:cordova.fireDocumentEvent('" + event + "'," + json + ");"));
    }
}
