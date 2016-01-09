cordova.define("com.clevertap.cordova.CleverTapPlugin.CleverTap", function(require, exports, module) { //  CleverTap.js
//  Copyright (C) 2015 CleverTap 
//
//  This code is provided under a commercial License.
//  A copy of this license has been distributed in a file called LICENSE
//  with this source code.
//

var CleverTap = function () {
}

/*******************
 * Personalization
 ******************/
// Enables the Personalization API
CleverTap.prototype.enablePersonalization = function () {
	cordova.exec(null, null, "CleverTapPlugin", "enablePersonalization", []);
}
               
/*******************
 * Push
 ******************/
// Registers for push notifications
CleverTap.prototype.registerPush = function () {
    cordova.exec(null, null, "CleverTapPlugin", "registerPush", []);
}
               
               
/*******************
 * Events
 ******************/

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

// Set location
// lat = float
// lon = float
CleverTap.prototype.setLocation = function (lat, lon) {
    cordova.exec(null, null, "CleverTapPlugin", "setLocation", [lat, lon]);
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
               
/*******************
 * Developer Options
 ******************/
// Set the debug level, 0 is off, 1 is on
// level = int
CleverTap.prototype.setDebugLevel= function (level) {
	cordova.exec(null, null, "CleverTapPlugin", "setDebugLevel", [level]);
}


module.exports = new CleverTap();

});
