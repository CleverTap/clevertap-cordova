
# CleverTap Plugin Ionic/ Cordova Usage using Javascript

#### Import the class
```javascript 
import { CleverTap } from '@ionic-native/clevertap/ngx';
```
#### Set CleverTap object as parameter in Home Page constructor to get reference
```javascript 
export class HomePage {
  constructor(public clevertap: CleverTap, <other parameters>)
	{
		//constructor code
	}
//function calls
}
```

#### Adding Listeners to your JavaScript 

All calls to the CleverTap SDK should be made from your Javascript.


```javascript
document.addEventListener('onCleverTapPushPermissionResponse', this.onCleverTapPushPermissionResponse,false);
document.addEventListener('onCleverTapInAppNotificationShow', this.onCleverTapInAppNotificationShow,false);// Only for Android, NO-OP for iOS
document.addEventListener('deviceready', this.onDeviceReady, false);
document.addEventListener('onCleverTapProfileSync', this.onCleverTapProfileSync, false); // optional: to be notified of CleverTap user profile synchronization updates
document.addEventListener('onCleverTapProfileDidInitialize', this.onCleverTapProfileDidInitialize, false); // optional, to be notified when the CleverTap user profile is initialized
document.addEventListener('onCleverTapInAppNotificationDismissed', this.onCleverTapInAppNotificationDismissed, false); // optional, to be receive a callback with custom in-app notification click data
document.addEventListener('onDeepLink', this.onDeepLink, false); // optional, register to receive deep links.
document.addEventListener('onPushNotification', this.onPushNotification, false); // optional, register to receive push notification payloads.
document.addEventListener('onCleverTapInboxDidInitialize', this.onCleverTapInboxDidInitialize, false); // optional, to check if CleverTap Inbox intialized
document.addEventListener('onCleverTapInboxMessagesDidUpdate', this.onCleverTapInboxMessagesDidUpdate, false); // optional, to check if CleverTap Inbox Messages were updated
document.addEventListener('onCleverTapInboxButtonClick', this.onCleverTapInboxButtonClick, false); // optional, to check if Inbox button was clicked with custom payload
document.addEventListener('onCleverTapInboxItemClick', this.onCleverTapInboxItemClick, false); // optional, to check if Inbox message was clicked
document.addEventListener('onCleverTapInAppButtonClick', this.onCleverTapInAppButtonClick, false); // optional, to check if InApp button was clicked with custom payload
document.addEventListener('onCleverTapFeatureFlagsDidUpdate', this.onCleverTapFeatureFlagsDidUpdate, false); // optional, to check if Feature Flags were updated
document.addEventListener('onCleverTapProductConfigDidInitialize', this.onCleverTapProductConfigDidInitialize, false); // optional, to check if Product Config was initialized
document.addEventListener('onCleverTapProductConfigDidFetch', this.onCleverTapProductConfigDidFetch, false); // optional, to check if Product Configs were updated
document.addEventListener('onCleverTapProductConfigDidActivate', this.onCleverTapProductConfigDidActivate, false); // optional, to check if Product Configs were activated
document.addEventListener('onCleverTapExperimentsUpdated', this.onCleverTapExperimentsUpdated, false); // optional, to check if Dynamic Variable Experiments were updated
document.addEventListener('onCleverTapDisplayUnitsLoaded', this.onCleverTapDisplayUnitsLoaded, false); // optional, to check if Native Display units were loaded

// Push Permission
onCleverTapPushPermissionResponse: function(e) {
   console.log(e.accepted)
},

// on inapp displayed, Only for Android, NO-OP for iOS
onCleverTapInAppNotificationShow: function(e) {
   log("onCleverTapInAppNotificationShow")
   log(e.customExtras)
},

// deep link handling  
onDeepLink: function(e) {
    console.log(e.deeplink);  
},

// push notification data handling
onPushNotification: function(e) {
    console.log(JSON.stringify(e.notification));
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

```
## User Properties

#### Update User Profile (Push Profile)

```javascript 
this.clevertap.profileSet({Name: 'Test-Name', Identity: 'android098768', custom: 122211});
```

#### Set Multi Values For Key 

```javascript 
this.clevertap.profileSetMultiValues('colors', ['red', 'blue']);
```

#### Remove Multi Value For Key 

```javascript 
this.clevertap.profileRemoveMultiValue('colors', 'green');
```

#### Add Multi Value For Key

```javascript 
this.clevertap.profileAddMultiValue('colors', 'green');
```

#### Increment Value For Key

```javascript 
this.clevertap.profileIncrementValueBy('score', 15);
```

#### Decrement Value For Key

```javascript 
this.clevertap.profileDecrementValueBy('score', 10);
```

#### Create a User profile when user logs in (On User Login)

```javascript 
this.clevertap.onUserLogin({Name: 'Test-Name', Identity: 'android098768', Email: 'TestIonic@hotmail.com', custom: 122211});
```

#### Get CleverTap Reference Id

```javascript
this.clevertap.profileGetCleverTapID().then(r => {
   console.log('profileGetCleverTapID: ' + r);
});
```

#### Set Location to User Profile

```javascript 
this.clevertap.setLocation(38.89, -77.04);
```

## User Events

#### Record an event  

```javascript 
this.clevertap.recordEventWithName('Test Event');
```

#### Record Charged event

```javascript 
this.clevertap.recordChargedEventWithDetailsAndItems({amount: 200, 'Charged ID': 5678},
      [{
      Category: 'Food',
      Quantity: 2,
      Title: 'Eggs (Dozen)'
    }]);
```


## App Inbox

#### Initialize the CleverTap App Inbox Method

```javascript 
this.clevertap.initializeInbox();
```

#### Show the App Inbox

```javascript
this.clevertap.showInbox({'tabs':['Offers','Promotions'],'navBarTitle':'My App Inbox','navBarTitleColor':'#FF0000','navBarColor':'#FFFFFF','inboxBackgroundColor':'#AED6F1','backButtonColor':'#00FF00'
                                ,'unselectedTabColor':'#0000FF','selectedTabColor':'#FF0000','selectedTabIndicatorColor':'#000000',
                                'noMessageText':'No message(s)','noMessageTextColor':'#FF0000'});
 ```

#### Get Total message count

```javascript 
this.clevertap.getInboxMessageCount().then(r => {
   console.log('getInboxMessageCount: ' + r);
});	
```

#### Get Total message unread count

```javascript 
this.clevertap.getUnreadInboxMessageCount().then(r => {
   console.log('getUnreadInboxMessageCount: ' + r);
});	
```

#### Get All Inbox Messages

```javascript 
this.clevertap.getAllInboxMessage().then(r => {
   console.log('getAllInboxMessage: ' + r);
});	
```

#### Get all Inbox unread messages

```javascript 
this.clevertap.getUnreadInboxMessage().then(r => {
   console.log('getUnreadInboxMessage: ' + r);
});	
```

#### Get inbox message with Id

```javascript 
this.clevertap.getInboxMessageForId('message_ID_1234').then(r => {
console.log('getInboxMessageForId: ' + r);
});
				
```

#### Delete message with Id

```javascript 
this.clevertap.deleteInboxMessageForId('message_ID_1234');		
```

#### Delete bulk messages with Ids - Only for iOS, NO-OP for Android [*v2.7.0* onwards Android adds support for this method].

```javascript 
this.clevertap.deleteInboxMessagesForIds(['message_ID_1234','message_ID_xyz']);        
```

#### Mark a message as Read for Inbox Id

```javascript 
this.clevertap.markReadInboxMessageForId('message_ID_1234');		
```

#### Mark bulk Inbox messages with Ids as Read

```javascript 
this.clevertap.markReadInboxMessagesForIds(['message_ID_1234','message_ID_xyz']);        
```

#### Dismiss the App Inbox

```javascript 
this.clevertap.dismissInbox();        
```

#### pushInbox Notification Viewed Event For Id

```javascript 
this.clevertap.pushInboxNotificationViewedEventForId('message_ID_1234');	
```

#### push Inbox Notification Clicked Event For Id

```javascript 
this.clevertap.pushInboxNotificationClickedEventForId('message_ID_1234');			
```


## Push Notifications

#### Creating Notification Channel

```javascript 
this.clevertap.createNotificationChannel('channelID_1234', 'Notification Channel', 'channelDescription', 1, true);			
```

#### Delete Notification Channel

```javascript 
this.clevertap.deleteNotificationChannel('channelID_1234');		
```

#### Creating a group notification channel

```javascript 
this.clevertap.createNotificationChannelGroup('groupID_5678', 'Channel Group Name');		
```

#### Delete a group notification channel

```javascript 
this.clevertap.deleteNotificationChannelGroup('groupID_5678');			
```

#### Registering Fcm Token

```javascript 
this.clevertap.setPushToken('<Token Value>');
```
 
## InApp Notification Controls

#### Suspend InApp Notifications

```javascript 
this.clevertap.suspendInAppNotifications();
```

#### Discard InApp Notifications

```javascript 
this.clevertap.discardInAppNotifications();
```

#### Resume InApp Notifications

```javascript 
this.clevertap.resumeInAppNotifications();
```

## Native Display

#### Get Display Unit for Id

```javascript 
this.clevertap.getDisplayUnitForId('Test Display Unit').then(r => {
   console.log('getDisplayUnitForId: ' + r);
});
```

#### Get All Display Units

```javascript 
this.clevertap.getAllDisplayUnits('Test Display Unit').then(r => {
   console.log('getAllDisplayUnits: ' + r);
});
```

## Product Config 

#### Set Product Configuration to default

```javascript 
this.clevertap.setDefaultsMap({
key_long: 123, key_double: 3.14, key_string: 'sensible', key_bool: true
    });
```

#### Fetching product configs

```javascript 
this.clevertap.fetch();
```

#### Activate the most recently fetched product config

```javascript 
this.clevertap.activate();
```

#### Fetch And Activate product config

```javascript 
this.clevertap.fetchAndActivate();
```

#### Fetch with Minimum Time Interval

```javascript 
this.clevertap.fetchWithMinimumFetchIntervalInSeconds(60);
```

#### Set Minimum Time Interval for Fetch 

```javascript 
this.clevertap.setMinimumFetchIntervalInSeconds(60 * 10);
```

#### Get Boolean key

```javascript 
this.clevertap.getBoolean('key_string').then(r => {
   console.log('getBoolean: ' + r);
});
```
#### Get Long

```javascript 
this.clevertap.getLong('key_string').then(r => {
   console.log('getLong: ' + r);
});
```
#### Get Double
  
```javascript 
this.clevertap.getDouble('key_string').then(r => {
   console.log('getDouble: ' + r);
});	
```
#### Get String

```javascript 
this.clevertap.getString('key_string').then(r => {
   console.log('getString: ' + r);
});
```

#### Delete all activated, fetched and defaults configs

```javascript 
this.clevertap.reset();
```

#### Get last fetched timestamp in millis

```javascript 
this.clevertap.getLastFetchTimeStampInMillis().then(r => {
   console.log('getLastFetchTimeStampInMillis: ' + r);
});		
```

## Feature Flag

#### Get Feature Flag

```javascript 
this.clevertap.getFeatureFlag('key_string', 'defaultString').then(r => {
   console.log('getFeatureFlag: ' + r);
});	
```

## App Personalisation

#### Enable Personalization

```javascript 
this.clevertap.enablePersonalization();
```

#### Get Profile Name

```javascript 
this.clevertap.profileGetProperty('Name').then(r => {
   console.log('profileGetProperty' + r);
});	
```

#### Get CleverTap Identifier

```javascript 
this.clevertap.getCleverTapID().then(r => {
   console.log('getCleverTapID: ' + r);
});	
```

### For more information:
 - [See included Example Projects](/Samples) 
 - [See CleverTap JS interface](/www/CleverTap.js)
