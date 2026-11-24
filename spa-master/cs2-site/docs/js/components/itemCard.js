import { ITEM_PLACEHOLDER_IMAGE } from "../config.js";
import { formatPrice, translate, translateItemName } from "../i18n.js";

export const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

export function renderItemCard(item, index = 0, { eager = false } = {}) {
  const name = escapeHtml(translateItemName(item.name));
  const source = escapeHtml(item.imageUrl || ITEM_PLACEHOLDER_IMAGE);
  const price = escapeHtml(formatPrice(item.price));
  const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity).toLocaleString() : "0";
  return `<article class="item-card" data-index="${index}" data-image-url="${source}" tabindex="0" role="button" aria-label="${escapeHtml(translate("View details for"))} ${name}">
    <div class="item-art"><img src="${source}" alt="" loading="${eager ? "eager" : "lazy"}" decoding="async" onerror="this.onerror=null;this.src='${ITEM_PLACEHOLDER_IMAGE}'"></div>
    <div class="item-details"><h3 title="${name}">${name}</h3><div class="item-meta"><strong>${price}</strong>${eager ? "" : `<small>${quantity} ${escapeHtml(translate("listed"))}</small>`}</div></div>
  </article>`;
}
