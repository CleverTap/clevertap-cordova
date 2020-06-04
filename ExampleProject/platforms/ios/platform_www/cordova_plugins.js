cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "clevertap-cordova.CleverTap",
      "file": "plugins/clevertap-cordova/www/CleverTap.js",
      "pluginId": "clevertap-cordova",
      "clobbers": [
        "CleverTap"
      ]
    },
    {
      "id": "clevertap-cordova-tests.tests",
      "file": "plugins/clevertap-cordova-tests/tests.js",
      "pluginId": "clevertap-cordova-tests"
    },
    {
      "id": "cordova-plugin-test-framework.cdvtests",
      "file": "plugins/cordova-plugin-test-framework/www/tests.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.jasmine_helpers",
      "file": "plugins/cordova-plugin-test-framework/www/jasmine_helpers.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.medic",
      "file": "plugins/cordova-plugin-test-framework/www/medic.js",
      "pluginId": "cordova-plugin-test-framework"
    },
    {
      "id": "cordova-plugin-test-framework.main",
      "file": "plugins/cordova-plugin-test-framework/www/main.js",
      "pluginId": "cordova-plugin-test-framework"
    }
  ];
  module.exports.metadata = {
    "clevertap-cordova": "2.1.8",
    "cordova-android-support-gradle-release": "3.0.0",
    "cordova-plugin-whitelist": "1.3.3",
    "clevertap-cordova": "2.2.2",
    "clevertap-cordova-tests": "2.2.2",
    "cordova-plugin-test-framework": "1.1.6"
  };
});
