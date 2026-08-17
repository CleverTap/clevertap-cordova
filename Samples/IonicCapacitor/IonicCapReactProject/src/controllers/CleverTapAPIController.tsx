import { ListItem } from '../models/Page';
import { UserActions } from '../helper/CleverTapActions';

function handleUserAction(item: ListItem) {
  const clevertap = (window as any).CleverTap;
  if (!clevertap) return;
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
        Name: 'Updated User Name',
        Email: 'UpdatedUser@gmail.com',
        Gender: 'F',
        Employed: 'N',
        Education: 'College',
        Married: 'N',
        'MSG-push': false,
      };
      clevertap.profileSet(profileUpdate);
      break;

    case UserActions.LoginAddSingleProp:
      clevertap.profileSet({
        score: 100,
        city: 'Mumbai',
      });
      break;

    case UserActions.LoginRemoveSingleProp:
      clevertap.profileRemoveValueForKey('score');
      break;

    case UserActions.LoginReplaceMultiProp:
      clevertap.profileSetMultiValues('interests', ['sports', 'music', 'travel']);
      break;

    case UserActions.LoginRemoveMultiProp:
      clevertap.profileRemoveMultiValue('interests', 'music');
      break;

    case UserActions.LoginProfileLocation:
      clevertap.setLocation(19.076, 72.8777);
      break;

    case UserActions.LoginGetUserProfileProp:
      clevertap.profileGetProperty('Name', (res: any) => {
        console.log('profileGetProperty Name: ' + JSON.stringify(res));
      });
      break;

    // app inbox
    case UserActions.InboxShow:
      clevertap.showInbox({
        tabs: ['Offers', 'Promotions'],
        navBarTitle: 'My Inbox',
        navBarTitleColor: '#FF0000',
        navBarColor: '#FFFFFF',
        inboxBackgroundColor: '#AED6F1',
        backButtonTitle: 'Back',
        backButtonTitleColor: '#00FF00',
        showFooter: true,
      });
      break;

    case UserActions.InboxGetMessageCount:
      clevertap.getInboxMessageCount((count: number) => {
        console.log('Inbox message count: ' + count);
      });
      break;

    case UserActions.InboxGetUnreadCount:
      clevertap.getInboxMessageUnreadCount((count: number) => {
        console.log('Inbox unread message count: ' + count);
      });
      break;

    case UserActions.InboxGetAllMessages:
      clevertap.getAllInboxMessages((messages: any) => {
        console.log('All inbox messages: ' + JSON.stringify(messages));
      });
      break;

    // in-app
    case UserActions.InAppSuspend:
      clevertap.suspendInAppNotifications();
      break;

    case UserActions.InAppDiscard:
      clevertap.discardInAppNotifications(false);
      break;

    case UserActions.InAppResume:
      clevertap.resumeInAppNotifications();
      break;
  }
}

export { handleUserAction as CleverTapAction };
