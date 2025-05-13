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
    let variables = {
        'cordova_var_string': 'cordova_var_string_value',
        'cordova_var_map': {
          cordova_var_map_string: 'cordova_var_map_value',
          cordova_var_map_float: 10.11,
          cordova_var_map_nested:{
            cordova_var_map_nested_float:3.14
          }
        },
        'cordova_var_int': 6,
        'cordova_var_float': 6.9,
        'cordova_var_boolean': true
      };

    let fileVariable = "folder1.fileVariable"


    let eventsMap = [

        ["title","Custom Templates"],
        ["Sync Custom Templates", () => CleverTap.syncCustomTemplates()],
        ["Sync Custom Templates in Prod", () => CleverTap.syncCustomTemplatesInProd(true)],

        ["title","ClientSide InApps"],
        ["Fetch InApps", () => CleverTap.fetchInApps(success => log("fetchInApps success = " + success))],
        ["Clear InApp Resources", () => CleverTap.clearInAppResources(false)],
        ["Clear Expired Only InApp Resources", () => CleverTap.clearInAppResources(true)],
        ["Clear File Resources", () => CleverTap.clearFileResources(false)],
        ["Clear Expired Only File Resources", () => CleverTap.clearInAppResources(true)],

        ["title","Android 13 Push Primer"],
        ["promptPushPrimer",()=> CleverTap.promptPushPrimer({
            inAppType: 'alert',
            titleText: 'Get Notified',
            messageText:
              'Please enable notifications on your device to use Push Notifications.',
            followDeviceOrientation: true,
            positiveBtnText: 'Allow',
            negativeBtnText: 'Cancel',
            backgroundColor: '#FFFFFF',
            btnBorderColor: '#FF0000',
            titleTextColor: '#0000FF',
            messageTextColor: '#000000',
            btnTextColor: '#FFFFFF',
            btnBackgroundColor: '#0000FF',
            btnBorderRadius: '5',
            imageUrl:"https://icons.iconarchive.com/icons/treetog/junior/64/camera-icon.png",
            fallbackToSettings: true
          })
      ],
      ["promptForPushPermission",()=> CleverTap.promptForPushPermission(true)],
      ["isPushPermissionGranted",()=> CleverTap.isPushPermissionGranted(val => log("isPushPermissionGranted value is " + val))],

      ["title","Product Experiences"],
      ["defineVariables", () => CleverTap.defineVariables(variables)],
      ["defineFileVariable", () => CleverTap.defineFileVariable(fileVariable)],
      ["syncVariables", () => CleverTap.syncVariables()],
      ["syncVariablesinProd", () => CleverTap.syncVariablesinProd()],
      ["fetchVariables", () => CleverTap.fetchVariables(success => log("fetchVariables success = " + success))],
      ["getVariable", () => {
        let key = prompt("Please enter key", "cordova_var_string");
         CleverTap.getVariable(key,val => log(key+" value is "+JSON.stringify(val)));
       }
      ],
      ["getFileVariable", () => {
        let key = prompt("Please enter key", "folder1");
        CleverTap.getVariable(key,val => log(key+" value is "+JSON.stringify(val)));
       }
      ],
      ["getVariables", () => {
         CleverTap.getVariables(val => log("getVariables value is "+val.cordova_var_map.cordova_var_map_nested.cordova_var_map_nested_float));
       }
      ],
      ["onVariablesChanged", () => {
        CleverTap.onVariablesChanged(val => log("onVariablesChanged value is "+JSON.stringify(val)));
      }
     ],
     ["onValueChanged", () => {
        let key = prompt("Please enter key", "cordova_var_string");
        CleverTap.onValueChanged(key,val => log("onValueChanged value is "+JSON.stringify(val)));
      }
     ],
     ["onFileValueChanged", () => {
        let key = prompt("Please enter key", "folder1");
        CleverTap.onFileValueChanged(key,val => log("onFileValueChanged value is "+JSON.stringify(val)));
      }
     ],

     ["onOneTimeVariablesChanged", () => {
        CleverTap.onOneTimeVariablesChanged(val => log("onOneTimeVariablesChanged value is "+JSON.stringify(val)));
      }
     ],

     ["onVariablesChangedAndNoDownloadsPending", () => {
        CleverTap.onVariablesChangedAndNoDownloadsPending(val => log("onVariablesChangedAndNoDownloadsPending value is "+JSON.stringify(val)));
      }
     ],
     ["onceVariablesChangedAndNoDownloadsPending", () => {
        CleverTap.onceVariablesChangedAndNoDownloadsPending(val => log("onceVariablesChangedAndNoDownloadsPending value is "+JSON.stringify(val)));
      }
     ],

        ["title","Events"],
        ["record Event With Name", () => {
            let eventName = prompt("Please enter name of event")
            CleverTap.recordEventWithName(eventName)}],
        ["set Locale", () => CleverTap.setLocale("en_IN")],
        ["record Event With NameAndProps", () => CleverTap.recordEventWithNameAndProps("boo", {"bar": "zoo"})],
        ["record Charged Event With Details And Items", () => CleverTap.recordChargedEventWithDetailsAndItems({
            "amount": 300,
            "Charged ID": 1234
        }, [{"Category": "Books", "Quantity": 1, "Title": "Book Title"}])],
        ["recordScreenView", () => CleverTap.recordScreenView("HomeView")],


        ["title","User Profile"],
        ["profile Set with Identity = 20701", () => {
            let key = prompt("Please enter key", "stringAttr1");
            let value = prompt("Please enter value for " + key, "newValue");
            CleverTap.profileSet({"Identity": 20701, "DOB": "1951-10-15", "custom": 1.3, [key]: value})}],

        ["profile Set with Random Identity", () => {
            let key = prompt("Please enter key", "stringAttr1");
            let value = prompt("Please enter value for " + key, "newValue");
            let randomIdentity = Math.floor(Math.random() * 1000000);
            CleverTap.profileSet({"Identity": randomIdentity, "DOB": "1951-10-15", "custom": 1.3, [key]: value})}],
        ["profile SetMultiValues", () => CleverTap.profileSetMultiValues("multiValue", ["one", "two", "three", "four"])],
        ["profile getLocation/setLocation", () => CleverTap.getLocation(loc => {
            log("CleverTapLocation is " + loc.lat + loc.lon)
            CleverTap.setLocation(loc.lat, loc.lon)
        }, error => log("CleverTapLocation error is " + error))],
        ["profile GetProperty - DOB", () => CleverTap.profileGetProperty("DOB", val => log("DOB profile value is " + val))],
        ["profile GetProperty - Identity", () => CleverTap.profileGetProperty("Identity", val => log("Identity profile value is " + val))],
        ["profile GetProperty - custom", () => CleverTap.profileGetProperty("custom", val => log("custom profile value is " + val))],
        ["profile onUserLogin with Identity = 20701", () => CleverTap.onUserLogin({"Identity": 20700, "custom": 1.3})],
        ["profile onUserLogin with Random Identity", () => CleverTap.onUserLogin({"Identity": Math.floor(Math.random() * 1000000), "custom": 1.3})],
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

        ["title","Notification Channel"],
        ["create notification channel GSTTesting", ()=> CleverTap.createNotificationChannel("GSTTesting", "GSTTesting", "", 5, true)],
        ["create notification channel BRTesting", ()=> CleverTap.createNotificationChannel("BRTesting", "Core", "", 5, true)],
        ["create notification channel PTTesting", ()=> CleverTap.createNotificationChannel("PTTesting", "Push templates", "", 5, true)],

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
        ["show Inbox", () => CleverTap.showInbox({"navBarTitle": "My App Inbox", "tabs": ["tag1", "tag2"], "navBarColor": "#FF0000"})],
        ["get All Inbox Messages", () => CleverTap.getAllInboxMessages(val => log("Inbox messages are " + val))],
        ["get Unread Inbox Messages", () => CleverTap.getUnreadInboxMessages(val => log("Unread Inbox messages are " + val))],
        ["delete Inbox Message For Id", () => CleverTap.deleteInboxMessageForId("messageId")],
        ["delete Inbox Messages For Ids", () => CleverTap.deleteInboxMessagesForIds(["id1", "id2"])],
        ["mark Read Inbox Message For Id", () => CleverTap.markReadInboxMessageForId("messageId")],
        ["mark Read Inbox Messages For Ids", () => CleverTap.markReadInboxMessagesForIds(["id1", "id2"])],
        ["push Inbox Notification Viewed Event For Id", () => CleverTap.pushInboxNotificationViewedEventForId("messageId")],
        ["push Inbox Notification Clicked Event For Id", () => CleverTap.pushInboxNotificationClickedEventForId("messageId")],
        ["dismiss Inbox", () => CleverTap.dismissInbox()],

        ["title","User History"],
        ["event GetFirstTime - foo", () => CleverTap.getUserEventLog("foo", eventLog => log("foo event first time is " + eventLog.firstTime))],
        ["event GetLastTime - foo", () => CleverTap.getUserEventLog("foo", eventLog => log("foo last time is " + eventLog.lastTime))],
        ["event GetOccurrences foo", () => CleverTap.getUserEventLogCount("foo", count => log("foo event occurrences " + count))],
        ["event GetUserEventLog - Charged", () => CleverTap.getUserEventLog("Charged", res => log(res))],
        ["getEventHistory", () => CleverTap.getUserEventLogHistory(history => log(history))],
        ["App Launch Count", () => CleverTap.getUserAppLaunchCount(count => log("App Launch Count " + count))],
        ["session GetTimeElapsed", () => CleverTap.sessionGetTimeElapsed(val => log("session elapsed time is " + val))],
        ["session GetScreenCount", () => CleverTap.sessionGetScreenCount(val => log("session screen count is " + val))],
        ["session GetUTMDetails", () => CleverTap.sessionGetUTMDetails(val => log(val))],

        ["title","Device Identifiers"],
        ["get CleverTap ID", () => CleverTap.getCleverTapID(val => log("getCleverTapID is " + val))],

        ["title","special functions for cordova sdk"],
        ["Push tokens manually", () => {
            CleverTap.setPushToken("foo")
            CleverTap.registerPushToken("bps_token", {
                type: 'bps',
                prefKey: 'bps_token',
                className: 'com.clevertap.android.bps.BaiduPushProvider',
                messagingSDKClassName: 'com.baidu.android.pushservice.PushMessageReceiver'
            });

            CleverTap.registerPushToken("hps_token", {
                type: 'hps',
                prefKey: 'hps_token',
                className: 'com.clevertap.android.hms.HmsPushProvider',
                messagingSDKClassName: 'com.huawei.hms.push.HmsMessageService'
            });
        }],
        ["Push Display Unit Clicked", () => {
            let unitId = prompt("Please enter the unitID")
            CleverTap.pushDisplayUnitClickedEventForID(unitId)
        }],
        ["Push Display Unit Viewed", () => {
            let unitId = prompt("Please enter the unitID")
            CleverTap.pushDisplayUnitViewedEventForID(unitId)
        }],
        ["set Debug Level", () => CleverTap.setDebugLevel(3)],
        ["notify Device Ready", () => CleverTap.notifyDeviceReady()],
        ["register Push", () => CleverTap.registerPush()],
        ["pushInstallReferrer", () => CleverTap.pushInstallReferrer("source", "medium", "campaign")],
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

    const groupedButtons = {};
    let currentGroup = null;

    for (let element of eventsMap) {
        if (element[0] === "title") {
            currentGroup = element[1];
            groupedButtons[currentGroup] = [];
        } else if (currentGroup) {
            groupedButtons[currentGroup].push({
                label: element[0],
                action: element[1]
            });
        }
    }

    const container = document.querySelector('.ct_button');

    // Render the buttons with collapsible groups
    for (const [groupTitle, buttons] of Object.entries(groupedButtons)) {
        // Create title button
        const titleButton = document.createElement("button");
        titleButton.classList.add("group-title");
        titleButton.innerText = groupTitle;

        // Create a container for sub-buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Toggle visibility on title button click
        titleButton.addEventListener('click', () => {
            buttonContainer.classList.toggle("open");
        });

        // Add sub-buttons
        buttons.forEach(buttonData => {
            const subButton = document.createElement("button");
            subButton.classList.add("sub-button");
            subButton.innerText = buttonData.label;
            subButton.addEventListener('click', buttonData.action);
            buttonContainer.appendChild(subButton);
        });

        container.appendChild(titleButton);
        container.appendChild(buttonContainer);
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
    log("setting listeners");

    document.addEventListener('onCleverTapProfileSync', e => {
        showToast("onCleverTapProfileSync");
        log("onCleverTapProfileSync = " + JSON.stringify(e));
    });

    document.addEventListener('onCleverTapProfileDidInitialize', e => {
        showToast("onCleverTapProfileDidInitialize");
        log("onCleverTapProfileDidInitialize = " + JSON.stringify(e));
    });

    document.addEventListener('onCleverTapInAppNotificationDismissed', e => {
        showToast("onCleverTapInAppNotificationDismissed");
        log("onCleverTapInAppNotificationDismissed = " + JSON.stringify(e));
    });

    // Deeplink handler
    document.addEventListener('onDeepLink', e => {
        showToast("onDeepLink");
        log("onDeepLink = " + e.deeplink);
    });

    document.addEventListener('onPushNotification', e => {
        showToast("onPushNotification");
        log("onPushNotification = " + JSON.stringify(e.notification));
    });

    document.addEventListener('onCleverTapInboxDidInitialize', () => {
        showToast("onCleverTapInboxDidInitialize");
        log("onCleverTapInboxDidInitialize");
    });

    document.addEventListener('onCleverTapInboxMessagesDidUpdate', () => {
        showToast("onCleverTapInboxMessagesDidUpdate");
        CleverTap.getInboxMessageCount(val =>
            log("onCleverTapInboxMessagesDidUpdate - Inbox message count = " + val)
        );
    });

    document.addEventListener('onCleverTapInboxButtonClick', e => {
        showToast("onCleverTapInboxButtonClick");
        log("onCleverTapInboxButtonClick = " + JSON.stringify(e.customExtras));
    });

    document.addEventListener('onCleverTapInboxItemClick', e => {
        showToast("onCleverTapInboxItemClick");
        log("onCleverTapInboxItemClick = " + JSON.stringify(e));
    });

    document.addEventListener('onCleverTapInAppButtonClick', e => {
        showToast("onCleverTapInAppButtonClick");
        log("onCleverTapInAppButtonClick = " + JSON.stringify(e.customExtras));
    });

    document.addEventListener('onCleverTapFeatureFlagsDidUpdate', () => {
        showToast("onCleverTapFeatureFlagsDidUpdate");
        log("onCleverTapFeatureFlagsDidUpdate");
    });

    document.addEventListener('onCleverTapProductConfigDidInitialize', () => {
        showToast("onCleverTapProductConfigDidInitialize");
        log("onCleverTapProductConfigDidInitialize");
    });

    document.addEventListener('onCleverTapProductConfigDidFetch', () => {
        showToast("onCleverTapProductConfigDidFetch");
        log("onCleverTapProductConfigDidFetch");
    });

    document.addEventListener('onCleverTapProductConfigDidActivate', () => {
        showToast("onCleverTapProductConfigDidActivate");
        log("onCleverTapProductConfigDidActivate");
    });

    document.addEventListener('onCleverTapExperimentsUpdated', () => {
        showToast("onCleverTapExperimentsUpdated");
        log("onCleverTapExperimentsUpdated");
    });

    document.addEventListener('onCleverTapDisplayUnitsLoaded', e => {
        showToast("onCleverTapDisplayUnitsLoaded");
        log("onCleverTapDisplayUnitsLoaded = " + JSON.stringify(e.units));
        CleverTap.getAllDisplayUnits(val =>
            showToast("onCleverTapDisplayUnitsLoaded - Native Display units = " + JSON.stringify(val))
        );
    });

    document.addEventListener('onCleverTapPushNotificationTappedWithCustomExtras', e => {
        showToast("onCleverTapPushNotificationTappedWithCustomExtras");
        log("onCleverTapPushNotificationTappedWithCustomExtras = " + JSON.stringify(e.customExtras));
    });

    document.addEventListener('onCleverTapPushAmpPayloadDidReceived', e => {
        showToast("onCleverTapPushAmpPayloadDidReceived");
        log("onCleverTapPushAmpPayloadDidReceived = " + JSON.stringify(e.customExtras));
    });

    document.addEventListener('onCleverTapPushPermissionResponseReceived', e => {
        showToast("onCleverTapPushPermissionResponseReceived");
        log("onCleverTapPushPermissionResponseReceived = " + e.accepted);
    });

    document.addEventListener('onCleverTapInAppNotificationShow', e => {
        showToast("onCleverTapInAppNotificationShow");
        log("onCleverTapInAppNotificationShow = " + JSON.stringify(e.customExtras));
    });
}




function updateUi() {
    document.getElementById('deviceready').classList.add('ready')
    let parentElement = document.getElementById("deviceready")
    let listeningElement = parentElement.querySelector('.listening')
    let receivedElement = parentElement.querySelector('.received')

    listeningElement.setAttribute('style', 'display:none')
    receivedElement.setAttribute('style', 'display:block')
}

function showToast(message) {
  if (window.plugins && window.plugins.toast) {
    window.plugins.toast.show(message, 'short', 'bottom');
  }
  console.log(message);  // Fallback to console log if toast plugin is not available
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
