---
name: api-wrapper-patterns
description: Standard patterns for wrapping native CleverTap Android/iOS SDK APIs in the Cordova plugin. Use when adding a new native SDK API, updating an existing API signature, or implementing a cross-platform method across the JS / Android / iOS bridge layers.
---

# API Wrapper Patterns

> **⚠️ MANDATORY READING**: Read this skill in full BEFORE implementing any API wrapper. Follow
> THIS document — do not infer patterns from scattered code. The biggest cause of broken builds is
> a missed bridge touch (especially the Android enum) or a guessed native symbol.

How to expose a native CleverTap Android/iOS SDK method through the Cordova plugin, across all
bridge layers, with consistent action names and correct type handling.

## The bridge in one picture

```
JS  www/CleverTap.js
      cordova.exec(success, error, "CleverTapPlugin", "<action>", [args])
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                     ▼
Android                                     iOS
  src/android/CleverTapFunction.java          src/ios/CleverTapPlugin.h
    enum constant  "<action>"                   - (void)<action>:(CDVInvokedUrlCommand *)command;
  src/android/CleverTapPlugin.java            src/ios/CleverTapPlugin.m
    case <ENUM>: in execute() switch            - (void)<action>:(CDVInvokedUrlCommand *)command { … }
    private void <action>(...) { … }
```

**The action string is the contract.** The 4th argument to `cordova.exec` (JS), the
`CleverTapFunction` enum's action string (Android), and the Obj-C selector name (iOS) must be the
**exact same string**. A mismatch = the call silently no-ops on that platform.

## Core principle: keep JS thin

`www/CleverTap.js` is a **pass-through**. It forwards arguments to native via `cordova.exec` and
hands the result to the caller's callback. Do all parsing / type conversion / SDK logic in the
native layers — they have direct access to the SDK types. The one JS-side exception already in the
codebase: `convertDateToEpochInProperties(...)` normalizes `Date` objects in properties before they
cross the bridge (see `recordEventWithNameAndProps`). Don't add other transformations.

## Decision tree

```
Is this a public API that host apps call directly?
├─ YES → Does it already exist in the Cordova plugin?
│  ├─ YES → Does the signature need updating?
│  │  ├─ YES → UPDATE existing wrapper (prefer adding an OPTIONAL trailing arg)
│  │  └─ NO  → NO ACTION
│  └─ NO → Commonly used functionality?
│     ├─ YES → CREATE new wrapper
│     └─ NO  → record in `flagged_for_review` / DISCUSS
└─ NO (internal / config / payload only) → NO wrapper needed
```

## Type mapping (across the bridge)

`cordova.exec` arguments cross as JSON. On the way in, native receives a `JSONArray`; on the way
out, you return a primitive / `JSONObject` / `JSONArray` (Android) or use the matching
`CDVPluginResult messageAs…:` (iOS).

| JS / JSON | Android (`JSONArray` accessor) | Android SDK type | iOS (`[command argumentAtIndex:]`) | iOS return |
|-----------|-------------------------------|------------------|------------------------------------|------------|
| string | `args.getString(i)` | `String` | `NSString *` | `messageAsString:` |
| number (int) | `args.getInt(i)` | `int` / `long` | `NSNumber *` / `NSInteger` | `messageAsInt:` |
| number (float) | `args.getDouble(i)` → `(float)` | `double` | `NSNumber *` | `messageAsDouble:` |
| boolean | `args.getBoolean(i)` | `boolean` | `BOOL` | `messageAsBool:` |
| object | `args.getJSONObject(i)` → `toMap(...)` | `HashMap<String,Object>` | `NSDictionary *` | `messageAsDictionary:` |
| array | `args.getJSONArray(i)` | `JSONArray` / `ArrayList` | `NSArray *` | `messageAsArray:` |
| (no return) | `Status.NO_RESULT` | `void` | `void` | (no `sendPluginResult`) |

For deeper native-type inference see
[`native-sdk-changelog-analysis/references/type-mapping.md`](../native-sdk-changelog-analysis/references/type-mapping.md).

## Android: the THREE touches (most common mistake = forgetting one)

Adding a method on Android touches **three** places in two files:

1. **`src/android/CleverTapFunction.java`** — add an enum constant whose action string equals the JS
   action, just before `CLEVERTAP_UNKNOWN`:
   ```java
   UNMUTE("unmute"),
   ```
2. **`src/android/CleverTapPlugin.java`** — add a `case` to the `execute()` switch:
   ```java
   case UNMUTE:
       unmute(callbackContext);
       return true;
   ```
3. **`src/android/CleverTapPlugin.java`** — add the private implementation (see patterns below).

If the enum constant is missing, `CleverTapFunction.fromString(action)` returns `CLEVERTAP_UNKNOWN`
and the call falls through to the `default` "unhandled CleverTapPlugin action" error — a silent
runtime failure, not a compile error.

## iOS: the TWO touches

1. **`src/ios/CleverTapPlugin.h`** — declare the selector:
   ```objc
   - (void)unmute:(CDVInvokedUrlCommand *)command;
   ```
2. **`src/ios/CleverTapPlugin.m`** — implement it (see patterns). Cordova auto-dispatches by
   selector name; there is **no** switch to edit. Always wrap SDK work in
   `[self.commandDelegate runInBackground:^{ … }]`.

## Source verification — MANDATORY before any native SDK call

Before writing `cleverTap.<x>()` (Android) or `[clevertap <x>]` (iOS), confirm the exact symbol
exists at the target native version. Use the **Read / Grep / Glob tools** (NOT Bash — Bash is
denied outside the working dir) on the cached native source the diff tool downloaded under
`~/.cache/clevertap-sdk-versions/`. Obj-C selectors include every part
(`recordChargedEventWithDetails:andItems:`). If you cannot confirm the symbol, do NOT write the
call — flag it for review. A flagged gap is recoverable; a guessed selector is a broken build.

---

## Pattern 1: fire-and-forget (no return value)

**Example: `unmute()`** — resumes event tracking; returns nothing.

### JS (`www/CleverTap.js`)
```javascript
CleverTap.prototype.unmute = function () {
    cordova.exec(null, null, "CleverTapPlugin", "unmute", []);
}
```

### Android — enum (`CleverTapFunction.java`) + switch case + method (`CleverTapPlugin.java`)
```java
// CleverTapFunction.java
UNMUTE("unmute"),

// CleverTapPlugin.java — execute() switch
case UNMUTE:
    unmute(callbackContext);
    return true;

// CleverTapPlugin.java — implementation
private void unmute(CallbackContext callbackContext) {
    cordova.getThreadPool().execute(() -> {
        cleverTap.unmute();
        sendPluginResult(callbackContext, Status.NO_RESULT);
    });
}
```

### iOS (`CleverTapPlugin.h` + `.m`)
```objc
// CleverTapPlugin.h
- (void)unmute:(CDVInvokedUrlCommand *)command;

// CleverTapPlugin.m
- (void)unmute:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [clevertap unmute];
    }];
}
```

A method that takes a simple arg follows the same shape — e.g.
`recordEventWithName(eventName)` reads `arguments.getString(0)` on Android and
`[command argumentAtIndex:0]` on iOS, calls `cleverTap.pushEvent(eventName)` /
`[clevertap recordEvent:eventName]`, then `Status.NO_RESULT` (Android) / no result (iOS).

## Pattern 2: method with a return value (via success callback)

**Example: `eventGetFirstTime(eventName, successCallback)`** — returns a timestamp.

### JS
```javascript
CleverTap.prototype.eventGetFirstTime = function (eventName, successCallback) {
    cordova.exec(successCallback, null, "CleverTapPlugin", "eventGetFirstTime", [eventName]);
}
```

### Android
```java
// execute() switch
case EVENT_GET_FIRST_TIME:
    eventGetFirstTime(args, callbackContext);
    return true;

// implementation — note executeWithArgs wraps JSON parsing + error reporting
private void eventGetFirstTime(JSONArray args, CallbackContext callbackContext) {
    executeWithArgs(args, callbackContext, (arguments) -> {
        String eventName = arguments.getString(0);
        cordova.getThreadPool().execute(() -> {
            double firstTime = cleverTap.getFirstTime(eventName);
            sendPluginResult(callbackContext, Status.OK, (float) firstTime);
        });
    });
}
```

### iOS
```objc
- (void)eventGetFirstTime:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]]) {
            NSTimeInterval first = [clevertap eventGetFirstTime:eventName];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:first];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}
```

For a collection return (e.g. `variants(successCallback)`), build a `JSONArray` on Android and use
`messageAsArray:` on iOS:
```java
private void variants(CallbackContext callbackContext) {
    cordova.getThreadPool().execute(() -> {
        List<Map<String, Object>> variantsList = cleverTap.variants();
        JSONArray result = new JSONArray();
        if (variantsList != null) {
            for (Map<String, Object> variantMap : variantsList) {
                result.put(new JSONObject(variantMap));
            }
        }
        sendPluginResult(callbackContext, Status.OK, result);
    });
}
```
```objc
- (void)variants:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSArray *variants = [clevertap variants];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:variants ?: @[]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}
```

## Pattern 3: object / complex arguments

**Example: `recordEventWithNameAndProps(eventName, eventProps)`** — passes a properties object.

### JS — note the date-normalization pass before crossing the bridge
```javascript
CleverTap.prototype.recordEventWithNameAndProps = function (eventName, eventProps) {
    convertDateToEpochInProperties(eventProps)
    cordova.exec(null, null, "CleverTapPlugin", "recordEventWithNameAndProps", [eventName, eventProps]);
}
```

### Android — `getJSONObject` + `toMap`
```java
private void recordEventWithNameAndProps(JSONArray args, CallbackContext callbackContext) {
    executeWithArgs(args, callbackContext, (arguments) -> {
        String eventName = arguments.getString(0);
        JSONObject jsonProps = arguments.getJSONObject(1);
        HashMap<String, Object> props = toMap(jsonProps);
        cordova.getThreadPool().execute(() -> {
            cleverTap.pushEvent(eventName, props);
            sendPluginResult(callbackContext, Status.NO_RESULT);
        });
    });
}
```

### iOS — `NSDictionary` with a type guard
```objc
- (void)recordEventWithNameAndProps:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *eventName = [command argumentAtIndex:0];
        NSDictionary *eventProps = [command argumentAtIndex:1];
        if (eventName != nil && [eventName isKindOfClass:[NSString class]] && eventProps != nil && [eventProps isKindOfClass:[NSDictionary class]]) {
            [clevertap recordEvent:eventName withProps:eventProps];
        }
    }];
}
```

## Updating an existing API (added optional parameter)

When the native SDK adds an OPTIONAL parameter, extend the existing wrapper rather than creating a
new method — add a trailing optional argument in JS and read it defensively in native (the real
`discardInAppNotifications(dismissInAppIfVisible)` change followed this shape). Treat a newly
**required** parameter as a breaking change (MAJOR version bump).

## Helpers you should reuse (don't reinvent)

- `executeWithArgs(args, callbackContext, arguments -> { … })` — wraps JSON parsing in try/catch and
  reports `Status.ERROR` on `JSONException`. Use it for any method that reads args.
- `cordova.getThreadPool().execute(() -> { … })` — run SDK work off the main thread.
- `sendPluginResult(callbackContext, Status.NO_RESULT)` / `(..., Status.OK, value)` — the two
  result helpers (`Status` = `PluginResult.Status`).
- `toMap(jsonObject)` — `JSONObject` → `HashMap<String,Object>`. `toArrayListOfStringObjectMaps(...)`
  for arrays of objects.
- iOS: always `[self.commandDelegate runInBackground:^{ … }]`; guard arg types with `isKindOfClass:`.

## Events / callbacks back to JS (native → JS)

For listener-style features (not request/response), native broadcasts an event that JS subscribes to
with `document.addEventListener(...)`:

- **Define the event name** in `src/android/CleverTapEvent.java` (enum, action-string style) and
  emit via `CleverTapEventEmitter.sendEvent(CleverTapEvent.X, data)` — it runs
  `cordova.fireDocumentEvent('<eventName>', json)` on the WebView.
- **iOS** emits with `[self.commandDelegate evalJs:@"cordova.fireDocumentEvent('<eventName>')"]`
  (see `ctProductConfigFetched` for the pattern), typically driven by an SDK delegate callback.

## Documentation step (`docs/Usage.md`)

After wiring a public method, add a short entry to `docs/Usage.md` under the matching feature
heading, with a JS usage snippet in the file's existing style. Add to `docs/Variables.md` instead
for product-variable APIs. Keep it to the public call + one example.

## Per-method completion checklist

- [ ] **JS** — `CleverTap.prototype.<action>` in `www/CleverTap.js` (callback args if it returns data).
- [ ] **Android enum** — constant in `CleverTapFunction.java` with the exact action string.
- [ ] **Android switch** — `case` in `CleverTapPlugin.java` `execute()`.
- [ ] **Android impl** — private method in `CleverTapPlugin.java`; every `cleverTap.<x>()` source-verified.
- [ ] **iOS decl** — selector in `CleverTapPlugin.h`.
- [ ] **iOS impl** — method in `CleverTapPlugin.m`; every `[clevertap <x>]` source-verified.
- [ ] **Example demos** — added to **all 4 sample apps** (see [`example-app-patterns`](../example-app-patterns/SKILL.md)).
- [ ] **Docs** — entry in `docs/Usage.md` (or `docs/Variables.md`).
- [ ] Action string identical across JS, Android enum, and iOS selector.

> **Related (separate repo, follow-up — NOT part of this repo's sync gate):** Ionic/Angular clients
> reach this method through the `awesome-cordova-plugins` typings, which live in a different repo and
> ship on their own release cadence (after a `clevertap-cordova` version is published). Adding the
> method there is its own task — see [`ionic-native-typings`](../ionic-native-typings/SKILL.md).

## Common issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Call no-ops, log "unhandled CleverTapPlugin action" | Missing `CleverTapFunction` enum constant or switch case | Add all 3 Android touches |
| Works on iOS, silent on Android (or vice-versa) | Action string mismatch | Make JS / enum / selector strings identical |
| iOS build fails: "no visible @interface … selector" | Selector declared in `.m` but not `.h` | Add the `.h` declaration |
| Build fails on a `cleverTap.<x>()` call | Symbol doesn't exist at that native version | Source-verify; flag if absent — never guess |
| `JSONException` / crash reading args | Wrong accessor / index | Match the type-mapping table; use `executeWithArgs` |
