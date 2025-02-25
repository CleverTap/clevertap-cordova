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

import androidx.annotation.NonNull;
import com.clevertap.android.sdk.PushPermissionResponseListener;
import com.clevertap.android.sdk.inapp.CTInAppNotification;
import com.clevertap.android.sdk.inapp.CTLocalInApp;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.android.sdk.pushnotification.amp.CTPushAmpListener;
import com.clevertap.android.sdk.usereventlogs.UserEventLog;
import com.clevertap.android.sdk.variables.CTVariableUtils;
import com.clevertap.android.sdk.variables.Var;
import com.clevertap.android.sdk.variables.callbacks.VariableCallback;
import com.clevertap.android.sdk.variables.callbacks.VariablesChangedCallback;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.lang.Exception;

import java.util.List;
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
import com.clevertap.android.sdk.InboxMessageListener;
import com.clevertap.android.sdk.InAppNotificationButtonListener;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;
import com.clevertap.android.sdk.displayunits.DisplayUnitListener;
import com.clevertap.android.sdk.product_config.CTProductConfigListener;
import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener;
import com.clevertap.android.sdk.interfaces.NotificationHandler;


public class CleverTapPlugin extends CordovaPlugin implements SyncListener, InAppNotificationListener, CTInboxListener,
        InboxMessageButtonListener, InAppNotificationButtonListener, DisplayUnitListener,
        CTFeatureFlagsListener, CTProductConfigListener, CTPushNotificationListener, CTPushAmpListener, InboxMessageListener,
        PushPermissionResponseListener {

    private static final String LOG_TAG = "CLEVERTAP_PLUGIN";
    private static String CLEVERTAP_API_ERROR;
    private static CleverTapAPI cleverTap;
    private boolean callbackDone = false;
    public static Map<String, Object> variables = new HashMap<>();

    @Override
    public void onDestroy() {
        CleverTapEventEmitter.setCordovaWebView(null);
        super.onDestroy();
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        CleverTapEventEmitter.setCordovaWebView(webView);
        cleverTap = CleverTapAPI.getDefaultInstance(cordova.getActivity().getApplicationContext());
        cleverTap.setSyncListener(this);
        cleverTap.setInAppNotificationListener(this);
        cleverTap.setCTNotificationInboxListener(this);
        cleverTap.setInboxMessageButtonListener(this);
        cleverTap.setCTInboxMessageListener(this);
        cleverTap.setInAppNotificationButtonListener(this);
        cleverTap.setDisplayUnitListener(this);
        cleverTap.setCTFeatureFlagsListener(this);
        cleverTap.setCTProductConfigListener(this);
        cleverTap.setCTPushNotificationListener(this);
        cleverTap.setCTPushAmpListener(this);
        cleverTap.registerPushPermissionNotificationResponseListener(this);

        String libName = "Cordova";
        int libVersion = 30400;
        cleverTap.setLibrary(libName);
        cleverTap.setCustomSdkVersion(libName, libVersion);

        try {
            String ptHandler = "com.clevertap.android.pushtemplates.PushTemplateNotificationHandler";
            CleverTapAPI.setNotificationHandler((NotificationHandler) (Class.forName(ptHandler).getConstructor().newInstance()));
            System.out.println("Push templates dependency available");
        } catch (Throwable e){
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
                if (!isDeepLinkValid(data)) {
                    Log.w(LOG_TAG, "Found malicious deep link. Not processing further.");
                    return;
                }
                Map<String, Object> result = new HashMap<>();
                result.put("deeplink", data);
                CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_DEEP_LINK, result);
            }
        }
        // push notification
        else {
            Bundle extras = intent.getExtras();
            boolean isPushNotification = (extras != null && extras.get("wzrk_pn") != null);
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

                Map<String, Object> result = new HashMap<>();
                result.put("notification", data);
                CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_PUSH_NOTIFICATION, result);

                if (!callbackDone) {
                    Map<String, Object> callbackResult = new HashMap<>();
                    result.put("customExtras", data.toString());
                    CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PUSH_NOTIFICATION_TAPPED_WITH_CUSTOM_EXTRAS, callbackResult);
                }
            }
        }
    }

    private void executeWithArgs(JSONArray args, CallbackContext callbackContext, LambdaWithArgs action) {
        try {
            action.execute(args);
        } catch (JSONException e) {
            sendPluginResult(callbackContext, Status.ERROR, "Invalid arguments: " + e.getMessage());
        }
    }

    // Functional interface for lambda
    private interface LambdaWithArgs {
        void execute(JSONArray args) throws JSONException;
    }


    private void notifyDeviceReady(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            ActivityLifecycleCallback.register(cordova.getActivity().getApplication());
            CleverTapAPI.setAppForeground(true);
            CleverTapAPI.onActivityResumed(cordova.getActivity());
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void setPushToken(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String token = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.pushFcmRegistrationId(token, true);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void setPushBaiduToken(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String token = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.pushBaiduRegistrationId(token, true);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void setPushHuaweiToken(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String token = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.pushHuaweiRegistrationId(token, true);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotification(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String extras = arguments.getString(0);
            JSONObject json = new JSONObject(extras);
            Bundle bundle = new Bundle();
            for (Iterator<String> entry = json.keys(); entry.hasNext(); ) {
                String key = entry.next();
                String str = json.optString(key);
                bundle.putString(key, str);
            }
            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotification(cordova.getActivity().getApplicationContext(), bundle);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotificationChannel(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String channelId = (arguments.length() == 5 ? arguments.getString(0) : "");
            final String channelName = (arguments.length() == 5 ? arguments.getString(1) : "");
            final String channelDescription = (arguments.length() == 5 ? arguments.getString(2) : "");
            final int importance = Integer.parseInt((arguments.length() == 5 ? arguments.getString(3) : "0"));
            final boolean showBadge = Boolean.valueOf((arguments.length() == 5 ? arguments.getString(4) : "false"));

            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, showBadge);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotificationChannelWithSound(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String channelId = (arguments.length() == 6 ? arguments.getString(0) : "");
            final String channelName = (arguments.length() == 6 ? arguments.getString(1) : "");
            final String channelDescription = (arguments.length() == 6 ? arguments.getString(2) : "");
            final int importance = Integer.parseInt((arguments.length() == 6 ? arguments.getString(3) : "0"));
            final boolean showBadge = Boolean.valueOf((arguments.length() == 6 ? arguments.getString(4) : "false"));
            final String sound = (arguments.length() == 6 ? arguments.getString(5) : "");
            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, showBadge, sound);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotificationChannelWithGroupId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String channelId = (arguments.length() == 6 ? arguments.getString(0) : "");
            final String channelName = (arguments.length() == 6 ? arguments.getString(1) : "");
            final String channelDescription = (arguments.length() == 6 ? arguments.getString(2) : "");
            final int importance = Integer.parseInt((arguments.length() == 6 ? arguments.getString(3) : "0"));
            final String groupId = (arguments.length() == 6 ? arguments.getString(4) : "");
            final boolean showBadge = Boolean.valueOf((arguments.length() == 6 ? arguments.getString(5) : "false"));

            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, groupId, showBadge);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotificationChannelWithGroupIdAndSound(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String channelId = (arguments.length() == 7 ? arguments.getString(0) : "");
            final String channelName = (arguments.length() == 7 ? arguments.getString(1) : "");
            final String channelDescription = (arguments.length() == 7 ? arguments.getString(2) : "");
            final int importance = Integer.parseInt((arguments.length() == 7 ? arguments.getString(3) : "0"));
            final String groupId = (arguments.length() == 7 ? arguments.getString(4) : "");
            final boolean showBadge = Boolean.valueOf((arguments.length() == 7 ? arguments.getString(5) : "false"));
            final String sound = (arguments.length() == 7 ? arguments.getString(6) : "");

            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotificationChannel(cordova.getActivity().getApplicationContext(), channelId, channelName, channelDescription, importance, groupId, showBadge, sound);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void createNotificationChannelGroup(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String groupId = (arguments.length() == 2 ? arguments.getString(0) : "");
            final String groupName = (arguments.length() == 2 ? arguments.getString(1) : "");

            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.createNotificationChannelGroup(cordova.getActivity().getApplicationContext(), groupId, groupName);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }


    private void deleteNotificationChannel(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String channelId = (arguments.length() == 1 ? arguments.getString(0) : "");
            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.deleteNotificationChannel(cordova.getActivity().getApplicationContext(), channelId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void deleteNotificationChannelGroup(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String groupId = (arguments.length() == 1 ? arguments.getString(0) : "");
            cordova.getThreadPool().execute(() -> {
                CleverTapAPI.deleteNotificationChannelGroup(cordova.getActivity().getApplicationContext(), groupId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void recordScreenView(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String screen = (arguments.length() == 1 ? arguments.getString(0) : "");
            cordova.getThreadPool().execute(() -> {
                cleverTap.recordScreen(screen);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void setDebugLevel(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            int level = (arguments.length() == 1 ? arguments.getInt(0) : -2);
            if (level >= -1) {
                CleverTapAPI.setDebugLevel(level);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            }
        });
    }

    private void setOptOut(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final boolean optOut = arguments.getBoolean(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.setOptOut(optOut);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void setOffline(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final boolean offline = arguments.getBoolean(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.setOffline(offline);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void enableDeviceNetworkInfoReporting(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final boolean enable = arguments.getBoolean(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.enableDeviceNetworkInfoReporting(enable);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void enablePersonalization(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.enablePersonalization();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void disablePersonalization(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.disablePersonalization();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void recordEventWithName(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.pushEvent(eventName);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void recordEventWithNameAndProps(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            JSONObject jsonProps = arguments.getJSONObject(1);
            HashMap<String, Object> props = toMap(jsonProps);

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushEvent(eventName, props);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void recordChargedEventWithDetailsAndItems(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            JSONObject jsonDetails = arguments.getJSONObject(0);
            JSONArray jsonItems = arguments.getJSONArray(1);

            HashMap<String, Object> details = toMap(jsonDetails);
            ArrayList<HashMap<String, Object>> items = toArrayListOfStringObjectMaps(jsonItems);

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushChargedEvent(details, items);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void pushInstallReferrer(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String source = arguments.getString(0);
            String medium = arguments.getString(1);
            String campaign = arguments.getString(2);

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushInstallReferrer(source, medium, campaign);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void eventGetFirstTime(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                double firstTime = cleverTap.getFirstTime(eventName);
                sendPluginResult(callbackContext, Status.OK, (float) firstTime);
            });
        });
    }

    private void eventGetLastTime(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                double lastTime = cleverTap.getLastTime(eventName);
                sendPluginResult(callbackContext, Status.OK, (float) lastTime);
            });
        });
    }

    private void eventGetOccurrences(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                int occurrences = cleverTap.getCount(eventName);
                sendPluginResult(callbackContext, Status.OK, occurrences);
            });
        });
    }

    private void eventGetDetails(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                EventDetail details = cleverTap.getDetails(eventName);
                try {
                    JSONObject jsonDetails = CleverTapPlugin.eventDetailsToJSON(details);
                    sendPluginResult(callbackContext, Status.OK, jsonDetails);
                } catch (JSONException e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void getEventHistory(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            Map<String, EventDetail> history = cleverTap.getHistory();
            try {
                JSONObject jsonHistory = CleverTapPlugin.eventHistoryToJSON(history);
                sendPluginResult(callbackContext, Status.OK, jsonHistory);
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
            }
        });
    }

    private void getUserEventLog(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                UserEventLog eventLog = cleverTap.getUserEventLog(eventName);
                try {
                    JSONObject jsonEventLog = eventLogToJSON(eventLog);
                    sendPluginResult(callbackContext, Status.OK, jsonEventLog);
                } catch (JSONException e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void getUserEventLogCount(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String eventName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                int count = cleverTap.getUserEventLogCount(eventName);
                sendPluginResult(callbackContext, Status.OK, count);
            });
        });
    }

    private void getUserLastVisitTs(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            double timestamp = cleverTap.getUserLastVisitTs();
            sendPluginResult(callbackContext, Status.OK, timestamp);
        });
    }

    private void getUserAppLaunchCount(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int launchCount = cleverTap.getUserAppLaunchCount();
            sendPluginResult(callbackContext, Status.OK, launchCount);
        });
    }

    private void getUserEventLogHistory(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            Map<String, UserEventLog> history = cleverTap.getUserEventLogHistory();
            try {
                JSONObject jsonHistory = eventLogHistoryToJSON(history);
                sendPluginResult(callbackContext, Status.OK, jsonHistory);
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
            }
        });
    }

    private void setLocation(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            double lat = arguments.getDouble(0);
            double lon = arguments.getDouble(1);
            final Location location = new Location("CleverTapPlugin");
            location.setLatitude(lat);
            location.setLongitude(lon);
            cordova.getThreadPool().execute(() -> {
                cleverTap.setLocation(location);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void getLocation(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            Location location = cleverTap.getLocation();
            try {
                if (location != null) {
                    JSONObject jsonLoc = new JSONObject();
                    jsonLoc.put("lat", location.getLatitude());
                    jsonLoc.put("lon", location.getLongitude());
                    sendPluginResult(callbackContext, Status.OK, jsonLoc);
                    return;
                }
            } catch (Throwable t) {
                // no-op
            }
            sendPluginResult(callbackContext, Status.ERROR, "Unable to get location");
        });
    }

    private void profileSet(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            JSONObject jsonProfile = arguments.getJSONObject(0);
            cordova.getThreadPool().execute(() -> {
                try {
                    HashMap<String, Object> profile = formatProfile(jsonProfile);
                    cleverTap.pushProfile(profile);
                } catch (Exception e) {
                    Log.d(LOG_TAG, "Error setting profile " + e.getLocalizedMessage());
                }
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void onUserLogin(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            JSONObject jsonProfile = arguments.getJSONObject(0);
            cordova.getThreadPool().execute(() -> {
                try {
                    HashMap<String, Object> profile = formatProfile(jsonProfile);
                    cleverTap.onUserLogin(profile);
                } catch (Exception e) {
                    Log.d(LOG_TAG, "Error in onUserLogin " + e.getLocalizedMessage());
                }
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileGetProperty(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String propertyName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                Object prop = cleverTap.getProperty(propertyName);
                if (prop instanceof JSONArray) {
                    sendPluginResult(callbackContext, Status.OK, prop);
                } else {
                    sendPluginResult(callbackContext, Status.OK, prop != null ? prop.toString() : null);
                }
            });
        });
    }

    private void profileGetCleverTapID(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            String cleverTapID = cleverTap.getCleverTapID();
            sendPluginResult(callbackContext, Status.OK, cleverTapID);
        });
    }

    private void profileGetCleverTapAttributionIdentifier(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            String attributionID = cleverTap.getCleverTapAttributionIdentifier();
            sendPluginResult(callbackContext, Status.OK, attributionID);
        });
    }


    private void getCleverTapID(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.getCleverTapID(new OnInitCleverTapIDListener() {
            @Override
            public void onInitCleverTapID(final String cleverTapID) {
                // Callback on main thread
                sendPluginResult(callbackContext, Status.OK, cleverTapID);
            }
        }));
    }

    private void profileRemoveValueForKey(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.removeValueForKey(key);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileSetMultiValues(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            JSONArray values = arguments.getJSONArray(1);
            ArrayList<String> valueList = new ArrayList<>();

            for (int i = 0; i < values.length(); i++) {
                valueList.add(values.get(i).toString());
            }

            cordova.getThreadPool().execute(() -> {
                cleverTap.setMultiValuesForKey(key, valueList);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileAddMultiValues(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            JSONArray values = arguments.getJSONArray(1);
            ArrayList<String> valueList = new ArrayList<>();

            for (int i = 0; i < values.length(); i++) {
                valueList.add(values.get(i).toString());
            }

            cordova.getThreadPool().execute(() -> {
                cleverTap.addMultiValuesForKey(key, valueList);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileRemoveMultiValues(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            JSONArray values = arguments.getJSONArray(1);
            ArrayList<String> valueList = new ArrayList<>();

            for (int i = 0; i < values.length(); i++) {
                valueList.add(values.get(i).toString());
            }

            cordova.getThreadPool().execute(() -> {
                cleverTap.removeMultiValuesForKey(key, valueList);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileAddMultiValue(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            String value = arguments.getString(1);

            cordova.getThreadPool().execute(() -> {
                cleverTap.addMultiValueForKey(key, value);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileRemoveMultiValue(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            String value = arguments.getString(1);

            cordova.getThreadPool().execute(() -> {
                cleverTap.removeMultiValueForKey(key, value);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileIncrementValueBy(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            double value = arguments.getDouble(1);

            cordova.getThreadPool().execute(() -> {
                cleverTap.incrementValue(key, value);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void profileDecrementValueBy(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            double value = arguments.getDouble(1);

            cordova.getThreadPool().execute(() -> {
                cleverTap.decrementValue(key, value);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void sessionGetTimeElapsed(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int time = cleverTap.getTimeElapsed();
            sendPluginResult(callbackContext, Status.OK, time);
        });
    }

    private void sessionGetTotalVisits(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int count = cleverTap.getTotalVisits();
            sendPluginResult(callbackContext, Status.OK, count);
        });
    }

    private void sessionGetScreenCount(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int count = cleverTap.getScreenCount();
            sendPluginResult(callbackContext, Status.OK, count);
        });
    }

    private void sessionGetPreviousVisitTime(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int time = cleverTap.getPreviousVisitTime();
            sendPluginResult(callbackContext, Status.OK, time);
        });
    }

    private void sessionGetUTMDetails(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            UTMDetail details = cleverTap.getUTMDetails();
            try {
                JSONObject jsonDetails = CleverTapPlugin.utmDetailsToJSON(details);
                sendPluginResult(callbackContext, Status.OK, jsonDetails);
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
            }
        });
    }

    private void initializeInbox(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.initializeInbox();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void showInbox(JSONArray args, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> executeWithArgs(args, callbackContext, (arguments) -> {
            JSONObject styleConfigJSON;
            CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
            if (arguments.length() == 1) {
                styleConfigJSON = arguments.getJSONObject(0);
                styleConfig = toStyleConfig(styleConfigJSON);
            }
            cleverTap.showAppInbox(styleConfig);
            sendPluginResult(callbackContext, Status.NO_RESULT);
        }));
    }

    private void getInboxMessageUnreadCount(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int unreadCount = cleverTap.getInboxMessageUnreadCount();
            sendPluginResult(callbackContext, Status.OK, unreadCount);
        });
    }

    private void getInboxMessageCount(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            int msgCount = cleverTap.getInboxMessageCount();
            sendPluginResult(callbackContext, Status.OK, msgCount);
        });
    }

    private void getAllInboxMessages(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                ArrayList<CTInboxMessage> messageList = cleverTap.getAllInboxMessages();
                sendPluginResult(callbackContext, Status.OK, inboxMessageListToJSONArray(messageList));
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR);
            }
        });
    }

    private void getUnreadInboxMessages(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                ArrayList<CTInboxMessage> messageList = cleverTap.getUnreadInboxMessages();
                sendPluginResult(callbackContext, Status.OK, inboxMessageListToJSONArray(messageList));
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR);
            }
        });
    }

    private void getInboxMessageForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String messageId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                CTInboxMessage message = cleverTap.getInboxMessageForId(messageId);
                try {
                    sendPluginResult(callbackContext, Status.OK, message.getData());
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, "InboxMessage with ID=" + messageId + " not found!");
                }
            });
        });
    }

    private void deleteInboxMessageForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String messageId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                cleverTap.deleteInboxMessage(messageId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void markReadInboxMessageForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String messageId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.markReadInboxMessage(messageId);
                    sendPluginResult(callbackContext, Status.NO_RESULT);
                }
            });
        });
    }

    private void markReadInboxMessagesForIds(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final JSONArray finalJsonArray = arguments.getJSONArray(0);
            cordova.getThreadPool().execute(() -> {
                try {
                    cleverTap.markReadInboxMessagesForIDs((ArrayList<String>) toStringList(finalJsonArray));
                    sendPluginResult(callbackContext, Status.NO_RESULT);
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void deleteInboxMessagesForIds(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final JSONArray finalJsonArray = arguments.getJSONArray(0);
            cordova.getThreadPool().execute(() -> {
                try {
                    cleverTap.deleteInboxMessagesForIDs((ArrayList<String>) toStringList(finalJsonArray));
                    sendPluginResult(callbackContext, Status.NO_RESULT);
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void dismissInbox(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.dismissAppInbox();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void pushInboxNotificationViewedEventForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String messageId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushInboxNotificationViewedEvent(messageId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void pushInboxNotificationClickedEventForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String messageId = (arguments.length() == 1 ? arguments.getString(0) : "");
            cordova.getThreadPool().execute(() -> {
                cleverTap.pushInboxNotificationClickedEvent(messageId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void getAllDisplayUnits(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                ArrayList<CleverTapDisplayUnit> displayUnits = cleverTap.getAllDisplayUnits();
                sendPluginResult(callbackContext, Status.OK, displayUnitListToJSONArray(displayUnits));
            } catch (JSONException e) {
                sendPluginResult(callbackContext, Status.ERROR);
            }
        });
    }

    private void getDisplayUnitForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String unitId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                CleverTapDisplayUnit displayUnit = cleverTap.getDisplayUnitForId(unitId);
                if (displayUnit != null) {
                    sendPluginResult(callbackContext, Status.OK, displayUnit.getJsonObject());
                } else {
                    sendPluginResult(callbackContext, Status.ERROR, "DisplayUnit with ID=" + unitId + " not found!");
                }
            });
        });
    }

    private void pushDisplayUnitViewedEventForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String unitId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushDisplayUnitViewedEventForID(unitId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void pushDisplayUnitClickedEventForId(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String unitId = (arguments.length() == 1 ? arguments.getString(0) : "");

            cordova.getThreadPool().execute(() -> {
                cleverTap.pushDisplayUnitClickedEventForID(unitId);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }


    private void isFeatureFlagInitialized(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            boolean value = cleverTap.featureFlag().isInitialized();
            sendPluginResult(callbackContext, Status.OK, value);
        });
    }

    private void getFeatureFlag(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String name = arguments.getString(0);
            final boolean defaultValue = arguments.getBoolean(1);

            cordova.getThreadPool().execute(() -> {
                boolean value = cleverTap.featureFlag().get(name, defaultValue);
                sendPluginResult(callbackContext, Status.OK, value);
            });
        });
    }


    private void isProductConfigInitialized(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            boolean value = cleverTap.productConfig().isInitialized();
            sendPluginResult(callbackContext, Status.OK, value);
        });
    }

    private void setDefaultsMap(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final HashMap<String, Object> defaultValue = toMap(arguments.getJSONObject(0));
            cordova.getThreadPool().execute(() -> {
                cleverTap.productConfig().setDefaults(defaultValue);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void fetch(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.productConfig().fetch();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void fetchWithMinimumFetchIntervalInSeconds(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            long interval = arguments.getInt(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.productConfig().fetch(interval);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void activate(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.productConfig().activate();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void fetchAndActivate(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.productConfig().fetchAndActivate();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void setMinimumFetchIntervalInSeconds(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            long interval = arguments.getInt(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.productConfig().setMinimumFetchIntervalInSeconds(interval);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void getLastFetchTimeStampInMillis(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            long value = cleverTap.productConfig().getLastFetchTimeStampInMillis();
            sendPluginResult(callbackContext, Status.OK, value);
        });
    }

    private void getString(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                String value = cleverTap.productConfig().getString(key);
                sendPluginResult(callbackContext, Status.OK, value);
            });
        });
    }

    private void getBoolean(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                boolean value = cleverTap.productConfig().getBoolean(key);
                sendPluginResult(callbackContext, Status.OK, value);
            });
        });
    }

    private void getLong(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                long value = cleverTap.productConfig().getLong(key);
                sendPluginResult(callbackContext, Status.OK, value);
            });
        });
    }

    private void getDouble(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String key = arguments.getString(0);
            cordova.getThreadPool().execute(() -> {
                float value = cleverTap.productConfig().getDouble(key).floatValue();
                sendPluginResult(callbackContext, Status.OK, value);
            });
        });
    }

    private void reset(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.productConfig().reset();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void suspendInAppNotifications(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.suspendInAppNotifications();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void discardInAppNotifications(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.discardInAppNotifications();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void resumeInAppNotifications(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.resumeInAppNotifications();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void promptPushPrimer(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {

            final JSONObject pushPrimerJsonObject = processPushPrimerArgument(arguments.getJSONObject(0));
            if (pushPrimerJsonObject != null) {
                cordova.getThreadPool().execute(() -> {
                    cleverTap.promptPushPrimer(pushPrimerJsonObject);
                    sendPluginResult(callbackContext, Status.NO_RESULT);
                });
            }
        });
    }


    private void promptForPushPermission(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final boolean showFallbackSettings = arguments.getBoolean(0);
            cordova.getThreadPool().execute(() -> {
                cleverTap.promptForPushPermission(showFallbackSettings);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void isPushPermissionGranted(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            boolean value = cleverTap.isPushPermissionGranted();
            sendPluginResult(callbackContext, Status.OK, value);
        });
    }

    private void setLibrary(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String libName = arguments.getString(0);
            int libVersion = arguments.getInt(1);

            cordova.getThreadPool().execute(() -> {
                cleverTap.setCustomSdkVersion(libName, libVersion);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void syncVariables(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.syncVariables();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void syncVariablesInProd(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            Log.d(LOG_TAG, "syncVariablesinProd is no-op in Android");
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void fetchVariables(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.fetchVariables(isSuccess -> sendPluginResult(callbackContext, Status.OK, isSuccess)));
    }

    private void defineVariables(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final Map<String, Object> variablesMap = toMap(arguments.getJSONObject(0));

            cordova.getThreadPool().execute(() -> {
                for (Map.Entry<String, Object> entry : variablesMap.entrySet()) {
                    variables.put(entry.getKey(), cleverTap.defineVariable(entry.getKey(), entry.getValue()));
                }
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void defineFileVariable(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String fileVariable = arguments.getString(0);

            cordova.getThreadPool().execute(() -> {
                variables.put(fileVariable, cleverTap.defineFileVariable(fileVariable));
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void getVariable(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String variableName = arguments.getString(0);

            cordova.getThreadPool().execute(() -> {
                try {
                    Object value = getVariableValue(variableName);
                    sendPluginResult(callbackContext, Status.OK, value);
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void getVariables(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            JSONObject jsonVariables = getVariablesAsJson();
            sendPluginResult(callbackContext, Status.OK, jsonVariables);
        });
    }

    private void onVariablesChanged(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.addVariablesChangedCallback(new VariablesChangedCallback() {
            @Override
            public void variablesChanged() {
                JSONObject jsonVariables = getVariablesAsJson();
                sendPluginResult(callbackContext, Status.OK,jsonVariables);
            }
        }));
    }

    private void onOneTimeVariablesChanged(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.addOneTimeVariablesChangedCallback(new VariablesChangedCallback() {
            @Override
            public void variablesChanged() {
                JSONObject jsonVariables = getVariablesAsJson();
                sendPluginResult(callbackContext, Status.OK, jsonVariables);
            }
        }));
    }

    private void onValueChanged(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String variableName = arguments.getString(0);

            cordova.getThreadPool().execute(() -> {
                try {
                    if (variables.containsKey(variableName)) {
                        Var<Object> variable = (Var<Object>) variables.get(variableName);
                        variable.addValueChangedCallback(new VariableCallback<Object>() {
                            @Override
                            public void onValueChanged(final Var<Object> variable) {
                                Object value = getVariableValue(variableName);
                                sendPluginResult(callbackContext, Status.OK, value);
                            }
                        });
                    }
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void onFileValueChanged(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String variableName = arguments.getString(0);

            cordova.getThreadPool().execute(() -> {
                try {
                    if (variables.containsKey(variableName)) {
                        Var<Object> variable = (Var<Object>) variables.get(variableName);
                        variable.addFileReadyHandler(new VariableCallback<Object>() {
                            @Override
                            public void onValueChanged(final Var<Object> variable) {
                                Object value = getVariableValue(variableName);
                                sendPluginResult(callbackContext, Status.OK, value);
                            }
                        });
                    }
                } catch (Exception e) {
                    sendPluginResult(callbackContext, Status.ERROR, e.getLocalizedMessage());
                }
            });
        });
    }

    private void onVariablesChangedAndNoDownloadsPending(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.onVariablesChangedAndNoDownloadsPending(new VariablesChangedCallback() {
            @Override
            public void variablesChanged() {
                JSONObject jsonVariables = getVariablesAsJson();
                sendPluginResult(callbackContext, Status.OK, jsonVariables);
            }
        }));
    }

    private void onceVariablesChangedAndNoDownloadsPending(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.onceVariablesChangedAndNoDownloadsPending(new VariablesChangedCallback() {
            @Override
            public void variablesChanged() {
                JSONObject jsonVariables = getVariablesAsJson();
                sendPluginResult(callbackContext, Status.OK, jsonVariables);
            }
        }));
    }

    private void setLocale(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            String locale = arguments.getString(0);

            cordova.getThreadPool().execute(() -> {
                cleverTap.setLocale(locale);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void clearInAppResources(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            boolean expiredOnly = arguments.getBoolean(0);

            cordova.getThreadPool().execute(() -> {
                cleverTap.clearInAppResources(expiredOnly);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void clearFileResources(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            boolean expiredOnly = arguments.getBoolean(0);

            cordova.getThreadPool().execute(() -> {
                cleverTap.clearFileResources(expiredOnly);
                sendPluginResult(callbackContext, Status.NO_RESULT);
            });
        });
    }

    private void fetchInApps(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> cleverTap.fetchInApps(isSuccess -> sendPluginResult(callbackContext, Status.OK, isSuccess)));
    }


    private void syncCustomTemplates(CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            cleverTap.syncRegisteredInAppTemplates();
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    }

    private void customTemplateSetDismissed(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String templateName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> resolveWithTemplateContext(templateName, callbackContext, false, templateContext -> {
                templateContext.setDismissed();
                return null;
            }));
        });
    }

    private void customTemplateSetPresented(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String templateName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> resolveWithTemplateContext(templateName, callbackContext, false, templateContext -> {
                templateContext.setPresented();
                return null;
            }));
        });
    }

    private void customTemplateRunAction(JSONArray args, CallbackContext callbackContext) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String templateName = arguments.getString(0);
            final String argName = arguments.getString(1);
            cordova.getThreadPool().execute(() -> resolveWithTemplateContext(templateName, callbackContext, false, customTemplateContext -> {
                if (customTemplateContext instanceof CustomTemplateContext.TemplateContext) {
                    ((CustomTemplateContext.TemplateContext) customTemplateContext).triggerActionArgument(argName, null);
                }
                return null;
            }));
        });
    }

    private void executeCustomTemplateGetArg(CallbackContext callbackContext, JSONArray args, String type) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String templateName = arguments.getString(0);
            final String argName = arguments.getString(1);
            cordova.getThreadPool().execute(() -> resolveWithTemplateContext(templateName, callbackContext, true, templateContext -> {
                switch (type) {
                    case "String":
                        return templateContext.getString(argName);
                    case "Number":
                        return templateContext.getDouble(argName);
                    case "Boolean":
                        return templateContext.getBoolean(argName);
                    case "File":
                        return templateContext.getFile(argName);
                    case "Object":
                        Map<String, Object> mapArg = templateContext.getMap(argName);
                        JSONObject result = null;
                        if (mapArg != null)
                            result = new JSONObject(mapArg);
                        return result;
                    default:
                        return null;
                }
            }));
        });
    }

    private void executeCustomTemplateToString(CallbackContext callbackContext, JSONArray args) {
        executeWithArgs(args, callbackContext, (arguments) -> {
            final String templateName = arguments.getString(0);
            cordova.getThreadPool().execute(() -> resolveWithTemplateContext(templateName, callbackContext, true, templateContext -> {
                String result = templateContext.toString();
                sendPluginResult(callbackContext, Status.OK, result);
                return null;
            }));
        });
    }




    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
        CleverTapFunction event = CleverTapFunction.fromString(action);
        Log.d(LOG_TAG, "handling action " + action);

        if (!checkCleverTapInitialized()) {
            sendPluginResult(callbackContext, Status.ERROR, "CleverTap API not initialized");
            return true;
        }

        switch (event) {
            case NOTIFY_DEVICE_READY:
                notifyDeviceReady(callbackContext);
                return true;
            case REGISTER_PUSH:
                sendPluginResult(callbackContext, Status.NO_RESULT);
                return true;
            case SET_PUSH_TOKEN:
                setPushToken(args, callbackContext);
                return true;
            case SET_PUSH_BAIDU_TOKEN:
                setPushBaiduToken(args, callbackContext);
                return true;
            case SET_PUSH_HUAWEI_TOKEN:
                setPushHuaweiToken(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION:
                createNotification(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION_CHANNEL:
                createNotificationChannel(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION_CHANNEL_WITH_SOUND:
                createNotificationChannelWithSound(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION_CHANNEL_WITH_GROUP_ID:
                createNotificationChannelWithGroupId(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION_CHANNEL_WITH_GROUP_ID_AND_SOUND:
                createNotificationChannelWithGroupIdAndSound(args, callbackContext);
                return true;
            case CREATE_NOTIFICATION_CHANNEL_GROUP:
                createNotificationChannelGroup(args, callbackContext);
                return true;
            case DELETE_NOTIFICATION_CHANNEL:
                deleteNotificationChannel(args, callbackContext);
                return true;
            case DELETE_NOTIFICATION_CHANNEL_GROUP:
                deleteNotificationChannelGroup(args, callbackContext);
                return true;
            case RECORD_SCREEN_VIEW:
                recordScreenView(args, callbackContext);
                return true;
            case SET_DEBUG_LEVEL:
                setDebugLevel(args, callbackContext);
                return true;
            case SET_OPT_OUT:
                setOptOut(args, callbackContext);
                return true;
            case SET_OFFLINE:
                setOffline(args, callbackContext);
                return true;
            case ENABLE_DEVICE_NETWORK_INFO_REPORTING:
                enableDeviceNetworkInfoReporting(args, callbackContext);
                return true;
            case ENABLE_PERSONALIZATION:
                enablePersonalization(callbackContext);
                return true;
            case DISABLE_PERSONALIZATION:
                disablePersonalization(callbackContext);
                return true;

            case RECORD_EVENT_WITH_NAME:
                recordEventWithName(args, callbackContext);
                return true;

            case RECORD_EVENT_WITH_NAME_AND_PROPS:
                recordEventWithNameAndProps(args, callbackContext);
                return true;

            case RECORD_CHARGED_EVENT_WITH_DETAILS_AND_ITEMS:
                recordChargedEventWithDetailsAndItems(args, callbackContext);
                return true;

            case PUSH_INSTALL_REFERRER:
                pushInstallReferrer(args, callbackContext);
                return true;

            case EVENT_GET_FIRST_TIME:
                eventGetFirstTime(args, callbackContext);
                return true;

            case EVENT_GET_LAST_TIME:
                eventGetLastTime(args, callbackContext);
                return true;

            case EVENT_GET_OCCURRENCES:
                eventGetOccurrences(args, callbackContext);
                return true;

            case EVENT_GET_DETAILS:
                eventGetDetails(args, callbackContext);
                return true;

            case GET_EVENT_HISTORY:
                getEventHistory(callbackContext);
                return true;

            case GET_USER_EVENT_LOG:
                getUserEventLog(args, callbackContext);
                return true;

            case GET_USER_EVENT_LOG_COUNT:
                getUserEventLogCount(args, callbackContext);
                return true;

            case GET_USER_LAST_VISIT_TS:
                getUserLastVisitTs(callbackContext);
                return true;

            case GET_USER_APP_LAUNCH_COUNT:
                getUserAppLaunchCount(callbackContext);
                return true;

            case GET_USER_EVENT_LOG_HISTORY:
                getUserEventLogHistory(callbackContext);
                return true;

            case SET_LOCATION:
                setLocation(args, callbackContext);
                return true;

            case GET_LOCATION:
                getLocation(callbackContext);
                return true;

            case PROFILE_SET:
                profileSet(args, callbackContext);
                return true;

            case ON_USER_LOGIN:
                onUserLogin(args, callbackContext);
                return true;

            case PROFILE_GET_PROPERTY:
                profileGetProperty(args, callbackContext);
                return true;

            case PROFILE_GET_CLEVERTAP_ID:
                profileGetCleverTapID(callbackContext);
                return true;

            case PROFILE_GET_CLEVERTAP_ATTRIBUTION_IDENTIFIER:
                profileGetCleverTapAttributionIdentifier(callbackContext);
                return true;

            case GET_CLEVERTAP_ID:
                getCleverTapID(callbackContext);
                return true;

            case PROFILE_REMOVE_VALUE_FOR_KEY:
                profileRemoveValueForKey(args, callbackContext);
                return true;

            case PROFILE_SET_MULTI_VALUES:
                profileSetMultiValues(args, callbackContext);
                return true;

            case PROFILE_ADD_MULTI_VALUES:
                profileAddMultiValues(args, callbackContext);
                return true;
            case PROFILE_REMOVE_MULTI_VALUES:
                profileRemoveMultiValues(args, callbackContext);
                return true;
            case PROFILE_ADD_MULTI_VALUE:
                profileAddMultiValue(args, callbackContext);
                return true;
            case PROFILE_REMOVE_MULTI_VALUE:
                profileRemoveMultiValue(args, callbackContext);
                return true;
            case PROFILE_INCREMENT_VALUE_BY:
                profileIncrementValueBy(args, callbackContext);
                return true;
            case PROFILE_DECREMENT_VALUE_BY:
                profileDecrementValueBy(args, callbackContext);
                return true;
            case SESSION_GET_TIME_ELAPSED:
                sessionGetTimeElapsed(callbackContext);
                return true;
            case SESSION_GET_TOTAL_VISITS:
                sessionGetTotalVisits(callbackContext);
                return true;
            case SESSION_GET_SCREEN_COUNT:
                sessionGetScreenCount(callbackContext);
                return true;
            case SESSION_GET_PREVIOUS_VISIT_TIME:
                sessionGetPreviousVisitTime(callbackContext);
                return true;
            case SESSION_GET_UTM_DETAILS:
                sessionGetUTMDetails(callbackContext);
                return true;
            case INITIALIZE_INBOX:
                initializeInbox(callbackContext);
                return true;
            case SHOW_INBOX:
                showInbox(args, callbackContext);
                return true;
            case GET_INBOX_MESSAGE_UNREAD_COUNT:
                getInboxMessageUnreadCount(callbackContext);
                return true;
            case GET_INBOX_MESSAGE_COUNT:
                getInboxMessageCount(callbackContext);
                return true;
            case GET_ALL_INBOX_MESSAGES:
                getAllInboxMessages(callbackContext);
                return true;
            case GET_UNREAD_INBOX_MESSAGES:
                getUnreadInboxMessages(callbackContext);
                return true;
            case GET_INBOX_MESSAGE_FOR_ID:
                getInboxMessageForId(args, callbackContext);
                return true;
            case DELETE_INBOX_MESSAGE_FOR_ID:
                deleteInboxMessageForId(args, callbackContext);
                return true;
            case MARK_READ_INBOX_MESSAGE_FOR_ID:
                markReadInboxMessageForId(args, callbackContext);
                return true;
            case MARK_READ_INBOX_MESSAGES_FOR_IDS:
                markReadInboxMessagesForIds(args, callbackContext);
                return true;
            case DELETE_INBOX_MESSAGES_FOR_IDS:
                deleteInboxMessagesForIds(args, callbackContext);
                return true;
            case DISMISS_INBOX:
                dismissInbox(callbackContext);
                return true;
            case PUSH_INBOX_NOTIFICATION_VIEWED_EVENT_FOR_ID:
                pushInboxNotificationViewedEventForId(args, callbackContext);
                return true;
            case PUSH_INBOX_NOTIFICATION_CLICKED_EVENT_FOR_ID:
                pushInboxNotificationClickedEventForId(args, callbackContext);
                return true;
            case GET_ALL_DISPLAY_UNITS:
                getAllDisplayUnits(callbackContext);
                return true;
            case GET_DISPLAY_UNIT_FOR_ID:
                getDisplayUnitForId(args, callbackContext);
                return true;
            case PUSH_DISPLAY_UNIT_VIEWED_EVENT_FOR_ID:
                pushDisplayUnitViewedEventForId(args, callbackContext);
                return true;
            case PUSH_DISPLAY_UNIT_CLICKED_EVENT_FOR_ID:
                pushDisplayUnitClickedEventForId(args, callbackContext);
                return true;
            case IS_FEATURE_FLAG_INITIALIZED:
                isFeatureFlagInitialized(callbackContext);
                return true;
            case GET_FEATURE_FLAG:
                getFeatureFlag(args, callbackContext);
                return true;
            case IS_PRODUCT_CONFIG_INITIALIZED:
                isProductConfigInitialized(callbackContext);
                return true;
            case SET_DEFAULTS_MAP:
                setDefaultsMap(args, callbackContext);
                return true;
            case FETCH:
                fetch(callbackContext);
                return true;
            case FETCH_WITH_MINIMUM_FETCH_INTERVAL_IN_SECONDS:
                fetchWithMinimumFetchIntervalInSeconds(args, callbackContext);
                return true;
            case ACTIVATE:
                activate(callbackContext);
                return true;
            case FETCH_AND_ACTIVATE:
                fetchAndActivate(callbackContext);
                return true;
            case SET_MINIMUM_FETCH_INTERVAL_IN_SECONDS:
                setMinimumFetchIntervalInSeconds(args, callbackContext);
                return true;
            case GET_LAST_FETCH_TIMESTAMP_IN_MILLIS:
                getLastFetchTimeStampInMillis(callbackContext);
                return true;
            case GET_STRING:
                getString(args, callbackContext);
                return true;
            case GET_BOOLEAN:
                getBoolean(args, callbackContext);
                return true;
            case GET_LONG:
                getLong(args, callbackContext);
                return true;
            case GET_DOUBLE:
                getDouble(args, callbackContext);
                return true;
            case RESET:
                reset(callbackContext);
                return true;
            case SUSPEND_IN_APP_NOTIFICATIONS:
                suspendInAppNotifications(callbackContext);
                return true;
            case DISCARD_IN_APP_NOTIFICATIONS:
                discardInAppNotifications(callbackContext);
                return true;
            case RESUME_IN_APP_NOTIFICATIONS:
                resumeInAppNotifications(callbackContext);
                return true;
            case PROMPT_PUSH_PRIMER:
                promptPushPrimer(args, callbackContext);
                return true;
            case PROMPT_FOR_PUSH_PERMISSION:
                promptForPushPermission(args, callbackContext);
                return true;
            case IS_PUSH_PERMISSION_GRANTED:
                isPushPermissionGranted(callbackContext);
                return true;
            case SET_LIBRARY:
                setLibrary(args, callbackContext);
                return true;
            case SYNC_VARIABLES:
                syncVariables(callbackContext);
                return true;
            case SYNC_VARIABLES_IN_PROD:
                syncVariablesInProd(callbackContext);
                return true;
            case FETCH_VARIABLES:
                fetchVariables(callbackContext);
                return true;
            case DEFINE_VARIABLES:
                defineVariables(args, callbackContext);
                return true;
            case DEFINE_FILE_VARIABLE:
                defineFileVariable(args, callbackContext);
                return true;
            case GET_VARIABLE:
                getVariable(args, callbackContext);
                return true;
            case GET_VARIABLES:
                getVariables(callbackContext);
                return true;
            case ON_VARIABLES_CHANGED:
                onVariablesChanged(callbackContext);
                return true;
            case ON_ONE_TIME_VARIABLES_CHANGED:
                onOneTimeVariablesChanged(callbackContext);
                return true;
            case ON_VALUE_CHANGED:
                onValueChanged(args, callbackContext);
                return true;
            case ON_FILE_VALUE_CHANGED:
                onFileValueChanged(args, callbackContext);
                return true;
            case ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING:
                onVariablesChangedAndNoDownloadsPending(callbackContext);
                return true;
            case ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING:
                onceVariablesChangedAndNoDownloadsPending(callbackContext);
                return true;
            case SET_LOCALE:
                setLocale(args, callbackContext);
                return true;
            case CLEAR_IN_APP_RESOURCES:
                clearInAppResources(args, callbackContext);
                return true;
            case CLEAR_FILE_RESOURCES:
                clearFileResources(args, callbackContext);
                return true;
            case FETCH_IN_APPS:
                fetchInApps(callbackContext);
                return true;
            case SYNC_CUSTOM_TEMPLATES:
            case SYNC_CUSTOM_TEMPLATES_IN_PROD:
                syncCustomTemplates(callbackContext);
                return true;
            case CUSTOM_TEMPLATE_SET_DISMISSED:
                customTemplateSetDismissed(args, callbackContext);
                return true;
            case CUSTOM_TEMPLATE_SET_PRESENTED:
                customTemplateSetPresented(args, callbackContext);
                return true;
            case CUSTOM_TEMPLATE_RUN_ACTION:
                customTemplateRunAction(args, callbackContext);
                return true;
            case CUSTOM_TEMPLATE_GET_STRING_ARG: {
                executeCustomTemplateGetArg(callbackContext, args, "string");
                return true;
            }
            case CUSTOM_TEMPLATE_GET_NUMBER_ARG: {
                executeCustomTemplateGetArg(callbackContext, args, "number");
                return true;
            }
            case CUSTOM_TEMPLATE_GET_BOOLEAN_ARG: {
                executeCustomTemplateGetArg(callbackContext, args, "boolean");
                return true;
            }
            case CUSTOM_TEMPLATE_GET_FILE_ARG: {
                executeCustomTemplateGetArg(callbackContext, args, "file");
                return true;
            }
            case CUSTOM_TEMPLATE_GET_OBJECT_ARG: {
                executeCustomTemplateGetArg(callbackContext, args, "object");
                return true;
            }
            case CUSTOM_TEMPLATE_CONTEXT_TO_STRING: {
                executeCustomTemplateToString(callbackContext, args);
                return true;
            }
            default: {
                sendPluginResult(callbackContext, Status.ERROR, "unhandled CleverTapPlugin action");
            }
        }

        return true;
    }

    @NonNull
    private JSONObject getVariablesAsJson() {
        JSONObject jsonVariables = new JSONObject();
        for (String key : variables.keySet()) {
            try {
                jsonVariables.put(key,getVariableValue(key));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return jsonVariables;
    }

    private void sendCustomTemplateArgResult(CallbackContext callbackContext, Object arg) {
        if(arg != null)
            sendPluginResult(callbackContext, Status.OK, arg);
        else
            sendPluginResult(callbackContext, Status.ERROR,  "Argument not found");
    }

    @NonNull
    private PluginResult getPluginResult(final Status status, final Object value) {
        PluginResult result;
        if (value instanceof Boolean) {
            result  = new PluginResult(status, (Boolean) value);
        } else if (value instanceof Double) {
            result  = new PluginResult(status, ((Double) value).floatValue());
        } else if (value instanceof Float) {
            result  = new PluginResult(status, (Float) value);
        } else if (value instanceof Integer) {
            result  = new PluginResult(status, (Integer) value);
        } else if (value instanceof Long) {
            result  = new PluginResult(status, ((Long) value).intValue());
        } else if (value instanceof String) {
            result  = new PluginResult(status, (String) value);
        } else if (value instanceof JSONObject) {
            result  = new PluginResult(status, (JSONObject) value);
        } else if(value instanceof JSONArray) {
            result  = new PluginResult(status, (JSONArray) value);
        } else {
            result  = new PluginResult(Status.ERROR, "unknown value type");
        }

        return result;
    }

    //DisplayUnitListener

    public void onDisplayUnitsLoaded(ArrayList<CleverTapDisplayUnit> units) {

        try {
            final JSONArray unitsArray = displayUnitListToJSONArray(units);

            Map<String, Object> result = new HashMap<>();
            result.put("units", unitsArray);

            CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_DISPLAY_UNITS_LOADED, result);

        } catch (JSONException e) {
            Log.d(LOG_TAG, "JSONException in onDisplayUnitsLoaded" + e);
        }

    }

    //CTInboxListener

    public void inboxDidInitialize() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_INBOX_DID_INITIALIZE);
    }

    public void inboxMessagesDidUpdate() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_INBOX_MESSAGES_DID_UPDATE);
    }


    // InAppNotificationListener

    public boolean beforeShow(Map<String, Object> var1) {
        return true;
    }

    public void onDismissed(Map<String, Object> var1, Map<String, Object> var2) {
        if (var1 == null && var2 == null) {
            return;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("extras", var1 != null ? new JSONObject(var1) : new JSONObject());
        result.put("actionExtras", var2 != null ? new JSONObject(var2) : new JSONObject());

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED, result);
    }

    @Override
    public void onPushPermissionResponse(final boolean accepted) {
        Map<String, Object> result = new HashMap<>();
        result.put("accepted", accepted);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PUSH_PERMISSION_RESPONSE_RECEIVED, result);
    }

    // SyncListener
    public void profileDataUpdated(JSONObject updates) {

        if (updates == null) {
            return;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("updates", updates);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PROFILE_SYNC, result);
    }

    public void profileDidInitialize(String CleverTapID) {

        if (CleverTapID == null) {
            return;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("CleverTapID", CleverTapID);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PROFILE_DID_INITIALIZE, result);
    }

    //Inbox/InApp Button Click Listeners

    public void onInboxButtonClick(HashMap<String, String> payload) {
        JSONObject jsonPayload = new JSONObject(payload);

        Map<String, Object> result = new HashMap<>();
        result.put("customExtras", jsonPayload);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_INBOX_BUTTON_CLICK, result);
    }

    @Override
    public void onShow(CTInAppNotification inAppNotification) {
        if(inAppNotification != null &&  inAppNotification.getJsonDescription() != null){
            //Read the values
            Map<String, Object> result = new HashMap<>();
            result.put("customExtras", inAppNotification.getJsonDescription());
            CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_IN_APP_NOTIFICATION_SHOW, result);
        }
    }

    public void onInboxItemClicked(CTInboxMessage message, int contentPageIndex, int buttonIndex){
        if(message != null &&  message.getData() != null){
            //Read the values
            Map<String, Object> result = new HashMap<>();
            result.put("data", message.getData());
            result.put("contentPageIndex", contentPageIndex);
            result.put("buttonIndex", buttonIndex);

            webView.getView().post(() -> CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_INBOX_ITEM_CLICK, result));
        }
    }

    //InApp Notification callback
    public void onInAppButtonClick(HashMap<String, String> hashMap) {
        JSONObject jsonPayload = new JSONObject(hashMap);

        Map<String, Object> result = new HashMap<>();
        result.put("customExtras", jsonPayload);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_IN_APP_BUTTON_CLICK, result);
    }

    //Feature Flag Listener
    public void featureFlagsUpdated() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_FEATURE_FLAGS_DID_UPDATE);
    }

    //Product Config Listener
    public void onInit() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE);
    }

    public void onFetched() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PRODUCT_CONFIG_DID_FETCH);
    }

    public void onActivated() {
        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE);
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
            return toMap(jsonProfile);
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
        HashMap<String, Object> map = new HashMap<>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, fromJson(object.get(key)));
        }
        return map;
    }

    private static ArrayList<HashMap<String, Object>> toArrayListOfStringObjectMaps(JSONArray array) throws JSONException {
        ArrayList<HashMap<String, Object>> aList = new ArrayList<>();

        for (int i = 0; i < array.length(); i++) {
            aList.add(toMap((JSONObject) array.get(i)));
        }

        return aList;
    }

    @Deprecated
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

    private static JSONObject eventLogToJSON(UserEventLog eventLog) throws JSONException {
        JSONObject json = new JSONObject();
        if (eventLog != null) {
            json.put("eventName", eventLog.getEventName());
            json.put("normalizedEventName", eventLog.getNormalizedEventName());
            json.put("firstTime", eventLog.getFirstTs());
            json.put("lastTime", eventLog.getLastTs());
            json.put("count", eventLog.getCountOfEvents());
            json.put("deviceID", eventLog.getDeviceID());
        }
        return json;
    }


    private static JSONObject eventLogHistoryToJSON(Map<String, UserEventLog> history) throws JSONException {
        JSONObject json = new JSONObject();
        if (history == null || history.isEmpty()) {
            return json;
        }
        for (Map.Entry<String, UserEventLog> entry : history.entrySet()) {
            if (entry.getValue() != null) {
                json.put(entry.getKey(), eventLogToJSON(entry.getValue()));
            }
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

    @Deprecated
    private static JSONObject eventHistoryToJSON(Map<String, EventDetail> history) throws JSONException {

        JSONObject json = new JSONObject();

        if (history != null) {
            for (Object key : history.keySet()) {
                json.put(key.toString(), eventDetailsToJSON(history.get((String) key)));
            }
        }

        return json;
    }


    private List<String> toStringList(JSONArray array) throws JSONException {
        ArrayList<String> list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getString(i));
        }
        return list;
    }

    private Object getVariableValue(String name) {
        if (variables.containsKey(name)) {
            Var<?> variable = (Var<?>) variables.get(name);
            Object variableValue = variable.value();
            Object value;
            if (CTVariableUtils.DICTIONARY.equals(variable.kind())) {
                value = new JSONObject((Map<String, Object>) variableValue);
            } else {
                value = variableValue;
            }
            return value;
        }
        throw new IllegalArgumentException(
                "Variable name = " + name + " does not exist. Make sure you set variable first.");
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

        Map<String, Object> result = new HashMap<>();
        result.put("customExtras", jsonPayload);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PUSH_NOTIFICATION_TAPPED_WITH_CUSTOM_EXTRAS, result);
        callbackDone = true;
    }

    public void onPushAmpPayloadReceived(Bundle extras) {
        JSONObject jsonPayload = toJson(extras);

        Map<String, Object> result = new HashMap<>();
        result.put("customExtras", jsonPayload);

        CleverTapEventEmitter.sendEvent(CleverTapEvent.ON_CLEVERTAP_PUSH_AMP_PAYLOAD_DID_RECEIVE, result);
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

    private boolean isDeepLinkValid(Uri data) {
        String link = Uri.decode(data.toString());
        String patternString = "[{}\\[\\]()\"';]|javascript";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(link);
        return !matcher.find();
    }

    private JSONObject processPushPrimerArgument(JSONObject jsonObject) {
        CTLocalInApp.InAppType inAppType = null;
        String titleText = null, messageText = null, positiveBtnText = null, negativeBtnText = null,
                backgroundColor = null, btnBorderColor = null, titleTextColor = null, messageTextColor = null,
                btnTextColor = null, imageUrl = null, btnBackgroundColor = null, btnBorderRadius = null;
        boolean fallbackToSettings = false, followDeviceOrientation = false;

        final Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            try {
                final String configKey = iterator.next();
                switch (configKey) {
                    case "inAppType":
                        inAppType = inAppTypeFromString(jsonObject.getString(configKey));
                        break;
                    case "titleText":
                        titleText = jsonObject.getString(configKey);
                        break;
                    case "messageText":
                        messageText = jsonObject.getString(configKey);
                        break;
                    case "followDeviceOrientation":
                        followDeviceOrientation = jsonObject.getBoolean(configKey);
                        break;
                    case "positiveBtnText":
                        positiveBtnText = jsonObject.getString(configKey);
                        break;
                    case "negativeBtnText":
                        negativeBtnText = jsonObject.getString(configKey);
                        break;
                    case "fallbackToSettings":
                        fallbackToSettings = jsonObject.getBoolean(configKey);
                        break;
                    case "backgroundColor":
                        backgroundColor = jsonObject.getString(configKey);
                        break;
                    case "btnBorderColor":
                        btnBorderColor = jsonObject.getString(configKey);
                        break;
                    case "titleTextColor":
                        titleTextColor = jsonObject.getString(configKey);
                        break;
                    case "messageTextColor":
                        messageTextColor = jsonObject.getString(configKey);
                        break;
                    case "btnTextColor":
                        btnTextColor = jsonObject.getString(configKey);
                        break;
                    case "imageUrl":
                        imageUrl = jsonObject.getString(configKey);
                        break;
                    case "btnBackgroundColor":
                        btnBackgroundColor = jsonObject.getString(configKey);
                        break;
                    case "btnBorderRadius":
                        btnBorderRadius = jsonObject.getString(configKey);
                        break;
                }
            } catch (Throwable t) {
                Log.e(LOG_TAG, "invalid parameters in push primer config" + t.getLocalizedMessage());
                return null;
            }
        }

        //creates the builder instance of localInApp with all the required parameters
        CTLocalInApp.Builder.Builder6 builderWithRequiredParams = getLocalInAppBuilderWithRequiredParam(
                inAppType, titleText, messageText, followDeviceOrientation, positiveBtnText, negativeBtnText
        );

        //adds the optional parameters to the builder instance
        if (backgroundColor != null) {
            builderWithRequiredParams.setBackgroundColor(backgroundColor);
        }
        if (btnBorderColor != null) {
            builderWithRequiredParams.setBtnBorderColor(btnBorderColor);
        }
        if (titleTextColor != null) {
            builderWithRequiredParams.setTitleTextColor(titleTextColor);
        }
        if (messageTextColor != null) {
            builderWithRequiredParams.setMessageTextColor(messageTextColor);
        }
        if (btnTextColor != null) {
            builderWithRequiredParams.setBtnTextColor(btnTextColor);
        }
        if (imageUrl != null) {
            builderWithRequiredParams.setImageUrl(imageUrl);
        }
        if (btnBackgroundColor != null) {
            builderWithRequiredParams.setBtnBackgroundColor(btnBackgroundColor);
        }
        if (btnBorderRadius != null) {
            builderWithRequiredParams.setBtnBorderRadius(btnBorderRadius);
        }
        builderWithRequiredParams.setFallbackToSettings(fallbackToSettings);

        JSONObject localInAppConfig = builderWithRequiredParams.build();
        Log.i(LOG_TAG, "LocalInAppConfig for push primer prompt: " + localInAppConfig);
        return localInAppConfig;


    }

    /**
     * Creates an instance of the {@link CTLocalInApp.Builder.Builder6} with the required parameters.
     *
     * @return the {@link CTLocalInApp.Builder.Builder6} instance
     */
    private CTLocalInApp.Builder.Builder6 getLocalInAppBuilderWithRequiredParam(CTLocalInApp.InAppType inAppType,
                                                                                String titleText,
                                                                                String messageText,
                                                                                boolean followDeviceOrientation,
                                                                                String positiveBtnText,
                                                                                String negativeBtnText) {
        //throws exception if any of the required parameter is missing
        if (inAppType == null || titleText == null || messageText == null || positiveBtnText == null
                || negativeBtnText == null) {
            throw new IllegalArgumentException("mandatory parameters are missing in push primer config");
        }

        CTLocalInApp.Builder builder = CTLocalInApp.builder();

        return builder.setInAppType(inAppType)
                .setTitleText(titleText)
                .setMessageText(messageText)
                .followDeviceOrientation(followDeviceOrientation)
                .setPositiveBtnText(positiveBtnText)
                .setNegativeBtnText(negativeBtnText);
    }

    //returns InAppType type from the given string
    private CTLocalInApp.InAppType inAppTypeFromString(String inAppType) {
        if (inAppType == null) {
            return null;
        }
        switch (inAppType) {
            case "half-interstitial":
                return CTLocalInApp.InAppType.HALF_INTERSTITIAL;
            case "alert":
                return CTLocalInApp.InAppType.ALERT;
            default:
                return null;
        }
    }


    private void resolveWithTemplateContext(
            String templateName,
            final CallbackContext callbackContext,
            boolean hasResultValue,
            TemplateContextAction action) {

        CustomTemplateContext templateContext = cleverTap.getActiveContextForTemplate(templateName);
        if (templateContext == null) {
            sendPluginResult(callbackContext, Status.ERROR, "Custom template: " + templateName + " is not currently being presented");
            return;
        }
        Object result = action.execute(templateContext);

        if (hasResultValue) {
            sendCustomTemplateArgResult(callbackContext, result);
        } else {
            sendPluginResult(callbackContext, Status.OK);
        }
    }

    private void sendPluginResult(CallbackContext callbackContext, PluginResult.Status status) {
        PluginResult pluginResult = new PluginResult(status);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    private void sendPluginResult(CallbackContext callbackContext, PluginResult.Status status, Object result) {
        PluginResult pluginResult = getPluginResult(status, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    @FunctionalInterface
    private interface TemplateContextAction {
        Object execute(CustomTemplateContext context);
    }
}