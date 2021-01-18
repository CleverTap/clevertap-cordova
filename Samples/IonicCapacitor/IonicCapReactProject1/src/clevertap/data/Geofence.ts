import {AppPage} from '../../models/Page'
import { UserActions } from '../UserActions';

const data = {
    id:'geofence',
    title: 'Geofence',
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