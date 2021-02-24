import { CleverTap } from '@ionic-native/clevertap';
import { ListItem } from '../models/Page';
import { UserActions } from '../helper/CleverTapActions';
const clevertap = CleverTap;

function handleUserAction(item: ListItem) {
  clevertap.setDebugLevel(3);
  console.log('Click Event:' + item.title);
  switch (item.userAction) {
    // events
    case UserActions.EventRecord:
      clevertap.recordEventWithName('foo');
      break;
    case UserActions.EventRecordWithProp:
      var map = {
        bar: 'zoo',
        startdate: Date(),
        enddate: Date(),
      };
      clevertap.recordEventWithNameAndProps('boo', map);
      break;
    case UserActions.EventRecordCharged:
      var details = {
        amount: 300,
        'Charged ID': 1234,
        paymentdate: Date(),
        transactiondate: Date(),
      };
      var items = [
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
      clevertap.recordChargedEventWithDetailsAndItems(details, items);
      break;

    // Login
    case UserActions.LoginPushProfile:
      var profile = {
        Identity: 'android12345',
        custom: 678910,
        lastLoginDate: Date(),
      };
      clevertap.profileSet(profile);
      break;

    case UserActions.LoginOnUserLogin:
      var onuserlogin = {
        Identity: 'android123456',
        custom: 678910121,
        lastLoginDate: Date(),
      };
      clevertap.onUserLogin(onuserlogin);
      break;
    case UserActions.LoginReplaceSingleProp:
      var profileUpdate = {
        Name: 'Updated User Name', // String
        Email: 'UpdatedUser@gmail.com', // Email address of the user
        Gender: 'F', // Can be either M or F
        Employed: 'N', // Can be either Y or N
        Education: 'College', // Can be either Graduate, College or School
        Married: 'N', // Can be either Y or N
        'MSG-push': false, // Disable push notifications
      };
      clevertap.profileSet(profileUpdate);
  }
}

export { handleUserAction as CleverTapAction };
