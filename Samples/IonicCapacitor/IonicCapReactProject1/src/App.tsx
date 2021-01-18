import Menu from './components/leftnav/LeftNav';
import Page from './components/pages/Page';
import React, {Component} from 'react';
import {CleverTap} from '@ionic-native/clevertap'
import { 
  IonApp, 
  IonRouterOutlet, 
  IonSplitPane 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
type Props = {};
export default class App extends Component<Props> {

  componentWillMount() {
    console.log('Component WILL MOUNT123!')
  }

  componentDidMount() {
    // optional: add listeners for CleverTap Events
    

    CleverTap.setDebugLevel(3);
    // for iOS only: register for push notifications

    // for iOS only; record a Screen View

    //Create notification channel for Android O and above
    CleverTap.createNotificationChannel("BRTesting", "BRTesting", "BRTesting", 5, true);
    //initialize the App Inbox
    CleverTap.initializeInbox();
    document.addEventListener('onCleverTapProfileDidInitialize', (e: any) => {
      console.log("onCleverTapProfileDidInitialize");
      console.log(e.CleverTapID);
    });

    document.addEventListener('onCleverTapInAppNotificationDismissed', (e: any) => {
      console.log("onCleverTapInAppNotificationDismissed");
      console.log(JSON.stringify(e.extras));
      console.log(JSON.stringify(e.actionExtras));
    });

    //deeplink handling
    document.addEventListener('onDeepLink', (e: any) => {
      console.log("onDeepLink");
      console.log(e.deeplink);
    });

    //push notification payload handling
    document.addEventListener('onPushNotification', (e: any) => {
      console.log("onPushNotification");
      console.log(JSON.stringify(e.notification));
    });
    
}

componentWillUnmount() {
    // clean up listeners
    document.removeEventListener('onCleverTapProfileDidInitialize', (e: any) => {
    });

    document.removeEventListener('onCleverTapInAppNotificationDismissed', (e: any) => {
    });

    //deeplink handling
    document.removeEventListener('onDeepLink', (e: any) => {
    });

    //push notification payload handling
    document.removeEventListener('onPushNotification', (e: any) => {
    });
}

  render(){
    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/page/:name" component={Page} exact />
              <Redirect from="/" to="/page/events" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );
  }
}

