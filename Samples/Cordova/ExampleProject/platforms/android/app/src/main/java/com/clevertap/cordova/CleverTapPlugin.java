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

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.location.Location;

import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.android.sdk.pushnotification.amp.CTPushAmpListener;
import java.util.Set;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.lang.Exception;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;

import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CTFeatureFlagsListener;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.SyncListener;
import com.clevertap.android.sdk.InAppNotificationListener;
import com.clevertap.android.sdk.events.EventDetail;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.CTInboxListener;
import com.clevertap.android.sdk.CTInboxStyleConfig;
import com.clevertap.android.sdk.inbox.CTInboxMessage;
import com.clevertap.android.sdk.InboxMessageButtonListener;
import com.clevertap.android.sdk.InAppNotificationButtonListener;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;
import com.clevertap.android.sdk.displayunits.DisplayUnitListener;
import com.clevertap.android.sdk.product_config.CTProductConfigListener;
import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener;
import com.clevertap.android.sdk.interfaces.NotificationHandler;


public class CleverTapPlugin extends CordovaPlugin implements SyncListener, InAppNotificationListener, CTInboxListener,
        InboxMessageButtonListener, InAppNotificationButtonListener, DisplayUnitListener,
        CTFeatureFlagsListener, CTProductConfigListener, CTPushNotificationListener, CTPushAmpListener {

    private static final String LOG_TAG = "CLEVERTAP_PLUGIN";
    private static String CLEVERTAP_API_ERROR;
    private static CleverTapAPI cleverTap;
    private boolean callbackDone = false;


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        cleverTap = CleverTapAPI.getDefaultInstance(cordova.getActivity().getApplicationContext());
        cleverTap.setSyncListener(this);
        cleverTap.setInAppNotificationListener(this);
        cleverTap.setCTNotificationInboxListener(this);
        cleverTap.setInboxMessageButtonListener(this);
        cleverTap.setInAppNotificationButtonListener(this);
        cleverTap.setDisplayUnitListener(this);
        cleverTap.setCTFeatureFlagsListener(this);
        cleverTap.setCTProductConfigListener(this);
        cleverTap.setCTPushNotificationListener(this);
        cleverTap.setCTPushAmpListener(this);
        cleverTap.setLibrary("Cordova");

        try {
            String ptHandler = "com.clevertap.android.pushtemplates.PushTemplateNotificationHandler";
            CleverTapAPI.setNotificationHandler((NotificationHandler) (Class.forName(ptHandler).getConstructor().newInstance()));
            System.out.println("Push templates dependency available");
        }
        catch (Throwable e){
            System.out.println("Push templates dependency not found");
        }

        onNewIntent(cordova.getActivity().getIntent());

    }

    /**
     * Called when the activity receives a new intent.
     */
    public void onNewIntent(Intent intent) {
        if (intent == null) return;

        // deeplink
        if (intent.getAction() != null && intent.getAction().equals(Intent.ACTION_VIEW)) {
            Uri data = intent.getData();
            if (data != null) {
                final String json = "{'deeplink':'" + data.toString() + "'}";

                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        webView.loadUrl("javascript:cordova.fireDocumentEvent('onDeepLink'," + json + ");");
                    }
                });

            }
        }
        // push notification
        else {
            Bundle extras = intent.getExtras();
            Boolean isPushNotification = (extras != null && extras.get("wzrk_pn") != null);
            if (isPushNotification) {
                JSONObject data = new JSONObject();

                for (String key : extras.keySet()) {
                    try {
                        Object value = extras.get(key);
                        if (value instanceof Map) {
                            JSONObject jsonObject = new JSONObject((Map) value);
                            data.put(key, jsonObject);
                        } else if (value instanceof List) {
                            JSONArray jsonArray = new JSONArray((List) value);
                            data.put(key, jsonArray);
                        } else {
                            data.put(key, extras.get(key));
                        }
                    } catch (Throwable t) {
                        // no-op
                    }
                }

                final String json = "{'notification':" + data.toString() + "}";
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        webView.loadUrl("javascript:cordova.fireDocumentEvent('onPushNotification'," + json + ");");
                    }
                });

                if (!callbackDone) {
                    final String callbackJson = "{'customExtras':" + data.toString() + "}";

                    webView.getView().post(new Runnable() {
                        public void run() {

                            webView.loadUrl(
                                    "javascript:cordova.fireDocumentEvent('onCleverTapPushNotificationTappedWithCustomExtras',"
                                            + callbackJson + ");");
                        }
                    });
                }

            }
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

        Log.d(LOG_TAG, "handling action " + action);

        boolean haveError = false;
        String errorMsg = "unhandled CleverTapPlugin action";

        PluginResult result = null;

        if (!checkCleverTapInitialized()) {
            result = new PluginResult(PluginResult.Status.ERROR, "CleverTap API not initialized");
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            return true;
        }

        // manually start application life cycle
        else if (action.equals("notifyDeviceReady")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    ActivityLifecycleCallback.register(cordova.getActivity().getApplication());
                    CleverTapAPI.setAppForeground(true);
                    CleverTapAPI.onActivityResumed(cordova.getActivity());
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });

            return true;
        }

        // not required for Android here but handle as its in the JS interface
        else if (action.equals("registerPush")) {
            result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            return true;
        } else if (action.equals("setPushTokenAsString")) {
            final String token = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushFcmRegistrationId(token, true);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setPushXiaomiTokenAsString")) {
            final String token = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushXiaomiRegistrationId(token, true);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setPushBaiduTokenAsString")) {
            final String token = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushBaiduRegistrationId(token, true);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setPushHuaweiTokenAsString")) {
            final String token = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushHuaweiRegistrationId(token, true);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("createNotification")) {
            final String extras = args.getString(0);
            JSONObject json = new JSONObject(extras);
            Bundle bundle = new Bundle();
            for (Iterator<String> entry = json.keys(); entry.hasNext(); ) {
                String key = entry.next();
                String str = json.optString(key);
                bundle.putString(key, str);
            }
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotification(cordova.getActivity().getApplicationContext(), bundle);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        /* Android O functions start*/
        else if (action.equals("createNotificationChannel")) {
            final String channelId = (args.length() == 5 ? args.getString(0) : "");
            final String channelName = (args.length() == 5 ? args.getString(1) : "");
            final String channelDescription = (args.length() == 5 ? args.getString(2) : "");
            final int importance = Integer.parseInt((args.length() == 5 ? args.getString(3) : "0"));
            final boolean showBadge = Boolean.valueOf((args.length() == 5 ? args.getString(4) : "false"));
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, showBadge);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("createNotificationChannelWithSound")) {
            final String channelId = (args.length() == 6 ? args.getString(0) : "");
            final String channelName = (args.length() == 6 ? args.getString(1) : "");
            final String channelDescription = (args.length() == 6 ? args.getString(2) : "");
            final int importance = Integer.parseInt((args.length() == 6 ? args.getString(3) : "0"));
            final boolean showBadge = Boolean.valueOf((args.length() == 6 ? args.getString(4) : "false"));
            final String sound = (args.length() == 6 ? args.getString(5) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, showBadge, sound);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("createNotificationChannelWithGroupId")) {
            final String channelId = (args.length() == 6 ? args.getString(0) : "");
            final String channelName = (args.length() == 6 ? args.getString(1) : "");
            final String channelDescription = (args.length() == 6 ? args.getString(2) : "");
            final int importance = Integer.parseInt((args.length() == 6 ? args.getString(3) : "0"));
            final String groupId = (args.length() == 6 ? args.getString(4) : "");
            final boolean showBadge = Boolean.valueOf((args.length() == 6 ? args.getString(5) : "false"));
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, groupId, showBadge);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("createNotificationChannelWithGroupIdAndSound")) {
            final String channelId = (args.length() == 7 ? args.getString(0) : "");
            final String channelName = (args.length() == 7 ? args.getString(1) : "");
            final String channelDescription = (args.length() == 7 ? args.getString(2) : "");
            final int importance = Integer.parseInt((args.length() == 7 ? args.getString(3) : "0"));
            final String groupId = (args.length() == 7 ? args.getString(4) : "");
            final boolean showBadge = Boolean.valueOf((args.length() == 7 ? args.getString(5) : "false"));
            final String sound = (args.length() == 7 ? args.getString(6) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, groupId, showBadge, sound);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("createNotificationChannelGroup")) {
            final String groupId = (args.length() == 2 ? args.getString(0) : "");
            final String groupName = (args.length() == 2 ? args.getString(1) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.createNotificationChannelGroup(cordova.getActivity().getApplicationContext(), groupId, groupName);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("deleteNotificationChannel")) {
            final String channelId = (args.length() == 1 ? args.getString(0) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.deleteNotificationChannel(cordova.getActivity().getApplicationContext(), channelId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("deleteNotificationChannelGroup")) {
            final String groupId = (args.length() == 1 ? args.getString(0) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.deleteNotificationChannelGroup(cordova.getActivity().getApplicationContext(), groupId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }
        /* Android O functions end*/

        else if (action.equals("recordScreenView")) {
            final String screen = (args.length() == 1 ? args.getString(0) : "");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.recordScreen(screen);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setDebugLevel")) {
            int level = (args.length() == 1 ? args.getInt(0) : -2);
            if (level >= -1) {
                CleverTapAPI.setDebugLevel(level);
                result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
                return true;
            }

        }

        //Enables tracking opt out for the currently active user.
        else if (action.equals("setOptOut")) {
            final boolean value = args.getBoolean(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.setOptOut(value);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }
        //Sets the SDK to offline mode
        else if (action.equals("setOffline")) {
            final boolean value = args.getBoolean(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.setOffline(value);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        //Enables the reporting of device network related information, including IP address.  This reporting is disabled by default.
        else if (action.equals("enableDeviceNetworkInfoReporting")) {
            final boolean value = args.getBoolean(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.enableDeviceNetworkInfoReporting(value);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("enablePersonalization")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.enablePersonalization();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;

        } else if (action.equals("disablePersonalization")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.disablePersonalization();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;

        } else if (action.equals("recordEventWithName")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.pushEvent(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        } else if (action.equals("recordEventWithNameAndProps")) {
            String eventName = null;
            JSONObject jsonProps;
            HashMap<String, Object> _props = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    eventName = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "eventName cannot be null";
                }
                if (!args.isNull(1)) {
                    jsonProps = args.getJSONObject(1);
                    try {
                        _props = toMap(jsonProps);
                    } catch (JSONException e) {
                        haveError = true;
                        errorMsg = "Error parsing event properties";
                    }
                } else {
                    haveError = true;
                    errorMsg = "Arg cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _eventName = eventName;
                final HashMap<String, Object> props = _props;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.pushEvent(_eventName, props);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("recordChargedEventWithDetailsAndItems")) {
            JSONObject jsonDetails;
            JSONArray jsonItems;
            HashMap<String, Object> _details = null;
            ArrayList<HashMap<String, Object>> _items = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    jsonDetails = args.getJSONObject(0);
                    try {
                        _details = toMap(jsonDetails);
                    } catch (JSONException e) {
                        haveError = true;
                        errorMsg = "Error parsing arg " + e.getLocalizedMessage();
                    }
                } else {
                    haveError = true;
                    errorMsg = "Arg cannot be null";
                }
                if (!args.isNull(1)) {
                    jsonItems = args.getJSONArray(1);
                    try {
                        _items = toArrayListOfStringObjectMaps(jsonItems);
                    } catch (JSONException e) {
                        haveError = true;
                        errorMsg = "Error parsing arg " + e.getLocalizedMessage();
                    }
                } else {
                    haveError = true;
                    errorMsg = "Arg cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final HashMap<String, Object> details = _details;
                final ArrayList<HashMap<String, Object>> items = _items;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.pushChargedEvent(details, items);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("pushInstallReferrer")) {
            String source = null;
            String campaign = null;
            String medium = null;

            if (args.length() == 3) {
                if (!args.isNull(0)) {
                    source = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "source cannot be null";
                }
                if (!args.isNull(1)) {
                    medium = args.getString(1);
                } else {
                    haveError = true;
                    errorMsg = "medium cannot be null";
                }
                if (!args.isNull(2)) {
                    campaign = args.getString(2);
                } else {
                    haveError = true;
                    errorMsg = "campaign cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 3 arguments";
            }

            if (!haveError) {
                final String _source = source;
                final String _medium = medium;
                final String _campaign = campaign;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.pushInstallReferrer(_source, _medium, _campaign);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("eventGetFirstTime")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        double first = cleverTap.getFirstTime(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, (float) first);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        } else if (action.equals("eventGetLastTime")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        double lastTime = cleverTap.getLastTime(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, (float) lastTime);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        } else if (action.equals("eventGetOccurrences")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        int num = cleverTap.getCount(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, num);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        } else if (action.equals("eventGetDetails")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        EventDetail details = cleverTap.getDetails(eventName);
                        try {
                            JSONObject jsonDetails = CleverTapPlugin.eventDetailsToJSON(details);
                            PluginResult _result = new PluginResult(PluginResult.Status.OK, jsonDetails);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        } catch (JSONException e) {
                            PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        } else if (action.equals("getEventHistory")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Map<String, EventDetail> history = cleverTap.getHistory();
                    try {
                        JSONObject jsonDetails = CleverTapPlugin.eventHistoryToJSON(history);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, jsonDetails);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        } else if (action.equals("setLocation")) {
            Double lat = null;
            Double lon = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    lat = args.getDouble(0);
                } else {
                    haveError = true;
                    errorMsg = "lat cannot be null";
                }
                if (!args.isNull(1)) {
                    lon = args.getDouble(1);
                } else {
                    haveError = true;
                    errorMsg = "lon cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final Location location = new Location("CleverTapPlugin");
                location.setLatitude(lat);
                location.setLongitude(lon);
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.setLocation(location);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("getLocation")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Location location = cleverTap.getLocation();
                    PluginResult _result = null;
                    try {
                        if (location != null) {
                            JSONObject jsonLoc = new JSONObject();
                            jsonLoc.put("lat", location.getLatitude());
                            jsonLoc.put("lon", location.getLongitude());
                            _result = new PluginResult(PluginResult.Status.OK, jsonLoc);
                        }
                    } catch (Throwable t) {
                        // no-op
                    }

                    if (_result == null) {
                        _result = new PluginResult(PluginResult.Status.ERROR, "Unable to get location");
                    }
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("profileSet")) {
            JSONObject jsonProfile = null;

            if (args.length() == 1) {
                if (!args.isNull(0)) {
                    jsonProfile = args.getJSONObject(0);
                } else {
                    haveError = true;
                    errorMsg = "profile cannot be null";
                }

            } else {
                haveError = true;
                errorMsg = "Expected 1 argument";
            }

            if (!haveError) {
                final JSONObject _jsonProfile = jsonProfile;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        try {
                            HashMap<String, Object> profile = formatProfile(_jsonProfile);
                            cleverTap.pushProfile(profile);
                        } catch (Exception e) {
                            Log.d(LOG_TAG, "Error setting profile " + e.getLocalizedMessage());
                        }
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });

                return true;
            }
        } else if (action.equals("onUserLogin")) {
            JSONObject jsonProfile = null;

            if (args.length() == 1) {
                if (!args.isNull(0)) {
                    jsonProfile = args.getJSONObject(0);
                } else {
                    haveError = true;
                    errorMsg = "profile cannot be null";
                }

            } else {
                haveError = true;
                errorMsg = "Expected 1 argument";
            }

            if (!haveError) {
                final JSONObject _jsonProfile = jsonProfile;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        try {
                            HashMap<String, Object> profile = formatProfile(_jsonProfile);
                            cleverTap.onUserLogin(profile);
                        } catch (Exception e) {
                            Log.d(LOG_TAG, "Error in onUserLogin " + e.getLocalizedMessage());
                        }
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });

                return true;
            }
        } else if (action.equals("profileGetProperty")) {
            final String propertyName = (args.length() == 1 ? args.getString(0) : null);
            if (propertyName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        PluginResult _result;
                        Object prop = cleverTap.getProperty(propertyName);

                        if (prop instanceof JSONArray) {
                            JSONArray _prop = (JSONArray) prop;
                            _result = new PluginResult(PluginResult.Status.OK, _prop);

                        } else {
                            String _prop;
                            if (prop != null) {
                                _prop = prop.toString();
                            } else {
                                _prop = null;
                            }
                            _result = new PluginResult(PluginResult.Status.OK, _prop);
                        }

                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "propertyName cannot be null";
            }
        } else if (action.equals("profileGetCleverTapID")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    String CleverTapID = cleverTap.getCleverTapID();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, CleverTapID);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("profileGetCleverTapAttributionIdentifier")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    String attributionID = cleverTap.getCleverTapAttributionIdentifier();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, attributionID);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getCleverTapID")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.getCleverTapID(new OnInitCleverTapIDListener() {
                        @Override
                        public void onInitCleverTapID(final String cleverTapID) {
                            // Callback on main thread
                            PluginResult _result = new PluginResult(PluginResult.Status.OK, cleverTapID);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }

                    });
                }
            });
            return true;
        } else if (action.equals("profileRemoveValueForKey")) {
            final String key = (args.length() == 1 ? args.getString(0) : null);
            if (key != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.removeValueForKey(key);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "property key cannot be null";
            }
        } else if (action.equals("profileSetMultiValues")) {
            String key = null;
            JSONArray values = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    values = args.getJSONArray(1);
                    if (values == null) {
                        haveError = true;
                        errorMsg = "values cannot be null";
                    }
                } else {
                    haveError = true;
                    errorMsg = "values cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final ArrayList<String> _values = new ArrayList<String>();
                try {
                    for (int i = 0; i < values.length(); i++) {
                        _values.add(values.get(i).toString());
                    }

                    cordova.getThreadPool().execute(new Runnable() {
                        public void run() {
                            cleverTap.setMultiValuesForKey(_key, _values);
                            PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }
                    });

                    return true;

                } catch (Exception e) {
                    // no-op
                }
            }
        } else if (action.equals("profileAddMultiValues")) {
            String key = null;
            JSONArray values = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    values = args.getJSONArray(1);
                    if (values == null) {
                        haveError = true;
                        errorMsg = "values cannot be null";
                    }
                } else {
                    haveError = true;
                    errorMsg = "values cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final ArrayList<String> _values = new ArrayList<String>();
                try {
                    for (int i = 0; i < values.length(); i++) {
                        _values.add(values.get(i).toString());
                    }

                    cordova.getThreadPool().execute(new Runnable() {
                        public void run() {
                            cleverTap.addMultiValuesForKey(_key, _values);
                            PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }
                    });

                    return true;

                } catch (Exception e) {
                    // no-op
                }
            }
        } else if (action.equals("profileRemoveMultiValues")) {
            String key = null;
            JSONArray values = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    values = args.getJSONArray(1);
                    if (values == null) {
                        haveError = true;
                        errorMsg = "values cannot be null";
                    }
                } else {
                    haveError = true;
                    errorMsg = "values cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final ArrayList<String> _values = new ArrayList<String>();
                try {
                    for (int i = 0; i < values.length(); i++) {
                        _values.add(values.get(i).toString());
                    }

                    cordova.getThreadPool().execute(new Runnable() {
                        public void run() {
                            cleverTap.removeMultiValuesForKey(_key, _values);
                            PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }
                    });

                    return true;

                } catch (Exception e) {
                    // no-op
                }
            }
        } else if (action.equals("profileAddMultiValue")) {
            String key = null;
            String value = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    value = args.getString(1);
                } else {
                    haveError = true;
                    errorMsg = "value cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final String _value = value;

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.addMultiValueForKey(_key, _value);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("profileRemoveMultiValue")) {
            String key = null;
            String value = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    value = args.getString(1);
                } else {
                    haveError = true;
                    errorMsg = "value cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final String _value = value;

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.removeMultiValueForKey(_key, _value);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("profileIncrementValueBy")) {
            String key = null;
            Double value = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    value = args.getDouble(1);
                } else {
                    haveError = true;
                    errorMsg = "value cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final Double _value = value;

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.incrementValue(_key, _value);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("profileDecrementValueBy")) {
            String key = null;
            Double value = null;

            if (args.length() == 2) {
                if (!args.isNull(0)) {
                    key = args.getString(0);
                } else {
                    haveError = true;
                    errorMsg = "key cannot be null";
                }
                if (!args.isNull(1)) {
                    value = args.getDouble(1);
                } else {
                    haveError = true;
                    errorMsg = "value cannot be null";
                }
            } else {
                haveError = true;
                errorMsg = "Expected 2 arguments";
            }

            if (!haveError) {
                final String _key = key;
                final Double _value = value;

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.decrementValue(_key, _value);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        } else if (action.equals("sessionGetTimeElapsed")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int time = cleverTap.getTimeElapsed();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, time);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("sessionGetTotalVisits")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int count = cleverTap.getTotalVisits();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, count);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("sessionGetScreenCount")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int count = cleverTap.getScreenCount();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, count);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("sessionGetPreviousVisitTime")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int time = cleverTap.getPreviousVisitTime();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, time);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("sessionGetUTMDetails")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    UTMDetail details = cleverTap.getUTMDetails();
                    try {
                        JSONObject jsonDetails = CleverTapPlugin.utmDetailsToJSON(details);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, jsonDetails);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        }
        //Notification Inbox methods
        else if (action.equals("initializeInbox")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.initializeInbox();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
        } else if (action.equals("showInbox")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        JSONObject styleConfigJSON;
                        CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
                        if (args.length() == 1) {
                            styleConfigJSON = args.getJSONObject(0);
                            styleConfig = toStyleConfig(styleConfigJSON);
                        }
                        cleverTap.showAppInbox(styleConfig);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
        } else if (action.equals("getInboxMessageUnreadCount")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int unreadCount = cleverTap.getInboxMessageUnreadCount();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, unreadCount);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getInboxMessageCount")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int msgCount = cleverTap.getInboxMessageCount();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, msgCount);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getAllInboxMessages")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        ArrayList<CTInboxMessage> messageList = cleverTap.getAllInboxMessages();
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, inboxMessageListToJSONArray(messageList));
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        } else if (action.equals("getUnreadInboxMessages")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        ArrayList<CTInboxMessage> messageList = cleverTap.getUnreadInboxMessages();
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, inboxMessageListToJSONArray(messageList));
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        } else if (action.equals("getInboxMessageForId")) {
            final String messageId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    CTInboxMessage message = cleverTap.getInboxMessageForId(messageId);
                    try {
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, message.getData());
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (Exception e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR, "InboxMessage with ID=" + messageId + " not found!");
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        } else if (action.equals("deleteInboxMessageForId")) {
            final String messageId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.deleteInboxMessage(messageId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("markReadInboxMessageForId")) {
            final String messageId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.markReadInboxMessage(messageId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("pushInboxNotificationViewedEventForId")) {
            final String messageId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushInboxNotificationViewedEvent(messageId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("pushInboxNotificationClickedEventForId")) {
            final String messageId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushInboxNotificationClickedEvent(messageId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getAllDisplayUnits")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        ArrayList<CleverTapDisplayUnit> displayUnits = cleverTap.getAllDisplayUnits();
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, displayUnitListToJSONArray(displayUnits));
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        } else if (action.equals("getDisplayUnitForId")) {
            final String unitId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    CleverTapDisplayUnit displayUnit = cleverTap.getDisplayUnitForId(unitId);
                    PluginResult _result;
                    if (displayUnit != null) {
                        _result = new PluginResult(PluginResult.Status.OK, displayUnit.getJsonObject());
                    } else {
                        _result = new PluginResult(PluginResult.Status.ERROR, "DisplayUnit with ID=" + unitId + " not found!");
                    }
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("pushDisplayUnitViewedEventForID")) {
            final String unitId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushDisplayUnitViewedEventForID(unitId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("pushDisplayUnitClickedEventForID")) {
            final String unitId = (args.length() == 1 ? args.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.pushDisplayUnitClickedEventForID(unitId);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("isFeatureFlagInitialized")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    boolean value = cleverTap.featureFlag().isInitialized();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getFeatureFlag")) {
            final String name = args.getString(0);
            final boolean defaultValue = args.getBoolean(1);

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    boolean value = cleverTap.featureFlag().get(name, defaultValue);
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("isProducConfigInitialized")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    boolean value = cleverTap.productConfig().isInitialized();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setDefaultsMap")) {
            try {
                final HashMap<String, Object> defaultValue = toMap(args.getJSONObject(0));

                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.productConfig().setDefaults(defaultValue);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });

            } catch (JSONException e) {
                PluginResult _result = new PluginResult(PluginResult.Status.ERROR);
                _result.setKeepCallback(true);
                callbackContext.sendPluginResult(_result);
            }

            return true;
        } else if (action.equals("fetch")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().fetch();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("fetchWithMinimumFetchIntervalInSeconds")) {
            long interval = args.getInt(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().fetch(interval);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("activate")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().activate();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("fetchAndActivate")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().activate();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("setMinimumFetchIntervalInSeconds")) {
            long interval = args.getInt(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().setMinimumFetchIntervalInSeconds(interval);
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getLastFetchTimeStampInMillis")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    long value = cleverTap.productConfig().getLastFetchTimeStampInMillis();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getString")) {
            String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    String value = cleverTap.productConfig().getString(key);
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getBoolean")) {
            String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    boolean value = cleverTap.productConfig().getBoolean(key);
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getLong")) {
            String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    long value = cleverTap.productConfig().getLong(key);
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("getDouble")) {
            String key = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    float value = cleverTap.productConfig().getDouble(key).floatValue();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, value);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("reset")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.productConfig().reset();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("suspendInAppNotifications")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.suspendInAppNotifications();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("discardInAppNotifications")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.discardInAppNotifications();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        } else if (action.equals("resumeInAppNotifications")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.resumeInAppNotifications();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        result = new PluginResult(PluginResult.Status.ERROR, errorMsg);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
        return true;
    }

    //DisplayUnitListener

    public void onDisplayUnitsLoaded(ArrayList<CleverTapDisplayUnit> units) {

        try {
            final JSONArray unitsArray = displayUnitListToJSONArray(units);

            final String json = "{'units':" + unitsArray.toString() + "}";

            webView.getView().post(new Runnable() {
                public void run() {
                    webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapDisplayUnitsLoaded'," + json + ");");
                }
            });

        } catch (JSONException e) {
            Log.d(LOG_TAG, "JSONException in onDisplayUnitsLoaded" + e);
        }

    }

    //CTInboxListener

    public void inboxDidInitialize() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapInboxDidInitialize');");
            }
        });
    }

    public void inboxMessagesDidUpdate() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapInboxMessagesDidUpdate');");
            }
        });
    }


    // InAppNotificationListener

    public boolean beforeShow(Map<String, Object> var1) {
        return true;
    }

    public void onDismissed(Map<String, Object> var1, Map<String, Object> var2) {
        if (var1 == null && var2 == null) {
            return;
        }

        JSONObject extras = var1 != null ? new JSONObject(var1) : new JSONObject();
        String _json = "{'extras':" + extras.toString() + ",";

        JSONObject actionExtras = var2 != null ? new JSONObject(var2) : new JSONObject();
        _json += "'actionExtras':" + actionExtras.toString() + "}";

        final String json = _json;
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapInAppNotificationDismissed'," + json + ");");
            }
        });
    }

    // SyncListener
    public void profileDataUpdated(JSONObject updates) {

        if (updates == null) {
            return;
        }

        final String json = "{'updates':" + updates.toString() + "}";
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProfileSync'," + json + ");");
            }
        });
    }

    public void profileDidInitialize(String CleverTapID) {

        if (CleverTapID == null) {
            return;
        }

        final String json = "{'CleverTapID':" + "'" + CleverTapID + "'" + "}";
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProfileDidInitialize'," + json + ");");
            }
        });
    }

    //Inbox/InApp Button Click Listeners

    public void onInboxButtonClick(HashMap<String, String> payload) {
        JSONObject jsonPayload = new JSONObject(payload);

        final String json = "{'customExtras':" + jsonPayload.toString() + "}";

        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapInboxButtonClick'," + json + ");");
            }
        });


    }

    //InApp Notification callback
    public void onInAppButtonClick(HashMap<String, String> hashMap) {
        JSONObject jsonPayload = new JSONObject(hashMap);
        final String json = "{'customExtras':" + jsonPayload.toString() + "}";

        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapInAppButtonClick'," + json + ");");
            }
        });
    }

    //Feature Flag Listener
    public void featureFlagsUpdated() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapFeatureFlagsDidUpdate');");
            }
        });
    }

    //Product Config Listener
    public void onInit() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProductConfigDidInitialize');");
            }
        });
    }

    public void onFetched() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProductConfigDidFetch');");
            }
        });
    }

    public void onActivated() {
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProductConfigDidActivate');");
            }
        });
    }

    /*******************
     * Private Methods
     ******************/

    private static boolean checkCleverTapInitialized() {
        boolean initialized = (cleverTap != null);
        if (!initialized) {
            Log.d(LOG_TAG, "CleverTap API not initialized: " + CLEVERTAP_API_ERROR);
        }
        return initialized;
    }

    private static HashMap<String, Object> formatProfile(JSONObject jsonProfile) {
        try {
            HashMap<String, Object> profile = toMap(jsonProfile);
            return profile;
        } catch (Throwable t) {
            return null;
        }
    }

    private static Object fromJson(Object json) throws JSONException {
        if (json == JSONObject.NULL) {
            return null;
        } else if (json instanceof JSONObject) {
            return toMap((JSONObject) json);
        } else {
            return json;
        }
    }

    private static CTInboxStyleConfig toStyleConfig(JSONObject object) throws JSONException {
        CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
        if (object.has("navBarColor")) {
            styleConfig.setNavBarColor(object.getString("navBarColor"));
        }
        if (object.has("navBarTitle")) {
            styleConfig.setNavBarTitle(object.getString("navBarTitle"));
        }
        if (object.has("navBarTitleColor")) {
            styleConfig.setNavBarTitleColor(object.getString("navBarTitleColor"));
        }
        if (object.has("inboxBackgroundColor")) {
            styleConfig.setInboxBackgroundColor(object.getString("inboxBackgroundColor"));
        }
        if (object.has("backButtonColor")) {
            styleConfig.setBackButtonColor(object.getString("backButtonColor"));
        }
        if (object.has("selectedTabColor")) {
            styleConfig.setSelectedTabColor(object.getString("selectedTabColor"));
        }
        if (object.has("unselectedTabColor")) {
            styleConfig.setUnselectedTabColor(object.getString("unselectedTabColor"));
        }
        if (object.has("selectedTabIndicatorColor")) {
            styleConfig.setSelectedTabIndicatorColor(object.getString("selectedTabIndicatorColor"));
        }
        if (object.has("tabBackgroundColor")) {
            styleConfig.setTabBackgroundColor(object.getString("tabBackgroundColor"));
        }
        if (object.has("tabs")) {
            JSONArray tabsArray = object.getJSONArray("tabs");
            ArrayList tabs = new ArrayList();
            for (int i = 0; i < tabsArray.length(); i++) {
                tabs.add(tabsArray.getString(i));
            }
            styleConfig.setTabs(tabs);
        }
        return styleConfig;
    }

    private static HashMap<String, Object> toMap(JSONObject object) throws JSONException {
        HashMap<String, Object> map = new HashMap<String, Object>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, fromJson(object.get(key)));
        }
        return map;
    }

    private static ArrayList<HashMap<String, Object>> toArrayListOfStringObjectMaps(JSONArray array) throws JSONException {
        ArrayList<HashMap<String, Object>> aList = new ArrayList<HashMap<String, Object>>();

        for (int i = 0; i < array.length(); i++) {
            aList.add(toMap((JSONObject) array.get(i)));
        }

        return aList;
    }

    private static JSONObject eventDetailsToJSON(EventDetail details) throws JSONException {

        JSONObject json = new JSONObject();

        if (details != null) {
            json.put("name", details.getName());
            json.put("firstTime", details.getFirstTime());
            json.put("lastTime", details.getLastTime());
            json.put("count", details.getCount());
        }

        return json;
    }

    private static JSONObject utmDetailsToJSON(UTMDetail details) throws JSONException {

        JSONObject json = new JSONObject();

        if (details != null) {
            json.put("campaign", details.getCampaign());
            json.put("source", details.getSource());
            json.put("medium", details.getMedium());
        }

        return json;
    }

    private static JSONObject eventHistoryToJSON(Map<String, EventDetail> history) throws JSONException {

        JSONObject json = new JSONObject();

        if (history != null) {
            for (Object key : history.keySet()) {
                json.put(key.toString(), eventDetailsToJSON(history.get((String) key)));
            }
        }

        return json;
    }

    private static JSONArray listToJSONArray(List<?> list) throws JSONException {
        JSONArray array = new JSONArray();

        for (int i = 0; i < list.size(); i++) {
            array.put(list.get(i));
        }

        return array;
    }

    private List<Boolean> toBooleanList(JSONArray array) throws JSONException {
        ArrayList<Boolean> list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getBoolean(i));
        }
        return list;
    }

    private List<Double> toDoubleList(JSONArray array) throws JSONException {
        ArrayList<Double> list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getDouble(i));
        }
        return list;
    }

    private List<Integer> toIntegerList(JSONArray array) throws JSONException {
        ArrayList<Integer> list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getInt(i));
        }
        return list;
    }

    private List<String> toStringList(JSONArray array) throws JSONException {
        ArrayList<String> list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getString(i));
        }
        return list;
    }

    private static HashMap<String, Boolean> toBooleanMap(JSONObject object) throws JSONException {
        HashMap<String, Boolean> map = new HashMap<String, Boolean>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, object.getBoolean(key));
        }
        return map;
    }

    private static HashMap<String, Double> toDoubleMap(JSONObject object) throws JSONException {
        HashMap<String, Double> map = new HashMap<String, Double>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, object.getDouble(key));
        }
        return map;
    }

    private static HashMap<String, Integer> toIntegerMap(JSONObject object) throws JSONException {
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, object.getInt(key));
        }
        return map;
    }

    private static HashMap<String, String> toStringMap(JSONObject object) throws JSONException {
        HashMap<String, String> map = new HashMap<String, String>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, object.getString(key));
        }
        return map;
    }

    private JSONObject getJsonFromMap(Map<String, ?> map) throws JSONException {
        JSONObject jsonData = new JSONObject();
        for (String key : map.keySet()) {
            Object value = map.get(key);
            if (value instanceof Map<?, ?>) {
                value = getJsonFromMap((Map<String, ?>) value);
            }
            jsonData.put(key, value);
        }
        return jsonData;
    }

    private JSONArray displayUnitListToJSONArray(ArrayList<CleverTapDisplayUnit> displayUnits) throws JSONException {
        JSONArray array = new JSONArray();

        if (displayUnits == null) {
            return array;
        }

        for (int i = 0; i < displayUnits.size(); i++) {
            array.put(displayUnits.get(i).getJsonObject());
        }

        return array;
    }

    private JSONArray inboxMessageListToJSONArray(ArrayList<CTInboxMessage> messageList) throws JSONException {
        JSONArray array = new JSONArray();

        for (int i = 0; i < messageList.size(); i++) {
            array.put(messageList.get(i).getData());
        }

        return array;
    }

    public void onNotificationClickedPayloadReceived(HashMap<String, Object> payload) {

        JSONObject jsonPayload = new JSONObject(payload);

        final String json = "{'customExtras':" + jsonPayload.toString() + "}";

        webView.getView().post(new Runnable() {
            public void run() {

                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapPushNotificationTappedWithCustomExtras'," + json + ");");
            }
        });
        callbackDone = true;
    }

    public void onPushAmpPayloadReceived(Bundle extras) {
        JSONObject jsonPayload = toJson(extras);

        final String json = "{'customExtras':" + jsonPayload.toString() + "}";

        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapPushAmpPayloadDidReceived'," + json + ");");
            }
        });
    }

    private JSONObject toJson(Bundle bundle) {
        JSONObject json = new JSONObject();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            try {
                // json.put(key, bundle.get(key)); see edit below
                json.put(key, JSONObject.wrap(bundle.get(key)));
            } catch (JSONException e) {
                //Handle exception here
            }
        }
        return json;
    }
}