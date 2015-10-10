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
CleverTap.prototype.recordEventWithName = function (eventName) {
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithName", [eventName]);
}
               
// Record Event with Name and Event properties
CleverTap.prototype.recordEventWithNameAndProps = function (eventName, eventProps) {
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithNameAndProps", [eventName, eventProps]);
}
               
// Record Charged Event with Details and Items
CleverTap.prototype.recordChargedEventWithDetailsAndItems = function (details, items) {
    cordova.exec(null, null, "CleverTapPlugin", "recordChargedEventWithDetailsAndItems", [details, items]);
}
               
// Get Event First Time
// successCallback = callback function for result
CleverTap.prototype.eventGetFirstTime = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetFirstTime", [eventName]);
}
               
// Get Event Last Time
// successCallback = callback function for result
CleverTap.prototype.eventGetLastTime = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetLastTime", [eventName]);
}
               
// Get Event Get Occurrences
// successCallback = callback function for result
CleverTap.prototype.eventGetOccurrences = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetOccurrences", [eventName]);
}
               
// Get Event Get Details
// successCallback = callback function for result
CleverTap.prototype.eventGetDetails = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetDetails", [eventName]);
}
               
// Get Event History
// successCallback = callback function for result
CleverTap.prototype.getEventHistory = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "getEventHistory", []);
}
               

/*******************
 * Profiles
 ******************/

// Set profile attributes
CleverTap.prototype.profileSet = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSet", [profile]);
}
               
// Set profile attributes from facebook user
CleverTap.prototype.profileSetGraphUser = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSetGraphUser", [profile]);
}
               
// Set profile attributes from google plus user
CleverTap.prototype.profileGooglePlusUser = function (profile) {
    cordova.exec(null, null, "CleverTapPlugin", "profileSetGooglePlusUser", [profile]);
}
               

// Get User Profile Property
// successCallback = callback function for result
CleverTap.prototype.profileGetProperty = function (propertyName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "profileGetProperty", [propertyName]);
}
               
/*******************
 * Session
 ******************/

// Get Session Elapsed Time
// successCallback = callback function for result
CleverTap.prototype.sessionGetTimeElapsed = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetTimeElapsed", []);
}
               
// Get Session Get Total Visits
// successCallback = callback function for result
CleverTap.prototype.sessionGetTotalVisits = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetTotalVisits", []);
}
               
// Get Sesssion Screen Count
// successCallback = callback function for result
CleverTap.prototype.sessionGetScreenCount = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetScreenCount", []);
}
               
// Get Sesssion Get Previous Visit Time
// successCallback = callback function for result
CleverTap.prototype.sessionGetPreviousVisitTime = function (successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "sessionGetPreviousVisitTime", []);
}

// Get Sesssion Get Referrer UTM detao;s
// successCallback = callback function for result
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
