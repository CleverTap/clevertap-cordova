//  Copyright (C) 2015 CleverTap
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//

var CleverTap = function () {}
               
/*******************
 * notify device ready
 * NOTE: in iOS use to be notified of launch Push Notification or Deep Link
    in Android use only in android phonegap build projects
 ******************/
CleverTap.prototype.notifyDeviceReady = function () {
    cordova.exec(null, null, "CleverTapPlugin", "notifyDeviceReady", []);
}

/*******************
 * Personalization
 ******************/
// Enables the Personalization API
CleverTap.prototype.enablePersonalization = function () {
	cordova.exec(null, null, "CleverTapPlugin", "enablePersonalization", []);
}

// Disables the Personalization API
CleverTap.prototype.disablePersonalization = function () {
    cordova.exec(null, null, "CleverTapPlugin", "disablePersonalization", []);
}

//Enables tracking opt out for the currently active user.
CleverTap.prototype.setOptOut = function (value) {
    cordova.exec(null, null, "CleverTapPlugin", "setOptOut", [value]);
}

//Sets CleverTap SDK to offline mode.
CleverTap.prototype.setOffline = function (value) {
    cordova.exec(null, null, "CleverTapPlugin", "setOffline", [value]);
}

//Enables the reporting of device network related information, including IP address.  This reporting is disabled by default.
CleverTap.prototype.enableDeviceNetworkInfoReporting = function (value) {
    cordova.exec(null, null, "CleverTapPlugin", "enableDeviceNetworkInfoReporting", [value]);
}
               
/*******************
 * Push
 ******************/
// Registers for push notifications
CleverTap.prototype.registerPush = function () {
    cordova.exec(null, null, "CleverTapPlugin", "registerPush", []);
}
               
// Sets the devices push token
CleverTap.prototype.setPushToken = function (token) {
    cordova.exec(null, null, "CleverTapPlugin", "setPushTokenAsString", [token]);
}

// Sets the devices Baidu push token
CleverTap.prototype.setPushBaiduToken = function (token) {
    cordova.exec(null, null, "CleverTapPlugin", "setPushBaiduTokenAsString", [token]);
}

// Sets the devices Huawei push token
CleverTap.prototype.setPushHuaweiToken = function (token) {
    cordova.exec(null, null, "CleverTapPlugin", "setPushHuaweiTokenAsString", [token]);
}

//Create Notification Channel for Android O

CleverTap.prototype.createNotification = function (extras) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotification", [extras]);
}

CleverTap.prototype.createNotificationChannel = function (channelID, channelName, channelDescription, importance, showBadge) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotificationChannel", [channelID, channelName, channelDescription, importance, showBadge]);
}

CleverTap.prototype.createNotificationChannelWithSound = function (channelID, channelName, channelDescription, importance, showBadge,sound) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotificationChannelWithSound", [channelID, channelName, channelDescription, importance, showBadge, sound]);
}

//Create Notification Channel with Group ID for Android O
CleverTap.prototype.createNotificationChannelWithGroupId = function (channelID, channelName, channelDescription, importance, groupId, showBadge) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotificationChannelWithGroupId", [channelID, channelName, channelDescription, importance, groupId, showBadge]);
}

CleverTap.prototype.createNotificationChannelWithGroupIdAndSound = function (channelID, channelName, channelDescription, importance, groupId, showBadge, sound) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotificationChannelWithGroupIdAndSound", [channelID, channelName, channelDescription, importance, groupId, showBadge, sound]);
}

//Create Notification Channel Group for Android O
CleverTap.prototype.createNotificationChannelGroup = function (groupId, groupName) {
    cordova.exec(null,null, "CleverTapPlugin", "createNotificationChannelGroup", [groupId, groupName]);
}

//Delete Notification Channel  for Android O
CleverTap.prototype.deleteNotificationChannel = function (channelID) {
    cordova.exec(null,null, "CleverTapPlugin", "deleteNotificationChannel", [channelID]);
}

//Delete Notification Channel Group  for Android O
CleverTap.prototype.deleteNotificationChannelGroup = function (groupId) {
    cordova.exec(null,null, "CleverTapPlugin", "deleteNotificationChannelGroup", [groupId]);
}
               
               
/*******************
 * Events
 ******************/

// Record Screen View, iOS only
// screenName = string
CleverTap.prototype.recordScreenView = function (screenName) {
    cordova.exec(null, null, "CleverTapPlugin", "recordScreenView", [screenName]);
}
               
// Record Event with Name
// eventName = string
CleverTap.prototype.recordEventWithName = function (eventName) {
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithName", [eventName]);
}
               
// Record Event with Name and Event properties
// eventName = string
// eventProps = object
CleverTap.prototype.recordEventWithNameAndProps = function (eventName, eventProps) {
    convertDateToEpochInProperties(eventProps)
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithNameAndProps", [eventName, eventProps]);
}
               
// Record Charged Event with Details and Items
// details = object with transaction details
// items = array of items purchased
CleverTap.prototype.recordChargedEventWithDetailsAndItems = function (details, items) {
    convertDateToEpochInProperties(details)
    // iterate over the array & convert the date items to CleverTap's server supported $D String
    for (var i = 0; i < items.length; i++) {
        convertDateToEpochInProperties(items[i])
    }
    cordova.exec(null, null, "CleverTapPlugin", "recordChargedEventWithDetailsAndItems", [details, items]);
}
               
// Get Event First Time
// eventName = string
// successCallback = callback function for result
// success returns epoch seconds or -1
CleverTap.prototype.eventGetFirstTime = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetFirstTime", [eventName]);
}
               
// Get Event Last Time
// eventName = string
// successCallback = callback function for result
// success returns epoch seconds or -1
CleverTap.prototype.eventGetLastTime = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetLastTime", [eventName]);
}
               
// Get Event Get Occurrences
// successCallback = callback function for result
// success calls back with int or -1
CleverTap.prototype.eventGetOccurrences = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetOccurrences", [eventName]);
}
               
// Get Event Get Details
// successCallback = callback function for result
// success calls back with object {"eventName": <string>, "firstTime":<epoch seconds>, "lastTime": <epoch seconds>, "count": <int>} or empty object 
CleverTap.prototype.eventGetDetails = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetDetails", [eventName]);
}
               
// Get Event History
// successCallback = callback function for result
// success calls back with object {"eventName1":<event1 details object>, "eventName2":<event2 details object>} 
CleverTap.prototype.getEventHistory = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getEventHistory", []);
}
               

/*******************
 * Profiles
 ******************/

/** 
Get the device location if available.

On iOS:
Calling this will prompt the user location permissions dialog.
Please be sure to include the NSLocationWhenInUseUsageDescription key in your Info.plist.
Uses desired accuracy of kCLLocationAccuracyHundredMeters. 
If you need background location updates or finer accuracy please implement your own location handling.

On Android:
Requires Location Permission in AndroidManifest e.g. "android.permission.ACCESS_COARSE_LOCATION"

You can use location to pass it to CleverTap via the setLocation API
for, among other things, more fine-grained geo-targeting and segmentation purposes.

successCallback = callback function for result
errorCallback = callback function in case of error
success returns {lat:lat, lon:lon} lat and lon are floats
error returns a reason string
 
Note: on iOS the call to CleverTapSDK must be made on the main thread due to LocationManager restrictions, but the CleverTapSDK method itself is non-blocking.
*/
CleverTap.prototype.getLocation = function (successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "CleverTapPlugin", "getLocation", []);
}
               
// Set location
// lat = float
// lon = float
CleverTap.prototype.setLocation = function (lat, lon) {
    cordova.exec(null, null, "CleverTapPlugin", "setLocation", [lat, lon]);
}

/**
 Creates a separate and distinct user profile identified by one or more of Identity, Email, FBID or GPID values,
 and populated with the key-values included in the profile dictionary.
 
 If your app is used by multiple users, you can use this method to assign them each a unique profile to track them separately.
 
 If instead you wish to assign multiple Identity, Email, FBID and/or GPID values to the same user profile,
 use profileSet rather than this method.
 
 If none of Identity, Email, FBID or GPID is included in the profile dictionary,
 all properties values will be associated with the current user profile.
 
 When initially installed on this device, your app is assigned an "anonymous" profile.
 The first time you identify a user on this device (whether via onUserLogin or profileSet),
 the "anonymous" history on the device will be associated with the newly identified user.
 
 Then, use this method to switch between subsequent separate identified users.
 
 Please note that switching from one identified user to another is a costly operation
 in that the current session for the previous user is automatically closed
 and data relating to the old user removed, and a new session is started
 for the new user and data for that user refreshed via a network call to CleverTap.
 In addition, any global frequency caps are reset as part of the switch.
 
 profile = object
 */
CleverTap.prototype.onUserLogin = function (profile) {
    convertDateToEpochInProperties(profile)
    cordova.exec(null, null, "CleverTapPlugin", "onUserLogin", [profile]);
}
               
// Set profile attributes
// profile = object
CleverTap.prototype.profileSet = function (profile) {
    convertDateToEpochInProperties(profile)
    cordova.exec(null, null, "CleverTapPlugin", "profileSet", [profile]);
}

// Get User Profile Property
// propertyName = string
// successCallback = callback function for result
// success calls back with value of propertyName or false
CleverTap.prototype.profileGetProperty = function (propertyName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetProperty", [propertyName]);
}

/**
* @deprecated This method is deprecated in v2.3.5. Use getCleverTapID() instead.
* Get a unique CleverTap identifier suitable for use with install attribution providers
* successCallback = callback function for result
* success returns the unique CleverTap attribution identifier
*/
CleverTap.prototype.profileGetCleverTapAttributionIdentifier = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetCleverTapAttributionIdentifier", []);
}

/**
* @deprecated This method is deprecated in v2.3.5. Use getCleverTapID() instead.
* Get User Profile CleverTapID
* successCallback = callback function for result
* success calls back with CleverTapID or false
*/
CleverTap.prototype.profileGetCleverTapID = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetCleverTapID", []);
}

// Get User Profile CleverTapID
// successCallback = callback function for result
// success calls back with CleverTapID or false
CleverTap.prototype.getCleverTapID = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getCleverTapID", []);
}

// Remove the property specified by key from the user profile
// key = string
CleverTap.prototype.profileRemoveValueForKey = function (key) {
    cordova.exec(null, null, "CleverTapPlugin", "profileRemoveValueForKey", [key]);
}

// Method for setting a multi-value user profile property.
// key = string
// values = array of strings
CleverTap.prototype.profileSetMultiValues = function (key, values) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSetMultiValues", [key, values]);
}

// Method for adding a value to a multi-value user profile property.
// key = string
// value = string
CleverTap.prototype.profileAddMultiValue = function (key, value) {
    cordova.exec(null, null, "CleverTapPlugin", "profileAddMultiValue", [key, value]);
}

// Method for adding values to a multi-value user profile property.
// key = string
// values = array of strings
CleverTap.prototype.profileAddMultiValues = function (key, values) {
    cordova.exec(null, null, "CleverTapPlugin", "profileAddMultiValues", [key, values]);
}

// Method for removing a value from a multi-value user profile property.
// key = string
// value = string
CleverTap.prototype.profileRemoveMultiValue = function (key, value) {
    cordova.exec(null, null, "CleverTapPlugin", "profileRemoveMultiValue", [key, value]);
}

// Method for removing values from a multi-value user profile property.
// key = string
// values = array of strings
CleverTap.prototype.profileRemoveMultiValues = function (key, values) {
    cordova.exec(null, null, "CleverTapPlugin", "profileRemoveMultiValues", [key, values]);
}
// Method for incrementing a value for a single-value profile property (if it exists).
// key = string
// value = number
CleverTap.prototype.profileIncrementValueBy = function (key, value) {
    cordova.exec(null, null, "CleverTapPlugin", "profileIncrementValueBy", [key, value]);
}

// Method for decrementing a value for a single-value profile property (if it exists).
// key = string
// value = number
CleverTap.prototype.profileDecrementValueBy = function (key, value) {
    cordova.exec(null, null, "CleverTapPlugin", "profileDecrementValueBy", [key, value]);
}
               
/*******************
 * Session
 ******************/

// Get Session Elapsed Time
// successCallback = callback function for result
// success calls back with seconds
CleverTap.prototype.sessionGetTimeElapsed = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetTimeElapsed", []);
}
               
// Get Session Get Total Visits
// successCallback = callback function for result
// success calls back with int or -1
CleverTap.prototype.sessionGetTotalVisits = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetTotalVisits", []);
}
               
// Get Sesssion Screen Count
// successCallback = callback function for result
// success calls back with int
CleverTap.prototype.sessionGetScreenCount = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetScreenCount", []);
}
               
// Get Sesssion Get Previous Visit Time
// successCallback = callback function for result
// success calls back with epoch seconds or -1
CleverTap.prototype.sessionGetPreviousVisitTime = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetPreviousVisitTime", []);
}

// Get Sesssion Get Referrer UTM details
// successCallback = callback function for result
// success calls back with  object {"source": <string>, "medium": <string>, "campaign": <string>} or empty object
CleverTap.prototype.sessionGetUTMDetails = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetUTMDetails", []);
}

// Call this to manually track the utm details for an incoming install referrer.
// source = string               the utm source
// medium = string               the utm medium
// campaign = string             the utm campaign
CleverTap.prototype.pushInstallReferrer = function (source, medium, campaign) {
    cordova.exec(null, null, "CleverTapPlugin", "pushInstallReferrer", [source, medium, campaign]);
}
               
/*******************
 * Developer Options
 ******************/
// Set the debug level, 0 is off, 1 is on
// level = int
CleverTap.prototype.setDebugLevel= function (level) {
	cordova.exec(null, null, "CleverTapPlugin", "setDebugLevel", [level]);
}

/****************************
 * Notification Inbox methods
 ****************************/
// Initializes the app inbox

CleverTap.prototype.initializeInbox= function () {
    cordova.exec(null, null, "CleverTapPlugin", "initializeInbox", []);
}

// Get Unread Inbox Message count for the user
// successCallback = callback function for result
// success calls back returns the total number of unread inbox messages for the user
CleverTap.prototype.getInboxMessageUnreadCount = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getInboxMessageUnreadCount", []);
}

// Get Inbox Message count for the user
// successCallback = callback function for result
// success calls back returns the total number of inbox messages for the user
CleverTap.prototype.getInboxMessageCount = function (successCallback) {
     cordova.exec(successCallback, null, "CleverTapPlugin", "getInboxMessageCount", []);
}

CleverTap.prototype.showInbox = function (styleConfig) {
    cordova.exec(null, null, "CleverTapPlugin", "showInbox", [styleConfig]);
}

CleverTap.prototype.getAllInboxMessages = function (successCallback) {
     cordova.exec(successCallback, null, "CleverTapPlugin", "getAllInboxMessages", []);
}

CleverTap.prototype.getUnreadInboxMessages = function (successCallback) {
     cordova.exec(successCallback, null, "CleverTapPlugin", "getUnreadInboxMessages", []);
}

CleverTap.prototype.getInboxMessageForId = function (messageId, successCallback) {
     cordova.exec(successCallback, null, "CleverTapPlugin", "getInboxMessageForId", [messageId]);
}

CleverTap.prototype.deleteInboxMessageForId = function (messageId) {
     cordova.exec(null, null, "CleverTapPlugin", "deleteInboxMessageForId", [messageId]);
}

CleverTap.prototype.deleteInboxMessagesForIds = function (messageIds) {
    cordova.exec(null, null, "CleverTapPlugin", "deleteInboxMessagesForIds", [messageIds]);
}

CleverTap.prototype.markReadInboxMessageForId = function (messageId) {
     cordova.exec(null, null, "CleverTapPlugin", "markReadInboxMessageForId", [messageId]);
}

CleverTap.prototype.markReadInboxMessagesForIds = function (messageIds) {
    cordova.exec(null, null, "CleverTapPlugin", "markReadInboxMessagesForIds", [messageIds]);
}

CleverTap.prototype.dismissInbox= function () {
    cordova.exec(null, null, "CleverTapPlugin", "dismissInbox", []);
}

CleverTap.prototype.pushInboxNotificationViewedEventForId = function (messageId) {
     cordova.exec(null, null, "CleverTapPlugin", "pushInboxNotificationViewedEventForId", [messageId]);
}

CleverTap.prototype.pushInboxNotificationClickedEventForId = function (messageId) {
     cordova.exec(null, null, "CleverTapPlugin", "pushInboxNotificationClickedEventForId", [messageId]);
}

/*******************
 * In-App Controls
 ******************/
/**
 Suspends and saves inApp notifications until 'resumeInAppNotifications' is called for current session.
 Automatically resumes InApp notifications display on CleverTap shared instance creation. Pending inApp notifications are displayed only for current session.
 */
CleverTap.prototype.suspendInAppNotifications = function () {
    cordova.exec(null, null, "CleverTapPlugin", "suspendInAppNotifications", []);
}

/**
 Discards inApp notifications until 'resumeInAppNotifications' is called for current session.
 Automatically resumes InApp notifications display on CleverTap shared instance creation. Pending inApp notifications are not displayed. */
CleverTap.prototype.discardInAppNotifications = function () {
    cordova.exec(null, null, "CleverTapPlugin", "discardInAppNotifications", []);
}

/**
 Resumes displaying inApps notifications and shows pending inApp notifications if any.
 */
CleverTap.prototype.resumeInAppNotifications = function () {
    cordova.exec(null, null, "CleverTapPlugin", "resumeInAppNotifications", []);
}

/****************************
 * Native Display methods
 ****************************/
CleverTap.prototype.getAllDisplayUnits = function(successCallback){
	cordova.exec(successCallback, null, "CleverTapPlugin", "getAllDisplayUnits", []);
}

CleverTap.prototype.getDisplayUnitForId = function(unitId, successCallback){
	cordova.exec(successCallback, null, "CleverTapPlugin", "getDisplayUnitForId", [unitId]);
}

CleverTap.prototype.pushDisplayUnitViewedEventForID = function(unitId){
	cordova.exec(null, null, "CleverTapPlugin", "pushDisplayUnitViewedEventForID", [unitId]);
}

CleverTap.prototype.pushDisplayUnitClickedEventForID = function(unitId){
	cordova.exec(null, null, "CleverTapPlugin", "pushDisplayUnitClickedEventForID", [unitId]);
}

/****************************
 * Feature Flag methods
 ****************************/
/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getFeatureFlag = function(name,defaultValue,successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getFeatureFlag", [name,defaultValue]);
}

/****************************
 * Product Config methods
 ****************************/
/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.setDefaultsMap = function(jsonMap){
    cordova.exec(null, null, "CleverTapPlugin", "setDefaultsMap", [jsonMap]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.fetch = function(){
    cordova.exec(null, null, "CleverTapPlugin", "fetch", []);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.fetchWithMinimumFetchIntervalInSeconds = function(interval){
    cordova.exec(null, null, "CleverTapPlugin", "fetchWithMinimumFetchIntervalInSeconds", [interval]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.activate = function(){
    cordova.exec(null, null, "CleverTapPlugin", "activate", []);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.fetchAndActivate = function(){
    cordova.exec(null, null, "CleverTapPlugin", "fetchAndActivate", []);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.setMinimumFetchIntervalInSeconds = function(interval){
    cordova.exec(null, null, "CleverTapPlugin", "setMinimumFetchIntervalInSeconds", [interval]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getLastFetchTimeStampInMillis = function(successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getLastFetchTimeStampInMillis", []);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getString = function(key,successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getString", [key]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getBoolean = function(key,successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getBoolean", [key]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getLong = function(key,successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getLong", [key]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.getDouble = function(key,successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "getDouble", [key]);
}

/** 
 * @deprecated - Since version 2.7.0 and will be removed in the future versions of this SDK.
 */
CleverTap.prototype.reset = function(){
    cordova.exec(null, null, "CleverTapPlugin", "reset", []);
}


/****************************
 * Product Experiences methods
 ****************************/

/**
 Uploads variables to the server. Requires Development/Debug build/configuration.
*/
CleverTap.prototype.syncVariables = function(){
    cordova.exec(null, null, "CleverTapPlugin", "syncVariables", []); 
}

/**
Uploads variables to the server.
@param {boolean} isProduction Provide `true` if variables must be sync in Productuon build/configuration.
*/
CleverTap.prototype.syncVariablesinProd = function(isProduction){
    cordova.exec(null, null, "CleverTapPlugin", "syncVariablesinProd", [isProduction]); 
}

/**
Forces variables to update from the server.
*/
CleverTap.prototype.fetchVariables = function(successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "fetchVariables", []);
}

/**
Create variables. 
@param {object} variables The JSON Object specifying the varibles to be created.
*/
CleverTap.prototype.defineVariables = function (variables) {
    cordova.exec(null, null, "CleverTapPlugin", "defineVariables", [variables]);
}

/**
Create file variable.
@param {string} fileVariable The name specifying the file variable to be created.
*/
CleverTap.prototype.defineFileVariable = function (variable) {
    cordova.exec(null, null, "CleverTapPlugin", "defineFileVariable", [variable]);
}

/**
Get a variable or a group for the specified name.
@param {string} name - name.
*/
CleverTap.prototype.getVariable = function (name, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getVariable", [name]);
}

/**
Get all variables via a JSON object.
*/
CleverTap.prototype.getVariables = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getVariables", []);
}

 /**
Adds a callback to be invoked when variables are initialised with server values. Will be called each time new values are fetched.
@param {function} handler The callback to add
*/
CleverTap.prototype.onVariablesChanged = function (handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onVariablesChanged", []);
}

/**
Adds a callback to be invoked when variables are initialised with server values. Will be called only once on app start, or when added if server values are already received
@param {function} handler The callback to add
*/
CleverTap.prototype.onOneTimeVariablesChanged = function (handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onOneTimeVariablesChanged", []);
}

/**
Called when the value of the variable changes.
@param {name} string the name of the variable
@param {function} handler The callback to add
*/
CleverTap.prototype.onValueChanged = function (name, handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onValueChanged", [name]);
}

/**
Adds a callback to be invoked when the value of the file variable is downloaded and ready. This is only available for File variables.
@param {name} string the name of the file variable
@param {function} handler The callback to add
*/
CleverTap.prototype.onFileValueChanged = function (name, handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onFileValueChanged", [name]);
}

/**
*
Adds a callback to be invoked when no files need to be downloaded or all downloads have been completed. It is called each time new values are fetched and downloads are completed.
@param {function} handler The callback to add
*/
CleverTap.prototype.onVariablesChangedAndNoDownloadsPending = function (handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onVariablesChangedAndNoDownloadsPending", []);
}

/**
Adds a callback to be invoked only once for when new values are fetched and downloaded
@param {function} handler The callback to add
*/
CleverTap.prototype.onceVariablesChangedAndNoDownloadsPending = function (handler) {
    cordova.exec(handler, null, "CleverTapPlugin", "onceVariablesChangedAndNoDownloadsPending", []);
}


/****************************
 * Android 13 Push Primer
 ****************************/
 
CleverTap.prototype.promptPushPrimer = function(localInAppObject){
    cordova.exec(null, null, "CleverTapPlugin", "promptPushPrimer", [localInAppObject]);
}

CleverTap.prototype.promptForPushPermission = function(showFallbackSettings){
    cordova.exec(null, null, "CleverTapPlugin", "promptForPushPermission", [showFallbackSettings]);
}

CleverTap.prototype.isPushPermissionGranted = function(successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "isPushPermissionGranted", []);
}

// Set Locale
// locale = string
CleverTap.prototype.setLocale = function (locale) {
    cordova.exec(null, null, "CleverTapPlugin", "setLocale", [locale]);
}

/**
Deletes all images and gifs which are preloaded for inapps in cs mode
@param {expiredOnly} to clear only assets which will not be needed further for inapps
*/
CleverTap.prototype.clearInAppResources = function (expiredOnly) {
    cordova.exec(null, null, "CleverTapPlugin", "clearInAppResources", [expiredOnly]);
}

/**
Deletes all types of files which are preloaded for SDK features like custom in-app templates, app functions and variables etc.
@param {expiredOnly} to clear only assets which will not be needed further for inapps
*/
CleverTap.prototype.clearFileResources = function (expiredOnly) {
    cordova.exec(null, null, "CleverTapPlugin", "clearFileResources", [expiredOnly]);
}

/**
* Uploads Custom in-app templates and app functions to the server.
* Requires Development/Debug build/configuration.
*/
CleverTap.prototype.syncCustomTemplates = function () {
    cordova.exec(null, null, "CleverTapPlugin", "syncCustomTemplates", []);
}

/**
* Uploads Custom in-app templates and app functions to the server.
* @param {boolean} isProduction Provide `true` if templates must be sync in Productuon build/configuration.
*/
CleverTap.prototype.syncCustomTemplatesInProd = function(isProduction){
    cordova.exec(null, null, "CleverTapPlugin", "syncCustomTemplatesInProd", [isProduction]); 
}

/**
* Notify the SDK that an active custom template is dismissed. The active custom template is considered to be
* visible to the user until this method is called. Since the SDK can show only one InApp message at a time, all
* other messages will be queued until the current one is dismissed. 
* @param {string} templateName The name of the active template
*/
CleverTap.prototype.customTemplateSetDismissed = function(templateName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateSetDismissed", 
            [templateName]
        );
    });
}

/**
* Notify the SDK that an active custom template is presented to the user.
* @param {string} templateName The name of the active template
*/
CleverTap.prototype.customTemplateSetPresented = function(templateName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateSetPresented", 
            [templateName]
        );
    });
}

/**
* Trigger a custom template action argument by name.
* 
* @param {string} templateName The name of an active template for which the action is defined
* @param {string} argName The action argument na
*/
CleverTap.prototype.customTemplateRunAction = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateRunAction", 
            [templateName,argName]
        );
    });
}

/**
* Retrieve a string argument by name.
*
* @param {string} templateName The name of an active template for which the argument is defined
* @param {string} argName The action argument name
*/
CleverTap.prototype.customTemplateGetStringArg = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateGetStringArg", 
            [templateName,argName]
        );
    });
}

/**
* Retrieve a number argument by name.
*
* @param {string} templateName The name of an active template for which the argument is defined
* @param {string} argName The action argument name
*/
CleverTap.prototype.customTemplateGetNumberArg = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateGetNumberArg", 
            [templateName,argName]
        );
    });
}

/**
* Retrieve a boolean argument by name.
*
* @param {string} templateName The name of an active template for which the argument is defined
* @param {string} argName The action argument name
*/
CleverTap.prototype.customTemplateGetBooleanArg = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateGetBooleanArg", 
            [templateName,argName]
        );
    });
}

/**
* Retrieve a file argument by name.
*
* @param {string} templateName The name of an active template for which the argument is defined
* @param {string} argName The action argument name
*/
CleverTap.prototype.customTemplateGetFileArg = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateGetFileArg", 
            [templateName,argName]
        );
    });
}

/**
* Retrieve an object argument by name.
*
* @param {string} templateName The name of an active template for which the argument is defined
* @param {string} argName The action argument name
*/
CleverTap.prototype.customTemplateGetObjectArg = function(templateName,argName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateGetObjectArg", 
            [templateName,argName]
        );
    });
}

/**
* Get a string representation of an active's template context with information about all arguments. 
* @param {string} templateName The name of an active template
*/
CleverTap.prototype.customTemplateContextToString = function(templateName){
    return new Promise((resolve, reject) => {
        cordova.exec(
            resolve,              
            reject,               
            "CleverTapPlugin",     
            "customTemplateContextToString", 
            [templateName]
        );
    });
}

/**
Fetches In Apps from server.
@param {successCallback} Callback to be invoked when fetching is done.
*/
CleverTap.prototype.fetchInApps = function(successCallback){
    cordova.exec(successCallback, null, "CleverTapPlugin", "fetchInApps", []);
}


function convertDateToEpochInProperties(items){
//Conversion of date object in suitable CleverTap format

    /*-------------- * -----------------
    |  input        =>        output    |
    * --------------------------------- *
    | new Date()    =>     $D_epoch     |
    ---------------- * ----------------- */
    for (let [key, value] of Object.entries(items)) {
            if (Object.prototype.toString.call(value) === '[object Date]') {
                items[key] = "$D_" + Math.floor(value.getTime()/1000);
            }
    }
}

module.exports = new CleverTap();
