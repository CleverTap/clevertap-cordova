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
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "clevertap-cordova": "2.1.1",
  "cordova-android-support-gradle-release": "3.0.0"
};
// BOTTOM OF METADATA
});