---
name: changelog-generation
description: Generate a properly formatted CHANGELOG.md entry for a CleverTap Cordova plugin release. Use when bumping native SDK versions, adding/updating APIs, or preparing any release. Covers the exact Cordova changelog format, platform tags, and native-SDK link anchors.
---

# Changelog Generation

> **⚠️ MANDATORY READING**: The `CHANGELOG.md` format is strict and parsed by reviewers and
> tooling. Match the existing entries exactly.

Generate the new `CHANGELOG.md` entry for a CleverTap Cordova plugin release.

## Critical Rules

1. **Add at the TOP** — new entry goes directly under the file header (`Change Log\n==========`),
   before all existing version entries.
2. **Header line** — `Version X.Y.Z *(Month DD YYYY)*` immediately followed by a separator line of
   hyphens (`-------------------------------------------`).
3. **Date format** — `Month DD YYYY` — full month name, day with NO leading zero, 4-digit year.
   e.g. `April 30 2026`, `October 8 2025`. No commas, no slashes.
4. **Platform tags** — use exactly `**[Android Platform]**`, `**[iOS Platform]**`,
   `**[Android and iOS Platform]**`.
5. **Native-SDK support line** — link to the native changelog WITH a version anchor (see below).
6. **Indentation** — 4 spaces per nesting level (`    *` for first-level bullets under a platform,
   `        *` for a sub-bullet).
7. **Inline code** — wrap method names, parameters, and types in backticks: `` `unmute()` ``,
   `` `discardInAppNotifications(dismissInAppIfVisible)` ``.
8. **Active voice** — "Adds…", "Updates…", "Fixes…" — not "Support was added".

## Entry Template

```markdown
Version X.Y.Z *(Month DD YYYY)*
-------------------------------------------
**What's new**
* **[Android Platform]**
    * Supports [CleverTap Android SDK vA.B.C](<android-link-with-anchor>).

* **[iOS Platform]**
    * Supports [CleverTap iOS SDK vD.E.F](<ios-link-with-anchor>).

**API changes**
* **[Android and iOS Platform]**
    * Adds new `methodName(args)` API to <what it does>.
    * Updates `existingMethod()` with an optional parameter `paramName`. <effect>.
        * `existingMethod(paramName)`

**Bug Fixes**
* **[iOS Platform]**
    * Fixes <description>.
```

Include only the sections that apply (`What's new`, `API changes`, `Breaking Changes`, `Bug Fixes`).
Omit a platform that had no change.

## Native-SDK Link Anchors

**Preferred: copy the anchor verbatim.** During a sync, the diff tool gives you the native
changelog entry (`diff.json` → `changelog.target_entry`, plus `intermediate_entries`). Derive the
anchor from the native changelog's own heading rather than hand-generating it — the anchor style has
varied between SDKs/versions.

Base URLs:
- Android: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#<anchor>`
- iOS: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#<anchor>`

**Observed anchor pattern** (both platforms, GitHub auto-anchor of `Version A.B.C (Month D, YYYY)`):
`#version-<digits>-<month>-<day>-<year>` — dots removed, lowercase month, e.g.:
- Android `8.1.0` (April 17 2026) → `#version-810-april-17-2026`
- iOS `7.6.0` (April 17 2026) → `#version-760-april-17-2026`

If the native heading differs from this pattern, follow the actual heading — when in doubt, the
verbatim copy from `target_entry` wins. Do NOT use WebFetch in CI; the changelog text is already in
`diff.json`.

## Complete Example (real, current top entry)

```markdown
Version 5.0.0 *(April 30 2026)*
-------------------------------------------
**What's new**
* **[Android Platform]**
    * Supports [CleverTap Android SDK v8.1.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-810-april-17-2026).
    * Bumps the minimum supported Android API level from 21 (Android 5.0) to 23 (Android 6.0).

* **[iOS Platform]**
    * Supports [CleverTap iOS SDK v7.6.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-760-april-17-2026).

**API changes**
* **[Android and iOS Platform]**
    * Adds new `variants(successCallback)` API to fetch the active A/B experiment variants for the current user.
    * Updates `discardInAppNotifications()` with an optional boolean parameter `dismissInAppIfVisible`. When `true`, immediately dismisses any currently visible In-App notification in addition to clearing the pending queue.
        * `discardInAppNotifications(dismissInAppIfVisible)`
    * Adds new `unmute()` API to resume event tracking, overriding any active mute period.

**Bug Fixes**
* **[iOS Platform]**
    * Fixes a bug where onUserLogin was creating additional guids only for encryption level high.
```

## Content Guidelines

- **What's new** — one `Supports [CleverTap <Platform> SDK vX.Y.Z](link)` line per platform whose
  pin changed; plus host-impacting changes (e.g. minSdk bump). Omit unchanged platforms.
- **API changes** — new public methods (`Adds new ...`); for an added optional parameter, write
  `Updates ...` and show the new signature as an indented sub-bullet.
- **Breaking Changes** — what was removed/changed + migration note.
- **Bug Fixes** — brief description, tagged by platform.
- When a sync spans multiple native versions (skipped releases), summarize the net API changes;
  the per-version native narrative is rendered separately in the PR body from `intermediate_entries`.

## Insertion Process

1. Read `CHANGELOG.md`.
2. Insert the new entry immediately after the header block:
   ```
   Change Log
   ==========
   Version X.Y.Z *(Month DD YYYY)*    ← NEW ENTRY HERE
   -------------------------------------------
   ...
   Version <previous> *(...)*          ← existing entries follow
   ```
3. Keep one blank line between the new entry and the previous one.

## Common Mistakes

❌ `### Version 5.0.0` (markdown heading) — Cordova uses a plain `Version …` line + hyphen rule
✅ `Version 5.0.0 *(April 30 2026)*` then `-------------------------------------------`

❌ Date with slashes/commas: `(04/30/2026)`, `(April 30, 2026)`
✅ `*(April 30 2026)*`

❌ Generic tag `**[Android]**`
✅ `**[Android Platform]**`

❌ Native link without an anchor
✅ `...CTCORECHANGELOG.md#version-810-april-17-2026`

❌ 2-space indentation
✅ 4-space indentation per level

❌ Entry at the bottom of the file
✅ Entry at the TOP, under the `Change Log` header
