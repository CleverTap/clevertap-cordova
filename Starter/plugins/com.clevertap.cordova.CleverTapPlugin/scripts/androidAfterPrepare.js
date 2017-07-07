#!/usr/bin/env node

module.exports = function(context) {

  var gsPaths = ["google-services.json", "platforms/android/assets/www/google-services.json"];

  for (var i = 0; i < gsPaths.length; i++) {
    process.stdout.write(gsPaths[i]);  
    if (fs.existsSync(gsPaths[i])) {
      try {
        var fileContents = fs.readFileSync(gsPaths[i]).toString();
        fs.writeFileSync("platforms/android/google-services.json", fileContents);
        var jsonContents = JSON.parse(fileContents);
        var s = fs.readFileSync("platforms/android/res/values/strings.xml").toString();

        s = s.replace(new RegExp('<string name="google_app_id">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('<string name="google_api_key">([^\@<]+?)<\/string>', "i"), '')

        s = s.replace(new RegExp('(\r\n|\n|\r)[ \t]*(\r\n|\n|\r)', "gm"), '$1')

        s = s.replace(new RegExp('<string name="google_app_id">([^<]+?)<\/string>', "i"), '<string name="google_app_id">' + jsonContents.client[0].client_info.mobilesdk_app_id + '</string>')

        s = s.replace(new RegExp('<string name="google_api_key">([^<]+?)<\/string>', "i"), '<string name="google_api_key">' + jsonContents.client[0].api_key[0].current_key + '</string>')

        fs.writeFileSync("platforms/android/res/values/strings.xml", s);
      } catch (err) {
        process.stdout.write(err);
      }
      break;
    }
  };
}
