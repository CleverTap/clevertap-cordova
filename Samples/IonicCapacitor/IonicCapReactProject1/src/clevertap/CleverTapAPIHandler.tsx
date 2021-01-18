import {CleverTap} from '@ionic-native/clevertap'
import { ListItem } from '../models/Page'
import {UserActions} from './UserActions'
const clevertap = CleverTap;
function handleUserAction(item:ListItem){
    clevertap.setDebugLevel(3);
    console.log('Click Event:'+ item.title)
    switch(item.userAction){
        // events
        case UserActions.EventRecord:
            clevertap.recordEventWithName("foo");
            break;
        case UserActions.EventRecordWithProp:
            clevertap.recordEventWithNameAndProps("boo", {"bar":"zoo"});
            break;
        case UserActions.EventRecordCharged:
            clevertap.recordChargedEventWithDetailsAndItems({"amount":300, "Charged ID":1234}, [{"Category":"Books", "Quantity":1, "Title":"Book Title"}]);
            break;

        // Login
        case UserActions.LoginPushProfile:
            clevertap.profileSet({"Identity":"android12345", "custom":678910})
            break;
    }    
}

export {handleUserAction as CleverTapAction} 