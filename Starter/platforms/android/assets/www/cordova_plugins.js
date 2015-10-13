cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.clevertap.cordova.CleverTapPlugin/www/CleverTap.js",
        "id": "com.clevertap.cordova.CleverTapPlugin.CleverTap",
        "clobbers": [
            "CleverTap"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.clevertap.cordova.CleverTapPlugin": "1.0.0",
    "cordova-plugin-whitelist": "1.0.0"
}
// BOTTOM OF METADATA
});