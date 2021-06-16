import { Component } from '@angular/core';
import { CleverTap } from '@ionic-native/clevertap/ngx';
import { ToastController } from '@ionic/angular';
// import { ModalController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public clevertap: CleverTap, public toastController: ToastController) {
    clevertap.onUserLogin({Identity: 'android098768', custom: 122211}).then(() => this.presentToast('User Login'));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  clickAlert(header = 'Alert',
             subHeader= 'An Alert you Made',
             message = 'This is an alert message.') 
{
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = header;
    alert.subHeader = subHeader;
    alert.message = message;
    alert.buttons = [{
                text: 'Okay',
                handler: () => {
//                    console.log('Alert OK response');
                }
            }];

    document.body.appendChild(alert);
    return alert.present();
  }

    recordEventWithName() {
    	console.log('recordEventWithName');
    	this.clevertap.recordEventWithName('Test Event');
    	this.presentToast('recordEventWithName \"Test Event\"');
    }

    recordEventWithNameAndProps() {
        console.log('recordEventWithNameAndProps');
        this.clevertap.recordEventWithNameAndProps('Test Event with Properties', {
            'Property 1': 'First Prop',
            'Color of Text': 'Green'
        });
        this.presentToast('recordEventWithNameAndProps \"Test Event with Properties\"');
    }

    recordChargedEventWithDetailsAndItems() {
        // implemented above too
        console.log('recordChargedEventWithDetailsAndItems');
        this.clevertap.recordChargedEventWithDetailsAndItems({ amount: 200, 'Charged ID': 5678 }, [{
                Category: 'Food',
                Quantity: 2,
                Title: 'Eggs (Dozen)'
            }]);
        this.presentToast('recordChargedEventWithDetailsAndItems');
    }

    eventGetFirstTime() {
        console.log('eventGetFirstTime');
        this.clevertap.eventGetFirstTime('Test Event').then(r => {
            this.presentToast('Test Event first pushed at ' + r)
        });
    }

    eventGetLastTime() {
        console.log('eventGetLastTime');
        this.clevertap.eventGetLastTime('Test Event').then(r => {
            this.presentToast('Test Event last pushed at ' + r)
        });
    }

    eventGetOccurrences() {
        console.log('eventGetOccurrences');
        this.clevertap.eventGetOccurrences('Test Event').then(r => {
            this.presentToast('Test Event total number of occurrences ' + r)
        });
    }

    eventGetDetails() {
        console.log('eventGetDetails');
        this.clevertap.eventGetDetails('Test Event with Properties').then(r => {
            this.clickAlert('eventGetDetails', 'Details for \"Test Event with Properties\"', JSON.stringify(r))
        });
    }

    getEventHistory() {
        console.log('getEventHistory');
        this.clevertap.getEventHistory().then(r => {
            this.clickAlert('getEventHistory', 'Event History is as follows', JSON.stringify(r))
        });
    }

    recordScreenView() {
        console.log('recordScreenView');
        this.clevertap.recordScreenView('Default Screen');
        this.presentToast('recordScreenView');
    }

    getLocation() {
        console.log('getLocation');
        this.clevertap.getLocation().then(r => {
            this.clickAlert('getLocation', 'Location coordinates', r)
        });
    }

    setLocation() {
        console.log('setLocation');
        this.clevertap.setLocation(38.89, -77.04);
        this.presentToast('setLocation to (38.89, -77.04)');
    }

    onUserLogin() {
        console.log('onUserLogin');
        // this.clevertap.onUserLogin(profile:any);
        this.clickAlert('OnUserLogin', '(not called)', 'Creates a new profile, and used to switch between two profiles.' +
            ' Switching between identified users is a costly operation ');
    }

    profileSet() {
        console.log('profileSet');
        this.clevertap.profileSet({ Preference: 'Medium' })
        this.presentToast('profileSet: Added new attribute [Preference: Medium]');
    }

    profileSetGraphUser() {
        console.log('profileSetGraphUser');
        this.clevertap.profileSetGraphUser({ Frequency: 'Rare' }).then(() => {
            this.presentToast('profileSetGraphUser: Added new attribute from Facebook User  [Frequency: Rare]')
        });
    }

    profileGooglePlusUser() {
        console.log('profileGooglePlusUser');
        this.clevertap.profileGooglePlusUser({ Surface: 'Smooth' }).then(() => {
            this.presentToast('profileGooglePlusUser: Added new attribute from Google User  [Surface: Smooth]')
        });
    }

    profileGetProperty() {
        console.log('profileGetProperty');
        this.clevertap.profileGetProperty('Preference').then(r => {
            this.clickAlert('profileGetProperty', 'Get value of Property: Preference', r)
        });
    }

    profileGetCleverTapAttributionIdentifier() {
        console.log('profileGetCleverTapAttributionIdentifier');
        this.clevertap.profileGetCleverTapAttributionIdentifier().then(r => {
            this.presentToast('profileGetCleverTapAttributionIdentifier' + r)
        });
    }

    profileGetCleverTapID() {
        console.log('profileGetCleverTapID');
        this.clevertap.profileGetCleverTapID().then(r => {
                this.presentToast('profileGetCleverTapID' + r);
        });
    }

    profileRemoveValueForKey() {
        console.log('profileRemoveValueForKey');
        this.clevertap.profileRemoveValueForKey('colors');
        this.presentToast('profileRemoveValueForKey: removing key \'colors\' from profile')
    }

    profileSetMultiValues() {
        console.log('profileSetMultiValues');
        this.clevertap.profileSetMultiValues('colors', ['red', 'blue']);
        this.presentToast('profileSetMultiValues: setting values \'[red, blue]\' for key \'colors\'')
    }

    profileAddMultiValue() {
        console.log('profileAddMultiValue');
        this.clevertap.profileAddMultiValue('colors', 'green');
        this.presentToast('profileAddMultiValue: setting value \'[green]\' for key \'colors\'')
    }

    profileAddMultiValues() {
        console.log('profileAddMultiValues');
        this.clevertap.profileAddMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileAddMultiValues: setting values \'[purple, pink]\' for key \'colors\'')
    }

    profileRemoveMultiValue() {
        console.log('profileRemoveMultiValue');
        this.clevertap.profileRemoveMultiValue('colors', 'green');
        this.presentToast('profileRemoveMultiValue: removing value \'[green]\' for key \'colors\'')
    }

    profileRemoveMultiValues() {
        console.log('profileRemoveMultiValues');
        this.clevertap.profileRemoveMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileRemoveMultiValues: removing value \'[purple, pink]\' for key \'colors\'')
    }

    enablePersonalization() {
        console.log('enablePersonalization');
        this.clevertap.enablePersonalization();
        this.presentToast('enablePersonalization');
    }

    disablePersonalization() {
        console.log('disablePersonalization');
        this.clevertap.disablePersonalization();
        this.presentToast('disablePersonalization');
    }

    setOptOut() {
        console.log('setOptOut');
        this.clevertap.setOptOut(true);
        this.presentToast('setOptOut to true');
    }

    setOffline() {
        console.log('setOffline');
        this.clevertap.setOffline(false);
        this.presentToast('setOffline false');
    }

    enableDeviceNetworkInfoReporting() {
        console.log('enableDeviceNetworkInfoReporting');
        this.clevertap.enableDeviceNetworkInfoReporting(false);
        this.presentToast('enableDeviceNetworkInfoReporting false');
    }

    registerPush() {
        console.log('registerPush');
        this.clevertap.registerPush();
        this.presentToast('registerPush');
    }

    setPushToken() {
        console.log('setPushToken');
        this.clevertap.setPushToken('push_token');
        this.presentToast('setPushToken');
    }

    setPushXiaomiToken() {
        console.log('setPushXiaomiToken');
        this.clevertap.setPushXiaomiToken('push_token_X');
        this.presentToast('setPushXiaomiToken');
    }

    setPushBaiduToken() {
        console.log('setPushBaiduToken');
        this.clevertap.setPushBaiduToken('push_token_B');
        this.presentToast('setPushBaiduToken');
    }

    setPushHuaweiToken() {
        console.log('setPushHuaweiToken');
        this.clevertap.setPushHuaweiToken('push_token_H');
        this.presentToast('setPushHuaweiToken');
    }

    createNotification() {
        console.log('createNotification');
        this.clevertap.createNotification({
            name: 'Notification!',
            day: 'Monday'
        });
        this.presentToast('createNotification Creates Notification Channel');
    }

    createNotificationChannel() {
        console.log('createNotificationChannel');
        this.clevertap.createNotificationChannel('channelID_1234', 'Notification Channel', 'channelDescription', 1, true);
        this.presentToast('createNotificationChannel Creates Notification Channel');
    }

    createNotificationChannelWithSound() {
        console.log('createNotificationChannelWithSound');
        this.clevertap.createNotificationChannelWithSound('channelID_1234', 'Notification Channel', 'channelDescription', 1, true, 'sound_effect.mp3');
        this.presentToast('createNotificationChannelWithSound Creates Notification Channel');
    }

    createNotificationChannelWithGroupId() {
        console.log('createNotificationChannelWithGroupId');
        this.clevertap.createNotificationChannelWithGroupId('channelID_1234', 'Notification Channel', 'channelDescription', 1, 'GroupID', true);
        this.presentToast('createNotificationChannelWithGroupId Creates Notification Channel');
    }

    createNotificationChannelWithGroupIdAndSound() {
        console.log('createNotificationChannelWithGroupIdAndSound');
        this.clevertap.createNotificationChannelWithGroupIdAndSound('channelID_1234', 'Notification Channel', 'channelDescription', 1, 'groupID_5678', true, 'group_sound.mp3');
        this.presentToast('createNotificationChannelWithGroupIdAndSound Creates Notification Channel');
    }

    createNotificationChannelGroup() {
        console.log('createNotificationChannelGroup');
        this.clevertap.createNotificationChannelGroup('groupID_5678', 'Channel Group Name');
        this.presentToast('createNotificationChannelGroup Creates Notification Channel Group');
    }

    deleteNotificationChannel() {
        console.log('deleteNotificationChannel');
        this.clevertap.deleteNotificationChannel('channelID_1234');
        this.presentToast('deleteNotificationChannel Deletes Notification Channel');
    }

    deleteNotificationChannelGroup() {
        console.log('deleteNotificationChannelGroup');
        this.clevertap.deleteNotificationChannelGroup('groupID_5678');
        this.presentToast('deleteNotificationChannelGroup Deletes Notification Channel Group');
    }

    sessionGetTimeElapsed() {
        console.log('sessionGetTimeElapsed');
        this.clevertap.sessionGetTimeElapsed().then(r => {
            this.presentToast('sessionGetTimeElapsed ' + r);
        });
    }

    sessionGetTotalVisits() {
        console.log('sessionGetTotalVisits');
        this.clevertap.sessionGetTotalVisits().then(r => {
            this.presentToast('sessionGetTotalVisits ' + r);
        });
    }

    sessionGetScreenCount() {
        console.log('sessionGetScreenCount');
        this.clevertap.sessionGetScreenCount().then(r => {
            this.presentToast('sessionGetScreenCount ' + r);
        });
    }

    sessionGetPreviousVisitTime() {
        console.log('sessionGetPreviousVisitTime');
        this.clevertap.sessionGetPreviousVisitTime().then(r => {
            this.presentToast('sessionGetPreviousVisitTime ' + r);
        });
    }

    sessionGetUTMDetails() {
        console.log('sessionGetUTMDetails');
        this.clevertap.sessionGetUTMDetails().then(r => {
            this.clickAlert('sessionGetUTMDetails ', '', JSON.stringify(r));
        });
    }

    pushInstallReferrer() {
        console.log('pushInstallReferrer');
        this.clevertap.pushInstallReferrer('Source Name', 'Medium Name', 'Campaign Name');
        this.presentToast('pushInstallReferrer');
    }

    infoInbox() {
        this.clickAlert('In-App Inbox', '', 'These functions provide the capability to create App Inbox notifications for your users.' +
            'You can use the App Inbox provided by CleverTap or create your own.' +
            'You can design App Inbox notifications right from the dashboard.');
    }

    initializeInbox() {
        console.log('initializeInbox');
        this.clevertap.initializeInbox();
        this.presentToast('initializeInbox');
    }

    getInboxMessageUnreadCount() {
        console.log('getInboxMessageUnreadCount');
        this.clevertap.getInboxMessageUnreadCount().then(r => {
            this.presentToast('getInboxMessageUnreadCount: ' + r);
        });
    }

    getInboxMessageCount() {
        console.log('getInboxMessageCount');
        this.clevertap.getInboxMessageCount().then(r => {
            this.presentToast('getInboxMessageCount: ' + r);
        });
    }

    showInbox() {
        console.log('showInbox');
        this.clevertap.showInbox({});
        this.presentToast('showInbox');
    }

    getAllInboxMessages() {
        console.log('getAllInboxMessages');
        this.clevertap.getAllInboxMessages().then(r => {
            this.clickAlert('getAllInboxMessages', '', JSON.stringify(r));
        });
    }

    getUnreadInboxMessages() {
        console.log('getUnreadInboxMessages');
        this.clevertap.getUnreadInboxMessages().then(r => {
            this.clickAlert('getUnreadInboxMessages', '', JSON.stringify(r));
        });
    }

    getInboxMessageForId() {
        console.log('getInboxMessageForId');
        this.clevertap.getInboxMessageForId('Insert message id')
    }

    deleteInboxMessageForId() {
        console.log('deleteInboxMessageForId');
        this.clevertap.deleteInboxMessageForId('Insert message id');
    }

    markReadInboxMessageForId() {
        console.log('markReadInboxMessageForId');
        this.clevertap.markReadInboxMessageForId('Insert message id');
    }

    pushInboxNotificationViewedEventForId() {
        console.log('pushInboxNotificationViewedEventForId');
        this.clevertap.pushInboxNotificationViewedEventForId('Insert message id');
    }

    pushInboxNotificationClickedEventForId() {
        console.log('pushInboxNotificationClickedEventForId');
        this.clevertap.pushInboxNotificationClickedEventForId('Insert message id');
    }

    getAllDisplayUnits() {
        console.log('getAllDisplayUnits');
        this.clevertap.getAllDisplayUnits();
        this.presentToast('getAllDisplayUnits');
    }

    getDisplayUnitForId() {
        console.log('getDisplayUnitForId');
        this.clevertap.getDisplayUnitForId('Test Display Unit');
        this.presentToast('getDisplayUnitForId');
    }

    pushDisplayUnitViewedEventForID() {
        console.log('pushDisplayUnitViewedEventForID');
        this.clevertap.pushDisplayUnitViewedEventForID('Test Display Unit');
        this.presentToast('pushDisplayUnitViewedEventForID');
    }

    pushDisplayUnitClickedEventForID() {
        console.log('pushDisplayUnitClickedEventForID');
        this.clevertap.pushDisplayUnitClickedEventForID('Test Display Unit');
        this.presentToast('pushDisplayUnitClickedEventForID');
    }

    getFeatureFlag() {
        console.log('getFeatureFlag');
        this.clevertap.getFeatureFlag('key_string', 'defaultString')
            .then(r => {
            this.clickAlert('getFeatureFlag', 'Get value of key_string or default value', r);
        });
    }

    setDefaultsMap() {
        console.log('setDefaultsMap');
        this.clevertap.setDefaultsMap({
            key_long: 123,
            key_double: 3.14,
            key_string: 'sensible',
            key_bool: true
        });
        this.presentToast('setDefaultsMap');
    }

    infoProductConfig() {
        this.clickAlert('Product Config', 'Category info', 'The CleverTap Product Experiences includes Product Config: ' +
            'Change the behavior and appearance of your app remotely without an update. ' +
            'This helps you to deliver in-app personalization experience to your app users ' +
            'and test their response.');
    }

    fetch() {
        console.log('fetch');
        this.clevertap.fetch();
        this.clickAlert('fetch', '', 'Values set on the dashboard are fetched and stored in the Product Config object.');
    }

    fetchWithMinimumFetchIntervalInSeconds() {
        console.log('fetchWithMinimumFetchIntervalInSeconds');
        this.clevertap.fetchWithMinimumFetchIntervalInSeconds(4);
        this.presentToast('fetchWithMinimumFetchIntervalInSeconds 4 seconds');
    }

    activate() {
        console.log('activate');
        this.clevertap.activate();
        this.clickAlert('activate', '', 'Called to make fetched parameter values available to app.');
    }

    fetchAndActivate() {
        console.log('fetchAndActivate');
        this.clevertap.fetchAndActivate();
        this.presentToast('fetchAndActivate');
    }

    setMinimumFetchIntervalInSeconds() {
        console.log('setMinimumFetchIntervalInSeconds');
        this.clevertap.setMinimumFetchIntervalInSeconds(60 * 10);
        this.presentToast('setMinimumFetchIntervalInSeconds 60*10 seconds');
    }

    getLastFetchTimeStampInMillis() {
        console.log('getLastFetchTimeStampInMillis');
        this.clevertap.getLastFetchTimeStampInMillis().then(r => {
            this.presentToast('getLastFetchTimeStampInMillis: Last Fetch Timestamp' + r);
        });
    }

    getString() {
        console.log('getString');
        this.clevertap.getString().then(r => {
            this.presentToast('getString: String value found' + r);
        });
    }

    getBoolean() {
        console.log('getBoolean');
        this.clevertap.getBoolean().then(r => {
            this.presentToast('getBoolean: Boolean value found' + r);
        });
    }

    getLong() {
        console.log('getLong');
        this.clevertap.getLong().then(r => {
            this.presentToast('getLong: Long value found' + r);
        });
    }

    getDouble() {
        console.log('getDouble');
        this.clevertap.getDouble().then(r => {
            this.presentToast('getDouble: Double value found' + r);
        });
    }

    reset() {
        console.log('reset');
        // this.clevertap.reset();
        this.clickAlert('reset', 'not called', 'Resets ProductConfig');
    }

    notifyDeviceReady() {
        console.log('notifyDeviceReady');
        this.clevertap.notifyDeviceReady();
        this.presentToast('notifyDeviceReady');
    }

    setDebugLevel() {
        console.log('setDebugLevel');
        this.clevertap.setDebugLevel(1);
        this.clickAlert('setDebugLevel', '0 is off, 1 is info, 2 is debug, default is 1', 'Level set to 1');
    }
}
