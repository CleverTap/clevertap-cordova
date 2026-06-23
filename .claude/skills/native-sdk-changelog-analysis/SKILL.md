---
name: native-sdk-changelog-analysis
description: Analyze CleverTap native Android/iOS SDK changes to decide what the Cordova plugin must wrap. Use during a native-release sync to categorize API changes, source-verify symbols, and produce a wrapper implementation plan. Treats the diff tool as ground truth and the native changelog as a recall pass.
---

# Native SDK Changelog Analysis

Turn a native Android/iOS SDK version bump into a concrete list of Cordova wrapper changes:
categorize each change, **verify the real symbol in native source**, and decide
implement / update / skip / flag.

## Ground truth: the diff tool (NOT WebFetch)

In CI the orchestrator runs `tools/diff_native_api.py` and gives you its `diff.json`. **That is
your ground truth** — do NOT WebFetch changelogs. `diff.json` has three parts:

- `api_diff` — added / removed / changed public methods (drives what you wrap).
- `build_manifest` — minSdk / deployment target / permissions / dependency deltas.
- `changelog` — the native changelog entry verbatim (`target_entry` + `intermediate_entries` for
  any skipped versions). This is a **second detection source**, not just narrative — the regex diff
  is ~80% complete and misses multi-line signatures, `@JvmOverloads`, Kotlin default params, etc.

> **CI mode:** there is no human. Anywhere a step says "wait for user / Approved / Hold / DISCUSS",
> make the best-judgment call, proceed, and record it. Never stop and wait.

## Inputs

| Parameter | Description | Example |
|-----------|-------------|---------|
| `platform` | Target platform | `"android"`, `"ios"` |
| `module` | Native module | `core` / `pushtemplates` / `hms` |
| `old_version` | Current pin (from `plugin.xml`) | `8.1.0` |
| `new_version` | Target version | `8.3.0` |

## Process

```
1. Read diff.json (api_diff + build_manifest + changelog)   ← ground truth
2. Categorize every change
3a. From api_diff: walk the decision tree → decision per item
3b. Recall pass from changelog: for each public API the changelog names but
    api_diff missed → SOURCE-VERIFY in native source, then act or flag
4. Map build_manifest deltas (minSdk / deployment target / permissions)
5. Emit the implementation plan (structured; no waiting for approval in CI)
```

## Step 2 — Categorize

| Category | Trigger words | Action |
|----------|---------------|--------|
| 🟢 `NEW_API` | "New", "Added", "Introduced" | Wrap it ([`api-wrapper-patterns`](../api-wrapper-patterns/SKILL.md)) |
| 🔴 `BREAKING` | "Removed", "Breaking", "Changed signature" | Update/remove the wrapper (MAJOR bump) |
| 🟡 `DEPRECATED` | "Deprecated", "Obsolete" | Keep wrapper; add a deprecation note |
| 🔵 `BUG_FIX` | "Fixed", "Bug", "Issue" | Usually no wrapper change |
| ⚪ `INTERNAL` | "Refactored", "Optimized", "Internal" | No wrapper change |

## Step 3a — Decision tree (per `api_diff` item)

```
API already in the Cordova plugin (grep www/CleverTap.js)?
├─ YES → Signature changed?
│  ├─ YES → UPDATE   (added REQUIRED param ⇒ BREAKING/MAJOR; optional ⇒ minor)
│  └─ NO  → NO_ACTION
└─ NO → Commonly used public functionality?
   ├─ YES → NEW_IMPLEMENTATION
   ├─ MAYBE → record rationale, best-judgment (CI), lean to implement if public
   └─ NO  → SKIP
```

## Step 3b — Recall pass (catch what the regex diff missed) — SOURCE-VERIFY FIRST

For every concrete public API the changelog names (`target_entry` + `intermediate_entries`) that is
NOT already in `api_diff`, **confirm it in the new native source before acting**:

- **Android:** `clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java` (or the
  class the changelog names).
- **iOS:** `CleverTapSDK/CleverTap.h` and its category headers (`CleverTap+Inbox.h`,
  `CleverTap+DisplayUnit.h`, …). Obj-C selectors include every label part —
  `recordChargedEventWithDetails:andItems:`, not `...WithDetails:items:`.

Then:
- **New API** — symbol present, not yet wrapped → implement (mark type `(inferred)` if the signature
  can't be fully confirmed).
- **Removed** — symbol genuinely absent → remove/deprecate the wrapper (MAJOR).
- **Deprecated** — present but marked `@Deprecated` / `__attribute__((deprecated))` → KEEP, add a
  doc note; do NOT delete.
- **Signature changed** — source confirms the new signature → update (MAJOR if a required param was
  added).
- **Behavior-only** — no symbol added/removed/changed → nothing to implement → `flagged_for_review`.
- **Cannot confirm in source** → do NOT guess → `flagged_for_review` (type `unconfirmed`).

## Step 4 — Build-manifest propagations

From `build_manifest`, propagate into the Cordova plugin (`plugin.xml` / `README.md`) only what the
diff shows:
- Android `minSdk` raised → reflect in the changelog (`Bumps the minimum supported Android API
  level…`) and any host-setup docs.
- iOS deployment target raised → note in the changelog/docs.
- New always-required Android permissions → declare in `plugin.xml`.
Record each in `build_propagated`.

## Source verification — MANDATORY, use Read/Grep tools (not Bash, not WebFetch)

The single biggest cause of broken builds is calling a native symbol that doesn't exist. Verify
EVERY native call against the cached native source the diff tool downloaded under
`~/.cache/clevertap-sdk-versions/<repo>-<tag>/`. **Use the Read / Grep / Glob TOOLS** — Bash
commands referencing paths outside the working dir are permission-DENIED; if a Bash grep on the
cache is denied, that's your cue to use the Grep tool, not to proceed unverified. If you cannot find
the symbol, do NOT write the call — flag it.

## Step 5 — Implementation plan (output)

Produce a single table; in CI this feeds the structured JSON the orchestrator emits (no approval
wait). Verified items become `surfaced`/`skipped`; unconfirmable or behavior-only items become
`flagged_for_review`.

```markdown
## Wrapper Implementation Plan
- Platform: <android|ios>   Range: <old> → <new>   Totals: NEW x / BREAKING y / …

| # | Category | API | Android type | iOS type | Params | Decision | source_verified | Notes |
|---|----------|-----|--------------|----------|--------|----------|-----------------|-------|
| 1 | 🟢 NEW_API | `unmute()` | `void` | `void` | none | NEW_IMPLEMENTATION | true | |
```

## References
- [Type Mapping](references/type-mapping.md) — Java ↔ Obj-C ↔ JS/JSON conversions.
- [Examples](references/examples.md) — worked Cordova analyses.

## Success Criteria
- ✅ All `api_diff` + changelog changes categorized and decided.
- ✅ Every surfaced native call source-verified (`source_verified: true`) or moved to `flagged_for_review`.
- ✅ APIs are never invented; unconfirmable items are flagged, not guessed.
- ✅ No WebFetch; no waiting for human approval (CI).
