# HN Userstyle & Sort Userscript Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Stylus userstyle and ViolentMonkey userscript that improve HN's reading ergonomics with a centered 720px container, better typography, dark mode, a comment count pill, and a header sort toggle.

**Architecture:** Two independent files — a pure CSS userstyle loaded by Stylus that overrides HN's presentation, and a JS userscript loaded by ViolentMonkey that injects a sort toggle UI and reorders DOM nodes client-side. No build step, no dependencies, no network requests.

**Tech Stack:** Plain CSS (Stylus `@-moz-document` format), plain ES2020 JS (ViolentMonkey userscript)

---

## File Structure

```
hn-style.user.css       — Stylus userstyle (all CSS)
hn-sort.user.js         — ViolentMonkey userscript (all JS)
```

---

## Part 1: Userstyle

### Task 1: Scaffold the userstyle file with Stylus metadata

**Files:**
- Create: `hn-style.user.css`

HN's HTML structure for reference:
- `#hnmain` — the outer layout table (what we center)
- `.itemlist` — the `<table>` containing all story rows
- `.athing` — a story title row (`<tr>`)
- `.titleline` — `<td>` containing rank + vote + title
- `.titlelink` — the `<a>` tag for the story title
- `.sitebit.comhead` — the domain label `(example.com)`
- `.subtext` — `<td>` with points, author, age, hide, comments links
- `.rank` — the story number span
- `.votelinks` — the upvote arrow `<td>`
- `#hnmain table[bgcolor='#ff6600']` or `td[bgcolor='#ff6600']` — the header bar (uses inline bgcolor attribute, not a class)
- `.hnname` — "Hacker News" site name link in header
- `span[id^="up_"]` / `.votearrow` — vote arrow elements

Stylus `@-moz-document` format is how Stylus userstyles declare which URLs they apply to.

- [ ] **Step 1: Create the file with Stylus metadata block**

```css
/* ==UserStyle==
@name         Hacker News — Refined
@namespace    https://github.com/hinzed1127/userStyles
@version      1.0.0
@description  Centered layout, better typography, dark mode, comment pill
@author       Dan Hinze
@homepageURL  https://github.com/hinzed1127/userStyles
@match        https://news.ycombinator.com/*
==/UserStyle== */

@-moz-document domain("news.ycombinator.com") {

  /* styles go here */

}
```

- [ ] **Step 2: Verify the file is valid by loading it in Stylus**

  Open Stylus → "Write new style" → paste the file contents → confirm no parse errors shown.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: scaffold Stylus userstyle with metadata"
```

---

### Task 2: Centered layout and font

**Files:**
- Modify: `hn-style.user.css`

- [ ] **Step 1: Add layout and typography rules inside the `@-moz-document` block**

```css
  /* ── Layout ── */
  body {
    font-family: system-ui, -apple-system, sans-serif !important;
  }

  #hnmain {
    max-width: 720px !important;
    margin: 0 auto !important;
    padding: 0 12px !important;
    box-sizing: border-box !important;
  }
```

- [ ] **Step 2: Verify in browser**

  Navigate to `https://news.ycombinator.com/news`. The story list should be centered and no wider than 720px. The font should be your system sans-serif instead of Verdana. Resize the window to confirm padding kicks in on narrow viewports.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: centered 720px layout and system font"
```

---

### Task 3: Typography refinements

**Files:**
- Modify: `hn-style.user.css`

- [ ] **Step 1: Add title, subtext, and rank rules**

```css
  /* ── Typography ── */
  .titlelink {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: #1a1a1a !important;
  }

  .subtext {
    font-size: 12px !important;
  }

  .rank {
    color: #aaa !important;
  }

  .sitebit.comhead,
  .sitebit.comhead a {
    color: #aaa !important;
    font-size: 11px !important;
  }
```

- [ ] **Step 2: Verify in browser**

  Titles should be slightly larger and medium-weight. Rank numbers and domain labels should be clearly muted. Subtext (points, age, comments) should be 12px.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: typography — title size/weight, muted rank and domain"
```

---

### Task 4: Spacing and story dividers

**Files:**
- Modify: `hn-style.user.css`

HN uses `<tr height='5'>` spacer rows between stories. We target them via the `height` attribute. The `.subtext` td gets a bottom border to act as a divider.

- [ ] **Step 1: Add spacing rules**

```css
  /* ── Spacing ── */

  /* Spacer rows between stories */
  .itemlist tr[style*="height: 5px"],
  .itemlist tr[height='5'] {
    height: 14px !important;
  }

  /* Breathing room below subtext */
  .subtext {
    padding-bottom: 8px !important;
    display: block !important;
  }

  /* Divider line — appears above each subtext row */
  tr:not(:first-child) > .subtext {
    border-bottom: 1px solid #e8e8e0 !important;
  }

  /* Header: slightly more breathing room */
  td[bgcolor='#ff6600'] {
    padding: 6px 8px !important;
  }
```

- [ ] **Step 2: Verify in browser**

  Stories should have noticeably more vertical breathing room between them. A faint line should appear below each story's subtext. The orange header should feel slightly less cramped.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: spacing — story gaps, subtext padding, header padding"
```

---

### Task 5: Header color

**Files:**
- Modify: `hn-style.user.css`

HN sets header color via `bgcolor` attribute on a `<td>`, which CSS `background` overrides.

- [ ] **Step 1: Add header color override**

```css
  /* ── Header ── */
  td[bgcolor='#ff6600'],
  td[bgcolor='#ff6600'] table td {
    background: #e85d00 !important;
  }

  .hnname a,
  td[bgcolor='#ff6600'] a {
    color: white !important;
    text-decoration: none !important;
  }
```

- [ ] **Step 2: Verify in browser**

  Header should be a slightly darker, less saturated orange (`#e85d00`). All header links (nav items, site name, login) should remain white.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: soften header orange to #e85d00"
```

---

### Task 6: Comment count pill

**Files:**
- Modify: `hn-style.user.css`

The comments link is always the last `<a>` inside `.subtext`. We use `:last-child` to target it specifically.

- [ ] **Step 1: Add pill styles**

```css
  /* ── Comment count pill ── */
  .subtext a:last-child {
    color: #e85d00 !important;
    font-weight: 600 !important;
    background: rgba(232, 93, 0, 0.08) !important;
    border-radius: 10px !important;
    padding: 1px 7px !important;
    font-size: 11.5px !important;
  }
```

- [ ] **Step 2: Verify in browser**

  The "N comments" link at the end of each story's subtext should have a faint orange pill background with orange bold text. The "hide" link and author/age links should be unaffected.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: comment count pill — orange bold with faint background"
```

---

### Task 7: Dark mode

**Files:**
- Modify: `hn-style.user.css`

Add a `@media (prefers-color-scheme: dark)` block inside the `@-moz-document` block. All dark overrides go in here.

- [ ] **Step 1: Add dark mode block**

```css
  /* ── Dark mode ── */
  @media (prefers-color-scheme: dark) {
    body,
    td,
    .itemlist {
      background: #1c1c1c !important;
      color: #d4d4d4 !important;
    }

    .titlelink {
      color: #d4d4d4 !important;
    }

    a:visited .titlelink,
    .titlelink:visited {
      color: #888 !important;
    }

    .subtext,
    .subtext a {
      color: #555 !important;
    }

    .rank {
      color: #555 !important;
    }

    .sitebit.comhead,
    .sitebit.comhead a {
      color: #555 !important;
    }

    tr:not(:first-child) > .subtext {
      border-bottom-color: #2a2a2a !important;
    }

    td[bgcolor='#ff6600'],
    td[bgcolor='#ff6600'] table td {
      background: #b84700 !important;
    }

    td[bgcolor='#ff6600'] a {
      color: rgba(255, 255, 255, 0.75) !important;
    }

    .subtext a:last-child {
      color: #e07030 !important;
      background: rgba(224, 112, 48, 0.12) !important;
    }
  }
```

- [ ] **Step 2: Verify in browser**

  Toggle your OS to dark mode. HN should switch to a dark `#1c1c1c` background, light gray titles, muted metadata, darker header. Toggle back to light — confirm the light styles are fully restored.

- [ ] **Step 3: Commit**

```bash
git add hn-style.user.css
git commit -m "feat: automatic dark mode via prefers-color-scheme"
```

---

## Part 2: Userscript

### Task 8: Scaffold the userscript file with ViolentMonkey metadata

**Files:**
- Create: `hn-sort.user.js`

ViolentMonkey userscript metadata uses `// @key value` comment blocks. `@run-at document-idle` means the script runs after the DOM is fully parsed. `@grant none` means no special VM APIs are needed.

- [ ] **Step 1: Create the file**

```js
// ==UserScript==
// @name         HN Sort Toggle
// @namespace    https://github.com/hinzed1127/userStyles
// @version      1.0.0
// @description  Add a sort toggle to HN's header to sort front page by Most Comments
// @author       Dan Hinze
// @match        https://news.ycombinator.com/news
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // entry point — called once DOM is ready
  function main() {
    // implementation goes here
  }

  main();
})();
```

- [ ] **Step 2: Load in ViolentMonkey**

  ViolentMonkey → Dashboard → "Install from file" or drag-and-drop `hn-sort.user.js`. Navigate to `https://news.ycombinator.com/news` and open the browser console — confirm no errors.

- [ ] **Step 3: Commit**

```bash
git add hn-sort.user.js
git commit -m "feat: scaffold ViolentMonkey userscript with metadata"
```

---

### Task 9: Stash original story order on page load

**Files:**
- Modify: `hn-sort.user.js`

HN's `.itemlist` `<tbody>` contains story rows in groups of three:
1. `.athing` row — rank, vote arrow, title
2. Subtext row (no class) — points, author, age, comments
3. Spacer row (`<tr height="5">`) — visual gap

We stash all three rows per story together so we can restore or reorder them as a unit.

- [ ] **Step 1: Replace the `main()` body with story stashing logic**

```js
  function main() {
    const tbody = document.querySelector('.itemlist tbody');
    if (!tbody) return;

    const stories = stashStories(tbody);
    if (stories.length === 0) return;
  }

  // Returns an array of story objects: { athing, subtext, spacer, commentCount }
  function stashStories(tbody) {
    const rows = Array.from(tbody.children);
    const stories = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.classList.contains('athing')) continue;

      const subtextRow = rows[i + 1] || null;
      const spacerRow = rows[i + 2] || null;

      const commentLink = subtextRow
        ? subtextRow.querySelector('.subtext a:last-child')
        : null;
      const commentText = commentLink ? commentLink.textContent.trim() : '';
      const commentCount = parseInt(commentText, 10) || 0;

      stories.push({ athing: row, subtext: subtextRow, spacer: spacerRow, commentCount });
    }

    return stories;
  }
```

- [ ] **Step 2: Verify in browser console**

  Add a temporary `console.log(stories)` after the `stashStories` call. Reload HN front page. Confirm you see an array of ~30 objects, each with `athing`, `subtext`, `spacer`, and a numeric `commentCount`. Remove the log line when done.

- [ ] **Step 3: Commit**

```bash
git add hn-sort.user.js
git commit -m "feat: stash story rows and parse comment counts on load"
```

---

### Task 10: Sort functions

**Files:**
- Modify: `hn-sort.user.js`

- [ ] **Step 1: Add `applySort` and `renderStories` functions**

Add these after `stashStories`:

```js
  // Re-inserts stories into tbody in the given order
  function renderStories(tbody, stories) {
    // Remove all story rows from the DOM (leave any non-story rows like the "More" link)
    stories.forEach(({ athing, subtext, spacer }) => {
      if (athing) athing.remove();
      if (subtext) subtext.remove();
      if (spacer) spacer.remove();
    });

    // Find the reference node to insert before (e.g. the "More" pagination row)
    // Insert at end of tbody if not found
    const moreRow = tbody.querySelector('.morespace') || tbody.querySelector('td.title > a[href*="news?p="]')?.closest('tr') || null;

    stories.forEach(({ athing, subtext, spacer }) => {
      if (athing) tbody.insertBefore(athing, moreRow);
      if (subtext) tbody.insertBefore(subtext, moreRow);
      if (spacer) tbody.insertBefore(spacer, moreRow);
    });
  }

  // Applies the named sort to the stories array and re-renders
  function applySort(tbody, stories, sort) {
    let ordered;
    if (sort === 'comments') {
      ordered = [...stories].sort((a, b) => b.commentCount - a.commentCount);
    } else {
      ordered = [...stories]; // original order preserved from stash
    }
    renderStories(tbody, ordered);
  }
```

- [ ] **Step 2: Smoke-test in browser**

  Temporarily add this to the end of `main()` to verify sorting works:

  ```js
    applySort(tbody, stories, 'comments');
  ```

  Reload HN. Stories should reorder so the one with the most comments is first. Verify by checking that the first story's comment count is the highest on the page. Remove the temporary line.

- [ ] **Step 3: Commit**

```bash
git add hn-sort.user.js
git commit -m "feat: applySort and renderStories functions"
```

---

### Task 11: Sort toggle UI injected into header

**Files:**
- Modify: `hn-sort.user.js`

The HN header nav is a `<td>` containing plain text with `|`-separated links. We inject a right-aligned sort toggle into the same header row.

- [ ] **Step 1: Add `injectSortToggle` function and wire up `main()`**

```js
  function injectSortToggle(tbody, stories) {
    // Find the header nav td (contains the nav links like "new | past | ...")
    const navTd = document.querySelector('td[style*="color: white"]');
    if (!navTd) return;

    const headerTr = navTd.closest('tr');
    if (!headerTr) return;

    // Create a right-aligned td for the sort toggle
    const td = document.createElement('td');
    td.style.cssText = 'text-align: right; padding-right: 8px; white-space: nowrap;';

    const label = document.createElement('span');
    label.style.cssText = 'font: 10pt verdana; color: rgba(255,255,255,0.7);';
    label.textContent = 'Sort: ';

    const defaultLink = document.createElement('a');
    defaultLink.href = '#';
    defaultLink.textContent = 'Default';
    defaultLink.dataset.sort = 'default';

    const sep = document.createElement('span');
    sep.style.cssText = 'font: 10pt verdana; color: rgba(255,255,255,0.5);';
    sep.textContent = ' · ';

    const commentsLink = document.createElement('a');
    commentsLink.href = '#';
    commentsLink.textContent = 'Most Comments';
    commentsLink.dataset.sort = 'comments';

    td.appendChild(label);
    td.appendChild(defaultLink);
    td.appendChild(sep);
    td.appendChild(commentsLink);
    headerTr.appendChild(td);

    // Shared link style
    function styleLinks(activeSort) {
      [defaultLink, commentsLink].forEach(link => {
        const isActive = link.dataset.sort === activeSort;
        link.style.cssText = isActive
          ? 'font: 10pt verdana; color: white; text-decoration: none;'
          : 'font: 10pt verdana; color: rgba(255,255,255,0.6); text-decoration: underline; cursor: pointer;';
      });
    }

    // Read persisted sort, apply it
    const savedSort = localStorage.getItem('hn-sort') || 'default';
    styleLinks(savedSort);
    if (savedSort !== 'default') {
      applySort(tbody, stories, savedSort);
    }

    // Click handler
    [defaultLink, commentsLink].forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const sort = link.dataset.sort;
        localStorage.setItem('hn-sort', sort);
        styleLinks(sort);
        applySort(tbody, stories, sort);
      });
    });
  }
```

- [ ] **Step 2: Update `main()` to call `injectSortToggle`**

Replace the existing `main()` body with:

```js
  function main() {
    const tbody = document.querySelector('.itemlist tbody');
    if (!tbody) return;

    const stories = stashStories(tbody);
    if (stories.length === 0) return;

    injectSortToggle(tbody, stories);
  }
```

- [ ] **Step 3: Verify in browser**

  Reload HN. The header bar should show `Sort: Default · Most Comments` right-aligned. Clicking "Most Comments" reorders stories by descending comment count and bolds the active label. Clicking "Default" restores original order. Reload the page — confirm the chosen sort is re-applied from `localStorage`.

- [ ] **Step 4: Commit**

```bash
git add hn-sort.user.js
git commit -m "feat: inject sort toggle into header with localStorage persistence"
```

---

### Task 12: Final review and push

**Files:**
- No new files

- [ ] **Step 1: Load both files together and do a full walkthrough**

  1. Confirm Stylus userstyle is active for `news.ycombinator.com`
  2. Confirm ViolentMonkey userscript is active for `https://news.ycombinator.com/news`
  3. Navigate to `https://news.ycombinator.com/news`
  4. Check: layout is centered, max ~720px wide, padded on narrow viewports
  5. Check: font is system sans-serif, not Verdana
  6. Check: header is `#e85d00`, not `#ff6600`
  7. Check: comment count links have orange pill styling
  8. Check: stories have more vertical breathing room with divider lines
  9. Check: sort toggle appears right-aligned in header
  10. Check: "Most Comments" sort reorders stories correctly
  11. Check: sort persists on reload
  12. Toggle OS dark mode — check all dark values are correct, toggle back to confirm light is restored
  13. Navigate to an item page (`/item?id=...`) — confirm sort toggle does NOT appear (wrong `@match`)

- [ ] **Step 2: Push to GitHub**

```bash
git push
```

- [ ] **Step 3: Done**

  Both files are complete. To install on a new machine: import `hn-style.user.css` into Stylus and `hn-sort.user.js` into ViolentMonkey.
