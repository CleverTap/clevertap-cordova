(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "A3+G":
/*!*********************************************!*\
  !*** ./src/app/home/home-routing.module.ts ***!
  \*********************************************/
/*! exports provided: HomePageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageRoutingModule", function() { return HomePageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home.page */ "zpKS");




const routes = [
    {
        path: '',
        component: _home_page__WEBPACK_IMPORTED_MODULE_3__["HomePage"],
    }
];
let HomePageRoutingModule = class HomePageRoutingModule {
};
HomePageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], HomePageRoutingModule);



/***/ }),

/***/ "WcN3":
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!--<ion-header [translucent]=\"true\">\n  <ion-toolbar>\n    <ion-title>\n      Hello there!\n    </ion-title>\n  </ion-toolbar>\n</ion-header>-->\n\n<ion-content [fullscreen]=\"true\">\n  <ion-header>\n    <ion-toolbar>\n\n      <ion-title size=\"large\">CleverTap Ionic App</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <!-- functions removed, need to rework -->\n  <ion-list>\n    <ion-item>True functions list</ion-item>\n    <ion-item>\n      <ion-button expand=\"block\" (click)=\"clickAlert()\">Button One</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"presentModal()\">CT Inbox (WIP)</ion-button>\n    </ion-item>\n    <ion-item>\n      <!-- (click)=\"pushChargedEvent1(?)\" -->\n      <ion-button expand=\"full\" (click)=\"pushChargedEvent1()\">Push Charged Event</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Events</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"recordEventWithName()\">\n        recordEventWithName</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordEventWithNameAndProps()\">\n        recordEventWithNameAndProps</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordChargedEventWithDetailsAndItems()\">\n        recordChargedEventWithDetailsAndItems</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetFirstTime()\">\n        eventGetFirstTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetLastTime()\">\n        eventGetLastTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetOccurrences()\">\n        eventGetOccurrences</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetDetails()\">\n        eventGetDetails</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getEventHistory()\">\n        getEventHistory</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordScreenView()\">\n        recordScreenView</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Profile</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"getLocation()\">\n        getLocation</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setLocation()\">\n        setLocation</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"onUserLogin()\">\n        onUserLogin</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSet()\">\n        profileSet</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSetGraphUser()\">\n        profileSetGraphUser</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGooglePlusUser()\">\n        profileGooglePlusUser</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetProperty()\">\n        profileGetProperty</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetCleverTapAttributionIdentifier()\">\n        profileGetCleverTapAttributionIdentifier</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetCleverTapID()\">\n        profileGetCleverTapID</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveValueForKey()\">\n        profileRemoveValueForKey</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSetMultiValues()\">\n        profileSetMultiValues</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileAddMultiValue()\">\n        profileAddMultiValue</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileAddMultiValues()\">\n        profileAddMultiValues</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveMultiValue()\">\n        profileRemoveMultiValue</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveMultiValues()\">\n        profileRemoveMultiValues</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Personalization</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"enablePersonalization()\">\n        enablePersonalization</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"disablePersonalization()\">\n        disablePersonalization</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setOptOut()\">\n        setOptOut</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setOffline()\">\n        setOffline</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"enableDeviceNetworkInfoReporting()\">\n        enableDeviceNetworkInfoReporting</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Push</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"registerPush()\">\n        registerPush</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushToken()\">\n        setPushToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushXiaomiToken()\">\n        setPushXiaomiToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushBaiduToken()\">\n        setPushBaiduToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushHuaweiToken()\">\n        setPushHuaweiToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotification()\">\n        createNotification</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannel()\">\n        createNotificationChannel</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithSound()\">\n        createNotificationChannelWithSound</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithGroupId()\">\n        createNotificationChannelWithGroupId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithGroupIdAndSound()\">\n        createNotificationChannelWithGroupIdAndSound</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelGroup()\">\n        createNotificationChannelGroup</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteNotificationChannel()\">\n        deleteNotificationChannel</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteNotificationChannelGroup()\">\n        deleteNotificationChannelGroup</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Session</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"sessionGetTimeElapsed()\">\n        sessionGetTimeElapsed</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetTotalVisits()\">\n        sessionGetTotalVisits</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetScreenCount()\">\n        sessionGetScreenCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetPreviousVisitTime()\">\n        sessionGetPreviousVisitTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetUTMDetails()\">\n        sessionGetUTMDetails</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInstallReferrer()\">\n        pushInstallReferrer</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>In-App Inbox</ion-label>\n      <ion-button (click)=\"infoInbox()\">Info</ion-button>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"initializeInbox()\">\n        initializeInbox</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageUnreadCount()\">\n        getInboxMessageUnreadCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageCount()\">\n        getInboxMessageCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"showInbox()\">\n        showInbox</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getAllInboxMessages()\">\n        getAllInboxMessages</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getUnreadInboxMessages()\">\n        getUnreadInboxMessages</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageForId()\">\n        getInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteInboxMessageForId()\">\n        deleteInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"markReadInboxMessageForId()\">\n        markReadInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInboxNotificationViewedEventForId()\">\n        pushInboxNotificationViewedEventForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInboxNotificationClickedEventForId()\">\n        pushInboxNotificationClickedEventForId</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Miscellaneous Variable Functions</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"setUIEditorConnectionEnabled()\">\n        setUIEditorConnectionEnabled</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerBooleanVariable()\">\n        registerBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerDoubleVariable()\">\n        registerDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerIntegerVariable()\">\n        registerIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerStringVariable()\">\n        registerStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerListOfBooleanVariable()\">\n        registerListOfBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerListOfDoubleVariable()\">\n        registerListOfDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerListOfIntegerVariable()\">\n        registerListOfIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerListOfStringVariable()\">\n        registerListOfStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerMapOfBooleanVariable()\">\n        registerMapOfBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerMapOfDoubleVariable()\">\n        registerMapOfDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerMapOfIntegerVariable()\">\n        registerMapOfIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"registerMapOfStringVariable()\">\n        registerMapOfStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getBooleanVariable()\">\n        getBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getDoubleVariable()\">\n        getDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getIntegerVariable()\">\n        getIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getStringVariable()\">\n        getStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getListOfBooleanVariable()\">\n        getListOfBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getListOfDoubleVariable()\">\n        getListOfDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getListOfIntegerVariable()\">\n        getListOfIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getListOfStringVariable()\">\n        getListOfStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getMapOfBooleanVariable()\">\n        getMapOfBooleanVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getMapOfDoubleVariable()\">\n        getMapOfDoubleVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getMapOfIntegerVariable()\">\n        getMapOfIntegerVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getMapOfStringVariable()\">\n        getMapOfStringVariable</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getAllDisplayUnits()\">\n        getAllDisplayUnits</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getDisplayUnitForId()\">\n        getDisplayUnitForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushDisplayUnitViewedEventForID()\">\n        pushDisplayUnitViewedEventForID</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushDisplayUnitClickedEventForID()\">\n        pushDisplayUnitClickedEventForID</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getFeatureFlag()\">\n        getFeatureFlag</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setDefaultsMap()\">\n        setDefaultsMap</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>ProductConfig</ion-label>\n      <ion-button (click)=\"infoProductConfig()\">Info</ion-button>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"fetch()\">fetch</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"fetchWithMinimumFetchIntervalInSeconds()\">\n        fetchWithMinimumFetchIntervalInSeconds</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"activate()\">\n        activate</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"fetchAndActivate()\">\n        fetchAndActivate</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setMinimumFetchIntervalInSeconds()\">\n        setMinimumFetchIntervalInSeconds</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getLastFetchTimeStampInMillis()\">\n        getLastFetchTimeStampInMillis</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getString()\">\n        getString</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getBoolean()\">\n        getBoolean</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getLong()\">\n        getLong</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getDouble()\">\n        getDouble</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"reset()\">\n        reset</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Developer Options</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"notifyDeviceReady()\">\n        notifyDeviceReady</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setDebugLevel()\">\n        setDebugLevel</ion-button>\n    </ion-item>\n  </ion-list>\n</ion-content>\n\n<!--\n<div id=\"container\">\n//id=\"container\" sticks this div to the centre of the screen\n<br/><br/><strong>Ready to create an app?</strong>\n<p>Get started with CleverTap Cordova + Ionic<br/>\n  <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://github.com/CleverTap/clevertap-cordova\">\n    View the repository</a></p>\n</div>\n-->\n<ion-footer>\n  <ion-toolbar>\n\n  </ion-toolbar>\n</ion-footer>\n");

/***/ }),

/***/ "ct+p":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./home.page */ "zpKS");
/* harmony import */ var _home_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home-routing.module */ "A3+G");







let HomePageModule = class HomePageModule {
};
HomePageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"],
            _home_routing_module__WEBPACK_IMPORTED_MODULE_6__["HomePageRoutingModule"]
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_5__["HomePage"]]
    })
], HomePageModule);



/***/ }),

/***/ "f6od":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".InboxModalClass {\n  --background: #93b3ff;\n}\n.InboxModalClass ion-label {\n  font-family: serif;\n  color: #0068c6;\n  font-size: 25px;\n}\nbody {\n  background-color: #0a4966;\n}\nion-item {\n  --background: #93b3ff;\n}\nion-button {\n  solid-color: #8c8c8c;\n  color: #0d0d0d;\n}\nion-toolbar {\n  --background: #0e2c75;\n  color: #f1e6e6;\n}\nion-label {\n  font-family: serif;\n  color: #0068c6;\n  font-size: 25px;\n}\n#container {\n  text-align: center;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50%;\n}\n#container strong {\n  font-size: 20px;\n  line-height: 26px;\n}\n#container p {\n  font-size: 16px;\n  line-height: 22px;\n  color: #8c8c8c;\n  margin: 0;\n}\n#container a {\n  text-decoration: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXGhvbWUucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBTUUscUJBQUE7QUFKRjtBQURFO0VBQ0Usa0JBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtBQUdKO0FBQ0E7RUFDRSx5QkFBQTtBQUVGO0FBQUE7RUFDRSxxQkFBQTtBQUdGO0FBREE7RUFDRSxvQkFBQTtFQUNBLGNBQUE7QUFJRjtBQUZBO0VBQ0UscUJBQUE7RUFDQSxjQUFBO0FBS0Y7QUFGQTtFQUNFLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7QUFLRjtBQUZBO0VBQ0Usa0JBQUE7RUFDQSxrQkFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsUUFBQTtBQUtGO0FBRkE7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7QUFLRjtBQUZBO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0VBRUEsY0FBQTtFQUVBLFNBQUE7QUFHRjtBQUFBO0VBQ0UscUJBQUE7QUFHRiIsImZpbGUiOiJob21lLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5JbmJveE1vZGFsQ2xhc3Mge1xuICBpb24tbGFiZWx7XG4gICAgZm9udC1mYW1pbHk6IHNlcmlmO1xuICAgIGNvbG9yOiAjMDA2OGM2O1xuICAgIGZvbnQtc2l6ZTogMjVweDtcbiAgfVxuICAtLWJhY2tncm91bmQ6ICM5M2IzZmY7XG59XG5ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBhNDk2Njtcbn1cbmlvbi1pdGVtIHtcbiAgLS1iYWNrZ3JvdW5kOiAjOTNiM2ZmO1xufVxuaW9uLWJ1dHRvbntcbiAgc29saWQtY29sb3I6ICM4YzhjOGM7XG4gIGNvbG9yOiAjMGQwZDBkO1xufVxuaW9uLXRvb2xiYXJ7XG4gIC0tYmFja2dyb3VuZDogIzBlMmM3NTtcbiAgY29sb3I6ICNmMWU2ZTY7XG59XG5cbmlvbi1sYWJlbCB7XG4gIGZvbnQtZmFtaWx5OiBzZXJpZjtcbiAgY29sb3I6ICMwMDY4YzY7XG4gIGZvbnQtc2l6ZTogMjVweDtcbn1cblxuI2NvbnRhaW5lciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgdG9wOiA1MCU7XG59XG5cbiNjb250YWluZXIgc3Ryb25nIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsaW5lLWhlaWdodDogMjZweDtcbn1cblxuI2NvbnRhaW5lciBwIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBsaW5lLWhlaWdodDogMjJweDtcblxuICBjb2xvcjogIzhjOGM4YztcblxuICBtYXJnaW46IDA7XG59XG5cbiNjb250YWluZXIgYSB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cbiJdfQ== */");

/***/ }),

/***/ "zpKS":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_home_page_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./home.page.html */ "WcN3");
/* harmony import */ var _home_page_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home.page.scss */ "f6od");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ionic_native_clevertap_ngx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic-native/clevertap/ngx */ "S2p3");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ "TEn/");






// import { ModalController} from '@ionic/angular';
let HomePage = class HomePage {
    constructor(clevertap, toastController) {
        this.clevertap = clevertap;
        this.toastController = toastController;
        clevertap.onUserLogin({ Identity: 'android098768', custom: 122211 }).then(() => this.presentToast('User Login'));
        customElements.define('modal-page', class extends HTMLElement {
            connectedCallback() {
                this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title>CT Inbox</ion-title>
    <ion-buttons slot="primary">
      <ion-button onClick=>
        <!-- dismissModal not recognized -->
        <ion-icon slot="icon-only" name="close" (click)="dismissModal()"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <ion-list>
  <ion-list-header>
      <ion-label>Inbox Messages</ion-label>
    </ion-list-header>
    <ion-item><ion-label>
        <h2>Message 1</h2>
        <p>Details inside Message 1</p>
        </ion-label>
    </ion-item>
    <ion-item><ion-label>
        <h2>Message 2</h2>
        <p>Details inside Message 2</p>
        </ion-label>
    </ion-item>
    <ion-item><ion-label>
        <h2>Message 3</h2>
        <p>Details inside Message 3</p>
        </ion-label>
    </ion-item>
    <ion-list-header>
      <ion-label>CleverTap Functions</ion-label>
    </ion-list-header>
    <ion-item>
      <ion-button expand="full">InitializeInbox</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="full">getAllInboxMessages</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="block">getUnreadInboxMessages</ion-button>
    </ion-item>
  </ion-list>
</ion-content>`;
            }
        });
    }
    presentToast(message) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const toast = yield this.toastController.create({
                message,
                duration: 2000
            });
            yield toast.present();
            const { role } = yield toast.onDidDismiss();
            console.log('onDidDismiss resolved with role', role);
        });
    }
    presentModal() {
        // create the modal with the `modal-page` component
        const modalElement = document.createElement('ion-modal');
        modalElement.component = 'modal-page';
        modalElement.cssClass = 'InboxModalClass';
        // present the modal
        document.body.appendChild(modalElement);
        return modalElement.present();
        function dismissModal() {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                console.log('dismiss called');
                yield modalElement.dismiss({
                    dismissed: true
                });
            });
        }
    }
    /* angular function, not used
    async function dismissModal() {
    await modal.dismiss({
      'dismissed': true
    });
  } Function used above
    dismissModal() {
      const modalElement = document.getElementsByTagName('ion-modal')[0];
      return modalElement.dismiss();
    }
    */
    clickAlert(header = 'Alert', subHeader = 'An Alert you Made', message = 'This is an alert message.') {
        const alert = document.createElement('ion-alert');
        alert.cssClass = 'my-custom-class';
        alert.header = header;
        alert.subHeader = subHeader;
        alert.message = message;
        alert.buttons = [{
                text: 'Okay',
                handler: () => {
                    console.log('Neutral response');
                }
            }, {
                text: 'Yes!',
                handler: () => {
                    console.log('Enthusiastic response');
                }
            }];
        document.body.appendChild(alert);
        return alert.present();
    }
    pushChargedEvent1() {
        console.log('push charged event');
        this.clevertap.recordChargedEventWithDetailsAndItems({ amount: 900, 'Charged ID': 1234 }, [{
                Category: 'Book',
                Quantity: 1,
                Title: 'The Title Of This Book'
            }]);
        this.presentToast('Charged Event Pushed');
    }
    recordEventWithName() {
        console.log('recordEventWithName');
        this.clevertap.recordEventWithName('Test Event');
        this.presentToast('recordEventWithName \"Test Event\"');
    }
    recordEventWithNameAndProps() {
        console.log('recordEventWithNameAndProps');
        this.clevertap.recordEventWithNameAndProps('Test Event with Properties', {
            'Property 1': 'First Prop',
            'Color of Text': 'Green'
        });
        this.presentToast('recordEventWithNameAndProps \"Test Event with Properties\"');
    }
    recordChargedEventWithDetailsAndItems() {
        // implemented above too
        console.log('recordChargedEventWithDetailsAndItems');
        this.clevertap.recordChargedEventWithDetailsAndItems({ amount: 200, 'Charged ID': 5678 }, [{
                Category: 'Food',
                Quantity: 2,
                Title: 'Eggs (Dozen)'
            }]);
        this.presentToast('recordChargedEventWithDetailsAndItems');
    }
    eventGetFirstTime() {
        console.log('eventGetFirstTime');
        this.clevertap.eventGetFirstTime('Test Event').then(r => {
            this.clickAlert('eventGetFirstTime', 'Test Event first pushed at', r)
                .then(() => this.presentToast('eventGetFirstTime'));
        });
    }
    eventGetLastTime() {
        console.log('eventGetLastTime');
        this.clevertap.eventGetLastTime('Test Event').then(r => {
            this.clickAlert('eventGetLastTime', 'Test Event last pushed at', r)
                .then(() => this.presentToast('eventGetLastTime'));
        });
    }
    eventGetOccurrences() {
        console.log('eventGetOccurrences');
        this.clevertap.eventGetOccurrences('Test Event').then(r => {
            this.clickAlert('eventGetOccurrences', 'Test Event total number of occurrences', r)
                .then(() => this.presentToast('eventGetOccurrences'));
        });
    }
    eventGetDetails() {
        console.log('eventGetDetails');
        this.clevertap.eventGetDetails('Test Event with Properties').then(r => {
            this.clickAlert('eventGetDetails', 'Details for \"Test Event with Properties\"', r.toString())
                .then(() => this.presentToast('eventGetDetails'));
        });
    }
    getEventHistory() {
        console.log('getEventHistory');
        this.clevertap.getEventHistory().then(r => {
            this.clickAlert('getEventHistory', 'Event History is as follows', r)
                .then(() => this.presentToast('getEventHistory'));
        });
    }
    recordScreenView() {
        console.log('recordScreenView');
        this.clevertap.recordScreenView('Default Screen');
        this.presentToast('recordScreenView');
    }
    getLocation() {
        console.log('getLocation');
        this.clevertap.getLocation().then(r => {
            this.clickAlert('getLocation', 'Location coordinates', r)
                .then(() => {
                this.presentToast('getLocation' + r);
            });
        });
    }
    setLocation() {
        console.log('setLocation');
        this.clevertap.setLocation(38.89, -77.04);
        this.presentToast('setLocation to (38.89, -77.04)');
    }
    onUserLogin() {
        console.log('onUserLogin');
        // this.clevertap.onUserLogin(profile:any);
        this.clickAlert('OnUserLogin', '(not called)', 'Creates a new profile, and used to switch between two profiles.' +
            ' Switching between identified users is a costly operation ');
        this.presentToast('onUserLogin');
    }
    profileSet() {
        console.log('profileSet');
        this.clevertap.profileSet({ Preference: 'Medium' }).then(() => {
            this.clickAlert('profileSet', 'Added new attribute', 'Preference: Medium')
                .then(() => {
                this.presentToast('profileSet');
            });
        });
    }
    profileSetGraphUser() {
        console.log('profileSetGraphUser');
        this.clevertap.profileSetGraphUser({ Frequency: 'Rare' }).then(() => {
            this.clickAlert('profileSetGraphUser', 'Added new attribute from Facebook User', 'Frequency: Rare')
                .then(() => {
                this.presentToast('profileSetGraphUser');
            });
        });
    }
    profileGooglePlusUser() {
        console.log('profileGooglePlusUser');
        this.clevertap.profileGooglePlusUser({ Surface: 'Smooth' }).then(() => {
            this.clickAlert('profileGooglePlusUser', 'Added new attribute from Google User', 'Surface: Smooth')
                .then(() => {
                this.presentToast('profileGooglePlusUser');
            });
        });
    }
    profileGetProperty() {
        console.log('profileGetProperty');
        this.clevertap.profileGetProperty('Preference').then(r => {
            this.clickAlert('profileGetProperty', 'Get value of Property: Preference', r)
                .then(() => this.presentToast('profileGetProperty' + r));
        });
    }
    profileGetCleverTapAttributionIdentifier() {
        console.log('profileGetCleverTapAttributionIdentifier');
        this.clevertap.profileGetCleverTapAttributionIdentifier();
        this.presentToast('profileGetCleverTapAttributionIdentifier');
    }
    profileGetCleverTapID() {
        console.log('profileGetCleverTapID');
        this.clevertap.profileGetCleverTapID().then(r => {
            this.clickAlert('profileGetCleverTapID', 'The ID that identifies a user', r)
                .then(() => {
                this.presentToast('profileGetCleverTapID' + r);
            });
        });
    }
    profileRemoveValueForKey() {
        console.log('profileRemoveValueForKey');
        this.clevertap.profileRemoveValueForKey('colors');
        this.presentToast('profileRemoveValueForKey');
    }
    profileSetMultiValues() {
        console.log('profileSetMultiValues');
        this.clevertap.profileSetMultiValues('colors', ['red', 'blue']);
        this.presentToast('profileSetMultiValues');
    }
    profileAddMultiValue() {
        console.log('profileAddMultiValue');
        this.clevertap.profileAddMultiValue('colors', 'green');
        this.presentToast('profileAddMultiValue');
    }
    profileAddMultiValues() {
        console.log('profileAddMultiValues');
        this.clevertap.profileAddMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileAddMultiValues');
    }
    profileRemoveMultiValue() {
        console.log('profileRemoveMultiValue');
        this.clevertap.profileRemoveMultiValue('colors', 'green');
        this.presentToast('profileRemoveMultiValue');
    }
    profileRemoveMultiValues() {
        console.log('profileRemoveMultiValues');
        this.clevertap.profileRemoveMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileRemoveMultiValues');
    }
    enablePersonalization() {
        console.log('enablePersonalization');
        this.clevertap.enablePersonalization();
        this.presentToast('enablePersonalization');
    }
    disablePersonalization() {
        console.log('disablePersonalization');
        this.clevertap.disablePersonalization();
        this.presentToast('disablePersonalization');
    }
    setOptOut() {
        console.log('setOptOut');
        this.clevertap.setOptOut(true);
        this.presentToast('setOptOut to true');
    }
    setOffline() {
        console.log('setOffline');
        this.clevertap.setOffline(false);
        this.presentToast('setOffline false');
    }
    enableDeviceNetworkInfoReporting() {
        console.log('enableDeviceNetworkInfoReporting');
        this.clevertap.enableDeviceNetworkInfoReporting(false);
        this.presentToast('enableDeviceNetworkInfoReporting false');
    }
    registerPush() {
        console.log('registerPush');
        this.clevertap.registerPush();
        this.presentToast('registerPush');
    }
    setPushToken() {
        console.log('setPushToken');
        this.clevertap.setPushToken('push_token');
        this.presentToast('setPushToken');
    }
    setPushXiaomiToken() {
        console.log('setPushXiaomiToken');
        this.clevertap.setPushXiaomiToken('push_token_X');
        this.presentToast('setPushXiaomiToken');
    }
    setPushBaiduToken() {
        console.log('setPushBaiduToken');
        this.clevertap.setPushBaiduToken('push_token_B');
        this.presentToast('setPushBaiduToken');
    }
    setPushHuaweiToken() {
        console.log('setPushHuaweiToken');
        this.clevertap.setPushHuaweiToken('push_token_H');
        this.presentToast('setPushHuaweiToken');
    }
    createNotification() {
        console.log('createNotification');
        this.clevertap.createNotification({
            name: 'Notification!',
            day: 'Monday'
        });
        this.presentToast('createNotification Creates Notification Channel');
    }
    createNotificationChannel() {
        console.log('createNotificationChannel');
        this.clevertap.createNotificationChannel('channelID_1234', 'Notification Channel', 'channelDescription', 1, true);
        this.presentToast('createNotificationChannel Creates Notification Channel');
    }
    createNotificationChannelWithSound() {
        console.log('createNotificationChannelWithSound');
        this.clevertap.createNotificationChannelWithSound('channelID_1234', 'Notification Channel', 'channelDescription', 1, true, 'sound_effect.mp3');
        this.presentToast('createNotificationChannelWithSound Creates Notification Channel');
    }
    createNotificationChannelWithGroupId() {
        console.log('createNotificationChannelWithGroupId');
        this.clevertap.createNotificationChannelWithGroupId('channelID_1234', 'Notification Channel', 'channelDescription', 1, 'GroupID', true);
        this.presentToast('createNotificationChannelWithGroupId Creates Notification Channel');
    }
    createNotificationChannelWithGroupIdAndSound() {
        console.log('createNotificationChannelWithGroupIdAndSound');
        this.clevertap.createNotificationChannelWithGroupIdAndSound('channelID_1234', 'Notification Channel', 'channelDescription', 1, 'groupID_5678', true, 'group_sound.mp3');
        this.presentToast('createNotificationChannelWithGroupIdAndSound Creates Notification Channel');
    }
    createNotificationChannelGroup() {
        console.log('createNotificationChannelGroup');
        this.clevertap.createNotificationChannelGroup('groupID_5678', 'Channel Group Name');
        this.presentToast('createNotificationChannelGroup Creates Notification Channel Group');
    }
    deleteNotificationChannel() {
        console.log('deleteNotificationChannel');
        this.clevertap.deleteNotificationChannel('channelID_1234');
        this.presentToast('deleteNotificationChannel Deletes Notification Channel');
    }
    deleteNotificationChannelGroup() {
        console.log('deleteNotificationChannelGroup');
        this.clevertap.deleteNotificationChannelGroup('groupID_5678');
        this.presentToast('deleteNotificationChannelGroup Deletes Notification Channel Group');
    }
    sessionGetTimeElapsed() {
        console.log('sessionGetTimeElapsed');
        this.clevertap.sessionGetTimeElapsed();
        this.presentToast('sessionGetTimeElapsed');
    }
    sessionGetTotalVisits() {
        console.log('sessionGetTotalVisits');
        this.clevertap.sessionGetTotalVisits();
        this.presentToast('sessionGetTotalVisits');
    }
    sessionGetScreenCount() {
        console.log('sessionGetScreenCount');
        this.clevertap.sessionGetScreenCount();
        this.presentToast('sessionGetScreenCount');
    }
    sessionGetPreviousVisitTime() {
        console.log('sessionGetPreviousVisitTime');
        this.clevertap.sessionGetPreviousVisitTime();
        this.presentToast('sessionGetPreviousVisitTime');
    }
    sessionGetUTMDetails() {
        console.log('sessionGetUTMDetails');
        this.clevertap.sessionGetUTMDetails();
        this.presentToast('sessionGetUTMDetails');
    }
    pushInstallReferrer() {
        console.log('pushInstallReferrer');
        this.clevertap.pushInstallReferrer('Source Name', 'Medium Name', 'Campaign Name');
        this.presentToast('pushInstallReferrer');
    }
    infoInbox() {
        this.clickAlert('In-App Inbox', '', 'These functions provide the capability to create App Inbox notifications for your users.' +
            'You can use the App Inbox provided by CleverTap or create your own.' +
            'You can design App Inbox notifications right from the dashboard.');
    }
    initializeInbox() {
        console.log('initializeInbox');
        this.clevertap.initializeInbox();
        this.presentToast('initializeInbox');
    }
    getInboxMessageUnreadCount() {
        console.log('getInboxMessageUnreadCount');
        this.clevertap.getInboxMessageUnreadCount();
        this.presentToast('getInboxMessageUnreadCount');
    }
    getInboxMessageCount() {
        console.log('getInboxMessageCount');
        this.clevertap.getInboxMessageCount();
        this.presentToast('getInboxMessageCount');
    }
    showInbox() {
        console.log('showInbox');
        this.clevertap.showInbox({});
        this.presentToast('showInbox');
    }
    getAllInboxMessages() {
        console.log('getAllInboxMessages');
        this.clevertap.getAllInboxMessages();
        this.presentToast('getAllInboxMessages');
    }
    getUnreadInboxMessages() {
        console.log('getUnreadInboxMessages');
        this.clevertap.getUnreadInboxMessages();
        this.presentToast('getUnreadInboxMessages');
    }
    getInboxMessageForId() {
        console.log('getInboxMessageForId');
        this.clevertap.getInboxMessageForId('message_ID_1234');
        this.presentToast('getInboxMessageForId');
    }
    deleteInboxMessageForId() {
        console.log('deleteInboxMessageForId');
        this.clevertap.deleteInboxMessageForId('message_ID_1234');
        this.presentToast('deleteInboxMessageForId');
    }
    markReadInboxMessageForId() {
        console.log('markReadInboxMessageForId');
        this.clevertap.markReadInboxMessageForId('message_ID_1234');
        this.presentToast('markReadInboxMessageForId');
    }
    pushInboxNotificationViewedEventForId() {
        console.log('pushInboxNotificationViewedEventForId');
        this.clevertap.pushInboxNotificationViewedEventForId('message_ID_1234');
        this.presentToast('pushInboxNotificationViewedEventForId');
    }
    pushInboxNotificationClickedEventForId() {
        console.log('pushInboxNotificationClickedEventForId');
        this.clevertap.pushInboxNotificationClickedEventForId('message_ID_1234');
        this.presentToast('pushInboxNotificationClickedEventForId');
    }
    setUIEditorConnectionEnabled() {
        console.log('setUIEditorConnectionEnabled');
        this.clevertap.setUIEditorConnectionEnabled(true);
        this.presentToast('setUIEditorConnectionEnabled');
    }
    registerBooleanVariable() {
        console.log('registerBooleanVariable');
        this.clevertap.registerBooleanVariable('var_bool');
        this.presentToast('registerBooleanVariable');
    }
    registerDoubleVariable() {
        console.log('registerDoubleVariable');
        this.clevertap.registerDoubleVariable('var_double');
        this.presentToast('registerDoubleVariable');
    }
    registerIntegerVariable() {
        console.log('registerIntegerVariable');
        this.clevertap.registerIntegerVariable('var_int');
        this.presentToast('registerIntegerVariable');
    }
    registerStringVariable() {
        console.log('registerStringVariable');
        this.clevertap.registerStringVariable('var_string');
        this.presentToast('registerStringVariable');
    }
    registerListOfBooleanVariable() {
        console.log('registerListOfBooleanVariable');
        this.clevertap.registerListOfBooleanVariable('var_list_bool');
        this.presentToast('registerListOfBooleanVariable');
    }
    registerListOfDoubleVariable() {
        console.log('registerListOfDoubleVariable');
        this.clevertap.registerListOfDoubleVariable('var_list_double');
        this.presentToast('registerListOfDoubleVariable');
    }
    registerListOfIntegerVariable() {
        console.log('registerListOfIntegerVariable');
        this.clevertap.registerListOfIntegerVariable('var_list_int');
        this.presentToast('registerListOfIntegerVariable');
    }
    registerListOfStringVariable() {
        console.log('registerListOfStringVariable');
        this.clevertap.registerListOfStringVariable('var_list_string');
        this.presentToast('registerListOfStringVariable');
    }
    registerMapOfBooleanVariable() {
        console.log('registerMapOfBooleanVariable');
        this.clevertap.registerMapOfBooleanVariable('var_map_bool');
        this.presentToast('registerMapOfBooleanVariable');
    }
    registerMapOfDoubleVariable() {
        console.log('registerMapOfDoubleVariable');
        this.clevertap.registerMapOfDoubleVariable('var_map_double');
        this.presentToast('registerMapOfDoubleVariable');
    }
    registerMapOfIntegerVariable() {
        console.log('registerMapOfIntegerVariable');
        this.clevertap.registerMapOfIntegerVariable('var_map_int');
        this.presentToast('registerMapOfIntegerVariable');
    }
    registerMapOfStringVariable() {
        console.log('registerMapOfStringVariable');
        this.clevertap.registerMapOfStringVariable('var_map_string');
        this.presentToast('registerMapOfStringVariable');
    }
    getBooleanVariable() {
        console.log('getBooleanVariable');
        this.clevertap.getBooleanVariable('var_bool', true);
        this.presentToast('getBooleanVariable');
    }
    getDoubleVariable() {
        console.log('getDoubleVariable');
        this.clevertap.getDoubleVariable('var_double', 0.0);
        this.presentToast('getDoubleVariable');
    }
    getIntegerVariable() {
        console.log('getIntegerVariable');
        this.clevertap.getIntegerVariable('var_int', 0);
        this.presentToast('getIntegerVariable');
    }
    getStringVariable() {
        console.log('getStringVariable');
        this.clevertap.getStringVariable('var_string', 'ABCD');
        this.presentToast('getStringVariable');
    }
    getListOfBooleanVariable() {
        console.log('getListOfBooleanVariable');
        this.clevertap.getListOfBooleanVariable('var_list_bool', [true, false]);
        this.presentToast('getListOfBooleanVariable');
    }
    getListOfDoubleVariable() {
        console.log('getListOfDoubleVariable');
        this.clevertap.getListOfDoubleVariable('var_list_double', [0.0, 3.14]);
        this.presentToast('getListOfDoubleVariable');
    }
    getListOfIntegerVariable() {
        console.log('getListOfIntegerVariable');
        this.clevertap.getListOfIntegerVariable('var_list_int', [0, 1]);
        this.presentToast('getListOfIntegerVariable');
    }
    getListOfStringVariable() {
        console.log('getListOfStringVariable');
        this.clevertap.getListOfStringVariable('var_list_string', ['ABCD', 'Hello']);
        this.presentToast('getListOfStringVariable');
    }
    getMapOfBooleanVariable() {
        console.log('getMapOfBooleanVariable');
        this.clevertap.getMapOfBooleanVariable('var_map_bool', { truth: true, lie: false });
        this.presentToast('getMapOfBooleanVariable');
    }
    getMapOfDoubleVariable() {
        console.log('getMapOfDoubleVariable');
        this.clevertap.getMapOfDoubleVariable('var_map_double', { zero: 0.0, pi: 3.14 });
        this.presentToast('getMapOfDoubleVariable');
    }
    getMapOfIntegerVariable() {
        console.log('getMapOfIntegerVariable');
        this.clevertap.getMapOfIntegerVariable('var_map_int', { zero: 0, one: 1 });
        this.presentToast('getMapOfIntegerVariable');
    }
    getMapOfStringVariable() {
        console.log('getMapOfStringVariable');
        this.clevertap.getMapOfStringVariable('var_map_string', { letters: 'ABCD', greeting: 'Hello' });
        this.presentToast('getMapOfStringVariable');
    }
    getAllDisplayUnits() {
        console.log('getAllDisplayUnits');
        this.clevertap.getAllDisplayUnits();
        this.presentToast('getAllDisplayUnits');
    }
    getDisplayUnitForId() {
        console.log('getDisplayUnitForId');
        this.clevertap.getDisplayUnitForId('Test Display Unit');
        this.presentToast('getDisplayUnitForId');
    }
    pushDisplayUnitViewedEventForID() {
        console.log('pushDisplayUnitViewedEventForID');
        this.clevertap.pushDisplayUnitViewedEventForID('Test Display Unit');
        this.presentToast('pushDisplayUnitViewedEventForID');
    }
    pushDisplayUnitClickedEventForID() {
        console.log('pushDisplayUnitClickedEventForID');
        this.clevertap.pushDisplayUnitClickedEventForID('Test Display Unit');
        this.presentToast('pushDisplayUnitClickedEventForID');
    }
    getFeatureFlag() {
        console.log('getFeatureFlag');
        this.clevertap.getFeatureFlag('key_string', 'defaultString')
            .then(r => {
            this.clickAlert('getFeatureFlag', 'Get value of key_string or default value', r);
        });
        this.presentToast('getFeatureFlag');
    }
    setDefaultsMap() {
        console.log('setDefaultsMap');
        this.clevertap.setDefaultsMap({
            key_long: 123,
            key_double: 3.14,
            key_string: 'sensible',
            key_bool: true
        });
        this.presentToast('setDefaultsMap');
    }
    infoProductConfig() {
        this.clickAlert('Product Config', 'Category info', 'The CleverTap Product Experiences includes Product Config: ' +
            'Change the behavior and appearance of your app remotely without an update. ' +
            'This helps you to deliver in-app personalization experience to your app users ' +
            'and test their response.');
    }
    fetch() {
        console.log('fetch');
        this.clevertap.fetch();
        this.clickAlert('fetch', '', 'Values set on the dashboard are fetched and stored in the Product Config object.');
        this.presentToast('fetch');
    }
    fetchWithMinimumFetchIntervalInSeconds() {
        console.log('fetchWithMinimumFetchIntervalInSeconds');
        this.clevertap.fetchWithMinimumFetchIntervalInSeconds(4);
        this.presentToast('fetchWithMinimumFetchIntervalInSeconds 4 seconds');
    }
    activate() {
        console.log('activate');
        this.clevertap.activate();
        this.clickAlert('activate', '', 'Called to make fetched parameter values available to app.');
        this.presentToast('activate');
    }
    fetchAndActivate() {
        console.log('fetchAndActivate');
        this.clevertap.fetchAndActivate();
        this.presentToast('fetchAndActivate');
    }
    setMinimumFetchIntervalInSeconds() {
        console.log('setMinimumFetchIntervalInSeconds');
        this.clevertap.setMinimumFetchIntervalInSeconds(60 * 10);
        this.presentToast('setMinimumFetchIntervalInSeconds 60*10 seconds');
    }
    getLastFetchTimeStampInMillis() {
        console.log('getLastFetchTimeStampInMillis');
        this.clevertap.getLastFetchTimeStampInMillis().then(r => {
            this.clickAlert('getLastFetchTimeStampInMillis', 'Last Fetch Timestamp', r)
                .then(() => this.presentToast('getLastFetchTimeStampInMillis' + r));
        });
    }
    getString() {
        console.log('getString');
        this.clevertap.getString().then(r => {
            this.clickAlert('getString', 'String value found', r);
        });
        this.presentToast('getString');
    }
    getBoolean() {
        console.log('getBoolean');
        this.clevertap.getBoolean().then(r => {
            this.clickAlert('getBoolean', 'Boolean value found', r);
        });
        this.presentToast('getBoolean');
    }
    getLong() {
        console.log('getLong');
        this.clevertap.getLong().then(r => {
            this.clickAlert('getLong', 'Long value found', r)
                .then(() => this.presentToast('getLong'));
        });
    }
    getDouble() {
        console.log('getDouble');
        this.clevertap.getDouble().then(r => {
            this.clickAlert('getDouble', 'Double value found', r);
        });
        this.presentToast('getDouble');
    }
    reset() {
        console.log('reset');
        // this.clevertap.reset();
        this.clickAlert('reset', 'not called', 'Resets ProductConfig');
        this.presentToast('reset');
    }
    notifyDeviceReady() {
        console.log('notifyDeviceReady');
        this.clevertap.notifyDeviceReady();
        this.presentToast('notifyDeviceReady');
    }
    setDebugLevel() {
        console.log('setDebugLevel');
        this.clevertap.setDebugLevel(1);
        this.clickAlert('setDebugLevel', '0 is off, 1 is info, 2 is debug, default is 1', 'Level set to 1');
        this.presentToast('setDebugLevel 1');
    }
};
HomePage.ctorParameters = () => [
    { type: _ionic_native_clevertap_ngx__WEBPACK_IMPORTED_MODULE_4__["CleverTap"] },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["ToastController"] }
];
HomePage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-home',
        template: _raw_loader_home_page_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_home_page_scss__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], HomePage);



/***/ })

}]);
//# sourceMappingURL=home-home-module.js.map