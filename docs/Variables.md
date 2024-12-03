# Overview
You can define variables using the CleverTap Corova SDK. When you define a variable in your code, you can sync them to the CleverTap Dashboard via the provided SDK methods.

# Supported Variable Types

Currently, CleverTap SDK supports the following variable types:

- String
- boolean
- JSON Object
- number

# Define Variables

Variables can be defined using the `defineVariables` method. You must provide the names and default values of the variables using a JSON Object. 

```javascript
let variables = {
              'cordova_var_string': 'cordova_var_string_value',
              'cordova_var_map': {
                'cordova_var_map_string': 'cordova_var_map_value'
              },
              'cordova_var_int': 6,
              'cordova_var_float': 6.9,
              'cordova_var_boolean': true
            };
this.clevertap.defineVariables(variables);
```

# Define File Variables

CleverTap Cordova SDK supports file types for variables from version `3.3.0`. Supported file types include but are not limited to images (jpg, jpeg, png, gif), text files, and PDFs.

```javascript
this.clevertap.defineFileVariable("fileVariable");
```

# Setup Callbacks

CleverTap cordova SDK provides several callbacks for the developer to receive feedback from the SDK. You can use them as per your requirement, using all of them is not mandatory. They are as follows:

- Status of fetch variables request
- `onVariablesChanged`
- `onValueChanged`

From version `3.3.0` onwards, the following callbacks are also supported:

- `onOneTimeVariablesChanged`
- `onVariablesChangedAndNoDownloadsPending`
- `onceVariablesChangedAndNoDownloadsPending`
- `onFileValueChanged`

## Status of Variables Fetch Request

This method provides a boolean flag to ensure that the variables are successfully fetched from the server.

```javascript
this.clevertap.fetchVariables(success => log("fetchVariables success = " + success))
```

## `onVariablesChanged`

This callback is invoked when variables are initialized with values fetched from the server. It is called each time new values are fetched.

```javascript
this.clevertap.onVariablesChanged(val => log("onVariablesChanged value is "+JSON.stringify(val)));
```

## `onValueChanged`

This callback is invoked when the value of the variable changes. You must provide the name of the variable whose value needs to be observed.

```javascript
this.clevertap.onValueChanged(key,val => log("Changed value is "+JSON.stringify(val)));
```

## `onOneTimeVariablesChanged`

This callback is invoked once when variables are initialized with a value or changed with a new server value. Callback is triggered only once on app start, or when added if server values are already received

```javascript
this.clevertap.onOneTimeVariablesChanged(val => log("onOneTimeVariablesChanged value is ", + JSON.stringify(val)));
```

## `onVariablesChangedAndNoDownloadsPending`

This callback is invoked when variable values are changed and the files associated with it are downloaded and ready to be used. Callback is triggered each time new values are fetched and downloaded.

```javascript
this.clevertap.onVariablesChangedAndNoDownloadsPending(val => log("onVariablesChangedAndNoDownloadsPending value is ", + JSON.stringify(val)));
```

## `onceVariablesChangedAndNoDownloadsPending`

This callback is invoked only once when variable values are changed and the files associated with it are downloaded and ready to be used. Callback is triggered only once for when new values are fetched and downloaded

```javascript
this.clevertap.onceVariablesChangedAndNoDownloadsPending(val => log("onceVariablesChangedAndNoDownloadsPending value is ", + JSON.stringify(val)));
```

## `onFileValueChanged`

This callback is registered per file variable. It is called when the file associated with the file variable is downloaded and ready to be used.

```javascript
this.clevertap.onFileValueChanged(key,val => log("Changed value of file is "+JSON.stringify(val)));
```

# Sync Defined Variables

After defining your variables in the code, you must send/sync variables to the server. To do so, the app must be in DEBUG mode and mark a particular CleverTap user profile as a test profile from the CleverTap dashboard. [Learn how to mark a profile as **Test Profile**](https://developer.clevertap.com/docs/concepts-user-profiles#mark-a-user-profile-as-a-test-profile)

After marking the profile as a test profile, you must sync the app variables in DEBUG mode:

```javascript

// 1. Define CleverTap variables 
// …
// 2. Add variables/values changed callbacks
// …

// 3. Sync CleverTap Variables from DEBUG mode/builds
this.clevertap.syncVariables();
```

> 📘 Key Points to Remember
> 
> - In a scenario where there is already a draft created by another user profile in the dashboard, the sync call will fail to avoid overriding important changes made by someone else. In this case, Publish or Dismiss the existing draft before you proceed with syncing variables again. However, you can override a draft you created via the sync method previously to optimize the integration experience.
> - You can receive the following console logs from the CleverTap SDK:
>   - Variables synced successfully.
>   - Unauthorized access from a non-test profile. Please mark this profile as a test profile from the CleverTap dashboard.

# Fetch Variables During a Session

You can fetch the updated values for your CleverTap variables from the server during a session. If variables have changed, the appropriate callbacks will be fired. The provided callback provides a boolean flag that indicates if the fetch call was successful. The callback is fired regardless of whether the variables have changed or not.

```javascript
this.clevertap.fetchVariables(success => log("fetchVariables success = " + success))
```

# Use Fetched Variables Values

This process involves the following two major steps:

1. Fetch variable values.
2. Access variable values.

## Fetch Variable Values

Variables are updated automatically when server values are received. If you want to receive feedback when a specific variable is updated, use the individual callback:

```javascript
 this.clevertap.onValueChanged(key,val => log("Changed value is "+JSON.stringify(val)));
```

## Access Variable Values

You can access these fetched values in the following two ways:

### Getting all variables

```javascript
this.clevertap.getVariables(val => log("getVariables value is "+JSON.stringify(val)))
```

### Getting a specific variable

```javascript
this.clevertap.getVariable('cordova_var_string', val => log("cordova_var_string value is "+JSON.stringify(val));
```