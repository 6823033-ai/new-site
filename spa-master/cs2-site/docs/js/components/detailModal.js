import { escapeHtml } from "./itemCard.js";
import { ITEM_PLACEHOLDER_IMAGE } from "../config.js";

let backdrop, modal, content, closeButton, previousFocus, isOpen = false, onStateChange = () => {};
const getFocusable = () => [...modal.querySelectorAll('button:not([disabled]),a[href]')];

function handleKeydown(event) {
  if (!isOpen) return;
  if (event.key === "Escape") { event.preventDefault(); closeModal(); return; }
  if (event.key !== "Tab") return;
  const focusable = getFocusable(), first = focusable[0] || modal, last = focusable.at(-1) || modal;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
function getMarketUrl(item) {
  const candidate = item.marketUrl || item.market_url || item.listingUrl || item.listing_url;
  if (candidate) { try { const url = new URL(candidate); if (url.protocol === "https:") return url.href; } catch {} }
  return item.market_hash_name ? "https://steamcommunity.com/market/listings/730/" + encodeURIComponent(item.market_hash_name) : "";
}
export function initDetailModal(onChange = () => {}) {
  backdrop = document.getElementById("item-modal"); modal = backdrop.querySelector(".modal");
  content = document.getElementById("modal-content"); closeButton = backdrop.querySelector(".close");
  onStateChange = onChange; closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModal(); });
  document.addEventListener("keydown", handleKeydown);
}
export function openModal(item, trigger) {
  previousFocus = trigger || document.activeElement;
  const image = item.imageUrl || ITEM_PLACEHOLDER_IMAGE;
  const fields = Object.entries(item)
    .filter(([key]) => !["name", "price", "quantity", "imageUrl", "marketUrl", "market_url", "listingUrl", "listing_url", "market_hash_name"].includes(key))
    .map(([key, value]) => `<div class="detail-row"><dt>${escapeHtml(key.replace(/[_-]/g, " "))}</dt><dd>${escapeHtml(typeof value === "object" ? JSON.stringify(value) : value)}</dd></div>`).join("");
  const url = getMarketUrl(item);
  content.innerHTML = `<img class="modal-img" alt="" loading="eager" src="${escapeHtml(image)}" onerror="this.onerror=null;this.src='${ITEM_PLACEHOLDER_IMAGE}'"><p class="eyebrow">MARKET ITEM</p><h2 id="modal-title">${escapeHtml(item.name)}</h2><strong class="modal-price">${escapeHtml(item.price)}</strong><dl><div class="detail-row"><dt>Listings</dt><dd>${Number(item.quantity || 0).toLocaleString()}</dd></div>${fields}</dl>${url ? `<a class="cta" target="_blank" rel="noopener noreferrer" href="${escapeHtml(url)}">View Steam listing</a>` : ""}`;
  backdrop.hidden = false; document.body.classList.add("locked"); isOpen = true; onStateChange(true); closeButton.focus();
}
export function closeModal() {
  if (!isOpen) return;
  backdrop.hidden = true; document.body.classList.remove("locked"); isOpen = false; onStateChange(false);
  if (previousFocus?.isConnected) previousFocus.focus();
}
