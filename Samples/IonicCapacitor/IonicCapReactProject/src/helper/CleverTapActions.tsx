export enum UserActions{
    // events
    EventRecord,
    EventRecordWithProp,
    EventRecordCharged,

    // user login
    LoginPushProfile,
    LoginOnUserLogin,
    LoginReplaceSingleProp,
    LoginAddSingleProp,
    LoginRemoveSingleProp,
    LoginReplaceMultiProp,
    LoginRemoveMultiProp,
    LoginProfileLocation,
    LoginGetUserProfileProp,

    // app inbox
    InboxFetch,

    // in-app
    InAppDismissPip,

    // display unit
    DisplayUnitElementClicked
}