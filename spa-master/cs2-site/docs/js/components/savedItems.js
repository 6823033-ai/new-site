import { formatPrice, getLanguage, translate, translateItemName } from "../i18n.js";

const STORAGE_KEY = "market-viewer-saved-items";
const CHANGE_EVENT = "saved-items:change";
let panel, toggle, saved = [];

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.name === "string" && item.price != null) : [];
  } catch { return []; }
}
function writeSaved() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch {}
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}
function itemId(item) {
  return `${item.game || "cs"}:${item.market_hash_name || item.marketHashName || item.name}`;
}
function numericPrice(price) {
  const text = String(price ?? "").replace(/[^\d.,-]/g, "");
  const comma = text.lastIndexOf(","), dot = text.lastIndexOf(".");
  const normalized = comma > dot ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return 0;
  const source = String(price ?? "");
  if (source.includes("₮")) return value / 3609.73;
  if (source.includes("¥")) return value / 6.6673;
  return value;
}
function escaped(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function render() {
  if (!panel || !toggle) return;
  saved = readSaved();
  toggle.innerHTML = `<span aria-hidden="true">♡</span><span>${escaped(translate("Saved Items"))}</span><span class="saved-items-count" data-saved-count>${saved.length}</span>`;
  toggle.setAttribute("aria-label", `${translate("Saved Items")}: ${saved.length}`);
  const list = panel.querySelector("[data-saved-list]");
  list.innerHTML = saved.length ? saved.map((item) => {
    const name = translateItemName(item.name);
    const id = itemId(item);
    return `<li class="saved-item-row"><img src="${escaped(item.imageUrl || "./assets/item-placeholder.svg")}" alt="" loading="lazy"><span class="saved-item-name" title="${escaped(name)}">${escaped(name)}</span><strong class="saved-item-price">${escaped(formatPrice(item.price))}</strong><button type="button" class="saved-item-remove" data-remove-saved="${escaped(id)}" aria-label="${escaped(translate("Remove"))} ${escaped(name)}">×</button></li>`;
  }).join("") : `<li class="saved-items-empty">${escaped(translate("No items saved yet."))}</li>`;
  const total = saved.reduce((sum, item) => sum + numericPrice(item.price), 0);
  panel.querySelector("[data-saved-total-label]").textContent = translate("Total price");
  panel.querySelector("[data-saved-total]").textContent = formatPrice(total);
  panel.querySelector("[data-saved-title]").textContent = translate("Your saved items");
  panel.querySelector("[data-close-saved]").setAttribute("aria-label", translate("Close"));
}
function setOpen(open) {
  panel.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
}
export function isSaved(item) {
  const id = itemId(item);
  return readSaved().some((entry) => itemId(entry) === id);
}
export function saveItem(item) {
  saved = readSaved();
  if (!isSaved(item)) {
    saved.push({
      game: item.game || document.body.dataset.game || "cs",
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || "./assets/item-placeholder.svg",
      market_hash_name: item.market_hash_name || item.marketHashName || "",
    });
    writeSaved();
  }
}
export function removeSavedItem(item) {
  saved = readSaved().filter((entry) => itemId(entry) !== itemId(item));
  writeSaved();
}
export function initSavedItems() {
  if (document.getElementById("saved-items-panel")) return;
  const header = document.querySelector("header");
  if (!header) return;
  const nav = header.querySelector("nav");
  toggle = document.createElement("a");
  toggle.className = "saved-items-link";
  toggle.href = "#saved-items";
  toggle.setAttribute("aria-controls", "saved-items-panel");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `<span aria-hidden="true">♡</span><span>${escaped(translate("Saved Items"))}</span><span class="saved-items-count" data-saved-count>0</span>`;
  if (nav && !document.body.classList.contains("news-page")) nav.append(toggle);
  else header.insertBefore(toggle, header.querySelector(".news-market-link") || null);
  panel = document.createElement("section");
  panel.id = "saved-items-panel";
  panel.className = "saved-items-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-labelledby", "saved-items-title");
  panel.innerHTML = `<div class="saved-items-heading"><h2 id="saved-items-title" data-saved-title></h2><button type="button" data-close-saved aria-label="${escaped(translate("Close"))}">×</button></div><ul class="saved-items-list" data-saved-list></ul><div class="saved-items-total"><span data-saved-total-label></span><strong data-saved-total></strong></div>`;
  document.body.append(panel);
  toggle.addEventListener("click", (event) => { event.preventDefault(); setOpen(panel.hidden); });
  panel.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-saved]")) { setOpen(false); return; }
    const remove = event.target.closest("[data-remove-saved]");
    if (remove) {
      const item = readSaved().find((entry) => itemId(entry) === remove.dataset.removeSaved);
      if (item) removeSavedItem(item);
    }
  });
  document.addEventListener("click", (event) => {
    if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) setOpen(false); });
  window.addEventListener(CHANGE_EVENT, render);
  window.addEventListener("market-viewer:language", render);
  render();
  if (!document.getElementById("saved-items-styles")) {
    const style = document.createElement("style");
    style.id = "saved-items-styles";
    style.textContent = `.saved-items-link{display:inline-flex!important;align-items:center;gap:6px;padding:7px 9px;border:1px solid var(--line,#36352e);border-radius:8px;color:var(--text,#f5f2ea)!important;font-size:11px!important;font-weight:700}.saved-items-link:hover{border-color:#f2a43d;color:#ffc26d!important}.saved-items-count{min-width:19px;height:19px;padding:0 5px;display:inline-grid;place-items:center;border-radius:99px;background:#f2a43d;color:#20170c;font-size:10px;font-weight:800}.saved-items-panel{position:fixed;z-index:45;top:78px;right:clamp(12px,5vw,75px);width:min(410px,calc(100vw - 24px));max-height:min(72vh,620px);display:flex;flex-direction:column;overflow:hidden;border:1px solid #344052;border-radius:12px;background:#101825;color:#f5f2ea;box-shadow:0 20px 70px #000b}.saved-items-panel[hidden]{display:none}.saved-items-heading{padding:16px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff18}.saved-items-heading h2{margin:0;font-size:16px}.saved-items-heading button,.saved-item-remove{width:30px;height:30px;display:grid;place-items:center;border:1px solid #ffffff20;border-radius:6px;background:#ffffff08;color:inherit;font:inherit;font-size:19px;cursor:pointer}.saved-items-list{margin:0;padding:8px 14px;overflow:auto;list-style:none}.saved-item-row{min-height:58px;padding:8px 2px;display:grid;grid-template-columns:42px minmax(0,1fr) auto 30px;align-items:center;gap:10px;border-bottom:1px solid #ffffff12}.saved-item-row img{width:42px;height:38px;object-fit:contain}.saved-item-name{overflow:hidden;color:#e6eaf0;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.saved-item-price{color:#ffc26d;font-size:11px;white-space:nowrap}.saved-item-remove{width:26px;height:26px;font-size:16px}.saved-items-empty{padding:24px 8px;text-align:center;color:#aab3c1;font-size:12px}.saved-items-total{margin-top:auto;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid #ffffff20;background:#141f2e;font-size:12px}.saved-items-total strong{color:#ffc26d;font-size:16px}.saved-item-action{padding:0 22px 16px;background:#101825}.saved-item-action button{width:100%;min-height:42px;padding:10px 14px;border:1px solid #dc9b3c66;border-radius:6px;background:#f2a43d;color:#20170c;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.saved-item-action button[aria-pressed=true]{background:#243348;border-color:#ffffff2a;color:#e7edf5}.news-page .saved-items-link{margin-left:10px;border:0;border-radius:0;color:#aab8c7!important}.news-page .saved-items-panel{top:60px;right:12px}@media(max-width:700px){.site-header nav .saved-items-link{padding:12px 0;border:0;border-bottom:1px solid #fff1;border-radius:0}.saved-items-panel{top:70px;right:12px}.saved-item-row{grid-template-columns:34px minmax(0,1fr) auto 28px;gap:7px}.saved-item-row img{width:34px}}`;
    document.head.append(style);
  }
}
