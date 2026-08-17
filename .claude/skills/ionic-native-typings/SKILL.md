---
name: ionic-native-typings
description: How to expose a CleverTap Cordova plugin method to Ionic/Angular apps by adding it to the awesome-cordova-plugins (formerly ionic-native) typings. Use after adding/updating a public method in the Cordova plugin, when a method is missing from @awesome-cordova-plugins/clevertap or @ionic-native/clevertap, or when preparing the Ionic typings PR for a released clevertap-cordova version.
---

# Ionic Native Typings (awesome-cordova-plugins)

Ionic/Angular apps don't call the Cordova plugin directly — they consume CleverTap through the
**`awesome-cordova-plugins`** package (older name: `@ionic-native`). Until a new Cordova plugin
method is added to that package's typings, Ionic clients can't call it type-safely (this is the
typings-lag gotcha in [`example-app-patterns`](../example-app-patterns/SKILL.md), where samples must
fall back to `(CleverTap as any)`). This skill is how you close that gap.

> **When to use:** after a public method is added/updated in `www/CleverTap.js` (see
> [`api-wrapper-patterns`](../api-wrapper-patterns/SKILL.md)) **and a `clevertap-cordova` version
> carrying it has been released** — the typings PR tracks a released plugin version.

## Repos and the two-PR flow

| Role | Repo | Default branch |
|------|------|----------------|
| Upstream (the published package) | `danielsogl/awesome-cordova-plugins` | `main` |
| CleverTap fork (where we work) | `CleverTap/ionic-native` | `master` |

1. **PR #1 — into the fork (automatable).** Branch off `CleverTap/ionic-native` `master`, edit the
   one file, open a PR **against the fork's `master`** for internal CleverTap review/merge.
2. **PR #2 — fork → upstream (human-initiated).** After PR #1 merges, a maintainer opens a PR from
   `CleverTap/ionic-native:master` → `danielsogl/awesome-cordova-plugins:main` via GitHub's
   "Contribute → Open pull request". This step is a deliberate human action — our GitHub App can't
   open PRs on a third-party repo it isn't installed on.

PR title convention (see the real example
[`danielsogl/awesome-cordova-plugins#4883`](https://github.com/danielsogl/awesome-cordova-plugins/pull/4883)):
`feat(clevertap): support clevertap-cordova X.Y.Z`.

> **Branch drift:** the upstream renamed `master`→`main` historically. Verify each repo's actual
> default branch at PR time rather than assuming.

## The one file

Everything lives in a single file:

```
src/@awesome-cordova-plugins/plugins/clevertap/index.ts
```

Its shape (do NOT change the header/decorators — only add methods inside the class):

```ts
import { Injectable } from '@angular/core';
import { Cordova, AwesomeCordovaNativePlugin, Plugin } from '@awesome-cordova-plugins/core';

declare let clevertap: any;

/**
 * @name CleverTap
 * @description Cordova Plugin that wraps CleverTap SDK for Android and iOS
 * @usage
 * ```typescript
 * import { CleverTap } from '@awesome-cordova-plugins/clevertap/ngx';
 * constructor(private clevertap: CleverTap) { }
 * ```
 */
@Plugin({
  pluginName: 'CleverTap',
  plugin: 'clevertap-cordova',
  pluginRef: 'CleverTap',
  repo: 'https://github.com/CleverTap/clevertap-cordova',
  platforms: ['Android', 'iOS'],
})
@Injectable()
export class CleverTap extends AwesomeCordovaNativePlugin {
  // ... one @Cordova() method per public plugin API, grouped under banner comments ...
}
```

Methods are grouped under banner comments (`/*** Events ***/`, `/**** Custom Templates methods ****/`,
…). Add each new method under the banner that matches its feature; create a new banner only for a
genuinely new feature area.

## Per-method pattern

Every method in this file is a `@Cordova()`-decorated stub that returns `Promise<any>` — the
decorator wires it to `cordova.exec` under the hood; the body is just `return;`. **No decorator
options are used anywhere in the CleverTap plugin — always bare `@Cordova()`.**

```ts
/**
 * <one-line description>
 * @param {string} name - <description>
 * @returns {Promise<any>}
 */
@Cordova()
methodName(name: string): Promise<any> {
  return;
}
```

## Mapping `www/CleverTap.js` → typings

1. **Parameters come from the `cordova.exec` args array — not the JS function signature.** A method
   is `CleverTap.prototype.foo = function (arg, successCallback) { cordova.exec(successCallback, errorCb, "CleverTapPlugin", "foo", [arg]) }`.
   The typings params are exactly the entries in that **`[ … ]` array** (here `arg`); the success/error
   callbacks (the 1st/2nd `cordova.exec` args) are NOT params — they collapse into the returned
   `Promise`. (Confirmed: `getCleverTapID()`, `profileGetProperty(propertyName)`, `variants()` are all
   callback-less `Promise<any>`; `discardInAppNotifications` passes `[dismissInAppIfVisible === true]`
   → it has one param.)
2. **Mirror the method name exactly** — it is the `cordova.exec` action string and the
   `pluginRef`'s method; a typo means the call won't reach native.
3. **Type the remaining args** JS → TS: `string` / `number` / `boolean`; an object → `any`
   (or a named interface if one already exists in the file); an array → `any[]`. Return is always
   `Promise<any>`.
4. **Removed vs deprecated:** if a method is **gone** from `www/CleverTap.js`, **delete** it from the
   typings (see "Reconciling" below). If it's still present but documented as deprecated, KEEP it and
   add `@deprecated <reason / replacement>` to its JSDoc (the file keeps such entries, e.g. the old
   attribution-id getters).

### Worked examples

Fire-and-forget, no args — `CleverTap.prototype.unmute = function () { cordova.exec(null, null, "CleverTapPlugin", "unmute", []) }`:
```ts
/**
 * Resumes event tracking, overriding any active mute period.
 * @returns {Promise<any>}
 */
@Cordova()
unmute(): Promise<any> {
  return;
}
```

Getter with a success callback — `CleverTap.prototype.variants = function (successCallback) { cordova.exec(successCallback, null, "CleverTapPlugin", "variants", []) }`:
```ts
/**
 * Fetches the active A/B experiment variants for the current user.
 * @returns {Promise<any>}
 */
@Cordova()
variants(): Promise<any> {
  return;       // the successCallback is dropped — its data resolves the Promise
}
```

Method with an argument — `recordEventWithName(eventName)`:
```ts
/**
 * Records an event with the given name.
 * @param {string} eventName - the name of the event
 * @returns {Promise<any>}
 */
@Cordova()
recordEventWithName(eventName: string): Promise<any> {
  return;
}
```

## Reconciling cordova ↔ typings (add / update / remove)

This is **full automation**: apply every change you can confidently derive and record it — the human
reviews the PR. Reserve flagging for cases you genuinely can't resolve.

**Updating an existing method (signature drift).** If a method exists in both but the cordova
exec-args differ from the typings signature, update the typings to match. Newly-added trailing params
become **optional** (`?`). Example — cordova added `dismissInAppIfVisible`:
```ts
// before
@Cordova()
discardInAppNotifications(): Promise<any> { return; }
// after
/**
 * Clears pending In-App notifications.
 * @param {boolean} dismissInAppIfVisible - also dismiss a currently-visible In-App.
 * @returns {Promise<any>}
 */
@Cordova()
discardInAppNotifications(dismissInAppIfVisible?: boolean): Promise<any> { return; }
```

**Removed from cordova.** If a method is in the typings but no longer in `www/CleverTap.js`, **delete
it** (method + its JSDoc) — full parity with the plugin; the PR review is the gate. **Guard:** only
delete when the name is genuinely gone — if it merely reappears under a different casing/rename, do
NOT delete; flag it instead.

**Only flag when genuinely uncertain.** If you can't confidently type a param, or a same-name /
different-casing near-duplicate exists, make a best-effort edit if sensible and record it for the
reviewer rather than guessing wildly.

## Checklist (per method)

- [ ] Edited only `src/@awesome-cordova-plugins/plugins/clevertap/index.ts`.
- [ ] **Added** missing methods; **updated** drifted signatures (exec-args; new trailing params `?`);
      **removed** methods gone from cordova (guard against casing/rename false positives).
- [ ] Method name matches `www/CleverTap.js` exactly; params from the `cordova.exec` args array.
- [ ] `@Cordova()` (bare) + returns `Promise<any>` + body is `return;`; JSDoc `@param`/`@returns`.
- [ ] Placed under the matching banner section; imports / `@Plugin` / class decl untouched.
- [ ] PR #1 opened against `CleverTap/ionic-native` `master`; upstream PR left as the human step.

## Common mistakes

❌ Keeping the `successCallback` parameter in the typings signature
✅ Drop it — the Cordova decorator resolves the `Promise` with the callback's value

❌ `@Cordova({ ... })` with options / a different return type
✅ Bare `@Cordova()` returning `Promise<any>` — matches every method in this file

❌ Editing the `@Plugin` block, imports, or `declare let clevertap` to add a method
✅ Only add methods inside the class body

❌ Leaving a method that no longer exists in the cordova plugin
✅ Delete it (full parity) — but only when the name is genuinely gone, not a casing/rename variant

❌ Skipping a method whose signature changed just because the name already exists
✅ Update the typings signature to match cordova's exec-args (new trailing params optional)

❌ Opening the upstream PR via automation
✅ Automation opens PR #1 into the fork; a maintainer opens the upstream PR by hand
