
# Example Ionic/Cordova Usage

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
## User Properties

#### Update User Profile(Push Profile )
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

#### Create a User profile when user logs in (On User Login)
```javascript 
this.clevertap.onUserLogin({Name: 'Test-Name', Identity: 'android098768', Email: 'TestIonic@hotmail.com', custom: 122211});
```

#### Get CleverTap Reference id
```javascript
this.clevertap.profileGetCleverTapID().then(r => {
console.log('profileGetCleverTapID: ' + r);
});
```

#### Set Location to User Profile
```javascript 
this.clevertap.setLocation(38.89, -77.04);
```

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
this.clevertap.getInboxMessageForId().then(r => {
console.log('getInboxMessageForId: ' + r);
});
				
```

#### Delete message with id
```javascript 
this.clevertap.deleteInboxMessageForId('message_ID_1234');		
```

#### Mark a message as Read for inbox Id
```javascript 
this.clevertap.markReadInboxMessageForId('message_ID_1234');		
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
this.clevertap.getBoolean().then(r => {
console.log('getBoolean: ' + r);
});
```
#### Get Long
```javascript 
this.clevertap.getLong().then(r => {
console.log('getLong: ' + r);
});
```
#### Get Double
```javascript 
this.clevertap.getDouble().then(r => {
console.log('getDouble: ' + r);
});	
```
#### Get String
```javascript 
this.clevertap.getString().then(r => {
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

## Attributions

#### Get CleverTap Attribution Identifier
```javascript 
this.clevertap.profileGetCleverTapAttributionIdentifier('Name').then(r => {
console.log('profileGetCleverTapAttributionIdentifier: ' + r);
});	
```

### For more information,
 - [see included Starter Application](https://github.com/Prem-Sinha/CleverTap-Ionic-App) 
 - [see CleverTap JS interface](https://github.com/CleverTap/clevertap-cordova/blob/master/www/CleverTap.js)
