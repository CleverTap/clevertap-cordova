---
name: example-app-patterns
description: How to demonstrate a CleverTap Cordova API in the sample apps. Use when implementing or updating an API — every public method MUST get a runnable demo in ALL FOUR sample apps under Samples/, because clients integrate via different stacks (plain Cordova, Ionic+Cordova/Angular, Ionic+Capacitor/Angular, Ionic+Capacitor/React).
---

# Example App Patterns

The `Samples/` folder ships **four** demo apps, one per integration style clients actually use.
Every new or updated public API MUST be demonstrated in **all four** — a method missing from a
sample looks unsupported to clients on that stack.

| # | Sample | Stack | Plugin access | Demo file(s) |
|---|--------|-------|---------------|--------------|
| 1 | `Samples/Cordova/ExampleProject` | Plain Cordova (JS) | global `CleverTap` (clobbered) | `www/js/index.js` |
| 2 | `Samples/IonicCordova/IonicAngularProject` | Ionic Angular + Cordova | `@ionic-native/clevertap/ngx`, injected `this.clevertap`, **Promise**-based | `src/app/home/home.page.ts` + `home.page.html` |
| 3 | `Samples/IonicCapacitorAngularV2/ct-demo-ionic-angular-cap` | Ionic Angular + Capacitor | `@awesome-cordova-plugins/clevertap`, **static** `CleverTap.x()` | `src/app/home/home.page.ts` + `home.page.html` |
| 4 | `Samples/IonicCapacitor/IonicCapReactProject` | Ionic React + Capacitor (TS) | `@ionic-native/clevertap`, `const clevertap = CleverTap` | `src/helper/CleverTapActions.tsx` + `src/controllers/CleverTapAPIController.tsx` + `src/data/*.ts` |

> **Typings gotcha:** samples 2–4 import third-party typings packages (`@ionic-native/clevertap`,
> `@awesome-cordova-plugins/clevertap`) that are NOT maintained in this repo. A brand-new plugin
> method may be absent from those typings → TypeScript won't compile. If so, cast:
> `(CleverTap as any).newMethod(...)` or add `// @ts-ignore` above the call. The plain-Cordova
> sample (1) has no typings and never hits this. The real fix is to add the method to those typings
> upstream — see [`ionic-native-typings`](../ionic-native-typings/SKILL.md).

Pick the right feature category in each sample (Events, User Profile, Inbox, Variables, …) — match
where the existing related calls live.

---

## Worked example: demoing `unmute()` in all four samples

### Sample 1 — plain Cordova (`Samples/Cordova/ExampleProject/www/js/index.js`)

Demos are entries in the `eventsMap` array inside `setupButtons()`. A `["title","Category"]` row
starts a collapsible group; every following `["Label", fn]` becomes a button in that group. Output
goes through the local `log(...)` helper (wraps `console.log`, JSON-stringifies objects).

```javascript
// inside eventsMap, under an existing/new ["title", "..."] group:
["unmute", () => CleverTap.unmute()],

// a method that returns data uses the success callback + log():
["variants", () => CleverTap.variants(v => log("variants", v))],
```

### Sample 2 — Ionic Angular + Cordova (`IonicCordova/IonicAngularProject`)

`home.page.ts`: add a method on the page class; the injected `this.clevertap` is **Promise**-based
for return values, and `this.presentToast(...)` is the existing feedback helper.

```typescript
// src/app/home/home.page.ts
unmute() {
    console.log('unmute');
    this.clevertap.unmute();
    this.presentToast('unmute');
}

// returns data → use the Promise
variants() {
    this.clevertap.variants().then(r => this.presentToast('variants: ' + JSON.stringify(r)));
}
```

`home.page.html`: add a clickable item in the matching `<ion-list>` section.
```html
<ion-item (click)="unmute()">unmute</ion-item>
```

### Sample 3 — Ionic Angular + Capacitor (`IonicCapacitorAngularV2/ct-demo-ionic-angular-cap`)

Same Angular shape as sample 2, but calls are **static** `CleverTap.x()` (imported from
`@awesome-cordova-plugins/clevertap`).

```typescript
// src/app/home/home.page.ts
unmute() {
    CleverTap.unmute();
}
```
```html
<!-- src/app/home/home.page.html -->
<ion-item (click)="unmute()">unmute</ion-item>
```

### Sample 4 — Ionic React + Capacitor (`IonicCapacitor/IonicCapReactProject`)

This one is **data-driven** and needs **3 touches**:

1. `src/helper/CleverTapActions.tsx` — add a value to the `UserActions` enum:
   ```tsx
   export enum UserActions {
       // …
       Unmute,
   }
   ```
2. `src/controllers/CleverTapAPIController.tsx` — add a `case` in the `switch (item.userAction)`:
   ```tsx
   case UserActions.Unmute:
       clevertap.unmute();
       break;
   ```
3. `src/data/*.ts` — add a list item in the matching category file (e.g. `Event.ts`), so it renders:
   ```ts
   { userAction: UserActions.Unmute, title: 'Unmute' },
   ```

---

## Patterns by return shape

- **Action trigger (no return):** just call it; toast/log a confirmation (samples 1–3). In React
  (sample 4) the `case` simply calls the method.
- **Getter / list (returns data):** sample 1 uses the success callback (`CleverTap.x(v => log(...))`);
  samples 2/3 use the Promise (`.then(r => …)`); sample 4 calls it inside the `case`. Use concrete,
  realistic demo inputs (a real event name, a real property map) — not `foo`/`bar` placeholders.
- **Updated signature (new optional arg):** add a second demo showing the new argument so both the
  old and new behavior are visible (e.g. `discardInAppNotifications()` and
  `discardInAppNotifications(true)`).

## Completion checklist (per API)

- [ ] Sample 1: `eventsMap` entry in `index.js`, under the right `["title", …]` group.
- [ ] Sample 2: method in `home.page.ts` + `<ion-item (click)>` in `home.page.html`.
- [ ] Sample 3: method in `home.page.ts` + `<ion-item (click)>` in `home.page.html`.
- [ ] Sample 4: `UserActions` enum + `switch` case + `data/*.ts` list item.
- [ ] Right feature category in each; realistic demo values; data-returning calls surface the result.
- [ ] If TS fails to find the new method, cast `(CleverTap as any)` / `// @ts-ignore` (samples 2–4).

## Common issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Button missing (sample 1) | Entry not under a `["title", …]` group, or wrong array | Place it after a title row inside `eventsMap` |
| TS build fails on the new call | Method absent from third-party typings | `(CleverTap as any).x()` or `// @ts-ignore` |
| Nothing happens on tap (sample 4) | Forgot one of the 3 touches | Add enum + switch case + `data/*.ts` item |
| No visible result for a getter | Didn't read the callback/Promise | Use `log`/`presentToast`/`.then` to surface it |
