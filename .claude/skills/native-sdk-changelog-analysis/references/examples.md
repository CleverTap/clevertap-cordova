# Changelog Analysis Examples (Cordova)

Worked examples of going from a native diff to a Cordova wrapper decision. All decisions are
auto-applied (CI mode) — no waiting for approval; unconfirmable items are flagged.

## Example 1 — New no-arg API (`unmute`)

**Input:** platform `android` + `ios`, core, `8.0.0 → 8.1.0`.

**Process:**
1. `api_diff` (or the changelog recall pass) shows `unmute`.
2. Source-verify (Grep tool, NOT Bash):
   - Android `CleverTapAPI.java` → `public void unmute()`
   - iOS `CleverTap.h` → `- (void)unmute;`
3. Not yet wrapped (grep `www/CleverTap.js`) → `NEW_IMPLEMENTATION`, both platforms, `void`.

| # | Category | API | Android | iOS | Decision | source_verified |
|---|----------|-----|---------|-----|----------|-----------------|
| 1 | 🟢 NEW_API | `unmute()` | `void` | `void` | NEW_IMPLEMENTATION | true |

Then implement via `api-wrapper-patterns` Pattern 1 (incl. the Android enum + switch + method) and
demo in all 4 samples.

## Example 2 — New API returning a collection (`variants`)

**Input:** `both`, core.

- Source: Android `List<Map<String, Object>> variants()`; iOS `- (NSArray *)variants;`.
- Maps to a `JSONArray` on Android (`messageAsArray:` on iOS). JS exposes
  `variants(successCallback)`.

| # | Category | API | Android | iOS | Params | Decision | source_verified |
|---|----------|-----|---------|-----|--------|----------|-----------------|
| 1 | 🟢 NEW_API | `variants()` | `List<Map<String,Object>>` | `NSArray *` | `successCallback` | NEW_IMPLEMENTATION | true |

## Example 3 — Added optional parameter (`discardInAppNotifications`)

Changelog: "Updates `discardInAppNotifications()` with an optional boolean `dismissInAppIfVisible`."

- Already wrapped → `UPDATE`, not new.
- Optional (not required) param → **minor** bump, non-breaking.
- Extend the existing JS method with a trailing optional arg; read it defensively in native.

| # | Category | API | Decision | Notes |
|---|----------|-----|----------|-------|
| 1 | 🔴/UPDATE | `discardInAppNotifications(dismissInAppIfVisible)` | UPDATE | optional arg → minor |

## Example 4 — Mixed batch (`8.1.0 → 8.3.0`, skipped version)

`diff.json.changelog.intermediate_entries` carries the `8.2.0` entry too — read it. Reconcile both
sources:

| # | Category | API | Decision | Notes |
|---|----------|-----|----------|-------|
| 1 | 🟢 NEW_API | `someNewApi()` | NEW_IMPLEMENTATION | confirmed in source |
| 2 | 🟡 DEPRECATED | `oldApi()` | UPDATE | present + `@Deprecated` → keep, note it |
| 3 | 🔵 BUG_FIX | InApp render fix | NO_ACTION | behavior only |
| 4 | ⚪ INTERNAL | DB migration | NO_ACTION | internal |

## Example 5 — Cannot confirm in source → FLAG, don't guess

Changelog names `fooBar()` but it is absent from `CleverTapAPI.java` / `CleverTap.h` at the new
version (or the wording is ambiguous, e.g. a behavior-only note).

- Do NOT write the call.
- Add to `flagged_for_review`:
  ```json
  { "type": "unconfirmed", "name": "fooBar", "changelog_version": "8.3.0",
    "rationale": "Changelog mentions fooBar but no matching symbol found in CleverTapAPI.java / CleverTap.h at 8.3.0; needs human confirmation." }
  ```

A flagged item is recoverable by the reviewer; a guessed selector is a broken build (this exact
failure has happened on another wrapper).
