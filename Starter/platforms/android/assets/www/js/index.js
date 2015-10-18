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
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        /*
        CleverTap.setDebugLevel(1);
        CleverTap.enablePersonalization();
        CleverTap.recordEventWithName("foo");
        CleverTap.recordEventWithNameAndProps("androidFoo", {"bar":"foo"});
        CleverTap.eventGetFirstTime("androidFoo", function (time) {console.log("androidFoo event first time is "+time);});
        CleverTap.eventGetLastTime("androidFoo", function (time) {console.log("androidFoo event last time is "+time);});
        CleverTap.eventGetOccurrences("androidFoo", function (count) {console.log("androidFoo event count is "+count);});

        CleverTap.eventGetFirstTime("noevent", function (time) {console.log("noevent first time is "+time);});
        CleverTap.eventGetLastTime("noevent", function (time) {console.log("noevent last time is "+time);});
        CleverTap.eventGetOccurrences("noevent", function (count) {console.log("noevent count is "+count);});

        CleverTap.recordChargedEventWithDetailsAndItems({"amount":300, "Charged ID":12345}, [{"Category":"Books", "Quantity":1, "Title":"Book Title"}]);
        CleverTap.eventGetDetails("charged", function (details) {console.log("details for charged " + details['name'] + " " + details['count']);});
        CleverTap.eventGetDetails("Charged", function (details) {console.log("details for Charged " + details['name'] + " " + details['count']);});
        CleverTap.getEventHistory(function (history) {console.log("history charged count is "+ history["Charged"]["count"]);});

        CleverTap.profileSet({"Identity":123456, "DOB":"1995-01-15", "custom3":2.445599});

        CleverTap.profileGetProperty("custom1",function (val) {console.log("custom1 profile prop value is "+val);});

        CleverTap.sessionGetTimeElapsed(function(val) {console.log("session elapsed time is "+val);});
        CleverTap.sessionGetTotalVisits(function(val) {console.log("session total visits is "+val);});
        CleverTap.sessionGetScreenCount(function(val) {console.log("session screen count is "+val);});
        CleverTap.sessionGetPreviousVisitTime(function(val) {console.log("session previous visit time is "+val);});
        CleverTap.sessionGetUTMDetails(function(val) {console.log('utm details campaign ' + val['campaign']);});
        */
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
