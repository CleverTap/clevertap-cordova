import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'in-app',
    title: 'In-App',
    items:[
        {
            userAction:UserActions.InAppDismissPip,
            title:'Dismiss Pip InApp'
        }
]

}as AppPage;

export default data;
