import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CleverTap } from '@ionic-native/clevertap/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [StatusBar, SplashScreen]
})
export class AppComponent {

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, clevertap: CleverTap) {
    platform.ready().then(() => {
      // once the platform is ready and plugins are available,
      // do all higher level native things
      statusBar.styleDefault();
      splashScreen.hide();

      document.addEventListener('onCleverTapProfileDidInitialize', (e: any) => {
        console.log('onCleverTapProfileDidInitialize');
        console.log(e.CleverTapID);
      });

      document.addEventListener('onCleverTapInAppNotificationDismissed', (e: any) => {
        console.log('onCleverTapInAppNotificationDismissed');
        console.log(JSON.stringify(e.extras));
        console.log(JSON.stringify(e.actionExtras));
      });
      document.addEventListener('onDeepLink', (e: any) => {
        console.log('onDeepLink');
        console.log(e.deeplink);
      });
      document.addEventListener('onPushNotification', (e: any) => {
        console.log('onPushNotification');
        console.log(JSON.stringify(e.notification));
      });

      clevertap.setDebugLevel(3);
      clevertap.enablePersonalization();
      clevertap.registerPush();

      clevertap.createNotificationChannel('TEST_CHANNEL', 'Test Channel', 'A TEST channel', 0, true);
      clevertap.profileGetCleverTapID().then((id) => {
        console.log('CleverTapID: ' + id);
      });
      /*
      clevertap.recordEventWithName('foo');
      clevertap.recordEventWithNameAndProps('boo', {bar: 'zoo'});
      clevertap.recordScreenView('Home');
      clevertap.recordChargedEventWithDetailsAndItems({amount: 300, 'Charged ID': 1234}, [{
        Category: 'Books',
        Quantity: 1,
        Title: 'Book Title'
      }]);
       */
      clevertap.eventGetFirstTime('Cordova Event 1').then((time) => {
        console.log('CE1 event first time is ' + time);
      });
      clevertap.eventGetLastTime('App Launched').then((time) => {
        console.log('app launched last time is ' + time);
      });
      clevertap.eventGetOccurrences('foo').then((num) => {
        console.log('foo event occurrences ' + num);
      });
      clevertap.eventGetDetails('Charged').then((res) => {
        console.log(JSON.stringify(res));
      });
      clevertap.getEventHistory().then((history) => {
        console.log(JSON.stringify(history));
      });
      clevertap.eventGetFirstTime('noevent').then((time) => {
        console.log('noevent event first time is ' + time);
      });
      clevertap.eventGetLastTime('noevent').then((time) => {
        console.log('noevent last time is ' + time);
      });
      clevertap.eventGetOccurrences('noevent').then((num) => {
        console.log('noevent occurrences ' + num);
      });
      clevertap.eventGetDetails('noevent').then((res) => {
        console.log(JSON.stringify(res));
      });
      // clevertap.onUserLogin({Identity: 'android098768', custom: 122211});
      clevertap.profileSet({Identity: 'a12345678', custom12: 1.311});
      clevertap.profileGetProperty('Identity').then((val) => {
        console.log('Identity profile value is ' + val);
      });
      clevertap.profileGetProperty('custom').then((val) => {
        console.log('custom profile value is ' + val);
      });
      clevertap.sessionGetTimeElapsed().then((val) => {
        console.log('session elapsed time is ' + val);
      });
      clevertap.sessionGetTotalVisits().then((val) => {
        console.log('session total visits is ' + val);
      });
      clevertap.sessionGetScreenCount().then((val) => {
        console.log('session screen count is ' + val);
      });
      clevertap.sessionGetPreviousVisitTime().then((val) => {
        console.log('session previous visit time is ' + val);
      });
      clevertap.sessionGetUTMDetails().then((val) => {
        console.log(JSON.stringify(val));
      });
    });
  }
}
