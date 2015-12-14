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
import java.util.Locale;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ArrayList;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.SyncListener;
import com.clevertap.android.sdk.EventDetail;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.exceptions.CleverTapMetaDataNotFoundException;
import com.clevertap.android.sdk.exceptions.CleverTapPermissionsNotSatisfied;
import com.clevertap.android.sdk.exceptions.InvalidEventNameException;


public class CleverTapPlugin extends CordovaPlugin implements SyncListener {

    private static final String LOG_TAG = "CLEVERTAP_PLUGIN";
    private static String CLEVERTAP_API_ERROR;
    private static CleverTapAPI cleverTap;


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        try {
            cleverTap = CleverTapAPI.getInstance(cordova.getActivity().getApplicationContext());
            cleverTap.setSyncListener(this);
        } catch (CleverTapMetaDataNotFoundException e) {
            CLEVERTAP_API_ERROR = e.getLocalizedMessage();
            //Log.d(LOG_TAG, e.getLocalizedMessage());
        } catch (CleverTapPermissionsNotSatisfied e) {
            CLEVERTAP_API_ERROR = e.getLocalizedMessage();
            //Log.d(LOG_TAG, e.getLocalizedMessage());
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

        // not required for Android here but handle as its in the JS interface
        else if (action.equals("registerPush")) {
            result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);
            return true;
        }

        else if (action.equals("setDebugLevel")) {
            int level = (args.length() == 1 ? args.getInt(0) : -1);
            if (level >= 0) {
                CleverTapAPI.setDebugLevel(level);
                result = new PluginResult(PluginResult.Status.NO_RESULT);
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
                return true;
            }

        }

        else if (action.equals("enablePersonalization")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    cleverTap.enablePersonalization();
                    PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;

        }

        else if (action.equals("recordEventWithName")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.event.push(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        }

        else if (action.equals("recordEventWithNameAndProps")) {
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
                        cleverTap.event.push(_eventName, props);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        }

        else if (action.equals("recordChargedEventWithDetailsAndItems")) {
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
                        try {
                            cleverTap.event.push(CleverTapAPI.CHARGED_EVENT, details, items);
                            PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        } catch (InvalidEventNameException e) {
                            PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        }
                    }
                });
                return true;
            }
        }

        else if (action.equals("eventGetFirstTime")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        double first = cleverTap.event.getFirstTime(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, (float) first);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        }

        else if (action.equals("eventGetLastTime")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        double lastTime = cleverTap.event.getLastTime(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, (float) lastTime);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        }

        else if (action.equals("eventGetOccurrences")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        int num = cleverTap.event.getCount(eventName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, num);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "eventName cannot be null";
            }
        }

        else if (action.equals("eventGetDetails")) {
            final String eventName = (args.length() == 1 ? args.getString(0) : null);
            if (eventName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        EventDetail details = cleverTap.event.getDetails(eventName);
                        try {
                            JSONObject jsonDetails = CleverTapPlugin.eventDetailsToJSON(details);
                            PluginResult _result = new PluginResult(PluginResult.Status.OK, jsonDetails);
                            _result.setKeepCallback(true);
                            callbackContext.sendPluginResult(_result);
                        } catch (JSONException e ) {
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
        }

        else if (action.equals("getEventHistory")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Map<String, EventDetail> history = cleverTap.event.getHistory();
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
        }

        else if (action.equals("profileSet")) {
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
                            HashMap<String, Object> profile = toMap(_jsonProfile);
                            String dob = (String)profile.get("DOB");
                            if(dob != null) {
                                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
                                try {
                                    Date date = format.parse(dob);
                                    profile.put("DOB", date);
                                } catch (ParseException e) {
                                    profile.remove("DOB");
                                    Log.d(LOG_TAG, "invalid DOB format in profileSet");
                                }
                            }

                            cleverTap.profile.push(profile);

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
        }

        else if (action.equals("profileSetGraphUser")) {
            JSONObject jsonGraphUser = null;

            if (args.length() == 1) {
                if (!args.isNull(0)) {
                    jsonGraphUser = args.getJSONObject(0);
                } else {
                    haveError = true;
                    errorMsg = "profile cannot be null";
                }

            } else {
                haveError = true;
                errorMsg = "Expected 1 argument";
            }

            if (!haveError) {
                final JSONObject _jsonGraphUser = jsonGraphUser;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.profile.pushFacebookUser(_jsonGraphUser);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        }

        else if (action.equals("profileSetGooglePlusUser")) {
            JSONObject jsonGooglePlusUser;
            HashMap<String, Object> _profile = null;

            if (args.length() == 1) {
                if (!args.isNull(0)) {
                    jsonGooglePlusUser = args.getJSONObject(0);
                    try {
                        _profile = toMapFromGooglePlusUser(jsonGooglePlusUser);
                    } catch (JSONException e) {
                        haveError = true;
                        errorMsg = "Error parsing arg " + e.getLocalizedMessage();
                    }
                } else {
                    haveError = true;
                    errorMsg = "profile cannot be null";
                }

            } else {
                haveError = true;
                errorMsg = "Expected 1 argument";
            }

            if (!haveError) {
                final HashMap<String, Object> profile = _profile;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        cleverTap.profile.push(profile);
                        PluginResult _result = new PluginResult(PluginResult.Status.NO_RESULT);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;
            }
        }

        else if (action.equals("profileGetProperty")) {
            final String propertyName = (args.length() == 1 ? args.getString(0) : null);
            if (propertyName != null) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        String prop = cleverTap.profile.getProperty(propertyName);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, prop);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                });
                return true;

            } else {
                errorMsg = "propertyName cannot be null";
            }
        }

        else if (action.equals("sessionGetTimeElapsed")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int time = cleverTap.session.getTimeElapsed();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, time);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        else if (action.equals("sessionGetTotalVisits")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int count = cleverTap.session.getTotalVisits();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, count);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        else if (action.equals("sessionGetScreenCount")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int count = cleverTap.session.getScreenCount();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, count);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        else if (action.equals("sessionGetPreviousVisitTime")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    int time = cleverTap.session.getPreviousVisitTime();
                    PluginResult _result = new PluginResult(PluginResult.Status.OK, time);
                    _result.setKeepCallback(true);
                    callbackContext.sendPluginResult(_result);
                }
            });
            return true;
        }

        else if (action.equals("sessionGetUTMDetails")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    UTMDetail details = cleverTap.session.getUTMDetails();
                    try {
                        JSONObject jsonDetails = CleverTapPlugin.utmDetailsToJSON(details);
                        PluginResult _result = new PluginResult(PluginResult.Status.OK, jsonDetails);
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    } catch (JSONException e ) {
                        PluginResult _result = new PluginResult(PluginResult.Status.ERROR, e.getLocalizedMessage());
                        _result.setKeepCallback(true);
                        callbackContext.sendPluginResult(_result);
                    }
                }
            });
            return true;
        }

        result = new PluginResult(PluginResult.Status.ERROR, errorMsg);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
        return true;
    }

    /*******************
     * Private Methods
     ******************/

    // SyncListener
    public void profileDataUpdated(JSONObject updates) {

        if(updates == null) {
            return ;
        }
        
        final String json = "{updates:"+updates.toString()+"}";
        webView.getView().post(new Runnable() {
            public void run() {
                webView.loadUrl("javascript:cordova.fireDocumentEvent('onCleverTapProfileSync',"+json+");");
            }
        });
    }

    private static boolean checkCleverTapInitialized() {
        boolean initialized = (cleverTap != null);
        if(!initialized) {
            Log.d(LOG_TAG, "CleverTap API not initialized: " + CLEVERTAP_API_ERROR);
        }
        return initialized;
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

    private static HashMap<String, Object> toMap(JSONObject object) throws JSONException {
        HashMap<String, Object> map = new HashMap<String, Object>();
        Iterator keys = object.keys();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            map.put(key, fromJson(object.get(key)));
        }
        return map;
    }

    private static HashMap<String, Object> toMapFromGooglePlusUser(JSONObject object) throws JSONException {

        HashMap<String, Object> map = new HashMap<String, Object>();

        JSONObject nameObj = (JSONObject)object.get("name");
        if(nameObj != null) {
            String name = (String)nameObj.get("formatted");
            if(name != null) {
                map.put("gpName", name);
            }
        }

        String id1 = (String)object.get("id");
        if(id1 != null) {
            map.put("gpID", id1);
        }

        String gender1 = (String)object.get("gender");
        if(gender1 != null) {
            if (gender1.toLowerCase().startsWith("m")) {
                gender1 = "M";
            } else if (gender1.toLowerCase().startsWith("f")) {
                gender1 = "F";
            } else {
                gender1 = "";
            }
            map.put("gpGender", gender1);
        }

        JSONArray organizations = (JSONArray)object.get("organizations");
        if(organizations != null) {
            String work1 = "N";
            for(int i=0; i < organizations.length(); i++) {
                JSONObject org = organizations.getJSONObject(i);
                String type = (String)org.get("type");
                if(type.equals("work")) {
                    work1 = "Y";
                    break;
                }
            }
            map.put("gpEmployed", work1);
        }

        String birthday = (String)object.get("birthday");
        if(birthday != null) {
            Date DOB = null;
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
            try {
                DOB = format.parse(birthday);
            } catch (ParseException e) {
                Log.d(LOG_TAG, "invalid DOB format");
            }
            if(DOB != null) {
                map.put("gpDOB", DOB);
            }
        }

        String relationshipStatus = (String)object.get("relationshipStatus");
        if(relationshipStatus != null) {
            String married1 = relationshipStatus.equals("married") ? "Y" : "N";
            map.put("gpRS", married1);
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

        if(details != null) {
            json.put("name", details.getName());
            json.put("firstTime", details.getFirstTime());
            json.put("lastTime", details.getLastTime());
            json.put("count", details.getCount());
        }

        return json;
    }

    private static JSONObject utmDetailsToJSON(UTMDetail details) throws JSONException {

        JSONObject json = new JSONObject();

        if(details != null) {
            json.put("campaign", details.getCampaign());
            json.put("source", details.getSource());
            json.put("medium", details.getMedium());
        }

        return json;
    }

    private static JSONObject eventHistoryToJSON( Map<String, EventDetail> history) throws JSONException {

        JSONObject json = new JSONObject();

        if(history != null) {
            for (Object key : history.keySet()) {
                json.put(key.toString(), eventDetailsToJSON(history.get((String)key)));
            }
        }

        return json;
    }
}


