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

  main();
})();
