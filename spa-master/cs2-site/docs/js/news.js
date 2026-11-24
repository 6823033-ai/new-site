const list = document.getElementById("news-list");
const filterButtons = [...document.querySelectorAll("[data-news-filter]")];
const favoritesKey = "cs2-dota-news-favorites";
let articles = [];
let activeFilter = "all";
let favorites = new Set();

import { applyLanguage, initLanguage, getLanguage } from "./i18n.js";
import { initSavedItems } from "./components/savedItems.js";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function card(article, index) {
  const category = escapeHtml(article.category);
  const title = escapeHtml(article.title);
  const saved = favorites.has(String(index));
  return `<article class="news-item" data-category="${category}">
    <a class="news-thumb" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title}"><img src="${escapeHtml(article.image)}" alt="" loading="${index < 4 ? "eager" : "lazy"}"></a>
    <div class="news-copy">
      <a class="news-title" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${title}</a>
      <div class="news-tags"><span class="news-tag" data-category="${category}">${category}</span></div>
      <div class="news-meta"><span>Зохиогч: ${escapeHtml(article.author)}</span><span>Эх сурвалж: ${escapeHtml(article.source)}</span><time class="news-date" datetime="${escapeHtml(article.date)}"><span class="clock-icon" aria-hidden="true">◷</span>${escapeHtml(article.date)}</time></div>
      <button class="news-save${saved ? " saved" : ""}" type="button" data-save-index="${index}" aria-pressed="${saved}">${saved ? "Цуглуулсан" : "Цуглуулах"}<span class="news-star" aria-hidden="true">${saved ? "★" : "☆"}</span></button>
    </div>
  </article>`;
}

function render() {
  const shown = articles.map((article, index) => ({ article, index }))
    .filter(({ article }) => activeFilter === "all" || article.category === activeFilter);
  list.innerHTML = shown.length
    ? shown.map(({ article, index }) => card(article, index)).join("")
    : `<p class="news-state">${getLanguage() === "MN" ? "Одоогоор энэ ангилалд мэдээ алга." : getLanguage() === "ZH" ? "此分类暂无新闻。" : "No news in this category yet."}</p>`;
  applyLanguage(list);
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.newsFilter;
  filterButtons.forEach((tab) => {
    const selected = tab === button;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-pressed", String(selected));
  });
  render();
}));

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-save-index]");
  if (!button) return;
  const index = button.dataset.saveIndex;
  if (favorites.has(index)) favorites.delete(index); else favorites.add(index);
  try { localStorage.setItem(favoritesKey, JSON.stringify([...favorites])); } catch {}
  render();
});

try { favorites = new Set(JSON.parse(localStorage.getItem(favoritesKey) || "[]")); } catch {}
initLanguage();
initSavedItems();
window.addEventListener("market-viewer:language", render);
fetch("./data/news.json")
  .then((response) => { if (!response.ok) throw new Error(`News could not be loaded (${response.status}).`); return response.json(); })
  .then((data) => { articles = data; render(); })
  .catch((error) => { list.innerHTML = `<p class="news-error">${escapeHtml(error.message)}</p>`; });
