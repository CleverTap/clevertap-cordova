//  Copyright (C) 2015 CleverTap 
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//

var CleverTap = function () {
}
               
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

//Create Notification Channel for Android O
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
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithNameAndProps", [eventName, eventProps]);
}
               
// Record Charged Event with Details and Items
// details = object with transaction details
// items = array of items purchased
CleverTap.prototype.recordChargedEventWithDetailsAndItems = function (details, items) {
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
    cordova.exec(null, null, "CleverTapPlugin", "onUserLogin", [profile]);
}
               
// Set profile attributes
// profile = object
CleverTap.prototype.profileSet = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSet", [profile]);
}
               
// Set profile attributes from facebook user
// profile = facebook graph user object
CleverTap.prototype.profileSetGraphUser = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSetGraphUser", [profile]);
}
               
// Set profile attributes from google plus user
// profile = google plus user object
CleverTap.prototype.profileGooglePlusUser = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSetGooglePlusUser", [profile]);
}

// Get User Profile Property
// propertyName = string
// successCallback = callback function for result
// success calls back with value of propertyName or false
CleverTap.prototype.profileGetProperty = function (propertyName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetProperty", [propertyName]);
}

// Get a unique CleverTap identifier suitable for use with install attribution providers.
// successCallback = callback function for result
// success returns the unique CleverTap attribution identifier.
CleverTap.prototype.profileGetCleverTapAttributionIdentifier = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetCleverTapAttributionIdentifier", []);
}
               
// Get User Profile CleverTapID
// successCallback = callback function for result
// success calls back with CleverTapID or false
CleverTap.prototype.profileGetCleverTapID = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetCleverTapID", []);
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


module.exports = new CleverTap();
