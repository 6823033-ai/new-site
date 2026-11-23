import { getItems, isUsingSampleData } from "../services/itemService.js";
import { renderGrid, renderSkeletons } from "../layouts/gridPageLayout.js";
import { renderCarousels } from "../components/carousel.js";
import { initDetailModal, openModal } from "../components/detailModal.js";
import { initItemSearch, filterItems } from "../components/itemSearch.js";
import { HERO_ITEMS_URL, resolveGridItemImages } from "../config.js";

const MOST_EXPENSIVE_COUNT = 8;
let items = [], query = "", category = "", resultsVersion = 0;

function parsePrice(price) {
  const value = String(price ?? "").replace(/[^0-9.,-]/g, "");
  const comma = value.lastIndexOf(","), dot = value.lastIndexOf(".");
  const normalized = comma > dot
    ? value.replace(/\./g, "").replace(",", ".")
    : value.replace(/,/g, "");
  return Number.parseFloat(normalized);
}

function bindCards(root) {
  root.querySelectorAll(".item-card").forEach((card) => {
    const open = () => {
      const item = items[Number(card.dataset.index)];
      if (item) openModal({ ...item, imageUrl: card.dataset.imageUrl || item.imageUrl }, card);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
  });
}

async function renderMostExpensive() {
  const root = document.getElementById("most-expensive-results");
  const ranked = items
    .map((item, index) => ({ ...item, __index: index, __priceValue: parsePrice(item.price) }))
    .filter((item) => Number.isFinite(item.__priceValue))
    .sort((a, b) => b.__priceValue - a.__priceValue)
    .slice(0, MOST_EXPENSIVE_COUNT);
  const resolved = await resolveGridItemImages(ranked);
  root.innerHTML = resolved.length
    ? renderGrid(resolved)
    : '<div class="state"><p>No priced items are available.</p></div>';
  bindCards(root);
}

async function renderResults() {
  const version = ++resultsVersion;
  const matched = filterItems(items, query, category).map((item) => ({ ...item, __index: items.indexOf(item) }));
  const results = document.getElementById("results");
  document.getElementById("result-count").textContent = `${matched.length} ${matched.length === 1 ? "item" : "items"} found`;
  const imagesResolved = await resolveGridItemImages(matched);
  if (version !== resultsVersion) return;
  const notice = isUsingSampleData() ? '<div class="sample-notice" role="status"><strong>Sample data:</strong> illustrative item names and prices are shown because the local market data file is empty or missing.</div>' : "";
  results.innerHTML = notice + (matched.length ? renderGrid(imagesResolved) : '<div class="state"><h2>No items found</h2><p>Try another item name.</p></div>');
  bindCards(results);
}

async function loadData() {
  const results = document.getElementById("results"), count = document.getElementById("result-count");
  count.textContent = "Loading itemsâ€¦"; results.innerHTML = renderSkeletons();
  try {
    const [loadedItems, heroResponse] = await Promise.all([getItems(), fetch(HERO_ITEMS_URL)]);
    if (!heroResponse.ok) throw new Error(`Could not load hero items (${heroResponse.status}).`);
    const namesByRow = await heroResponse.json();
    items = loadedItems;
    const carouselItems = await resolveGridItemImages(items);
    renderCarousels(carouselItems, namesByRow); bindCards(document.getElementById("hero-rails"));
    await Promise.all([renderResults(), renderMostExpensive()]);
  } catch (error) {
    count.textContent = "Unable to load listings";
    results.innerHTML = `<div class="state error"><h2>Items couldnâ€™t be loaded</h2><p>${String(error.message).replace(/[&<>"']/g, "")}</p><button class="retry-button" id="retry-items" type="button">Retry</button></div>`;
    document.getElementById("retry-items").addEventListener("click", loadData);
  }
}

export async function renderSearchPage() {
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
  const menu = document.getElementById("menu-toggle"), nav = document.getElementById("site-navigation");
  menu.onclick = () => { const expanded = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(expanded)); nav.classList.toggle("open", expanded); };
  nav.querySelectorAll("a").forEach((link) => link.onclick = () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); });
  initDetailModal((open) => document.querySelectorAll(".carousel-row").forEach((row) => row.dispatchEvent(new CustomEvent("viewer:modal", { detail: { open } }))));
  initItemSearch((value) => { query = value; category = ""; void renderResults(); }, (value) => { query = ""; category = value; void renderResults(); document.getElementById("items").scrollIntoView({ behavior: "smooth" }); });
  document.querySelectorAll("[data-show-all]").forEach((link) => {
    link.addEventListener("click", () => {
      query = "";
      category = "";
      document.getElementById("header-search").value = "";
      void renderResults();
    });
  });
  await loadData();
}


