import {Component} from '@angular/core';
import {ModelContentComponent} from "./content/model.content.component";
import {CleverTap} from '@awesome-cordova-plugins/clevertap'
import {ToastController} from '@ionic/angular'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  sections: Map<string, Array<string>>;

  constructor(public toastController: ToastController) {
    this.sections = new ModelContentComponent().data;
    CleverTap.setDebugLevel(3);
    //Create notification channel for Android O and above
    CleverTap.createNotificationChannel("BRTesting", "BRTesting", "BRTesting", 5, true);
    CleverTap.initializeInbox();
  }


  onItemClick($event, item: string) {
    this.presentToast(item);
    switch (item) {
      case "Record Event":
        CleverTap.recordEventWithName("foo");
        break;
      case "Record event with properties":
        const map = {
          bar: 'zoo',
          startdate: Date(),
          enddate: Date(),
        };
        CleverTap.recordEventWithNameAndProps('boo', map);
        break;
      case "Record Charged Event":
        const details = {
          amount: 300,
          'Charged ID': 1234,
          paymentdate: Date(),
          transactiondate: Date(),
        };
        const items = [
          {
            Category: 'Books',
            Quantity: 1,
            Title: 'Book Title',
            mfgDate: Date(),
          },
          {
            Category: 'Milk',
            Quantity: 1,
            mfgDate: Date(),
            bestBefore: Date(),
          },
        ];
        CleverTap.recordChargedEventWithDetailsAndItems(details, items);
        break;
      case "Record Screen Event":
        CleverTap.recordScreenView("HomeView");
        break;
      case "Push profile":
        CleverTap.profileSet({
          Identity: 'android12345',
          custom: 678910,
          Name: "John",
          lastLoginDate: Date()
        });
        CleverTap.profileSetMultiValues(
          "MyStuffList", ["one", "two"]
        );
        break;
      case "Update(Replace) Single-Value properties":
        CleverTap.profileSet({
          custom: 111111,
          Name: "Updated John"
        });
        break;
      case "Update(Add) Single-Value properties":
        CleverTap.profileSet({
          "Customer Type": "Silver", "Preferred Language": "English"
        });
        break;
      case "Update(Remove) Single-Value properties":
        CleverTap.profileRemoveValueForKey("custom");
        break;
      case "Update(Replace) Multi-Value property":
        CleverTap.profileSetMultiValues("MyStuffList", ["Bag", "Shoes"]);
        break;
      case "Update(Add) Multi-Value property":
        CleverTap.profileAddMultiValue("MyStuffList", "Coat");
        // or
        CleverTap.profileAddMultiValues("MyStuffList", ["Socks", "Scarf"]);
        break;
      case "Update(Remove) Multi-Value property":
        CleverTap.profileRemoveMultiValue("MyStuffList", "Coat");
        // or
        CleverTap.profileRemoveMultiValues("MyStuffList", ["Socks", "Scarf"]);
        break;
      case "Update(Add) Increment Value":
        CleverTap.profileIncrementValueBy("score", 50);
        break;
      case "Update(Add) Decrement Value":
        CleverTap.profileDecrementValueBy("score", 30);
        break;
      case "Profile Location":
        CleverTap.setLocation(19.232390, 72.827530);
        break;
      case "Get User Profile Property":
        CleverTap.profileGetProperty("Name").then(r => this.presentToast("Property value of Name is " + r));
        break;
      case "onUserLogin":
        let n, p;
        n = this.getRandom(0, 10000);
        p = this.getRandom(10000, 99999);
        const newProfile = {
          Name: `Don Joe ${n}`,
          Email: `donjoe${n}@gmail.com`,
          Phone: `+141566${p}`,
          Identity: `${n}`
        };
        CleverTap.onUserLogin(newProfile);
        break;
      case "Open Inbox":
        CleverTap.showInbox({})
        break;
      case "Show Total Counts":
        CleverTap.getInboxMessageCount().then(r => this.presentCustomTextToast(`Total inbox message count = ${r}`));
        break;
      case "Show Unread Counts":
        CleverTap.getInboxMessageUnreadCount().then(r => this.presentCustomTextToast(`Unread inbox message count = ${r}`));
        break;
      case "Get All Inbox Messages":
        CleverTap.getAllInboxMessages().then(val => console.log(`All inbox messages = ${JSON.stringify(val)}`));
        break;
      case "Get Unread Messages":
        CleverTap.getUnreadInboxMessages().then(val => console.log(`All unread inbox messages = ${JSON.stringify(val)}`));
        break;
      case "Get InboxMessage by messageID":
        CleverTap.getInboxMessageForId("your message Id");
        break;
      case "Delete InboxMessage by messageID":
        CleverTap.deleteInboxMessageForId("your message Id");
        break;
      case "Mark as read by messageID":
        CleverTap.markReadInboxMessageForId("your message Id");
        break;
      case "Notification Viewed event for Message":
        CleverTap.pushInboxNotificationViewedEventForId("your message Id");
        break;
      case "Notification Clicked event for Message":
        CleverTap.pushInboxNotificationClickedEventForId("your message Id");
        break;
      case "Basic Push":
        CleverTap.recordEventWithName("Send Basic Push");
        break;
      case
      "Carousel Push":
        CleverTap.recordEventWithName("Send Carousel Push");
        break;
      case
      "Manual Carousel Push":
        CleverTap.recordEventWithName("Send Manual Carousel Push");
        break;
      case
      "FilmStrip Carousel Push":
        CleverTap.recordEventWithName("Send Filmstrip Carousel Push");
        break;
      case
      "Rating Push":
        CleverTap.recordEventWithName("Send Rating Push");
        break;
      case
      "Product Display":
        CleverTap.recordEventWithName("Send Product Display Notification");
        break;
      case
      "Linear Product Display":
        CleverTap.recordEventWithName("Send Linear Product Display Push");
        break;
      case
      "Five CTA":
        CleverTap.recordEventWithName("Send CTA Notification");
        break;
      case
      "Zero Bezel":
        CleverTap.recordEventWithName("Send Zero Bezel Notification");
        break;
      case
      "Zero Bezel Text Only":
        CleverTap.recordEventWithName("Send Zero Bezel Text Only Notification");
        break;
      case
      "Timer Push":
        CleverTap.recordEventWithName("Send Timer Notification");
        break;
      case
      "Input Box - CTA + reminder Push Campaign - DOC true":
        CleverTap.recordEventWithName("Send Input Box Notification");
        break;
      case
      "Input Box - Reply with Event":
        CleverTap.recordEventWithName("Send Input Box Reply with Event Notification");
        break;
      case
      "Input Box - Reply with Intent":
        CleverTap.recordEventWithName("Send Input Box Reply with Auto Open Notification");
        break;
      case
      "Input Box - CTA + reminder Push Campaign - DOC false":
        CleverTap.recordEventWithName("Send Input Box Remind Notification DOC FALSE");
        break;
      case
      "Input Box - CTA - DOC true":
        CleverTap.recordEventWithName("Send Input Box CTA DOC true");
        break;
      case
      "Input Box - CTA - DOC false":
        CleverTap.recordEventWithName("Send Input Box CTA DOC false");
        break;
      case
      "Input Box - reminder - DOC true":
        CleverTap.recordEventWithName("Send Input Box Reminder DOC true");
        break;
      case
      "Input Box - reminder - DOC false":
        CleverTap.recordEventWithName("Send Input Box Reminder DOC false");
        break;
      case
      "Three CTA":
        CleverTap.recordEventWithName("Send Three CTA Notification");
        break;
    }

  }

  getRandom(min, max): number {
    return Math.random() * (max - min) + min;
  }

  async presentToast(item: string) {
    const toast = await this.toastController.create({
      message: '' +
        'running command ' + item + '....',
      duration: 2000
    });
    toast.present();
  }

  async presentCustomTextToast(item: string) {
    const toast = await this.toastController.create({
      message: item,
      duration: 2000
    });
    toast.present();
  }
}
