import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

declare var CleverTap: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  getCleverTap = () => {
    try {
      return CleverTap;
    } catch(e) {
      console.warn("CleverTap not available in the browser, run in a device/simulator");
      return null;
    }
  };

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      var clevertap = this.getCleverTap();
      if (clevertap) {
        clevertap.setDebugLevel(2);
        clevertap.profileGetCleverTapID((id) => {console.log(id)});
      }
    });
  }
}
