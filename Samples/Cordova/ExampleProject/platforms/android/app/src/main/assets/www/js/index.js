function log(param){
    if(arguments.length>1){
        for (let i = 0; i < arguments.length; i++) {
            log(arguments[i])
        }
    }
    else{
        if (typeof param === 'object') {
            console.log("object:",JSON.stringify(param))
        } else if (typeof param === 'function') {
            console.log('function:', param)
        } else {
            console.log(String(param))
        }
    }
}

function setupButtons() {
    let eventsMap = [
        ["title","Events"],
        ["record Event With Name", () => CleverTap.recordEventWithName("foo")],
        ["record Event With NameAndProps", () => CleverTap.recordEventWithNameAndProps("boo", {"bar": "zoo"})],
        ["record Charged Event With Details And Items", () => CleverTap.recordChargedEventWithDetailsAndItems({
            "amount": 300,
            "Charged ID": 1234
        }, [{"Category": "Books", "Quantity": 1, "Title": "Book Title"}])],
        ["recordScreenView", () => CleverTap.recordScreenView("HomeView")],


        ["title","User Profile"],
        ["profile Set", () => CleverTap.profileSet({"Identity": 20701, "DOB": "1951-10-15", "custom": 1.3})],
        ["profile SetMultiValues", () => CleverTap.profileSetMultiValues("multiValue", ["one", "two", "three", "four"])],
        ["profile getLocation/setLocation", () => CleverTap.getLocation(loc => {
            log("CleverTapLocation is " + loc.lat + loc.lon)
            CleverTap.setLocation(loc.lat, loc.lon)
        }, error => log("CleverTapLocation error is " + error))],
        ["profile GetProperty - DOB", () => CleverTap.profileGetProperty("DOB", val => log("DOB profile value is " + val))],
        ["profile GetProperty - Identity", () => CleverTap.profileGetProperty("Identity", val => log("Identity profile value is " + val))],
        ["profile GetProperty - custom", () => CleverTap.profileGetProperty("custom", val => log("custom profile value is " + val))],
        ["profile onUserLogin", () => CleverTap.onUserLogin({"Identity": 20700, "custom": 1.3})],
        ["profile Add MultiValue", () => CleverTap.profileAddMultiValue("multiValue", "five")],
        ["profile Remove MultiValues", () => CleverTap.profileRemoveMultiValues("multiValue", ["one", "two"])],
        ["profile Remove MultiValuE", () => CleverTap.profileRemoveMultiValue("multiValue", "three")],
        ["profile Remove Value For Key", () => CleverTap.profileRemoveValueForKey("custom")],
        ["profile GetProperty (multivalue)", () => CleverTap.profileGetProperty("multiValue", val => log("multiValue profile value is " + val))],
        ["profile Increment ValueBy", () => CleverTap.profileIncrementValueBy("Score", 1)],
        ["profile Increment ValueBy(2)", () => CleverTap.profileIncrementValueBy("Score", 2)],
        ["profile Decrement ValueBy", () => CleverTap.profileDecrementValueBy("pageview", 1)],
        ["profile getString", () => CleverTap.getString("test", val => log("Value is " + val))],
        ["profile getBoolean", () => CleverTap.getBoolean("test", val => log("Value is " + val))],
        ["profile getLong", () => CleverTap.getLong("test", val => log("Value is " + val))],
        ["profile getDouble", () => CleverTap.getDouble("test", val => log("Value is " + val))],


        ["title","In App"],
        ["suspend InApp Notifications", () => CleverTap.suspendInAppNotifications()],
        ["resume InApp Notifications", () => CleverTap.resumeInAppNotifications()],
        ["discard InApp Notifications", () => CleverTap.discardInAppNotifications()],
        ["create notification channel GSTTesting", ()=> CleverTap.createNotificationChannel("GSTTesting", "GSTTesting", "", 5, true)],
        ["create notification channel BRTesting", ()=> CleverTap.createNotificationChannel("BRTesting", "Core", "", 5, true)],
        ["create notification channel PTTesting", ()=> CleverTap.createNotificationChannel("PTTesting", "Push templates", "", 5, true)],
        ["Send Basic Push", () => CleverTap.recordEventWithName("Send Basic Push")],
        ["Send Carousel Push", () => CleverTap.recordEventWithName("Send Carousel Push")],
        ["Send Manual Carousel Pus", () => CleverTap.recordEventWithName("Send Manual Carousel Pus")],
        ["Send Filmstrip Carousel Push", () => CleverTap.recordEventWithName("Send Filmstrip Carousel Push")],
        ["Send Rating Push", () => CleverTap.recordEventWithName("Send Rating Push")],
        ["Send Product Display Notification", () => CleverTap.recordEventWithName("Send Product Display Notification")],
        ["Send Linear Product Display Push", () => CleverTap.recordEventWithName("Send Linear Product Display Push")],
        ["Send CTA Notification", () => CleverTap.recordEventWithName("Send CTA Notification")],
        ["Send Zero Bezel Notification", () => CleverTap.recordEventWithName("Send Zero Bezel Notification")],
        ["Send Zero Bezel Text Only Notification", () => CleverTap.recordEventWithName("Send Zero Bezel Text Only Notification")],
        ["Send Timer Notification", () => CleverTap.recordEventWithName("Send Timer Notification")],
        ["Send Input Box Notification", () => CleverTap.recordEventWithName("Send Input Box Notification")],
        ["Send Input Box Reply with Event Notification", () => CleverTap.recordEventWithName("Send Input Box Reply with Event Notification")],
        ["Send Input Box Reply with Auto Open Notification", () => CleverTap.recordEventWithName("Send Input Box Reply with Auto Open Notification")],
        ["Send Input Box Remind Notification DOC FALSE", () => CleverTap.recordEventWithName("Send Input Box Remind Notification DOC FALSE")],
        ["Send Input Box CTA DOC true", () => CleverTap.recordEventWithName("Send Input Box CTA DOC true")],
        ["Send Input Box CTA DOC false", () => CleverTap.recordEventWithName("Send Input Box CTA DOC false")],
        ["Send Input Box Reminder DOC true", () => CleverTap.recordEventWithName("Send Input Box Reminder DOC true")],
        ["Send Input Box Reminder DOC false", () => CleverTap.recordEventWithName("Send Input Box Reminder DOC false")],
        ["Send Input Box Reminder DOC false", () => CleverTap.recordEventWithName("Send Input Box Reminder DOC false")],

        ["title","productConfig"],
        ["productConfig fetch", () => CleverTap.fetch()],
        ["productConfig fetchWithMinimumInterval", () => CleverTap.fetchWithMinimumFetchIntervalInSeconds(100)],
        ["productConfig activate", () => CleverTap.activate()],
        ["productConfig fetchAndActivate", () => CleverTap.fetchAndActivate()],
        ["productConfig reset", () => CleverTap.reset()],
        ["productConfig setMinimumFetchInterval", () => CleverTap.setMinimumFetchIntervalInSeconds(100)],
        ["productConfig getLastFetchTimeStamp", () => CleverTap.getLastFetchTimeStampInMillis(val => log("Value is " + val))],

        ["title","inbox"],
        ["initialize Inbox", () => CleverTap.initializeInbox()],

        ["title","Feature flag"],
        ["get Feature Flag", () => CleverTap.getFeatureFlag("test", true, val => log("Value is " + val))],
        
        ["title","Product Experiences"],
        ["get Feature Flag", () => CleverTap.getFeatureFlag("test", true, val => log("Value is " + val))],
         
//         defineVariables({
//            "cordova_var_string": "cordova_var_string_value"
//          })],
        
        ["title","Device Identifiers"],
        ["get CleverTap ID", () => CleverTap.getCleverTapID(val => log("getCleverTapID is " + val))],

        ["title","special functions for cordova sdk"],
        ["Push tokens manually", () => {
            CleverTap.setPushToken("foo")
            CleverTap.setPushXiaomiToken("foo","in")
            CleverTap.setPushBaiduToken("foo")
            CleverTap.setPushHuaweiToken("foo")
        }],
        ["set Debug Level", () => CleverTap.setDebugLevel(3)],
        ["notify Device Ready", () => CleverTap.notifyDeviceReady()],
        ["register Push", () => CleverTap.registerPush()],
        ["pushInstallReferrer", () => CleverTap.pushInstallReferrer("source", "medium", "campaign")],
        ["event GetFirstTime - foo", () => CleverTap.eventGetFirstTime("foo", time => log("foo event first time is " + time))],
        ["event GetFirstTime - noevent", () => CleverTap.eventGetFirstTime("noevent", time => log("noevent event first time is " + time))],
        ["event GetLastTime - App Launched", () => CleverTap.eventGetLastTime("App Launched", time => log("app launched last time is " + time))],
        ["event GetLastTime - noevent", () => CleverTap.eventGetLastTime("noevent", time => log("noevent last time is " + time))],
        ["event GetOccurrences foo", () => CleverTap.eventGetOccurrences("foo", num => log("foo event occurrences " + num))],
        ["event GetDetails - Charged", () => CleverTap.eventGetDetails("Charged", res => log(res))],
        ["getEventHistory", () => CleverTap.getEventHistory(history => log(history))],
        ["event GetOccurrences noevent", () => CleverTap.eventGetOccurrences("noevent", num => log("noevent occurrences " + num))],
        ["event GetDetails - noevent", () => CleverTap.eventGetDetails("noevent", res => log(res))],
        ["session GetTimeElapsed", () => CleverTap.sessionGetTimeElapsed(val => log("session elapsed time is " + val))],
        ["session GetTotalVisits", () => CleverTap.sessionGetTotalVisits(val => log("session total visits is " + val))],
        ["session GetScreenCount", () => CleverTap.sessionGetScreenCount(val => log("session screen count is " + val))],
        ["session GetPreviousVisitTime", () => CleverTap.sessionGetPreviousVisitTime(val => log("session previous visit time is " + val))],
        ["session GetUTMDetails", () => CleverTap.sessionGetUTMDetails(val => log(val))],
        ["enable Personalization", () => CleverTap.enablePersonalization()],
        ["disable Personalization", () => CleverTap.disablePersonalization()],
        ["set Defaults Map", () => CleverTap.setDefaultsMap({"test": "val1", "test1": "val2"})],


        ["Run All Actions", () => {
            CleverTap.setDebugLevel(3)
            CleverTap.notifyDeviceReady()
            CleverTap.registerPush()
            CleverTap.enablePersonalization()
            CleverTap.disablePersonalization()
            CleverTap.recordScreenView("HomeView")

            CleverTap.pushInstallReferrer("source", "medium", "campaign")


            CleverTap.onUserLogin({"Identity": 20500, "custom": 1.3})

            CleverTap.profileSet({"Identity": 20501, "DOB": "1950-10-15", "custom": 1.3})

            CleverTap.profileSetMultiValues("multiValue", ["one", "two", "three", "four"])

            CleverTap.getLocation(
                loc => {
                    log("CleverTapLocation is " + loc.lat + loc.lon)
                    CleverTap.setLocation(loc.lat, loc.lon)
                },
                error => log("CleverTapLocation error is " + error)
            )

            CleverTap.recordEventWithName("foo")
            CleverTap.recordEventWithNameAndProps("boo", {"bar": "zoo"})
            CleverTap.recordChargedEventWithDetailsAndItems({"amount": 300, "Charged ID": 1234}, [{
                "Category": "Books",
                "Quantity": 1,
                "Title": "Book Title"
            }])
            CleverTap.eventGetFirstTime("foo", time => log("foo event first time is " + time))
            CleverTap.eventGetLastTime("App Launched", time => log("app launched last time is " + time))
            CleverTap.eventGetOccurrences("foo", num => log("foo event occurrences " + num))
            CleverTap.eventGetDetails("Charged", res => log(res))
            CleverTap.getEventHistory(history => log(history))

            CleverTap.eventGetFirstTime("noevent", time => log("noevent event first time is " + time))
            CleverTap.eventGetLastTime("noevent", time => log("noevent last time is " + time))
            CleverTap.eventGetOccurrences("noevent", num => log("noevent occurrences " + num))
            CleverTap.eventGetDetails("noevent", res => log(res))

            CleverTap.profileGetProperty("DOB", val => log("DOB profile value is " + val))

            CleverTap.profileGetProperty("Identity", val => log("Identity profile value is " + val))

            CleverTap.profileGetProperty("custom", val => log("custom profile value is " + val))

            CleverTap.sessionGetTimeElapsed(val => log("session elapsed time is " + val))
            CleverTap.sessionGetTotalVisits(val => log("session total visits is " + val))
            CleverTap.sessionGetScreenCount(val => log("session screen count is " + val))
            CleverTap.sessionGetPreviousVisitTime(val => log("session previous visit time is " + val))
            CleverTap.sessionGetUTMDetails(val => log(val))

            //CleverTap.profileGetCleverTapID(function(val) {log("CleverTapID is "+val)})

            //CleverTap.profileGetCleverTapAttributionIdentifier(function(val) {log("CleverTapAttributionIdentifier is "+val)})
            CleverTap.getCleverTapID(val => log("getCleverTapID is " + val))

            CleverTap.profileAddMultiValue("multiValue", "five")
            CleverTap.profileRemoveMultiValues("multiValue", ["one", "two"])
            CleverTap.profileRemoveMultiValue("multiValue", "three")
            CleverTap.profileRemoveValueForKey("custom")
            CleverTap.profileGetProperty("multiValue", val => log("multiValue profile value is " + val))
            CleverTap.profileIncrementValueBy("Score", 1)
            CleverTap.getFeatureFlag("test", true, val => log("Value is " + val))
            CleverTap.setDefaultsMap({"test": "val1", "test1": "val2"})
            CleverTap.fetch()
            CleverTap.fetchWithMinimumFetchIntervalInSeconds(100)
            CleverTap.activate()
            CleverTap.fetchAndActivate()
            CleverTap.setMinimumFetchIntervalInSeconds(100)
            CleverTap.getLastFetchTimeStampInMillis(val => log("Value is " + val))
            CleverTap.getString("test", val => log("Value is " + val))
            CleverTap.getBoolean("test", val => log("Value is " + val))
            CleverTap.getLong("test", val => log("Value is " + val))
            CleverTap.getDouble("test", val => log("Value is " + val))
            CleverTap.profileIncrementValueBy("Score", 1)
            CleverTap.profileDecrementValueBy("pageview", 1)
            CleverTap.suspendInAppNotifications()
            CleverTap.resumeInAppNotifications()
            CleverTap.discardInAppNotifications()
            CleverTap.reset()
            /* CleverTap.recordDisplayUnitViewedEventForID("unitID")
              CleverTap.recordDisplayUnitClickedEventForID("unitID")*/


            //FOR NOTIFICATION INBOX
            CleverTap.initializeInbox()

        }],
    ]

    for (let element of eventsMap) {

        const buttonElement = element[0]==="title"? document.createElement("p") : document.createElement("button")
        buttonElement.innerText = element[0]==="title" ? element[1]:element[0]
        const buttonOnClick = element[0]==="title" ? ()=>{} : element[1]
        buttonElement.addEventListener('click',buttonOnClick)
        document.querySelector('.ct_button').appendChild(buttonElement)
    }

    // onCleverTapProfileSync Event Handler
    // CleverTap provides a mechanism for notifying your application about synchronization-related changes to the User Profile/Event History.
    // You can subscribe to these notifications by listening for the onCleverTapProfile Sync event,
    // i.e. document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false)
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
}




function initLogging() {
    log('Running cordova-' + cordova.platformId + '@' + cordova.version)
    CleverTap.setDebugLevel(3)
}


function initListeners() {
    log("setting listeners")
    document.addEventListener('onCleverTapProfileSync', e => log(e.updates))
    document.addEventListener('onCleverTapProfileDidInitialize', e => log(e.CleverTapID))
    document.addEventListener('onCleverTapInAppNotificationDismissed', e => {
            log("onCleverTapInAppNotificationDismissed")
            log(e.extras)
            log(e.actionExtras)
        }
    )
    // deeplink handler
    document.addEventListener('onDeepLink', e => log(e.deeplink))
    //push notification handler
    document.addEventListener('onPushNotification', e => log(e.notification))
    document.addEventListener('onCleverTapInboxDidInitialize', () => {
            CleverTap.getInboxMessageForId("1642753141_1642755745", val => log("Inbox message is " + JSON.stringify(val)))
            CleverTap.showInbox({"navBarTitle": "My App Inbox", "tabs": ["tag1", "tag2"], "navBarColor": "#FF0000"})
            CleverTap.getAllInboxMessages(val => log("Inbox messages are " + val))
            CleverTap.getUnreadInboxMessages(val => log("Unread Inbox messages are " + val))
            CleverTap.deleteInboxMessageForId("messageId")
            CleverTap.deleteInboxMessagesForIds(["id1", "id2"])
            CleverTap.markReadInboxMessageForId("messageId")
            CleverTap.pushInboxNotificationViewedEventForId("messageId")
            CleverTap.pushInboxNotificationClickedEventForId("messageId")
        }
    )
    document.addEventListener('onCleverTapInboxMessagesDidUpdate', () => {
            CleverTap.getInboxMessageUnreadCount(val => log("Inbox unread message count" + val))
            CleverTap.getInboxMessageCount(val => log("Inbox read message count" + val))
        }
    )
    document.addEventListener('onCleverTapInboxButtonClick', e => {
            log("onCleverTapInboxButtonClick")
            log(e.customExtras)
        }
    )
    document.addEventListener('onCleverTapInboxItemClick', e => {
            log("onCleverTapInboxItemClick")
            log(e.customExtras)
        }
    )
    
    document.addEventListener('onCleverTapInAppButtonClick', e => {
            log("onCleverTapInAppButtonClick")
            log(e.customExtras)
        }
    )
    document.addEventListener('onCleverTapFeatureFlagsDidUpdate', () => log("onCleverTapFeatureFlagsDidUpdate"))
    document.addEventListener('onCleverTapProductConfigDidInitialize', () => log("onCleverTapProductConfigDidInitialize"))
    document.addEventListener('onCleverTapProductConfigDidFetch', () => log("onCleverTapProductConfigDidFetch"))
    document.addEventListener('onCleverTapProductConfigDidActivate', () => log("onCleverTapProductConfigDidActivate"))
    document.addEventListener('onCleverTapExperimentsUpdated', () => log("onCleverTapExperimentsUpdated"))
    document.addEventListener('onCleverTapDisplayUnitsLoaded', e => {
            log("onCleverTapDisplayUnitsLoaded")
            log(e.units)
            CleverTap.getDisplayUnitForId("1642753742_20220131", val => log("Native Display unit is " + JSON.stringify(val)))
            CleverTap.getAllDisplayUnits(val => log("Native Display units are " + JSON.stringify(val)))

        }
    )
    document.addEventListener('onCleverTapPushNotificationTappedWithCustomExtras', e => {
            log("onCleverTapPushNotificationTappedWithCustomExtras")
            log(e.customExtras)
        }
    )
    document.addEventListener('onCleverTapPushAmpPayloadDidReceived', e => {
            log("onCleverTapPushAmpPayloadDidReceived")
            log(e.customExtras)
        }
    )
}



function updateUi() {
    document.getElementById('deviceready').classList.add('ready')
    let parentElement = document.getElementById("deviceready")
    let listeningElement = parentElement.querySelector('.listening')
    let receivedElement = parentElement.querySelector('.received')

    listeningElement.setAttribute('style', 'display:none')
    receivedElement.setAttribute('style', 'display:block')
}


initListeners()
document.addEventListener(
    'deviceready',
    param => {
        log("on device ready, received param:", param)
        initLogging()
        setupButtons()
        updateUi()
    },
    false
)
//TEST-R78-ZZK-955Z TEST-311-ba2
// following tag combination gives a very clean log stream under logcat(make sure to check regex) : chromium|CleverTap
