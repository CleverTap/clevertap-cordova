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
    customElements.define('modal-page', class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title>CT Inbox</ion-title>
    <ion-buttons slot="primary">
      <ion-button onClick=>
        <!-- dismissModal not recognized -->
        <ion-icon slot="icon-only" name="close" (click)="dismissModal()"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <ion-list>
  <ion-list-header>
      <ion-label>Inbox Messages</ion-label>
    </ion-list-header>
    <ion-item><ion-label>
        <h2>Message 1</h2>
        <p>Details inside Message 1</p>
        </ion-label>
    </ion-item>
    <ion-item><ion-label>
        <h2>Message 2</h2>
        <p>Details inside Message 2</p>
        </ion-label>
    </ion-item>
    <ion-item><ion-label>
        <h2>Message 3</h2>
        <p>Details inside Message 3</p>
        </ion-label>
    </ion-item>
    <ion-list-header>
      <ion-label>CleverTap Functions</ion-label>
    </ion-list-header>
    <ion-item>
      <ion-button expand="full">InitializeInbox</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="full">getAllInboxMessages</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="block">getUnreadInboxMessages</ion-button>
    </ion-item>
  </ion-list>
</ion-content>`;
      }
    });
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


  presentModal()
  {
    // create the modal with the `modal-page` component
    const modalElement = document.createElement('ion-modal');
    modalElement.component = 'modal-page';
    modalElement.cssClass = 'InboxModalClass';

    // present the modal
    document.body.appendChild(modalElement);
    return modalElement.present();

    async function dismissModal() {
      console.log('dismiss called');
      await modalElement.dismiss({
        dismissed: true
      });
    }
  }
  /* angular function, not used
  async function dismissModal() {
  await modal.dismiss({
    'dismissed': true
  });
} Function used above
  dismissModal() {
    const modalElement = document.getElementsByTagName('ion-modal')[0];
    return modalElement.dismiss();
  }
  */

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
        console.log('Neutral response');
      }
    }, {
      text: 'Yes!',
      handler: () => {
        console.log('Enthusiastic response');
      }
    }];

    document.body.appendChild(alert);
    return alert.present();
  }

  pushChargedEvent1()
  {
    console.log('push charged event');
    this.clevertap.recordChargedEventWithDetailsAndItems({amount: 900, 'Charged ID': 1234}, [{
      Category: 'Book',
      Quantity: 1,
      Title: 'The Title Of This Book'
    }]);
    this.presentToast('Charged Event Pushed');
  }
  recordEventWithName()
  {
    console.log('recordEventWithName');
    this.clevertap.recordEventWithName('Test Event');
    this.presentToast('recordEventWithName \"Test Event\"');
  }
  recordEventWithNameAndProps()
  {
    console.log('recordEventWithNameAndProps');
    this.clevertap.recordEventWithNameAndProps('Test Event with Properties',
      {
      'Property 1': 'First Prop',
      'Color of Text': 'Green'
    });
    this.presentToast('recordEventWithNameAndProps \"Test Event with Properties\"');
  }
  recordChargedEventWithDetailsAndItems()
  {
    // implemented above too
    console.log('recordChargedEventWithDetailsAndItems');
    this.clevertap.recordChargedEventWithDetailsAndItems({amount: 200, 'Charged ID': 5678},
      [{
      Category: 'Food',
      Quantity: 2,
      Title: 'Eggs (Dozen)'
    }]);
    this.presentToast('recordChargedEventWithDetailsAndItems');
  }
  eventGetFirstTime()
  {
    console.log('eventGetFirstTime');
    this.clevertap.eventGetFirstTime('Test Event').then(r => {
      this.clickAlert('eventGetFirstTime', 'Test Event first pushed at', r)
        .then(() => this.presentToast('eventGetFirstTime'));
    });
  }
  eventGetLastTime()
  {
    console.log('eventGetLastTime');
    this.clevertap.eventGetLastTime('Test Event').then(r => {
    this.clickAlert('eventGetLastTime', 'Test Event last pushed at', r)
      .then(() => this.presentToast('eventGetLastTime'));
  });
  }
  eventGetOccurrences()
  {
    console.log('eventGetOccurrences');
    this.clevertap.eventGetOccurrences('Test Event').then(r => {
      this.clickAlert('eventGetOccurrences',
        'Test Event total number of occurrences', r)
        .then(() => this.presentToast('eventGetOccurrences'));
    });
  }
  eventGetDetails()
  {
    console.log('eventGetDetails');
    this.clevertap.eventGetDetails('Test Event with Properties').then(r => {
      this.clickAlert('eventGetDetails',
        'Details for \"Test Event with Properties\"', r.toString())
        .then(() => this.presentToast('eventGetDetails'));
    });
  }
  getEventHistory()
  {
    console.log('getEventHistory');
    this.clevertap.getEventHistory().then(r => {
      this.clickAlert('getEventHistory',
        'Event History is as follows', r)
        .then(() => this.presentToast('getEventHistory'));
    });
  }
  recordScreenView()
  {
    console.log('recordScreenView');
    this.clevertap.recordScreenView('Default Screen');
    this.presentToast('recordScreenView');
  }
  getLocation()
  {
    console.log('getLocation');
    this.clevertap.getLocation().then(r => {
      this.clickAlert('getLocation',
        'Location coordinates', r)
        .then(() => {
          this.presentToast('getLocation' + r);
        });
    });
  }
  setLocation()
  {
    console.log('setLocation');
    this.clevertap.setLocation(38.89, -77.04);
    this.presentToast('setLocation to (38.89, -77.04)');
  }
  onUserLogin()
  {
    console.log('onUserLogin');
    // this.clevertap.onUserLogin(profile:any);
    this.clickAlert('OnUserLogin', '(not called)',
      'Creates a new profile, and used to switch between two profiles.' +
      ' Switching between identified users is a costly operation ');
    this.presentToast('onUserLogin');
  }
  profileSet()
  {
    console.log('profileSet');
    this.clevertap.profileSet({Preference: 'Medium'}).then(() => {
      this.clickAlert('profileSet',
        'Added new attribute', 'Preference: Medium')
        .then(() => {
          this.presentToast('profileSet');
        });
    });
  }
  profileSetGraphUser()
  {
    console.log('profileSetGraphUser');
    this.clevertap.profileSetGraphUser({Frequency: 'Rare'}).then(() => {
      this.clickAlert('profileSetGraphUser',
        'Added new attribute from Facebook User', 'Frequency: Rare')
        .then(() => {
          this.presentToast('profileSetGraphUser');
        });
    });
  }
  profileGooglePlusUser()
  {
    console.log('profileGooglePlusUser');
    this.clevertap.profileGooglePlusUser({Surface: 'Smooth'}).then(() => {
      this.clickAlert('profileGooglePlusUser',
        'Added new attribute from Google User', 'Surface: Smooth')
        .then(() => {
          this.presentToast('profileGooglePlusUser');
        });
    });
  }
  profileGetProperty()
  {
    console.log('profileGetProperty');
    this.clevertap.profileGetProperty('Preference').then(r => {
    this.clickAlert('profileGetProperty',
      'Get value of Property: Preference', r)
      .then(() => this.presentToast('profileGetProperty' + r));
  });
  }
  profileGetCleverTapAttributionIdentifier()
  {
    console.log('profileGetCleverTapAttributionIdentifier');
    this.clevertap.profileGetCleverTapAttributionIdentifier();
    this.presentToast('profileGetCleverTapAttributionIdentifier');
  }
  profileGetCleverTapID()
  {
    console.log('profileGetCleverTapID');
    this.clevertap.profileGetCleverTapID().then(r => {
      this.clickAlert('profileGetCleverTapID',
        'The ID that identifies a user', r)
        .then (() => {
          this.presentToast('profileGetCleverTapID' + r);
        });
    });
  }
  profileRemoveValueForKey()
  {
    console.log('profileRemoveValueForKey');
    this.clevertap.profileRemoveValueForKey('colors');
    this.presentToast('profileRemoveValueForKey');
  }
  profileSetMultiValues()
  {
    console.log('profileSetMultiValues');
    this.clevertap.profileSetMultiValues('colors', ['red', 'blue']);
    this.presentToast('profileSetMultiValues');
  }
  profileAddMultiValue()
  {
    console.log('profileAddMultiValue');
    this.clevertap.profileAddMultiValue('colors', 'green');
    this.presentToast('profileAddMultiValue');
  }
  profileAddMultiValues()
  {
    console.log('profileAddMultiValues');
    this.clevertap.profileAddMultiValues('colors', ['purple', 'pink']);
    this.presentToast('profileAddMultiValues');
  }
  profileRemoveMultiValue()
  {
    console.log('profileRemoveMultiValue');
    this.clevertap.profileRemoveMultiValue('colors', 'green');
    this.presentToast('profileRemoveMultiValue');
  }
  profileRemoveMultiValues()
  {
    console.log('profileRemoveMultiValues');
    this.clevertap.profileRemoveMultiValues('colors', ['purple', 'pink']);
    this.presentToast('profileRemoveMultiValues');
  }
  enablePersonalization()
  {
    console.log('enablePersonalization');
    this.clevertap.enablePersonalization();
    this.presentToast('enablePersonalization');
  }
  disablePersonalization()
  {
    console.log('disablePersonalization');
    this.clevertap.disablePersonalization();
    this.presentToast('disablePersonalization');
  }
  setOptOut()
  {
    console.log('setOptOut');
    this.clevertap.setOptOut(true);
    this.presentToast('setOptOut to true');
  }
  setOffline()
  {
    console.log('setOffline');
    this.clevertap.setOffline(false);
    this.presentToast('setOffline false');
  }
  enableDeviceNetworkInfoReporting()
  {
    console.log('enableDeviceNetworkInfoReporting');
    this.clevertap.enableDeviceNetworkInfoReporting(false);
    this.presentToast('enableDeviceNetworkInfoReporting false');
  }
  registerPush()
  {
    console.log('registerPush');
    this.clevertap.registerPush();
    this.presentToast('registerPush');
  }
  setPushToken()
  {
    console.log('setPushToken');
    this.clevertap.setPushToken('push_token');
    this.presentToast('setPushToken');
  }
  setPushXiaomiToken()
  {
    console.log('setPushXiaomiToken');
    this.clevertap.setPushXiaomiToken('push_token_X');
    this.presentToast('setPushXiaomiToken');
  }
  setPushBaiduToken()
  {
    console.log('setPushBaiduToken');
    this.clevertap.setPushBaiduToken('push_token_B');
    this.presentToast('setPushBaiduToken');
  }
  setPushHuaweiToken()
  {
    console.log('setPushHuaweiToken');
    this.clevertap.setPushHuaweiToken('push_token_H');
    this.presentToast('setPushHuaweiToken');
  }
  createNotification()
  {
    console.log('createNotification');
    this.clevertap.createNotification({
      name: 'Notification!',
      day: 'Monday'
    });
    this.presentToast('createNotification Creates Notification Channel');
  }
  createNotificationChannel()
  {
    console.log('createNotificationChannel');
    this.clevertap.createNotificationChannel('channelID_1234', 'Notification Channel', 'channelDescription', 1, true);
    this.presentToast('createNotificationChannel Creates Notification Channel');
  }
  createNotificationChannelWithSound()
  {
    console.log('createNotificationChannelWithSound');
    this.clevertap.createNotificationChannelWithSound('channelID_1234', 'Notification Channel', 'channelDescription', 1, true, 'sound_effect.mp3');
    this.presentToast('createNotificationChannelWithSound Creates Notification Channel');
  }
  createNotificationChannelWithGroupId()
  {
    console.log('createNotificationChannelWithGroupId');
    this.clevertap.createNotificationChannelWithGroupId('channelID_1234', 'Notification Channel', 'channelDescription', 1, 'GroupID', true);
    this.presentToast('createNotificationChannelWithGroupId Creates Notification Channel');
  }
  createNotificationChannelWithGroupIdAndSound()
  {
    console.log('createNotificationChannelWithGroupIdAndSound');
    this.clevertap.createNotificationChannelWithGroupIdAndSound('channelID_1234', 'Notification Channel',
      'channelDescription', 1, 'groupID_5678', true, 'group_sound.mp3');
    this.presentToast('createNotificationChannelWithGroupIdAndSound Creates Notification Channel');
  }
  createNotificationChannelGroup()
  {
    console.log('createNotificationChannelGroup');
    this.clevertap.createNotificationChannelGroup('groupID_5678', 'Channel Group Name');
    this.presentToast('createNotificationChannelGroup Creates Notification Channel Group');
  }
  deleteNotificationChannel()
  {
    console.log('deleteNotificationChannel');
    this.clevertap.deleteNotificationChannel('channelID_1234');
    this.presentToast('deleteNotificationChannel Deletes Notification Channel');
  }
  deleteNotificationChannelGroup()
  {
    console.log('deleteNotificationChannelGroup');
    this.clevertap.deleteNotificationChannelGroup('groupID_5678');
    this.presentToast('deleteNotificationChannelGroup Deletes Notification Channel Group');
  }
  sessionGetTimeElapsed()
  {
    console.log('sessionGetTimeElapsed');
    this.clevertap.sessionGetTimeElapsed();
    this.presentToast('sessionGetTimeElapsed');
  }
  sessionGetTotalVisits()
  {
    console.log('sessionGetTotalVisits');
    this.clevertap.sessionGetTotalVisits();
    this.presentToast('sessionGetTotalVisits');
  }
  sessionGetScreenCount()
  {
    console.log('sessionGetScreenCount');
    this.clevertap.sessionGetScreenCount();
    this.presentToast('sessionGetScreenCount');
  }
  sessionGetPreviousVisitTime()
  {
    console.log('sessionGetPreviousVisitTime');
    this.clevertap.sessionGetPreviousVisitTime();
    this.presentToast('sessionGetPreviousVisitTime');
  }
  sessionGetUTMDetails()
  {
    console.log('sessionGetUTMDetails');
    this.clevertap.sessionGetUTMDetails();
    this.presentToast('sessionGetUTMDetails');
  }
  pushInstallReferrer()
  {
    console.log('pushInstallReferrer');
    this.clevertap.pushInstallReferrer('Source Name', 'Medium Name', 'Campaign Name');
    this.presentToast('pushInstallReferrer');
  }
  infoInbox()
  {
    this.clickAlert('In-App Inbox',
      '',
      'These functions provide the capability to create App Inbox notifications for your users.' +
      'You can use the App Inbox provided by CleverTap or create your own.' +
      'You can design App Inbox notifications right from the dashboard.');
  }
  initializeInbox()
  {
    console.log('initializeInbox');
    this.clevertap.initializeInbox();
    this.presentToast('initializeInbox');
  }
  getInboxMessageUnreadCount()
  {
    console.log('getInboxMessageUnreadCount');
    this.clevertap.getInboxMessageUnreadCount();
    this.presentToast('getInboxMessageUnreadCount');
  }
  getInboxMessageCount()
  {
    console.log('getInboxMessageCount');
    this.clevertap.getInboxMessageCount();
    this.presentToast('getInboxMessageCount');
  }
  showInbox()
  {
    console.log('showInbox');
    this.clevertap.showInbox({});
    this.presentToast('showInbox');
  }
  getAllInboxMessages()
  {
    console.log('getAllInboxMessages');
    this.clevertap.getAllInboxMessages();
    this.presentToast('getAllInboxMessages');
  }
  getUnreadInboxMessages()
  {
    console.log('getUnreadInboxMessages');
    this.clevertap.getUnreadInboxMessages();
    this.presentToast('getUnreadInboxMessages');
  }
  getInboxMessageForId()
  {
    console.log('getInboxMessageForId');
    this.clevertap.getInboxMessageForId('message_ID_1234');
    this.presentToast('getInboxMessageForId');
  }
  deleteInboxMessageForId()
  {
    console.log('deleteInboxMessageForId');
    this.clevertap.deleteInboxMessageForId('message_ID_1234');
    this.presentToast('deleteInboxMessageForId');
  }
  markReadInboxMessageForId()
  {
    console.log('markReadInboxMessageForId');
    this.clevertap.markReadInboxMessageForId('message_ID_1234');
    this.presentToast('markReadInboxMessageForId');
  }
  pushInboxNotificationViewedEventForId()
  {
    console.log('pushInboxNotificationViewedEventForId');
    this.clevertap.pushInboxNotificationViewedEventForId('message_ID_1234');
    this.presentToast('pushInboxNotificationViewedEventForId');
  }
  pushInboxNotificationClickedEventForId()
  {
    console.log('pushInboxNotificationClickedEventForId');
    this.clevertap.pushInboxNotificationClickedEventForId('message_ID_1234');
    this.presentToast('pushInboxNotificationClickedEventForId');
  }
  setUIEditorConnectionEnabled()
  {
    console.log('setUIEditorConnectionEnabled');
    this.clevertap.setUIEditorConnectionEnabled(true);
    this.presentToast('setUIEditorConnectionEnabled');
  }
  registerBooleanVariable()
  {
    console.log('registerBooleanVariable');
    this.clevertap.registerBooleanVariable('var_bool');
    this.presentToast('registerBooleanVariable');
  }
  registerDoubleVariable()
  {
    console.log('registerDoubleVariable');
    this.clevertap.registerDoubleVariable('var_double');
    this.presentToast('registerDoubleVariable');
  }
  registerIntegerVariable()
  {
    console.log('registerIntegerVariable');
    this.clevertap.registerIntegerVariable('var_int');
    this.presentToast('registerIntegerVariable');
  }
  registerStringVariable()
  {
    console.log('registerStringVariable');
    this.clevertap.registerStringVariable('var_string');
    this.presentToast('registerStringVariable');
  }
  registerListOfBooleanVariable()
  {
    console.log('registerListOfBooleanVariable');
    this.clevertap.registerListOfBooleanVariable('var_list_bool');
    this.presentToast('registerListOfBooleanVariable');
  }
  registerListOfDoubleVariable()
  {
    console.log('registerListOfDoubleVariable');
    this.clevertap.registerListOfDoubleVariable('var_list_double');
    this.presentToast('registerListOfDoubleVariable');
  }
  registerListOfIntegerVariable()
  {
    console.log('registerListOfIntegerVariable');
    this.clevertap.registerListOfIntegerVariable('var_list_int');
    this.presentToast('registerListOfIntegerVariable');
  }
  registerListOfStringVariable()
  {
    console.log('registerListOfStringVariable');
    this.clevertap.registerListOfStringVariable('var_list_string');
    this.presentToast('registerListOfStringVariable');
  }
  registerMapOfBooleanVariable()
  {
    console.log('registerMapOfBooleanVariable');
    this.clevertap.registerMapOfBooleanVariable('var_map_bool');
    this.presentToast('registerMapOfBooleanVariable');
  }
  registerMapOfDoubleVariable()
  {
    console.log('registerMapOfDoubleVariable');
    this.clevertap.registerMapOfDoubleVariable('var_map_double');
    this.presentToast('registerMapOfDoubleVariable');
  }
  registerMapOfIntegerVariable()
  {
    console.log('registerMapOfIntegerVariable');
    this.clevertap.registerMapOfIntegerVariable('var_map_int');
    this.presentToast('registerMapOfIntegerVariable');
  }
  registerMapOfStringVariable()
  {
    console.log('registerMapOfStringVariable');
    this.clevertap.registerMapOfStringVariable('var_map_string');
    this.presentToast('registerMapOfStringVariable');
  }
  getBooleanVariable()
  {
    console.log('getBooleanVariable');
    this.clevertap.getBooleanVariable('var_bool', true);
    this.presentToast('getBooleanVariable');
  }
  getDoubleVariable()
  {
    console.log('getDoubleVariable');
    this.clevertap.getDoubleVariable('var_double', 0.0);
    this.presentToast('getDoubleVariable');
  }
  getIntegerVariable()
  {
    console.log('getIntegerVariable');
    this.clevertap.getIntegerVariable('var_int', 0);
    this.presentToast('getIntegerVariable');
  }
  getStringVariable()
  {
    console.log('getStringVariable');
    this.clevertap.getStringVariable('var_string', 'ABCD');
    this.presentToast('getStringVariable');
  }
  getListOfBooleanVariable()
  {
    console.log('getListOfBooleanVariable');
    this.clevertap.getListOfBooleanVariable('var_list_bool', [true, false]);
    this.presentToast('getListOfBooleanVariable');
  }
  getListOfDoubleVariable()
  {
    console.log('getListOfDoubleVariable');
    this.clevertap.getListOfDoubleVariable('var_list_double', [0.0, 3.14]);
    this.presentToast('getListOfDoubleVariable');
  }
  getListOfIntegerVariable()
  {
    console.log('getListOfIntegerVariable');
    this.clevertap.getListOfIntegerVariable('var_list_int', [0, 1]);
    this.presentToast('getListOfIntegerVariable');
  }
  getListOfStringVariable()
  {
    console.log('getListOfStringVariable');
    this.clevertap.getListOfStringVariable('var_list_string', ['ABCD', 'Hello']);
    this.presentToast('getListOfStringVariable');
  }
  getMapOfBooleanVariable()
  {
    console.log('getMapOfBooleanVariable');
    this.clevertap.getMapOfBooleanVariable('var_map_bool', {truth: true, lie: false});
    this.presentToast('getMapOfBooleanVariable');
  }
  getMapOfDoubleVariable()
  {
    console.log('getMapOfDoubleVariable');
    this.clevertap.getMapOfDoubleVariable('var_map_double', {zero: 0.0, pi: 3.14});
    this.presentToast('getMapOfDoubleVariable');
  }
  getMapOfIntegerVariable()
  {
    console.log('getMapOfIntegerVariable');
    this.clevertap.getMapOfIntegerVariable('var_map_int', {zero: 0, one: 1});
    this.presentToast('getMapOfIntegerVariable');
  }
  getMapOfStringVariable()
  {
    console.log('getMapOfStringVariable');
    this.clevertap.getMapOfStringVariable('var_map_string', {letters: 'ABCD', greeting: 'Hello'});
    this.presentToast('getMapOfStringVariable');
  }
  getAllDisplayUnits()
  {
    console.log('getAllDisplayUnits');
    this.clevertap.getAllDisplayUnits();
    this.presentToast('getAllDisplayUnits');
  }
  getDisplayUnitForId()
  {
    console.log('getDisplayUnitForId');
    this.clevertap.getDisplayUnitForId('Test Display Unit');
    this.presentToast('getDisplayUnitForId');
  }
  pushDisplayUnitViewedEventForID()
  {
    console.log('pushDisplayUnitViewedEventForID');
    this.clevertap.pushDisplayUnitViewedEventForID('Test Display Unit');
    this.presentToast('pushDisplayUnitViewedEventForID');
  }
  pushDisplayUnitClickedEventForID()
  {
    console.log('pushDisplayUnitClickedEventForID');
    this.clevertap.pushDisplayUnitClickedEventForID('Test Display Unit');
    this.presentToast('pushDisplayUnitClickedEventForID');
  }
  getFeatureFlag()
  {
    console.log('getFeatureFlag');
    this.clevertap.getFeatureFlag('key_string', 'defaultString')
      .then(r => {this.clickAlert('getFeatureFlag',
        'Get value of key_string or default value', r);
      });
    this.presentToast('getFeatureFlag');
  }
  setDefaultsMap()
  {
    console.log('setDefaultsMap');
    this.clevertap.setDefaultsMap({
      key_long: 123,
      key_double: 3.14,
      key_string: 'sensible',
      key_bool: true
    });
    this.presentToast('setDefaultsMap');
  }
  infoProductConfig()
  {
    this.clickAlert('Product Config', 'Category info',
      'The CleverTap Product Experiences includes Product Config: ' +
      'Change the behavior and appearance of your app remotely without an update. ' +
      'This helps you to deliver in-app personalization experience to your app users ' +
      'and test their response.');
  }
  fetch()
  {
    console.log('fetch');
    this.clevertap.fetch();
    this.clickAlert('fetch', '',
      'Values set on the dashboard are fetched and stored in the Product Config object.');
    this.presentToast('fetch');
  }
  fetchWithMinimumFetchIntervalInSeconds()
  {
    console.log('fetchWithMinimumFetchIntervalInSeconds');
    this.clevertap.fetchWithMinimumFetchIntervalInSeconds(4);
    this.presentToast('fetchWithMinimumFetchIntervalInSeconds 4 seconds');
  }
  activate()
  {
    console.log('activate');
    this.clevertap.activate();
    this.clickAlert('activate', '',
      'Called to make fetched parameter values available to app.');
    this.presentToast('activate');
  }
  fetchAndActivate()
  {
    console.log('fetchAndActivate');
    this.clevertap.fetchAndActivate();
    this.presentToast('fetchAndActivate');
  }
  setMinimumFetchIntervalInSeconds()
  {
    console.log('setMinimumFetchIntervalInSeconds');
    this.clevertap.setMinimumFetchIntervalInSeconds(60 * 10);
    this.presentToast('setMinimumFetchIntervalInSeconds 60*10 seconds');
  }
  getLastFetchTimeStampInMillis()
  {
    console.log('getLastFetchTimeStampInMillis');
    this.clevertap.getLastFetchTimeStampInMillis().then(r => {
      this.clickAlert('getLastFetchTimeStampInMillis',
        'Last Fetch Timestamp', r)
        .then(() => this.presentToast('getLastFetchTimeStampInMillis' + r));
    });
  }
  getString()
  {
    console.log('getString');
    this.clevertap.getString().then(r => {
      this.clickAlert('getString', 'String value found', r);
    });
    this.presentToast('getString');
  }
  getBoolean()
  {
    console.log('getBoolean');
    this.clevertap.getBoolean().then(r => {
      this.clickAlert('getBoolean', 'Boolean value found', r);
    });
    this.presentToast('getBoolean');
  }
  getLong()
  {
    console.log('getLong');
    this.clevertap.getLong().then(r => {
      this.clickAlert('getLong', 'Long value found', r)
        .then(() => this.presentToast('getLong'));
    });
  }
  getDouble()
  {
    console.log('getDouble');
    this.clevertap.getDouble().then(r => {
      this.clickAlert('getDouble', 'Double value found', r);
    });
    this.presentToast('getDouble');
  }
  reset()
  {
    console.log('reset');
    // this.clevertap.reset();
    this.clickAlert('reset', 'not called', 'Resets ProductConfig');
    this.presentToast('reset');
  }
  notifyDeviceReady()
  {
    console.log('notifyDeviceReady');
    this.clevertap.notifyDeviceReady();
    this.presentToast('notifyDeviceReady');
  }
  setDebugLevel()
  {
    console.log('setDebugLevel');
    this.clevertap.setDebugLevel(1);
    this.clickAlert('setDebugLevel',
      '0 is off, 1 is info, 2 is debug, default is 1',
      'Level set to 1');
    this.presentToast('setDebugLevel 1');
  }

}
