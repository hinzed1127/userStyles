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
    const tbody = document.querySelector('#bigbox table tbody');
    if (!tbody) return;

    const stories = stashStories(tbody);
    if (stories.length === 0) return;

    injectSortToggle(tbody, stories);
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

  // Re-inserts stories into tbody in the given order
  function renderStories(tbody, stories) {
    stories.forEach(({ athing, subtext, spacer }) => {
      if (athing) athing.remove();
      if (subtext) subtext.remove();
      if (spacer) spacer.remove();
    });

    const moreRow = tbody.querySelector('.morespace') ||
      tbody.querySelector('a.morelink')?.closest('tr') ||
      null;

    stories.forEach(({ athing, subtext, spacer }) => {
      if (athing) tbody.insertBefore(athing, moreRow);
      if (subtext) tbody.insertBefore(subtext, moreRow);
      if (spacer) tbody.insertBefore(spacer, moreRow);
    });
  }

  // Applies the named sort to the stories array and re-renders
  function applySort(tbody, stories, sort) {
    const ordered = sort === 'comments'
      ? [...stories].sort((a, b) => b.commentCount - a.commentCount)
      : [...stories];
    renderStories(tbody, ordered);
  }

  function injectSortToggle(tbody, stories) {
    const navTd = document.querySelector('.pagetop a[href*="login"]')?.closest('td');
    if (!navTd) return;

    const headerTr = navTd.closest('tr');
    if (!headerTr) return;

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

    function styleLinks(activeSort) {
      [defaultLink, commentsLink].forEach(link => {
        const isActive = link.dataset.sort === activeSort;
        link.style.cssText = isActive
          ? 'font: 10pt verdana; color: white; text-decoration: none;'
          : 'font: 10pt verdana; color: rgba(255,255,255,0.6); text-decoration: underline; cursor: pointer;';
      });
    }

    const savedSort = localStorage.getItem('hn-sort') || 'default';
    styleLinks(savedSort);
    if (savedSort !== 'default') {
      applySort(tbody, stories, savedSort);
    }

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

  main();
})();
