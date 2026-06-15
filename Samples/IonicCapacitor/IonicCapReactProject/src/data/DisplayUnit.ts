import {AppPage} from '../models/Page'
import { UserActions } from '../helper/CleverTapActions';

const data = {
    id:'display-unit',
    title: 'Display Unit',
    items:[
        {
            userAction:UserActions.PushDisplayUnitElementClicked,
            title:'Push Display Unit Element Clicked'
        }
]

}as AppPage;

export default data;
