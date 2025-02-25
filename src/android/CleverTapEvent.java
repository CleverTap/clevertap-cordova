package com.clevertap.cordova;

public enum CleverTapEvent {
    ON_DEEP_LINK("onDeepLink"),
    ON_PUSH_NOTIFICATION("onPushNotification"),
    ON_CLEVERTAP_PUSH_NOTIFICATION_TAPPED_WITH_CUSTOM_EXTRAS("onCleverTapPushNotificationTappedWithCustomExtras"),
    ON_CLEVERTAP_DISPLAY_UNITS_LOADED("onCleverTapDisplayUnitsLoaded"),
    ON_CLEVERTAP_INBOX_DID_INITIALIZE("onCleverTapInboxDidInitialize"),
    ON_CLEVERTAP_INBOX_MESSAGES_DID_UPDATE("onCleverTapInboxMessagesDidUpdate"),
    ON_CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED("onCleverTapInAppNotificationDismissed"),
    ON_CLEVERTAP_PUSH_PERMISSION_RESPONSE_RECEIVED("onCleverTapPushPermissionResponseReceived"),
    ON_CLEVERTAP_PROFILE_SYNC("onCleverTapProfileSync"),
    ON_CLEVERTAP_PROFILE_DID_INITIALIZE("onCleverTapProfileDidInitialize"),
    ON_CLEVERTAP_INBOX_BUTTON_CLICK("onCleverTapInboxButtonClick"),
    ON_CLEVERTAP_IN_APP_NOTIFICATION_SHOW("onCleverTapInAppNotificationShow"),
    ON_CLEVERTAP_INBOX_ITEM_CLICK("onCleverTapInboxItemClick"),
    ON_CLEVERTAP_IN_APP_BUTTON_CLICK("onCleverTapInAppButtonClick"),
    ON_CLEVERTAP_FEATURE_FLAGS_DID_UPDATE("onCleverTapFeatureFlagsDidUpdate"),
    ON_CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE("onCleverTapProductConfigDidInitialize"),
    ON_CLEVERTAP_PRODUCT_CONFIG_DID_FETCH("onCleverTapProductConfigDidFetch"),
    ON_CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE("onCleverTapProductConfigDidActivate"),
    ON_CLEVERTAP_PUSH_AMP_PAYLOAD_DID_RECEIVE("onCleverTapPushAmpPayloadDidReceived"),
    CLEVERTAP_CUSTOM_TEMPLATE_PRESENT("CleverTapCustomTemplatePresent"),
    CLEVERTAP_CUSTOM_TEMPLATE_CLOSE("CleverTapCustomTemplateClose"),
    CLEVERTAP_CUSTOM_FUNCTION_PRESENT("CleverTapCustomFunctionPresent"),
    CLEVERTAP_UNKNOWN("CleverTapUnknown");

    private final String eventName;

    CleverTapEvent(String eventName) {
        this.eventName = eventName;
    }

    public String getEventName() {
        return eventName;
    }

    public static com.clevertap.cordova.CleverTapEvent fromString(String eventName) {
        for (com.clevertap.cordova.CleverTapEvent event : com.clevertap.cordova.CleverTapEvent.values()) {
            if (event.eventName.equals(eventName)) {
                return event;
            }
        }
        return CLEVERTAP_UNKNOWN;
    }
}
