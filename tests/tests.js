/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/* eslint-env jasmine */

exports.defineAutoTests = function () {
describe('CleverTap', function () {
         it('should be defined', function () {
           expect(CleverTap).toBeDefined();
            });

         describe('notifyDeviceReady', function () {
                  it('should be defined', function () {
                     expect(CleverTap.notifyDeviceReady).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.notifyDeviceReady).toEqual('function');
                     });
                  });

         describe('enablePersonalization', function () {
                  it('should be defined', function () {
                     expect(CleverTap.enablePersonalization).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.enablePersonalization).toEqual('function');
                     });
                  });

         describe('disablePersonalization', function () {
                  it('should be defined', function () {
                     expect(CleverTap.disablePersonalization).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.disablePersonalization).toEqual('function');
                     });
                  });

         describe('setOptOut', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setOptOut).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setOptOut).toEqual('function');
                     });
                  });

         describe('setOffline', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setOffline).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setOffline).toEqual('function');
                     });
                  });

         describe('enableDeviceNetworkInfoReporting', function () {
                  it('should be defined', function () {
                     expect(CleverTap.enableDeviceNetworkInfoReporting).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.enableDeviceNetworkInfoReporting).toEqual('function');
                     });
                  });

         describe('registerPush', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerPush).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerPush).toEqual('function');
                     });
                  });

         describe('createNotification', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotification).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotification).toEqual('function');
                     });
                  });

         describe('createNotificationChannel', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotificationChannel).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotificationChannel).toEqual('function');
                     });
                  });

         describe('createNotificationChannelWithSound', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotificationChannelWithSound).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotificationChannelWithSound).toEqual('function');
                     });
                  });

         describe('createNotificationChannelWithGroupId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotificationChannelWithGroupId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotificationChannelWithGroupId).toEqual('function');
                     });
                  });

         describe('createNotificationChannelWithGroupIdAndSound', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotificationChannelWithGroupIdAndSound).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotificationChannelWithGroupIdAndSound).toEqual('function');
                     });
                  });

         describe('createNotificationChannelGroup', function () {
                  it('should be defined', function () {
                     expect(CleverTap.createNotificationChannelGroup).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.createNotificationChannelGroup).toEqual('function');
                     });
                  });

         describe('deleteNotificationChannel', function () {
                  it('should be defined', function () {
                     expect(CleverTap.deleteNotificationChannel).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.deleteNotificationChannel).toEqual('function');
                     });
                  });

         describe('deleteNotificationChannelGroup', function () {
                  it('should be defined', function () {
                     expect(CleverTap.deleteNotificationChannelGroup).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.deleteNotificationChannelGroup).toEqual('function');
                     });
                  });

         describe('recordScreenView', function () {
                  it('should be defined', function () {
                     expect(CleverTap.recordScreenView).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.recordScreenView).toEqual('function');
                     });
                  });

         describe('recordEventWithName', function () {
                  it('should be defined', function () {
                     expect(CleverTap.recordEventWithName).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.recordEventWithName).toEqual('function');
                     });
                  });

         describe('recordEventWithNameAndProps', function () {
                  it('should be defined', function () {
                     expect(CleverTap.recordEventWithNameAndProps).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.recordEventWithNameAndProps).toEqual('function');
                     });
                  });

         describe('recordChargedEventWithDetailsAndItems', function () {
                  it('should be defined', function () {
                     expect(CleverTap.recordChargedEventWithDetailsAndItems).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.recordChargedEventWithDetailsAndItems).toEqual('function');
                     });
                  });

         describe('eventGetFirstTime', function () {
                  it('should be defined', function () {
                     expect(CleverTap.eventGetFirstTime).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.eventGetFirstTime).toEqual('function');
                     });

                  it('should succeed when called with parameter', function (done) {
                      function onSuccess(data){
                          expect(data).toBeDefined();
                          expect(typeof data === "string").toBe(false);
                          done();
                      }

                      function onError(error){
                          expect(true).toEqual(false);  //This has to fail
                          done();
                      }

                      CleverTap.eventGetFirstTime('testEvent',onSuccess,onError);
                  });

                  it('should fail when called without parameter', function (done) {
                      function onSuccess(data){
                          expect(true).toEqual(false);  //This has to fail
                          done();
                      }

                      function onError(error){
                          expect(error).toBeDefined();
                          expect(typeof error === "string").toBe(true);
                          done();
                      }

                      CleverTap.eventGetFirstTime(onSuccess,onError);
                  });

                  });

         describe('eventGetLastTime', function () {
                  it('should be defined', function () {
                     expect(CleverTap.eventGetLastTime).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.eventGetLastTime).toEqual('function');
                     });
                  });

         describe('eventGetOccurrences', function () {
                  it('should be defined', function () {
                     expect(CleverTap.eventGetOccurrences).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.eventGetOccurrences).toEqual('function');
                     });
                  });

         describe('eventGetDetails', function () {
                  it('should be defined', function () {
                     expect(CleverTap.eventGetDetails).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.eventGetDetails).toEqual('function');
                     });
                  });

         describe('getEventHistory', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getEventHistory).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getEventHistory).toEqual('function');
                     });
                  });

         describe('getLocation', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getLocation).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getLocation).toEqual('function');
                     });
                  });

         describe('setLocation', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setLocation).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setLocation).toEqual('function');
                     });
                  });

         describe('onUserLogin', function () {
                  it('should be defined', function () {
                     expect(CleverTap.onUserLogin).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.onUserLogin).toEqual('function');
                     });
                  });

         describe('profileSet', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileSet).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileSet).toEqual('function');
                     });
                  });

         describe('profileSetGraphUser', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileSetGraphUser).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileSetGraphUser).toEqual('function');
                     });
                  });

         describe('profileGooglePlusUser', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileGooglePlusUser).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileGooglePlusUser).toEqual('function');
                     });
                  });

         describe('profileGetProperty', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileGetProperty).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileGetProperty).toEqual('function');
                     });
                  });

         describe('profileGetCleverTapAttributionIdentifier', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileGetCleverTapAttributionIdentifier).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileGetCleverTapAttributionIdentifier).toEqual('function');
                     });
                  });

         describe('profileGetCleverTapID', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileGetCleverTapID).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileGetCleverTapID).toEqual('function');
                     });
                  });

         describe('profileRemoveValueForKey', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileRemoveValueForKey).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileRemoveValueForKey).toEqual('function');
                     });
                  });

         describe('profileSetMultiValues', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileSetMultiValues).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileSetMultiValues).toEqual('function');
                     });
                  });

         describe('profileAddMultiValue', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileAddMultiValue).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileAddMultiValue).toEqual('function');
                     });
                  });

         describe('profileAddMultiValues', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileAddMultiValues).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileAddMultiValues).toEqual('function');
                     });
                  });

         describe('profileRemoveMultiValue', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileRemoveMultiValue).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileRemoveMultiValue).toEqual('function');
                     });
                  });

         describe('profileRemoveMultiValues', function () {
                  it('should be defined', function () {
                     expect(CleverTap.profileRemoveMultiValues).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.profileRemoveMultiValues).toEqual('function');
                     });
                  });

         describe('sessionGetTimeElapsed', function () {
                  it('should be defined', function () {
                     expect(CleverTap.sessionGetTimeElapsed).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.sessionGetTimeElapsed).toEqual('function');
                     });
                  });

         describe('sessionGetTotalVisits', function () {
                  it('should be defined', function () {
                     expect(CleverTap.sessionGetTotalVisits).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.sessionGetTotalVisits).toEqual('function');
                     });
                  });

         describe('sessionGetScreenCount', function () {
                  it('should be defined', function () {
                     expect(CleverTap.sessionGetScreenCount).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.sessionGetScreenCount).toEqual('function');
                     });
                  });

         describe('sessionGetPreviousVisitTime', function () {
                  it('should be defined', function () {
                     expect(CleverTap.sessionGetPreviousVisitTime).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.sessionGetPreviousVisitTime).toEqual('function');
                     });
                  });

         describe('sessionGetUTMDetails', function () {
                  it('should be defined', function () {
                     expect(CleverTap.sessionGetUTMDetails).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.sessionGetUTMDetails).toEqual('function');
                     });
                  });

         describe('pushInstallReferrer', function () {
                  it('should be defined', function () {
                     expect(CleverTap.pushInstallReferrer).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.pushInstallReferrer).toEqual('function');
                     });
                  });

         describe('setDebugLevel', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setDebugLevel).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setDebugLevel).toEqual('function');
                     });
                  });

         describe('initializeInbox', function () {
                  it('should be defined', function () {
                     expect(CleverTap.initializeInbox).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.initializeInbox).toEqual('function');
                     });
                  });

         describe('getInboxMessageUnreadCount', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getInboxMessageUnreadCount).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getInboxMessageUnreadCount).toEqual('function');
                     });
                  });

         describe('getInboxMessageCount', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getInboxMessageCount).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getInboxMessageCount).toEqual('function');
                     });
                  });

         describe('showInbox', function () {
                  it('should be defined', function () {
                     expect(CleverTap.showInbox).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.showInbox).toEqual('function');
                     });
                  });

         describe('getAllInboxMessages', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getAllInboxMessages).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getAllInboxMessages).toEqual('function');
                     });
                  });

         describe('getUnreadInboxMessages', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getUnreadInboxMessages).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getUnreadInboxMessages).toEqual('function');
                     });
                  });

         describe('getInboxMessageForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getInboxMessageForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getInboxMessageForId).toEqual('function');
                     });
                  });

         describe('deleteInboxMessageForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.deleteInboxMessageForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.deleteInboxMessageForId).toEqual('function');
                     });
                  });

         describe('markReadInboxMessageForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.markReadInboxMessageForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.markReadInboxMessageForId).toEqual('function');
                     });
                  });

         describe('pushInboxNotificationViewedEventForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.pushInboxNotificationViewedEventForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.pushInboxNotificationViewedEventForId).toEqual('function');
                     });
                  });

         describe('pushInboxNotificationClickedEventForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.pushInboxNotificationClickedEventForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.pushInboxNotificationClickedEventForId).toEqual('function');
                     });
                  });

         describe('setUIEditorConnectionEnabled', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setUIEditorConnectionEnabled).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setUIEditorConnectionEnabled).toEqual('function');
                     });
                  });

         describe('registerBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerBooleanVariable).toEqual('function');
                     });
                  });

         describe('registerDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerDoubleVariable).toEqual('function');
                     });
                  });

         describe('registerIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerIntegerVariable).toEqual('function');
                     });
                  });

         describe('registerStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerStringVariable).toEqual('function');
                     });
                  });

         describe('registerListOfBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerListOfBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerListOfBooleanVariable).toEqual('function');
                     });
                  });

         describe('registerListOfDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerListOfDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerListOfDoubleVariable).toEqual('function');
                     });
                  });

         describe('registerListOfIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerListOfIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerListOfIntegerVariable).toEqual('function');
                     });
                  });

         describe('registerListOfStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerListOfStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerListOfStringVariable).toEqual('function');
                     });
                  });

         describe('registerMapOfBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerMapOfBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerMapOfBooleanVariable).toEqual('function');
                     });
                  });

         describe('registerMapOfDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerMapOfDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerMapOfDoubleVariable).toEqual('function');
                     });
                  });

         describe('registerMapOfIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerMapOfIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerMapOfIntegerVariable).toEqual('function');
                     });
                  });

         describe('registerMapOfStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.registerMapOfStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.registerMapOfStringVariable).toEqual('function');
                     });
                  });

         describe('getBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getBooleanVariable).toEqual('function');
                     });
                  });

         describe('getDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getDoubleVariable).toEqual('function');
                     });
                  });

         describe('getIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getIntegerVariable).toEqual('function');
                     });
                  });

         describe('getStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getStringVariable).toEqual('function');
                     });
                  });

         describe('getListOfBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getListOfBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getListOfBooleanVariable).toEqual('function');
                     });
                  });

         describe('getListOfDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getListOfDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getListOfDoubleVariable).toEqual('function');
                     });
                  });

         describe('getListOfIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getListOfIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getListOfIntegerVariable).toEqual('function');
                     });
                  });

         describe('getListOfStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getListOfStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getListOfStringVariable).toEqual('function');
                     });
                  });

         describe('getMapOfBooleanVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getMapOfBooleanVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getMapOfBooleanVariable).toEqual('function');
                     });
                  });

         describe('getMapOfDoubleVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getMapOfDoubleVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getMapOfDoubleVariable).toEqual('function');
                     });
                  });

         describe('getMapOfIntegerVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getMapOfIntegerVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getMapOfIntegerVariable).toEqual('function');
                     });
                  });

         describe('getMapOfStringVariable', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getMapOfStringVariable).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getMapOfStringVariable).toEqual('function');
                     });
                  });

         describe('getAllDisplayUnits', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getAllDisplayUnits).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getAllDisplayUnits).toEqual('function');
                     });
                  });

         describe('getDisplayUnitForId', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getDisplayUnitForId).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getDisplayUnitForId).toEqual('function');
                     });
                  });

         describe('pushDisplayUnitViewedEventForID', function () {
                  it('should be defined', function () {
                     expect(CleverTap.pushDisplayUnitViewedEventForID).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.pushDisplayUnitViewedEventForID).toEqual('function');
                     });
                  });

         describe('pushDisplayUnitClickedEventForID', function () {
                  it('should be defined', function () {
                     expect(CleverTap.pushDisplayUnitClickedEventForID).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.pushDisplayUnitClickedEventForID).toEqual('function');
                     });
                  });

         describe('getFeatureFlag', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getFeatureFlag).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getFeatureFlag).toEqual('function');
                     });
                  });

         describe('setDefaultsMap', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setDefaultsMap).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setDefaultsMap).toEqual('function');
                     });
                  });

         describe('fetch', function () {
                  it('should be defined', function () {
                     expect(CleverTap.fetch).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.fetch).toEqual('function');
                     });
                  });

         describe('fetchWithMinimumFetchIntervalInSeconds', function () {
                  it('should be defined', function () {
                     expect(CleverTap.fetchWithMinimumFetchIntervalInSeconds).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.fetchWithMinimumFetchIntervalInSeconds).toEqual('function');
                     });
                  });

         describe('activate', function () {
                  it('should be defined', function () {
                     expect(CleverTap.activate).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.activate).toEqual('function');
                     });
                  });

         describe('fetchAndActivate', function () {
                  it('should be defined', function () {
                     expect(CleverTap.fetchAndActivate).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.fetchAndActivate).toEqual('function');
                     });
                  });

         describe('setMinimumFetchIntervalInSeconds', function () {
                  it('should be defined', function () {
                     expect(CleverTap.setMinimumFetchIntervalInSeconds).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.setMinimumFetchIntervalInSeconds).toEqual('function');
                     });
                  });

         describe('getLastFetchTimeStampInMillis', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getLastFetchTimeStampInMillis).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getLastFetchTimeStampInMillis).toEqual('function');
                     });
                  });

         describe('getString', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getString).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getString).toEqual('function');
                     });
                  });

         describe('getBoolean', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getBoolean).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getBoolean).toEqual('function');
                     });
                  });

         describe('getLong', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getLong).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getLong).toEqual('function');
                     });
                  });

         describe('getDouble', function () {
                  it('should be defined', function () {
                     expect(CleverTap.getDouble).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.getDouble).toEqual('function');
                     });
                  });

         describe('reset', function () {
                  it('should be defined', function () {
                     expect(CleverTap.reset).toBeDefined();
                     });

                  it('should be a function', function () {
                     expect(typeof CleverTap.reset).toEqual('function');
                     });
                  });

    });
};

exports.defineManualTests = function (contentEl, createActionButton) {};
