# Modernization notes

Working list of things worth changing in `src/js/aprico-ui.js`, plus a few
loose ends elsewhere. Written 2026-07-28 against v0.2.1.

Line numbers refer to the file as it stood when this was written; they will
drift as things get fixed.

## Already done (context, not TODO)

- Dependencies migrated off the PostCSS 7 / `uglify-es` era. `postcss-color-function`
  and `postcss-remove-root` were dropped (both abandoned, no PostCSS 8 port);
  remove-root is now a small inline plugin in `postcss.config.js`.
- `utils.copyToClipboard` rewritten on the async Clipboard API, with the old
  `execCommand` path kept as a fallback. See the doc comment in `src/js/utils.js`
  for the four deployment targets and why the fallback stays.
- `browserslist` floor is `iOS >= 18`.

Everything below is *not* done.

---

## 1. Real issues

These are worth fixing whether or not you care about modernizing.

### 1.1 Dead versioned storage key — `aprico-ui.js:71`

```js
const hashIdKey = 'hashId_' + VERSION_TREE['aprico-gen'].replace(/\./g , "_");
```

Declared, never used. All six storage reads/writes use the literal `'hashId'`
(lines 85, 87, 95, 97, 136, 138). Terser already strips it from the bundle.

The *intent* matters more than the dead line: keying storage by aprico-gen
version is exactly the guard you want if the generation algorithm ever changes,
so that IDs stored under an incompatible version don't silently generate wrong
passwords. Either finish it or delete it — inert is the worst option.

- [ ] Decide: implement the versioned key (with a migration path) or remove it.

### 1.2 Document-wide queries inside a mountable component — `424`, `433`, `467`, `509`

```js
let formEls      = document.querySelectorAll('input');            // 424
let checkboxes   = document.querySelectorAll('.switch-toggle');   // 433
let $extraInputs = document.querySelectorAll('#aprico-extra input'); // 467
Array.from(document.querySelectorAll('.external-link'))           // 509
```

`bootstrap()` mounts into a caller-supplied selector, so this is meant to be
embeddable — but these four search the whole document instead of `_root`.

Harmless today, because the UI is effectively the entire page in all four
deployments. It becomes real the moment it is embedded in a larger host page:
line 424 attaches a "hide results on change" listener to *every* input on the
host page, and since `renderLogin`/`renderMain` re-run the setup functions on
each transition, listeners on host-page elements accumulate on every re-render.
Elements inside `_root` are fine — they get replaced, so their listeners go with
them.

- [ ] Scope all four to `_root.querySelectorAll(...)`.
- [ ] Consider the same for `utils.getId` (`document.getElementById`).

### 1.3 `tabs[0]` unguarded — `aprico-ui.js:240`

```js
chrome.tabs.query({active:true,currentWindow:true}, function(tabs){
  if (tabs[0].url.indexOf('.') > 0) {
```

`query` can return an empty array (no active tab, restricted page), and this
throws inside the callback. Also worth re-checking that the extension manifest
still grants `tabs`/`activeTab` under MV3.

- [ ] Guard `tabs[0]` and `tabs[0].url`.

### 1.4 Dead locals

- `step1` / `step2` / `step3` (`311`, `339`, `367`) — assigned, never read.
- `time` (`341`) — exists only for the commented-out `console.log` on line 351.

- [ ] Remove (falls out naturally from §2.1).

---

## 2. Highest-payoff modernization

### 2.1 The three-Promise step machinery in `generate()` — `299`–`392`

The biggest readability win in the file.

Three `new Promise(resolve => … setTimeout(resolve, 100))` blocks exist purely
to yield to the browser so it can paint before scrypt blocks the main thread.
The cost is that `timerId`, `results`, `copyPromise` and `copy` all have to be
hoisted to the function scope just to cross closure boundaries — which is also
why the clipboard fix needed the `copyPromise` split (fire in step 2, await
before step 3).

With a two-line helper it flattens to straight-line code:

```js
const tick = ms => new Promise(r => setTimeout(r, ms));

prepareUI();
await tick(100);
const pass = generatePassword();
const copy = await utils.copyToClipboard($result);
resolveUI(copy);
```

Every hoisted variable becomes an ordinary local.

Two things to preserve when doing this:

- The clipboard write must still *start* as early as possible after the password
  lands in `$result`, to stay inside the transient user-activation window that
  Safari and Firefox require. Don't move it later in the sequence.
- If you want to be accurate about "yield until painted", a double
  `requestAnimationFrame` is more honest than a 100 ms guess.

- [ ] Flatten `generate()`.

### 2.2 The inlined minified sha256 — `aprico-ui.js:22`

A ~1.5 KB unreadable blob, plus the UTF-8→base64 dance at `262`–`264` that
exists *only* because that implementation is ASCII-only:

```js
let value64 = btoa(encodeURIComponent(this.value).replace(/%([0-9A-F]{2})/g, ...));
```

`crypto.subtle.digest('SHA-256', …)` is native, deletes both, and is available
in all four deployment targets (`file://` included — it is a secure context).
It is async, but it only feeds an identicon from an `input` handler, so that is
fine.

**Caveat:** feeding `TextEncoder` bytes instead of the base64 string produces a
different digest, so existing users' identicons would change appearance.
Generated passwords are unaffected — the identicon is only a visual confirmation
that you typed the master password correctly — but it is a visible change and
should be a deliberate decision, not a side effect.

- [ ] Replace with `crypto.subtle.digest`, accepting the identicon change.

### 2.3 The Edge / `browser` namespace shim — `aprico-ui.js:36`–`53`

The 18-line comment block and:

```js
if (platform.webext && typeof chrome === "undefined") window.chrome = browser;
```

target legacy EdgeHTML, which has been dead since Edge moved to Chromium in
2020. Modern Firefox and Chrome/Edge all work with `chrome.*`, and MV3 supports
promises on those APIs.

Dropping this lets `setHashId`, `resetHashId` and `bootstrap` become `async` and
shed the `renderMain` / `renderLogin` callback threading through
`chrome.storage.local`.

This is the change to be most careful with — it can only be properly verified
against the real extension build, which lives in another repo.

- [ ] Remove the shim, move `chrome.storage.local` / `chrome.tabs.query` to promises.

---

## 3. Mechanical wins

- `Array.from(x).forEach(…)` at `425`, `434`, `469`, `509` — `NodeList` has had
  native `.forEach` since 2016.
- `Array.prototype.slice.call(checkboxes).some(…)` at `436` — `[...checkboxes]`
  or just `.some` directly.
- `while ($tip.firstChild) $tip.removeChild($tip.firstChild)` at `497`, and the
  `firstChild` checks at `157` / `176` → `replaceChildren()`.
- `resetHashId` at `97` writes `''` where `localStorage.removeItem('hashId')`
  says what it means.
- `results = false` at `355` — scrubbing the reference is a good instinct for a
  password manager, but `null` types better. Worth knowing it does not actually
  scrub anything: `$result.value` still holds the password.
- `alert()` on copy failure at `399` is a blocking, ugly way to report something
  the `$label` element already handles well. Now slightly more reachable than it
  used to be, since a Clipboard API rejection can land there.

---

## 4. Do NOT do this

**Do not bulk-convert `function(e)` callbacks to arrow functions.**

Ten of them depend on `this` being the event target:

| Line | Use |
|---|---|
| 254 | `this.value = aprico.normalizeService(this.value)` |
| 260, 262 | `this.value.length`, `this.value` |
| 276–280 | `this.classList` (toggle extra panel) |
| 289, 292 | `this.type = 'text' / 'password'` |
| 437–438 | `this.checked`, `this.value` |

A blanket conversion breaks all of them, and several fail *silently* rather than
throwing — `this.value` on `undefined` inside a blur handler is exactly the kind
of thing that ships unnoticed. The mixed `function` / arrow style in this file is
load-bearing, not sloppiness.

---

## 5. Bigger changes, only if you want them

- **CommonJS → ESM.** Would let you drop browserify for esbuild or rollup and
  get tree-shaking. This is a build-system change, not a file change.
- **HTML-string templates → `<template>` elements.** `utils.stringToDom` uses
  `createContextualFragment`, i.e. HTML parsing. No security issue today — the
  templates in `templates.js` are static and never see user input — but
  `<template>` is cleaner and makes that guarantee structural.

---

## 6. Loose ends outside this file

- **`--primary` is never defined.** Used three times in
  `src/css/montale-extra.css` (lines 107, 111, 115) but declared nowhere, so it
  resolves to nothing in the built CSS. Pre-existing, predates the dependency
  upgrade.
- **Keep `clipboardWrite` in the extension manifest.** The manifest lives in
  another repo. The `execCommand` fallback still needs that permission on
  Firefox — do not drop it on the assumption that moving to the Clipboard API
  removed the need.
- **Remaining `npm audit` advisories are build-time only.** All of them sit
  under `browserify` / `watchify` / `genversion`, which are already at their
  latest versions. Verified that none of the vulnerable crypto shims
  (`elliptic`, `browserify-sign`, `create-ecdh`) reach `dist/js/bundle.js` —
  `aprico-gen` only pulls `scrypt-async`, which is pure JS.
