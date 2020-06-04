/**
 * Jasmine Based test suites
 */
exports.defineAutoTests = function () {
    'use strict';

    describe('clevertapplugin', function () {
    	it('should be defined', function () {
            expect(clevertapplugin).toBeDefined();
        });

        describe('notifyDeviceReady', function () {
            it('should be defined', function () {
                expect(clevertapplugin.notifyDeviceReady).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof clevertapplugin.notifyDeviceReady).toEqual('function');
            });

        });
        /*
        describe('showDialog', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.showDialog).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.showDialog).toEqual('function');
            });
        });

        describe('login', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.login).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.login).toEqual('function');
            });
        });

        describe('logEvent', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.logEvent).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.logEvent).toEqual('function');
            });

            it('should succeed when called with valid arguments', function (done) {
                function onSuccess(data){
                    expect(data).toBeDefined();
                    done();
                }

                function onError(error){
                    expect(true).toEqual(false); // to make it fail
                    done();
                }

                facebookConnectPlugin.logEvent('test-event',{},0,onSuccess,onError);
            });
        });

        describe('logPurchase', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.logPurchase).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.logPurchase).toEqual('function');
            });

            it('should succeed when called with valid currency code', function (done) {
                function onSuccess(data){
                    expect(data).toBeDefined();
                    done();
                }

                function onError(error){
                    expect(true).toEqual(false); // to make it fail
                    done();
                }

                facebookConnectPlugin.logPurchase(1,'ARS',onSuccess,onError);
            });

            it('should fail when called with invalid currency code', function (done) {
                function onSuccess(data){
                    expect(true).toEqual(false); // to make it fail
                    done();
                }

                function onError(error){
                    expect(error).toBeDefined();
                    done();
                }

                facebookConnectPlugin.logPurchase(1,'BITCOINS',onSuccess,onError);
            });
        });

        describe('getAccessToken', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.getAccessToken).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.getAccessToken).toEqual('function');
            });

            it('should always call success or error callback',function(done){
                function onSuccess(data){
                    expect(data).toBeDefined();
                    done();
                }

                function onError(error){
                    expect(error).toBeDefined();
                    done(error);
                }

                facebookConnectPlugin.getAccessToken(onSuccess,onError);
            });
        });

        describe('logout', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.logout).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.logout).toEqual('function');
            });

            it('should always call success or error callback', function (done) {
                function onSuccess(data){
                    expect(data).toBeDefined();
                    done();
                }

                function onError(error){
                    expect(error).toBeDefined();
                    done();
                }

                facebookConnectPlugin.logout(onSuccess,onError);
            });
        });

        describe('api', function () {
            it('should be defined', function () {
                expect(facebookConnectPlugin.api).toBeDefined();
            });

            it('should be a function', function () {
                expect(typeof facebookConnectPlugin.api).toEqual('function');
            });
        });
        */
    });
};

/**
 * Manual tests suites
 */
exports.defineManualTests = function (contentEl, createActionButton) {};
