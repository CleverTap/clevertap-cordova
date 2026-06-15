import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'app-inbox',
    title: 'App Inbox',
    items:[
        {
            userAction:UserActions.FetchInbox,
            title:'Fetch Inbox'
        }
]

}as AppPage;

export default data;
