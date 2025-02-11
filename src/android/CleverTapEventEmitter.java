package com.clevertap.cordova;

import android.util.Log;
import org.apache.cordova.CordovaWebView;
import org.json.JSONObject;

import java.util.Collections;
import java.util.Map;

public class CleverTapEventEmitter {

    private static final String LOG_TAG = "CleverTapEventEmitter";

    private static CordovaWebView cordovaWebView;

    public static void setCordovaWebView(CordovaWebView webView) {
        cordovaWebView = webView;
    }

    public static void sendEvent(String event) {
        sendEvent(event, Collections.emptyMap());
    }

    public static void sendEvent(String event, Map<String, Object> data) {
        if (cordovaWebView == null) {
            Log.e(LOG_TAG, "Sending event " + event + " failed. WebView is null");
            return;
        }

        final String json = data.isEmpty() ? "" : new JSONObject(data).toString();

        Log.i(LOG_TAG, "Sending event " + event);
        cordovaWebView
                .getView()
                .post(() -> cordovaWebView.loadUrl("javascript:cordova.fireDocumentEvent('" + event + "'," + json + ");"));
    }
}
