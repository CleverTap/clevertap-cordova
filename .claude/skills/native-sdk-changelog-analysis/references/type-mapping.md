# Type Mapping Reference (Cordova)

How native Android (Java) and iOS (Obj-C) types cross the Cordova bridge to/from JS. Arguments
travel as JSON via `cordova.exec`; results come back through `CallbackContext` (Android) /
`CDVPluginResult` (iOS).

## Bridge type table

| Android SDK type | Android in/out | iOS SDK type | iOS in/out | JS / JSON |
|------------------|----------------|--------------|------------|-----------|
| `String` | `args.getString(i)` / `Status.OK, str` | `NSString *` | `[command argumentAtIndex:i]` / `messageAsString:` | string |
| `int`, `long` | `args.getInt(i)` / `Status.OK, n` | `NSInteger` | `messageAsInt:` | number |
| `double`, `float` | `args.getDouble(i)` / `Status.OK, (float)d` | `double` | `messageAsDouble:` | number |
| `boolean` | `args.getBoolean(i)` / `Status.OK, bool` | `BOOL` | `messageAsBool:` | boolean |
| `Map<String,Object>` / `HashMap` | `toMap(args.getJSONObject(i))` / `JSONObject` | `NSDictionary *` | `messageAsDictionary:` | object |
| `List` / `ArrayList` | `args.getJSONArray(i)` / `JSONArray` | `NSArray *` | `messageAsArray:` | array |
| `List<Map<String,Object>>` | build a `JSONArray` of `JSONObject` | `NSArray<NSDictionary *> *` | `messageAsArray:` | array of objects |
| `void` | `Status.NO_RESULT` | `void` | (no `sendPluginResult`) | (no callback) |
| `Object` | `Object` | `id` | — | dynamic |

## Common CleverTap types

| Android | iOS |
|---------|-----|
| `CTInboxMessage` | `CleverTapInboxMessage` |
| `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` |
| `CleverTapDisplayUnit` | `CleverTapDisplayUnit` |

In Cordova these collection types are serialized to a `JSONArray` (Android) / `NSArray` (iOS) of
plain objects before crossing the bridge — JS receives arrays of dictionaries, not SDK objects.

## Cross-platform inference

When a signature is confirmed on one platform but not the other:

```
Android → iOS                          iOS → Android
  ArrayList<T>     → NSArray<T *> *       NSArray<T *> *  → ArrayList<T>
  Map<String,Object> → NSDictionary *     NSDictionary * → Map<String,Object>
  boolean          → BOOL                 BOOL           → boolean
  void             → void                 void           → void
```

## Nullability

| Android | iOS | Meaning |
|---------|-----|---------|
| `@NonNull` | `_Nonnull` | never null |
| `@Nullable` | `_Nullable` | may be null |
| (none) | (none) | assume nullable; guard with `isKindOfClass:` on iOS |

Always verify the real type from native source (`CleverTapAPI.java` / `CleverTap.h`) before relying
on inference; annotate inferred types as `(inferred)` in the plan.
