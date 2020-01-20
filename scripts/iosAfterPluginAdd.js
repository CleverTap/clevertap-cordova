/**
 * adapted from https://github.com/aabluedragon/zcordova-plugin-archtrim and http://ikennd.ac/blog/2015/02/stripping-unwanted-architectures-from-dynamic-libraries-in-xcode/
*/

'use strict';

const xcode = require('xcode'),
    fs = require('fs'),
    path = require('path');

module.exports = function(context) {
    if(process.length >=5 && process.argv[1].indexOf('cordova') == -1) {
        if(process.argv[4] != 'ios') {
            return; // plugin only meant to work for ios platform.
        }
    }

    function fromDir(startPath,filter, rec, multiple){
      if (!fs.existsSync(startPath)){
          console.log("no dir ", startPath);
          return;
      }

      const files=fs.readdirSync(startPath);
      var resultFiles = []
      for(var i=0;i<files.length;i++){
          var filename=path.join(startPath,files[i]);
          var stat = fs.lstatSync(filename);
          if (stat.isDirectory() && rec){
              fromDir(filename,filter); //recurse
          }

          if (filename.indexOf(filter)>=0) {
              if (multiple) {
                  resultFiles.push(filename);
              } else {
                  return filename;
              }
          }
      }
      if(multiple) {
          return resultFiles;
      }
    }

    const xcodeProjPath = fromDir('platforms/ios','.xcodeproj', false);
    const projectPath = xcodeProjPath + '/project.pbxproj';
    const myProj = xcode.project(projectPath);

    myProj.parseSync();

    // unquote (remove trailing ")
    var projectName = myProj.getFirstTarget().firstTarget.name.substr(1);
    projectName = projectName.substr(0, projectName.length-1); //Removing the char " at beginning and the end.

    var options = {};
    options['shellPath'] = '/bin/sh';
    options['shellScript'] = `APP_PATH="\${TARGET_BUILD_DIR}/\${WRAPPER_NAME}"

# This script loops through the frameworks embedded in the application and
# removes unused architectures.
find "$APP_PATH" -name \'*.framework\' -type d | while read -r FRAMEWORK
do
FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"

EXTRACTED_ARCHS=()

for ARCH in $ARCHS
do
echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
done

echo "Merging extracted architectures: \${ARCHS}"
lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "\${EXTRACTED_ARCHS[@]}"
rm "\${EXTRACTED_ARCHS[@]}"

echo "Replacing original executable with thinned version"
rm "$FRAMEWORK_EXECUTABLE_PATH"
mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"

done`;

    var buildPhase = myProj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run Script', myProj.getFirstTarget().uuid, options).buildPhase;
    buildPhase['runOnlyForDeploymentPostprocessing'] = 0;

    fs.writeFileSync(projectPath, myProj.writeSync());
    console.log('Added Arch Trim run script build phase');
};
