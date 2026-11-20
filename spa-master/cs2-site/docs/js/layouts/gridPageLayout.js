import { renderItemCard } from "../components/itemCard.js";

export const renderGrid = (items) =>
  `<div class="item-grid">${items.map((item, index) =>
    renderItemCard(item, item.__index ?? index, { eager: index < 5 }),
  ).join("")}</div>`;

export const renderSkeletons = (count = 8) =>
  `<div class="item-grid" aria-label="Loading items">${Array.from({ length: count }, () =>
    '<div class="skeleton-card" aria-hidden="true"><div></div><i></i><i></i></div>',
  ).join("")}</div>`;
