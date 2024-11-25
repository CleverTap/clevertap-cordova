package com.clevertap.cordova

import android.util.Log
import org.apache.cordova.CordovaWebView

object CleverTapEventEmitter {
    private const val LOG_TAG = "CleverTapEventEmitter"

    var cordovaWebView : CordovaWebView? = null

    @JvmOverloads
    fun sendEvent(event: String, json : String = "") {
        val webView = cordovaWebView
        if (webView== null) {
            Log.e(LOG_TAG, "Sending event $event failed. WebView is null")
            return
        }

        webView.loadUrl("javascript:cordova.fireDocumentEvent('$event',$json);")
        Log.i(LOG_TAG, "Sending event $event")
    }
}