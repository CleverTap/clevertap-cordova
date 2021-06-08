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
/* harmony default export */ __webpack_exports__["default"] = ("<!--<ion-header [translucent]=\"true\">\n  <ion-toolbar>\n    <ion-title>\n      Hello there!\n    </ion-title>\n  </ion-toolbar>\n</ion-header>-->\n\n<ion-content [fullscreen]=\"true\">\n  <ion-header>\n    <ion-toolbar>\n\n      <ion-title size=\"large\">CleverTap Ionic App</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n\n  <ion-list>\n <ion-list-header>\n      <ion-label>Events</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"recordEventWithName()\">\n        recordEventWithName</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordEventWithNameAndProps()\">\n        recordEventWithNameAndProps</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordChargedEventWithDetailsAndItems()\">\n        recordChargedEventWithDetailsAndItems</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetFirstTime()\">\n        eventGetFirstTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetLastTime()\">\n        eventGetLastTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetOccurrences()\">\n        eventGetOccurrences</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"eventGetDetails()\">\n        eventGetDetails</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getEventHistory()\">\n        getEventHistory</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"recordScreenView()\">\n        recordScreenView</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Profile</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"getLocation()\">\n        getLocation</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setLocation()\">\n        setLocation</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"onUserLogin()\">\n        onUserLogin</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSet()\">\n        profileSet</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSetGraphUser()\">\n        profileSetGraphUser</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGooglePlusUser()\">\n        profileGooglePlusUser</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetProperty()\">\n        profileGetProperty</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetCleverTapAttributionIdentifier()\">\n        profileGetCleverTapAttributionIdentifier</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileGetCleverTapID()\">\n        profileGetCleverTapID</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveValueForKey()\">\n        profileRemoveValueForKey</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileSetMultiValues()\">\n        profileSetMultiValues</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileAddMultiValue()\">\n        profileAddMultiValue</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileAddMultiValues()\">\n        profileAddMultiValues</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveMultiValue()\">\n        profileRemoveMultiValue</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"profileRemoveMultiValues()\">\n        profileRemoveMultiValues</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Personalization</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"enablePersonalization()\">\n        enablePersonalization</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"disablePersonalization()\">\n        disablePersonalization</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setOptOut()\">\n        setOptOut</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setOffline()\">\n        setOffline</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"enableDeviceNetworkInfoReporting()\">\n        enableDeviceNetworkInfoReporting</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Push</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"registerPush()\">\n        registerPush</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushToken()\">\n        setPushToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushXiaomiToken()\">\n        setPushXiaomiToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushBaiduToken()\">\n        setPushBaiduToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setPushHuaweiToken()\">\n        setPushHuaweiToken</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotification()\">\n        createNotification</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannel()\">\n        createNotificationChannel</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithSound()\">\n        createNotificationChannelWithSound</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithGroupId()\">\n        createNotificationChannelWithGroupId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelWithGroupIdAndSound()\">\n        createNotificationChannelWithGroupIdAndSound</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"createNotificationChannelGroup()\">\n        createNotificationChannelGroup</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteNotificationChannel()\">\n        deleteNotificationChannel</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteNotificationChannelGroup()\">\n        deleteNotificationChannelGroup</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Session</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"sessionGetTimeElapsed()\">\n        sessionGetTimeElapsed</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetTotalVisits()\">\n        sessionGetTotalVisits</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetScreenCount()\">\n        sessionGetScreenCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetPreviousVisitTime()\">\n        sessionGetPreviousVisitTime</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"sessionGetUTMDetails()\">\n        sessionGetUTMDetails</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInstallReferrer()\">\n        pushInstallReferrer</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>In-App Inbox</ion-label>\n      <ion-button (click)=\"infoInbox()\">Info</ion-button>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"initializeInbox()\">\n        initializeInbox</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageUnreadCount()\">\n        getInboxMessageUnreadCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageCount()\">\n        getInboxMessageCount</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"showInbox()\">\n        showInbox</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getAllInboxMessages()\">\n        getAllInboxMessages</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getUnreadInboxMessages()\">\n        getUnreadInboxMessages</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getInboxMessageForId()\">\n        getInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"deleteInboxMessageForId()\">\n        deleteInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"markReadInboxMessageForId()\">\n        markReadInboxMessageForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInboxNotificationViewedEventForId()\">\n        pushInboxNotificationViewedEventForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushInboxNotificationClickedEventForId()\">\n        pushInboxNotificationClickedEventForId</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Native Display</ion-label>\n    </ion-list-header>\n  <ion-item>\n      <ion-button (click)=\"getAllDisplayUnits()\">\n        getAllDisplayUnits</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getDisplayUnitForId()\">\n        getDisplayUnitForId</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushDisplayUnitViewedEventForID()\">\n        pushDisplayUnitViewedEventForID</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"pushDisplayUnitClickedEventForID()\">\n        pushDisplayUnitClickedEventForID</ion-button>\n    </ion-item>\n <ion-list-header>\n      <ion-label>Feature Flag</ion-label>\n    </ion-list-header>\n   <ion-item>\n      <ion-button (click)=\"getFeatureFlag()\">\n        getFeatureFlag</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setDefaultsMap()\">\n        setDefaultsMap</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Product Config</ion-label>\n      <ion-button (click)=\"infoProductConfig()\">Info</ion-button>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"fetch()\">fetch</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"fetchWithMinimumFetchIntervalInSeconds()\">\n        fetchWithMinimumFetchIntervalInSeconds</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"activate()\">\n        activate</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"fetchAndActivate()\">\n        fetchAndActivate</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setMinimumFetchIntervalInSeconds()\">\n        setMinimumFetchIntervalInSeconds</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getLastFetchTimeStampInMillis()\">\n        getLastFetchTimeStampInMillis</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getString()\">\n        getString</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getBoolean()\">\n        getBoolean</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getLong()\">\n        getLong</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"getDouble()\">\n        getDouble</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"reset()\">\n        reset</ion-button>\n    </ion-item>\n    <ion-list-header>\n      <ion-label>Developer Options</ion-label>\n    </ion-list-header>\n    <ion-item>\n      <ion-button (click)=\"notifyDeviceReady()\">\n        notifyDeviceReady</ion-button>\n    </ion-item>\n    <ion-item>\n      <ion-button (click)=\"setDebugLevel()\">\n        setDebugLevel</ion-button>\n    </ion-item>\n  </ion-list>\n</ion-content>\n\n<!--\n<div id=\"container\">\n//id=\"container\" sticks this div to the centre of the screen\n<br/><br/><strong>Ready to create an app?</strong>\n<p>Get started with CleverTap Cordova + Ionic<br/>\n  <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://github.com/CleverTap/clevertap-cordova\">\n    View the repository</a></p>\n</div>\n-->\n<ion-footer>\n  <ion-toolbar>\n\n  </ion-toolbar>\n</ion-footer>\n");

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
    clickAlert(header = 'Alert', subHeader = 'An Alert you Made', message = 'This is an alert message.') {
        const alert = document.createElement('ion-alert');
        alert.cssClass = 'my-custom-class';
        alert.header = header;
        alert.subHeader = subHeader;
        alert.message = message;
        alert.buttons = [{
                text: 'Okay',
                handler: () => {
//                    console.log('Alert OK response');
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
            this.clickAlert('eventGetDetails', 'Details for \"Test Event with Properties\"', JSON.stringify(r))
        });
    }
    getEventHistory() {
        console.log('getEventHistory');
        this.clevertap.getEventHistory().then(r => {
            this.clickAlert('getEventHistory', 'Event History is as follows', JSON.stringify(r))
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
    }
    profileSet() {
        console.log('profileSet');
        this.clevertap.profileSet({ Preference: 'Medium' })
        this.presentToast('profileSet: Added new attribute [Preference: Medium]');
    }
    profileSetGraphUser() {
        console.log('profileSetGraphUser');
        this.clevertap.profileSetGraphUser({ Frequency: 'Rare' }).then(() => {
            this.presentToast('profileSetGraphUser: Added new attribute from Facebook User  [Frequency: Rare]')
        });
    }
    profileGooglePlusUser() {
        console.log('profileGooglePlusUser');
        this.clevertap.profileGooglePlusUser({ Surface: 'Smooth' }).then(() => {
            this.presentToast('profileGooglePlusUser: Added new attribute from Google User  [Surface: Smooth]')
        });
    }
    profileGetProperty() {
        console.log('profileGetProperty');
        this.clevertap.profileGetProperty('Preference').then(r => {
            this.clickAlert('profileGetProperty', 'Get value of Property: Preference', r)
        });
    }
    profileGetCleverTapAttributionIdentifier() {
        console.log('profileGetCleverTapAttributionIdentifier');
        this.clevertap.profileGetCleverTapAttributionIdentifier().then(r => {
            this.presentToast('profileGetCleverTapAttributionIdentifier' + r)
        });
    }
    profileGetCleverTapID() {
        console.log('profileGetCleverTapID');
        this.clevertap.profileGetCleverTapID().then(r => {
                this.presentToast('profileGetCleverTapID' + r);
        });
    }
    profileRemoveValueForKey() {
        console.log('profileRemoveValueForKey');
        this.clevertap.profileRemoveValueForKey('colors');
        this.presentToast('profileRemoveValueForKey: removing key \'colors\' from profile')
    }
    profileSetMultiValues() {
        console.log('profileSetMultiValues');
        this.clevertap.profileSetMultiValues('colors', ['red', 'blue']);
        this.presentToast('profileSetMultiValues: setting values \'[red, blue]\' for key \'colors\'')
    }
    profileAddMultiValue() {
        console.log('profileAddMultiValue');
        this.clevertap.profileAddMultiValue('colors', 'green');
        this.presentToast('profileAddMultiValue: setting value \'[green]\' for key \'colors\'')
    }
    profileAddMultiValues() {
        console.log('profileAddMultiValues');
        this.clevertap.profileAddMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileAddMultiValues: setting values \'[purple, pink]\' for key \'colors\'')
    }
    profileRemoveMultiValue() {
        console.log('profileRemoveMultiValue');
        this.clevertap.profileRemoveMultiValue('colors', 'green');
        this.presentToast('profileRemoveMultiValue: removing value \'[green]\' for key \'colors\'')
    }
    profileRemoveMultiValues() {
        console.log('profileRemoveMultiValues');
        this.clevertap.profileRemoveMultiValues('colors', ['purple', 'pink']);
        this.presentToast('profileRemoveMultiValues: removing value \'[purple, pink]\' for key \'colors\'')
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
        this.clevertap.sessionGetTimeElapsed().then(r => {
            this.presentToast('sessionGetTimeElapsed' + r);
        });
    }
    sessionGetTotalVisits() {
        console.log('sessionGetTotalVisits');
        this.clevertap.sessionGetTotalVisits().then(r => {
            this.presentToast('sessionGetTotalVisits' + r);
        });
    }
    sessionGetScreenCount() {
        console.log('sessionGetScreenCount');
        this.clevertap.sessionGetScreenCount().then(r => {
            this.presentToast('sessionGetScreenCount' + r);
        });
    }
    sessionGetPreviousVisitTime() {
        console.log('sessionGetPreviousVisitTime');
        this.clevertap.sessionGetPreviousVisitTime().then(r => {
            this.presentToast('sessionGetPreviousVisitTime' + r);
        });
    }
    sessionGetUTMDetails() {
        console.log('sessionGetUTMDetails');
        this.clevertap.sessionGetUTMDetails().then(r => {
            this.clickAlert('sessionGetUTMDetails', '', JSON.stringify(r));
        });
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
        this.clevertap.getInboxMessageUnreadCount().then(r => {
            this.presentToast('getInboxMessageUnreadCount: ' + r);
        });
    }
    getInboxMessageCount() {
        console.log('getInboxMessageCount');
        this.clevertap.getInboxMessageCount().then(r => {
            this.presentToast('getInboxMessageCount: ' + r);
        });
    }
    showInbox() {
        console.log('showInbox');
        this.clevertap.showInbox({});
        this.presentToast('showInbox');
    }
    getAllInboxMessages() {
        console.log('getAllInboxMessages');
        this.clevertap.getAllInboxMessages().then(r => {
            this.clickAlert('getAllInboxMessages', '', JSON.stringify(r));
        });
    }
    getUnreadInboxMessages() {
        console.log('getUnreadInboxMessages');
        this.clevertap.getUnreadInboxMessages().then(r => {
            this.clickAlert('getUnreadInboxMessages', '', JSON.stringify(r));
        });
    }
    getInboxMessageForId() {
        console.log('getInboxMessageForId');
        this.clevertap.getInboxMessageForId('Insert message id')
    }
    deleteInboxMessageForId() {
        console.log('deleteInboxMessageForId');
        this.clevertap.deleteInboxMessageForId('Insert message id');
    }
    markReadInboxMessageForId() {
        console.log('markReadInboxMessageForId');
        this.clevertap.markReadInboxMessageForId('Insert message id');
    }
    pushInboxNotificationViewedEventForId() {
        console.log('pushInboxNotificationViewedEventForId');
        this.clevertap.pushInboxNotificationViewedEventForId('Insert message id');
    }
    pushInboxNotificationClickedEventForId() {
        console.log('pushInboxNotificationClickedEventForId');
        this.clevertap.pushInboxNotificationClickedEventForId('Insert message id');
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
            this.presentToast('getLastFetchTimeStampInMillis: Last Fetch Timestamp' + r);
        });
    }
    getString() {
        console.log('getString');
        this.clevertap.getString().then(r => {
            this.presentToast('getString: String value found' + r);
        });
    }
    getBoolean() {
        console.log('getBoolean');
        this.clevertap.getBoolean().then(r => {
            this.presentToast('getBoolean: Boolean value found' + r);
        });
    }
    getLong() {
        console.log('getLong');
        this.clevertap.getLong().then(r => {
            this.presentToast('getLong: Long value found' + r);
        });
    }
    getDouble() {
        console.log('getDouble');
        this.clevertap.getDouble().then(r => {
            this.presentToast('getDouble: Double value found' + r);
        });
    }
    reset() {
        console.log('reset');
        // this.clevertap.reset();
        this.clickAlert('reset', 'not called', 'Resets ProductConfig');
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
