import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'app-inbox',
    title: 'App Inbox',
    items:[
        {
            userAction:UserActions.InboxShow,
            title:'Show Inbox'
        },
        {
            userAction:UserActions.InboxGetMessageCount,
            title:'Get Message Count'
        },
        {
            userAction:UserActions.InboxGetUnreadCount,
            title:'Get Unread Message Count'
        },
        {
            userAction:UserActions.InboxGetAllMessages,
            title:'Get All Messages'
        }
    ]
} as AppPage;

export default data;
