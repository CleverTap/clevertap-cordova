/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false);
    document.addEventListener('onCleverTapProfileDidInitialize', this.onCleverTapProfileDidInitialize, false);
    document.addEventListener('onCleverTapInAppNotificationDismissed', this.onCleverTapInAppNotificationDismissed, false);
    // deeplink handler
    document.addEventListener('onDeepLink', this.onDeepLink, false);
    //push notification handler
    document.addEventListener('onPushNotification', this.onPushNotification, false);
    document.addEventListener('onCleverTapInboxDidInitialize', this.onCleverTapInboxDidInitialize, false);
    document.addEventListener('onCleverTapInboxMessagesDidUpdate', this.onCleverTapInboxMessagesDidUpdate, false);
    document.addEventListener('onCleverTapInboxButtonClick', this.onCleverTapInboxButtonClick, false);
    document.addEventListener('onCleverTapInAppButtonClick', this.onCleverTapInAppButtonClick, false);
    document.addEventListener('onCleverTapFeatureFlagsDidUpdate', this.onCleverTapFeatureFlagsDidUpdate, false);
    document.addEventListener('onCleverTapProductConfigDidInitialize', this.onCleverTapProductConfigDidInitialize, false);
    document.addEventListener('onCleverTapProductConfigDidFetch', this.onCleverTapProductConfigDidFetch, false);
    document.addEventListener('onCleverTapProductConfigDidActivate', this.onCleverTapProductConfigDidActivate, false);
    document.addEventListener('onCleverTapExperimentsUpdated', this.onCleverTapExperimentsUpdated, false);
    document.addEventListener('onCleverTapDisplayUnitsLoaded', this.onCleverTapDisplayUnitsLoaded, false);
},
    
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
onDeviceReady: function() {
    this.receivedEvent('deviceready');
    CleverTap.setDebugLevel(3);
    CleverTap.registerPush();
    
    // Ionic example usage
    //$rootScope.CleverTap = CleverTap;
    //CleverTap && CleverTap.registerPush();
    
    /*
     CleverTap.setDebugLevel(1);
     CleverTap.notifyDeviceReady();
     CleverTap.registerPush();
     CleverTap.enablePersonalization();
     CleverTap.disablePersonalization();
     CleverTap.recordScreenView("HomeView");
     
     CleverTap.pushInstallReferrer("source", "medium", "campaign");
     
     CleverTap.setPushToken("foo");
     CleverTap.setPushXiaomiToken("foo");
     CleverTap.setPushBaiduToken("foo");
     CleverTap.setPushHuaweiToken("foo");
     
     CleverTap.onUserLogin({"Identity":098767, "custom":1.3});
     
     CleverTap.profileSet({"Identity":123456, "DOB":"1950-10-15", "custom":1.3});
     
     CleverTap.profileSetMultiValues("multiValue", ["one", "two", "three", "four"]);
     
     CleverTap.getLocation(function(loc) {
     console.log("CleverTapLocation is " + loc.lat + loc.lon);
     CleverTap.setLocation(loc.lat, loc.lon);
     },
     function(error) {
     console.log("CleverTapLocation error is "+error);
     });
     
     CleverTap.recordEventWithName("foo");
     CleverTap.recordEventWithNameAndProps("boo", {"bar":"zoo"});
     CleverTap.recordChargedEventWithDetailsAndItems({"amount":300, "Charged ID":1234}, [{"Category":"Books", "Quantity":1, "Title":"Book Title"}]);
     CleverTap.eventGetFirstTime("foo", function (time) {console.log("foo event first time is "+time);});
     CleverTap.eventGetLastTime("App Launched", function (time) {console.log("app launched last time is "+time);});
     CleverTap.eventGetOccurrences("foo", function (num) {console.log("foo event occurrences "+num);});
     CleverTap.eventGetDetails("Charged", function (res) {console.log(res);});
     CleverTap.getEventHistory(function (history) {console.log(history);});
     
     CleverTap.eventGetFirstTime("noevent", function (time) {console.log("noevent event first time is "+time);});
     CleverTap.eventGetLastTime("noevent", function (time) {console.log("noevent last time is "+time);});
     CleverTap.eventGetOccurrences("noevent", function (num) {console.log("noevent occurrences "+num);});
     CleverTap.eventGetDetails("noevent", function (res) {console.log(res);});
     
     CleverTap.profileGetProperty("DOB", function(val) {console.log("DOB profile value is "+val);});
     
     CleverTap.profileGetProperty("Identity", function(val) {console.log("Identity profile value is "+val);});
     
     CleverTap.profileGetProperty("custom", function(val) {console.log("custom profile value is "+val);});
     
     CleverTap.sessionGetTimeElapsed(function(val) {console.log("session elapsed time is "+val);});
     CleverTap.sessionGetTotalVisits(function(val) {console.log("session total visits is "+val);});
     CleverTap.sessionGetScreenCount(function(val) {console.log("session screen count is "+val);});
     CleverTap.sessionGetPreviousVisitTime(function(val) {console.log("session previous visit time is "+val);});
     CleverTap.sessionGetUTMDetails(function(val) {console.log(val);});
     
     CleverTap.profileGetCleverTapID(function(val) {console.log("CleverTapID is "+val);});
     
     CleverTap.profileGetCleverTapAttributionIdentifier(function(val) {console.log("CleverTapAttributionIdentifier is "+val);});
     
     CleverTap.profileAddMultiValue("multiValue", "five");
     CleverTap.profileRemoveMultiValues("multiValue", ["one", "two"]);
     CleverTap.profileRemoveMultiValue("multiValue", "three");
     CleverTap.profileRemoveValueForKey("custom");
     CleverTap.profileGetProperty("multiValue", function(val) {console.log("multiValue profile value is "+val);});
     
     CleverTap.getAllInboxMessages(function(val) {console.log("Inbox messages are "+val);});
     CleverTap.getUnreadInboxMessages(function(val) {console.log("Unread Inbox messages are "+val);});
     CleverTap.getInboxMessageForID("messageId", function(val) {console.log("Inbox message is "+val);});
     CleverTap.deleteInboxMessageForId("messageId");
     CleverTap.markReadInboxMessageForId("messageId");
     CleverTap.pushInboxNotificationViewedEventForId("messageId");
     CleverTap.pushInboxNotificationClickedEventForId("messageId");
     CleverTap.getAllDisplayUnits(function(val) {console.log("Native Display units are "+val);});
     CleverTap.getDisplayUnitForId(function(val) {console.log("Native Display unit is "+val);});
     CleverTap.recordDisplayUnitViewedEventForID("unitID");
     CleverTap.recordDisplayUnitClickedEventForID("unitID");
     CleverTap.setUIEditorConnectionEnabled(true);
     CleverTap.registerBooleanVariable("test");
     CleverTap.registerDoubleVariable("test");
     CleverTap.registerIntegerVariable("test");
     CleverTap.registerStringVariable("test");
     CleverTap.registerListOfBooleanVariable("test");
     CleverTap.registerListOfDoubleVariable("test");
     CleverTap.registerListOfIntegerVariable("test");
     CleverTap.registerListOfStringVariable("test");
     CleverTap.registerMapOfBooleanVariable("test");
     CleverTap.registerMapOfDoubleVariable("test");
     CleverTap.registerMapOfIntegerVariable("test");
     CleverTap.registerMapOfStringVariable("test");
     CleverTap.getBooleanVariable("test", true, function(val) {console.log("Value is "+val);});
     CleverTap.getDoubleVariable("test", 1000, function(val) {console.log("Value is "+val);});
     CleverTap.getIntegerVariable("test", 10, function(val) {console.log("Value is "+val);});
     CleverTap.getStringVariable("test", "testValue", function(val) {console.log("Value is "+val);});
     CleverTap.getListOfBooleanVariable("test", [true,true], function(val) {console.log("Value is "+val);});
     CleverTap.getListOfDoubleVariable("test", [1000,2000], function(val) {console.log("Value is "+val);});
     CleverTap.getListOfIntegerVariable("test", [10,20], function(val) {console.log("Value is "+val);});
     CleverTap.getListOfStringVariable("test", ["ASD","adsad"], function(val) {console.log("Value is "+val);});
     CleverTap.getMapOfBooleanVariable("test", {"test1": true, "test2": false, "test3": true}, function(val) {console.log("Value is "+val);});
     CleverTap.getMapOfDoubleVariable("test", {"test1": 1000, "test2": 2000, "test3": 3000}, function(val) {console.log("Value is "+val);});
     CleverTap.getMapOfIntegerVariable("test", {"test1": 10, "test2": 20, "test3": 30}, function(val) {console.log("Value is "+val);});
     CleverTap.getMapOfStringVariable("test", {"test1": "sda", "test2": "asd", "test3": "Sad"}, function(val) {console.log("Value is "+val);});
     CleverTap.getFeatureFlag("test",true,function(val) {console.log("Value is "+val);});
     CleverTap.setDefaultsMap({"test":"val1","test1":"val2"});
     CleverTap.fetch();
     CleverTap.fetchWithMinimumFetchIntervalInSeconds(100);
     CleverTap.activate();
     CleverTap.fetchAndActivate();
     CleverTap.setMinimumFetchIntervalInSeconds(100);
     CleverTap.getLastFetchTimeStampInMillis(function(val) {console.log("Value is "+val);});
     CleverTap.getString("test", function(val) {console.log("Value is "+val);});
     CleverTap.getBoolean("test", function(val) {console.log("Value is "+val);});
     CleverTap.getLong("test", function(val) {console.log("Value is "+val);});
     CleverTap.getDouble("test", function(val) {console.log("Value is "+val);});
     CleverTap.reset();
     
     //FOR NOTIFICATION INBOX
     CleverTap.initializeInbox();
     */

},
    
    // onCleverTapProfileSync Event Handler
    // CleverTap provides a mechanism for notifying your application about synchronization-related changes to the User Profile/Event History.
    // You can subscribe to these notifications by listening for the onCleverTapProfile Sync event,
    // i.e. document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false);
    // the updates property of the onCleverTapProfileSync event represents the changed data and is of the form:
    //      {
    //          "profile":{"<property1>":{"oldValue":<value>, "newValue":<value>}, ...},
    //          "events:{"<eventName>":
    //              {"count":
    //                  {"oldValue":(int)<old count>, "newValue":<new count>},
    //              "firstTime":
    //                  {"oldValue":(double)<old first time event occurred>, "newValue":<new first time event occurred>},
    //              "lastTime":
    //                  {"oldValue":(double)<old last time event occurred>, "newValue":<new last time event occurred>},
    //              }, ...
    //          }
    //      }
    //
    //
    
onCleverTapProfileSync: function(e) {
    console.log(e.updates);
},
    
onCleverTapProfileDidInitialize: function(e) {
    console.log(e.CleverTapID);
},
    
onCleverTapInAppNotificationDismissed: function(e) {
    console.log(e.extras);
    console.log(e.actionExtras);
},
    
    // deep link handling
onDeepLink: function(e) {
    console.log(e.deeplink);
},
    
    // push notification payload handling
onPushNotification: function(e) {
    console.log(e.notification);
},
    
onCleverTapInboxDidInitialize: function() {
    CleverTap.showInbox({"navBarTitle":"My App Inbox","tabs": ["tag1", "tag2"],"navBarColor":"#FF0000"});
},
    
onCleverTapInboxMessagesDidUpdate: function() {
    CleverTap.getInboxMessageUnreadCount(function(val) {console.log("Inbox unread message count"+val);})
    CleverTap.getInboxMessageCount(function(val) {console.log("Inbox read message count"+val);});
},

onCleverTapInAppButtonClick: function(e) {
    console.log("onCleverTapInAppButtonClick");
    console.log(e.customExtras);
},

onCleverTapInboxButtonClick: function(e) {
    console.log("onCleverTapInboxButtonClick");
    console.log(e.customExtras);
},

onCleverTapFeatureFlagsDidUpdate: function() {
    console.log("onCleverTapFeatureFlagsDidUpdate");
},

onCleverTapProductConfigDidInitialize: function() {
    console.log("onCleverTapProductConfigDidInitialize");
},

onCleverTapProductConfigDidFetch: function() {
    console.log("onCleverTapProductConfigDidFetch");
},

onCleverTapProductConfigDidActivate: function() {
    console.log("onCleverTapProductConfigDidActivate");
},

onCleverTapExperimentsUpdated: function() {
    console.log("onCleverTapExperimentsUpdated");
},

onCleverTapDisplayUnitsLoaded: function(e) {
    console.log("onCleverTapDisplayUnitsLoaded");
    console.log(e.units);
},
    
    // Update DOM on a Received Event
receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    
    console.log('Received Event: ' + id);
}
};

app.initialize();
