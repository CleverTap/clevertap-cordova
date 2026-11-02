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
        // loadUrl() runs a javascript: URL, and the WebView percent-decodes a javascript: URL
        // before it runs it. A "%22" inside a JSON string value would come back as a quote and
        // end the string early, so escape every "%": the decoded script is then exactly this one.
        final String js = ("cordova.fireDocumentEvent('" + event.getEventName() + "'," + json + ");")
                .replace("%", "%25");

        Log.i(LOG_TAG, "Sending event " + event.getEventName());
        cordovaWebView
                .getView()
                .post(() -> cordovaWebView.loadUrl("javascript:" + js));
    }

    public static String toJSONString(Map<String, Object> data) {
        return data.isEmpty() ? "" : new JSONObject(data).toString();
    }
}
