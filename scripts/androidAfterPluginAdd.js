#!/usr/bin/env node

module.exports = function(context) {

  var fs = require('fs'),
    path = require('path');

  var projectRoot = context.opts.projectRoot;
  var appClass = 'com.clevertap.android.sdk.Application';

  // Hook errors must not take the Cordova CLI down, and process.stdout.write only accepts
  // strings, so every failure is logged through here.
  function logError(message, err) {
    console.log('clevertap-cordova: ' + message + ': ' + (err && err.message ? err.message : String(err)));
  }

  var manifestFile = path.join(projectRoot, 'platforms/android/app/src/main/AndroidManifest.xml');

  if (fs.existsSync(manifestFile)) {
    try {
      var data = fs.readFileSync(manifestFile, 'utf8');

      if (data.indexOf(appClass) == -1) {
        var applicationTag = data.match(/<application\b[^>]*>/);

        if (!applicationTag) {
          console.log('clevertap-cordova: no <application> tag found in ' + manifestFile + ', not setting ' + appClass);
        } else {
          var existingName = applicationTag[0].match(/\sandroid:name\s*=\s*(["'])(.*?)\1/);

          if (existingName) {
            // Adding a second android:name would make the manifest invalid XML, and replacing
            // it would drop the app's own Application class.
            console.log('clevertap-cordova: <application> already uses android:name="' + existingName[2] + '", leaving it as is. ' +
              'Make that class extend ' + appClass + ', or call com.clevertap.android.sdk.ActivityLifecycleCallback.register(this) in its onCreate().');
          } else {
            var updatedTag = applicationTag[0].replace(/^<application\b/, '<application android:name="' + appClass + '"');
            fs.writeFileSync(manifestFile, data.replace(applicationTag[0], updatedTag), 'utf8');
          }
        }
      }
    } catch (err) {
      logError('unable to update AndroidManifest.xml', err);
    }
  }

  var gsPaths = ["google-services.json", "platforms/android/assets/www/google-services.json"];

  for (var i = 0; i < gsPaths.length; i++) {
    var gsPath = path.join(projectRoot, gsPaths[i]);
    if (fs.existsSync(gsPath)) {
      try {
        var fileContents = fs.readFileSync(gsPath).toString();
        fs.writeFileSync(path.join(projectRoot, "platforms/android/google-services.json"), fileContents);
        var jsonContents = JSON.parse(fileContents);
        var stringsFile = path.join(projectRoot, "platforms/android/app/src/main/res/values/strings.xml");
        var s = fs.readFileSync(stringsFile).toString();

        s = s.replace(new RegExp('<string name="google_app_id">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('<string name="google_api_key">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('(\r\n|\n|\r)[ \t]*(\r\n|\n|\r)', "gm"), '$1')

        s = s.replace(new RegExp('</resources>', "i"), '<string name="google_app_id">' + jsonContents.client[0].client_info.mobilesdk_app_id + '</string>\n</resources>')

        s = s.replace(new RegExp('</resources>', "i"), '<string name="google_api_key">' + jsonContents.client[0].api_key[0].current_key + '</string>\n</resources>')

        fs.writeFileSync(stringsFile, s);
      } catch (err) {
        logError('unable to copy ' + gsPaths[i], err);
      }
      break;
    }
  }
}
