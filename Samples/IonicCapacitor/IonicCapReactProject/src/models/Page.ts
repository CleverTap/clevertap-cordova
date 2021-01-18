import { UserActions } from "../clevertap/UserActions";

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