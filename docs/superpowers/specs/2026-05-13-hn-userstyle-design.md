# HN Userstyle & Sort Userscript — Design Spec

**Date:** 2026-05-13  
**Scope:** `https://news.ycombinator.com/*`

## Overview

Two files that together improve the HN reading experience: a Stylus userstyle for visual polish and layout, and a ViolentMonkey userscript for client-side sort toggling.

---

## File Structure

```
hn-style.user.css     — Stylus userstyle
hn-sort.user.js       — ViolentMonkey userscript
```

---

## Userstyle (`hn-style.user.css`)

### Layout

- `#hnmain` (the outer table): `max-width: 720px`, `margin: 0 auto`
- Left/right padding so the container doesn't touch viewport edges on narrower screens

### Typography

- Replace Verdana with `system-ui, -apple-system, sans-serif` sitewide
- `.titlelink`: `font-size: 14px`, `font-weight: 500`
- `.subtext`: `font-size: 12px`
- `.rank`: muted gray (`#aaa` light / `#555` dark)

### Spacing

- Per-story spacer rows: `5px` → `14px`
- `.subtext`: `padding-bottom` for breathing room; `border-bottom: 1px solid` divider between stories; last story has no divider
- Header: slightly more vertical padding than default

### Header

- Background: `#ff6600` → `#e85d00`

### Comment Count Pill

Target: `.subtext a:last-child` (the comments link is always the last anchor in subtext)

- Light: `color: #e85d00`, `background: rgba(232,93,0,0.08)`, `border-radius: 10px`, `padding: 1px 7px`, `font-weight: 600`
- Dark: `color: #e07030`, `background: rgba(224,112,48,0.12)`

### Dark Mode (`@media (prefers-color-scheme: dark)`)

| Element | Value |
|---|---|
| Page background | `#1c1c1c` |
| Title links | `#d4d4d4` |
| Visited title links | `#888` |
| Subtext / metadata | `#555` |
| Story dividers | `#2a2a2a` |
| Header background | `#b84700` |
| Header nav links | `rgba(255,255,255,0.75)` |
| Comment pill text | `#e07030` |
| Comment pill background | `rgba(224,112,48,0.12)` |

---

## Userscript (`hn-sort.user.js`)

### Metadata

```js
// @name         HN Sort Toggle
// @match        https://news.ycombinator.com/news
// @grant        none
// @run-at       document-idle
```

Runs only on the front page (`/news`), not on item or comment pages.

### Sort Toggle UI

- Injected into the header nav bar, right-aligned
- Markup: plain text links matching existing nav style — `Sort: Default · Most Comments`
- Active sort: white, not underlined
- Inactive sort: `rgba(255,255,255,0.6)`, underline on hover
- Persisted in `localStorage` key `hn-sort` — applied on page load before first paint if possible

### Sort Logic

On page load, stash original story order by collecting `.athing` rows and their associated subtext rows from `.itemlist`.

**Default:** Re-insert rows in stashed original order.

**Most Comments:** 
- Parse comment count from `.subtext a:last-child` text content (e.g. `"48 comments"` → `48`) using `parseInt`
- Stories with no parseable comment count (job posts, etc.) treated as `0` and sorted to the bottom
- Sort descending, re-insert into `.itemlist` preserving spacer rows between each story pair

### No network requests — purely DOM manipulation of the already-loaded page.

---

## What is explicitly out of scope

- Comment page styling (separate effort if desired later)
- Any modification to HN's server-side behavior
- Pagination or infinite scroll
- Mobile-specific breakpoints (HN's mobile experience is separate)
