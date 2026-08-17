import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'inapp',
    title: 'In-App',
    items:[
        {
            userAction:UserActions.InAppSuspend,
            title:'Suspend In-App Notifications'
        },
        {
            userAction:UserActions.InAppDiscard,
            title:'Discard In-App Notifications'
        },
        {
            userAction:UserActions.InAppResume,
            title:'Resume In-App Notifications'
        }
    ]
} as AppPage;

export default data;
