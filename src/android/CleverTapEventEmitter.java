package com.clevertap.cordova;

import android.util.Log;
import androidx.annotation.NonNull;
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

    public static void sendEvent(CleverTapEvent event) {
        sendEvent(event, Collections.emptyMap());
    }

    public static void sendEvent(@NonNull CleverTapEvent event, @NonNull Map<String, Object> data) {
        if (cordovaWebView == null) {
            Log.e(LOG_TAG, "Sending event " + event.getEventName() + " failed. WebView is null");
            return;
        }

        if(event == CleverTapEvent.CLEVERTAP_UNKNOWN) {
            Log.i(LOG_TAG, "Not Sending event since its unknown");
            return;
        }

        final String json = toJSONString(data);

        Log.i(LOG_TAG, "Sending event " + event.getEventName());
        cordovaWebView
                .getView()
                .post(() -> cordovaWebView.loadUrl("javascript:cordova.fireDocumentEvent('" + event.getEventName() + "'," + json + ");"));
    }

    public static String toJSONString(Map<String, Object> data) {
        return data.isEmpty() ? "" : new JSONObject(data).toString();
    }
}
