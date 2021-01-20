import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'feature-flag',
    title: 'Feature Flag',
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
        }
]

}as AppPage;

export default data;