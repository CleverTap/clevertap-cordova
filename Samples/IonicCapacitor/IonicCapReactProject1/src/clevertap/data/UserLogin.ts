import {AppPage} from '../../models/Page'
import { UserActions } from '../UserActions'
const data =  {
    id:'user-profile',
    title: 'User Profile',
    items:[
        {
            userAction:UserActions.LoginPushProfile,
            title:'Push Profile'
        },
        {
            userAction:UserActions.LoginReplaceSingleProp,
            title:'Update(Replace) Single-Value Properties'
        },
        {
            userAction:UserActions.LoginAddSingleProp,
            title:'Update(Add) Single-Value Properties'
        },
        {
            userAction:UserActions.LoginRemoveSingleProp,
            title:'Update(Remove) Single-Value Properties'
        },
        {
            userAction:UserActions.LoginReplaceMultiProp,
            title:'Update(Replace) Multi-Value Property'
        },
        {
            userAction:UserActions.LoginRemoveMultiProp,
            title:'Update(Remove) Multi-Value Property'
        },
        {
            userAction:UserActions.LoginProfileLocation,
            title:'Profile Location'
        },
        {
            userAction:UserActions.LoginGetUserProfileProp,
            title:'Get User Profile Property'
        }
    ]
} as AppPage;
export default data;