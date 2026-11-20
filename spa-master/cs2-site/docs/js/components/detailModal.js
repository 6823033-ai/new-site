import { escapeHtml } from "./itemCard.js";
import { ITEM_PLACEHOLDER_IMAGE } from "../config.js";

let backdrop, modal, content, closeButton, previousFocus, isOpen = false, onStateChange = () => {};
const TABS = ["market", "trading", "investment", "lore"];
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
function getValue(item, keys, fallback = "Unavailable") {
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}
function displayValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Unavailable";
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === undefined || value === null || value === "" ? "Unavailable" : String(value);
}
function metric(label, value, className = "") {
  return `<article class="insight-card ${className}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(displayValue(value))}</strong></article>`;
}
function selectTab(tabName, focus = false) {
  if (!TABS.includes(tabName)) return;
  content.querySelectorAll("[data-detail-tab]").forEach((button) => {
    const selected = button.dataset.detailTab === tabName;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  content.querySelectorAll("[data-detail-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.detailPanel !== tabName;
  });
}
function renderInsights(item) {
  const currentPrice = getValue(item, ["price", "currentPrice", "current_price"]);
  const listingCount = Number(item.quantity || 0).toLocaleString();
  const supplyDemand = getValue(item, ["supplyDemandStatus", "supply_demand_status"],
    Number(item.quantity) > 0 ? "Listings visible; sales demand unavailable" : "Supply and demand unavailable");
  const tradeStatus = getValue(item, ["tradeStatus", "trade_status"],
    typeof item.tradable === "boolean" ? (item.tradable ? "Tradable" : "Trade restricted") : "Restriction status unavailable");
  const rarity = getValue(item, ["rarityTier", "rarity_tier", "rarity"]);
  const recommendation = getValue(item, ["recommendation", "investmentRecommendation", "investment_recommendation"], "No signal");
  const description = getValue(item, ["description", "designHighlights", "design_highlights", "lore", "origin", "history"], "No item lore is included in this market snapshot.");
  const panels = {
    market: [
      metric("Current price", currentPrice, "insight-card-primary"),
      metric("7 day trend", getValue(item, ["priceChange7d", "price_change_7d", "trend7d"])),
      metric("30 day trend", getValue(item, ["priceChange30d", "price_change_30d", "trend30d"])),
      metric("90 day trend", getValue(item, ["priceChange90d", "price_change_90d", "trend90d"])),
      metric("All time high", getValue(item, ["allTimeHigh", "all_time_high", "ath"])),
      metric("All time low", getValue(item, ["allTimeLow", "all_time_low", "atl"])),
      metric("Steam market", getValue(item, ["steamPrice", "steam_price"], currentPrice)),
      metric("Third party price", getValue(item, ["thirdPartyPrice", "third_party_price", "marketplacePrice"])),
      metric("Supply & demand", supplyDemand, "insight-card-wide"),
    ].join(""),
    trading: [
      metric("Active listings", listingCount, "insight-card-primary"),
      metric("Daily sales volume", getValue(item, ["dailySalesVolume", "daily_sales_volume", "sales24h", "sales_24h"])),
      metric("Liquidity rating", getValue(item, ["liquidityRating", "liquidity_rating", "liquidity"])),
      metric("Trade status", tradeStatus),
    ].join(""),
    investment: [
      metric("Growth potential", getValue(item, ["growthPotential", "growth_potential"], "Not enough price history")),
      metric("Downside risk", getValue(item, ["downsideRisk", "downside_risk"], "Not enough price history")),
      metric("Rarity tier", rarity),
      metric("Future demand", getValue(item, ["futureDemandOutlook", "future_demand_outlook", "futureDemand"])),
      metric("Recommendation", recommendation, "insight-card-recommendation"),
    ].join(""),
    lore: [
      metric("Origin & design", description, "insight-card-wide"),
      metric("Item type", getValue(item, ["type", "itemType", "item_type"])),
      metric("Community popularity", getValue(item, ["communityPopularity", "community_popularity", "popularity"])),
      metric("Pro player usage", getValue(item, ["proPlayerUsage", "pro_player_usage", "proPlayers"])),
      metric("Rarest pattern", getValue(item, ["rarestPattern", "rarest_pattern", "patternInfo"])),
      metric("Fun fact", getValue(item, ["funFact", "fun_fact", "trivia"]), "insight-card-wide"),
    ].join(""),
  };
  return `<div class="item-insights"><div class="item-detail-tabs" role="tablist" aria-label="Item details">${TABS.map((tab, index) => `<button type="button" role="tab" id="detail-tab-${tab}" aria-controls="detail-panel-${tab}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-detail-tab="${tab}">${tab[0].toUpperCase()}${tab.slice(1)}</button>`).join("")}</div>${TABS.map((tab) => `<section class="item-detail-panel" id="detail-panel-${tab}" role="tabpanel" aria-labelledby="detail-tab-${tab}" data-detail-panel="${tab}"${tab === "market" ? "" : " hidden"}><div class="insight-grid">${panels[tab]}</div></section>`).join("")}</div>`;
}
export function initDetailModal(onChange = () => {}) {
  backdrop = document.getElementById("item-modal"); modal = backdrop.querySelector(".modal");
  content = document.getElementById("modal-content"); closeButton = backdrop.querySelector(".close");
  onStateChange = onChange; closeButton.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModal(); });
  content.addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-tab]");
    if (button) selectTab(button.dataset.detailTab);
  });
  content.addEventListener("keydown", (event) => {
    const button = event.target.closest("[data-detail-tab]");
    if (!button || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = TABS.indexOf(button.dataset.detailTab);
    const next = event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    selectTab(TABS[next], true);
  });
  document.addEventListener("keydown", handleKeydown);
}
export function openModal(item, trigger) {
  previousFocus = trigger || document.activeElement;
  const image = item.imageUrl || ITEM_PLACEHOLDER_IMAGE;
  const url = getMarketUrl(item);
  content.innerHTML = `<div class="modal-layout"><section class="modal-showcase"><div class="modal-item-heading"><p class="eyebrow">MARKET ITEM</p><h2 id="modal-title">${escapeHtml(item.name)}</h2></div><img class="modal-img" alt="${escapeHtml(item.name)}" loading="eager" src="${escapeHtml(image)}" onerror="this.onerror=null;this.src='${ITEM_PLACEHOLDER_IMAGE}'"></section><section class="modal-info-band" aria-label="Item information">${renderInsights(item)}${url ? `<div class="modal-market-action"><a class="modal-market-link" target="_blank" rel="noopener noreferrer" href="${escapeHtml(url)}">View Steam listing</a></div>` : ""}</section></div>`;
  selectTab("market");
  backdrop.hidden = false; document.body.classList.add("locked"); isOpen = true; onStateChange(true); closeButton.focus();
}
export function closeModal() {
  if (!isOpen) return;
  backdrop.hidden = true; document.body.classList.remove("locked"); isOpen = false; onStateChange(false);
  if (previousFocus?.isConnected) previousFocus.focus();
}
