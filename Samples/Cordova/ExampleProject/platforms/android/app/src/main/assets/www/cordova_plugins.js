cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "clevertap-cordova.CleverTap",
      "file": "plugins/clevertap-cordova/www/CleverTap.js",
      "pluginId": "clevertap-cordova",
      "clobbers": [
        "CleverTap"
      ]
    }
  ];
  module.exports.metadata = {
    "clevertap-cordova": "2.4.0",
    "cordova-android-support-gradle-release": "3.0.1",
    "cordova-plugin-whitelist": "1.3.4"
  };
});