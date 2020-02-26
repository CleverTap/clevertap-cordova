#!/usr/bin/env node

module.exports = function(context) {

  var fs = require('fs'),
    path = require('path');

  var platformRoot = path.join(context.opts.projectRoot, 'platforms/android/app/src/main');

  var manifestFile = path.join(platformRoot, 'AndroidManifest.xml');

  if (fs.existsSync(manifestFile)) {
    try {
        fs.readFile(manifestFile, 'utf8', function (err,data) {
          if (err) {
            throw new Error('Unable to find AndroidManifest.xml: ' + err);
          }

          var appClass = 'com.clevertap.android.sdk.Application';

          if (data.indexOf(appClass) == -1) {

            var result = data.replace(/<application/g, '<application android:name="' + appClass + '"');

            fs.writeFile(manifestFile, result, 'utf8', function (err) {
              if (err) {
                  throw new Error('Unable to write into AndroidManifest.xml: ' + err);
              }
            });
          }
        });
    } catch(err) {
        process.stdout.write(err);
    }
  }
  var gsPaths = ["google-services.json", "platforms/android/assets/www/google-services.json"];

  for (var i = 0; i < gsPaths.length; i++) {
    process.stdout.write(gsPaths[i]);
    if (fs.existsSync(gsPaths[i])) {
      try {
        var fileContents = fs.readFileSync(gsPaths[i]).toString();
        fs.writeFileSync("platforms/android/google-services.json", fileContents);
        var jsonContents = JSON.parse(fileContents);
        var s = fs.readFileSync("platforms/android/app/src/main/res/values/strings.xml").toString();

        s = s.replace(new RegExp('<string name="google_app_id">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('<string name="google_api_key">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('(\r\n|\n|\r)[ \t]*(\r\n|\n|\r)', "gm"), '$1')

        s = s.replace(new RegExp('</resources>', "i"), '<string name="google_app_id">' + jsonContents.client[0].client_info.mobilesdk_app_id + '</string>\n</resources>')

        s = s.replace(new RegExp('</resources>', "i"), '<string name="google_api_key">' + jsonContents.client[0].api_key[0].current_key + '</string>\n</resources>')

        fs.writeFileSync("platforms/android/app/src/main/res/values/strings.xml", s);
      } catch (err) {
        process.stdout.write(err);
      }
      break;
    }
  };
}
