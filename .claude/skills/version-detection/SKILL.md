---
name: version-detection
description: Version locations, patterns, and conversion logic for the CleverTap Cordova plugin. Single source of truth for where the plugin version, the Android native-SDK pin, and the iOS native-SDK pin live. Use when bumping versions during a native-release sync or verifying version consistency.
---

# Version Detection

Where every version string lives in the CleverTap Cordova plugin, how to extract it, and the
`libVersion` integer conversion. Three independent version values are tracked:

- **Plugin version** (e.g. `5.0.0`) — the wrapper's own release version.
- **Android native-SDK pin** (e.g. `8.1.0`) — `clevertap-android-sdk`.
- **iOS native-SDK pin** (e.g. `7.6.0`) — `CleverTap-iOS-SDK`.

The plugin version and the two native pins move **independently**. A native-release sync sets the
native pin(s) for the platform(s) being synced and then bumps the plugin version by semver.

## Version Locations

| # | Tracks | File | Where | Pattern |
|---|--------|------|-------|---------|
| 1 | Plugin version | `plugin.xml` | Top `<plugin>` tag (line ~2) | `<plugin ... version="X.Y.Z">` |
| 2 | Plugin version | `package.json` | Top (line ~3) | `"version": "X.Y.Z"` |
| 3 | Plugin version | `src/android/CleverTapPlugin.java` | `initialize()` (line ~110) | `int libVersion = NNNNN;` |
| 4 | Plugin version | `src/ios/CleverTapPlugin.m` | `setLibrary` (line ~1474) | `int libVersion = NNNNN;` |
| 5 | Plugin version | `CHANGELOG.md` | New entry at TOP | `Version X.Y.Z *(Month DD YYYY)*` |
| 6 | Android pin | `plugin.xml` | `<platform name="android">` (line ~116) | `<framework src="com.clevertap.android:clevertap-android-sdk:A.B.C"/>` |
| 7 | Android pin | `README.md` | "Supported Versions" (line ~22) | `CleverTap Android SDK version A.B.C` |
| 8 | iOS pin | `plugin.xml` | `<podspec>` (line ~49) | `<pod name="CleverTap-iOS-SDK" spec="D.E.F" />` |
| 9 | iOS pin | `README.md` | "Supported Versions" (line ~23) | `CleverTap iOS SDK version D.E.F` |

`CHANGELOG.md` also carries native-SDK *links* (Android + iOS) inside the new entry — see the
[`changelog-generation`](../changelog-generation/SKILL.md) skill for that format.

> Line numbers are hints, not guarantees — always grep the pattern, don't seek to a line.

## Extraction Process

### Plugin version (1–5)
The same `X.Y.Z` must appear in `plugin.xml` (top), `package.json`, both `libVersion` integers
(see conversion below), and the latest `CHANGELOG.md` header.

```bash
grep -n 'version=' plugin.xml | head -1
grep -n '"version"' package.json
grep -rn 'libVersion =' src/android/CleverTapPlugin.java src/ios/CleverTapPlugin.m
```

### Android native pin (6, 7)
```bash
grep -n 'clevertap-android-sdk:' plugin.xml
grep -n 'Android SDK version' README.md
```

### iOS native pin (8, 9)
```bash
grep -n 'CleverTap-iOS-SDK' plugin.xml
grep -n 'iOS SDK version' README.md
```

## libVersion Integer Conversion

The `libVersion` constant (locations 3 and 4) encodes the **plugin version** as a zero-padded
integer — `major * 10000 + minor * 100 + patch`. **It appears in TWO files** (`CleverTapPlugin.java`
and `CleverTapPlugin.m`); both must change together.

**Version → integer**: `5.0.0` → `50000`, `5.1.0` → `50100`, `5.2.3` → `50203`, `5.10.2` → `51002`

**Integer → version**:
1. `patch = n % 100`
2. `minor = (n / 100) % 100`
3. `major = n / 10000`
   e.g. `51002` → `5.10.2`

Both `CleverTapPlugin.java` (line ~110) and `CleverTapPlugin.m` (line ~1474) literally read:
```
int libVersion = 50000;
```

## Version Consistency Check

1. Extract the plugin version from locations 1–5 (decode both `libVersion` integers to `X.Y.Z`).
   They must all match.
2. Extract the Android pin from 6, 7 — must match each other.
3. Extract the iOS pin from 8, 9 — must match each other.
4. The plugin version and the two pins are independent; do NOT expect them to be equal.
5. Report any intra-group mismatch.

## Valid Version Format

Pattern: `X.Y.Z` where X, Y, Z are integers.

✅ Valid: `5.0.0`, `5.10.2`, `6.0.0`
❌ Invalid: `5.0`, `v5.0.0`, `5.0.0-beta`
