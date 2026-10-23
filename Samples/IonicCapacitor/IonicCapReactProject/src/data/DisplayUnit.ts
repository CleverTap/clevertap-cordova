import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'display-unit',
    title: 'Display Unit',
    items:[
        {
            userAction:UserActions.EventRecord,
            title:'Record Event'
        },
        {
            userAction:UserActions.EventRecordWithProp,
            title:'Record Event With Properties'
        },
        {
            id:UserActions.EventRecordCharged,
            title:'Record Charged Event'
        },
        {
            userAction:UserActions.DisplayUnitElementClicked,
            title:'Push Display Unit Element Clicked'
        },
        {
            userAction:UserActions.DisplayUnitElementViewed,
            title:'Push Display Unit Element Viewed'
        },
        {
            userAction:UserActions.FetchNativeDisplayMeta,
            title:'Fetch Native Display Meta'
        }
]

}as AppPage;

export default data;