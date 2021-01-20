import { UserActions } from "../helper/CleverTapActions";
export interface AppPage {
    id:string;
    url: string;
    title: string;
    items:ListItem[];
}
export interface ListItem{
    userAction:UserActions;
    title:string;
}