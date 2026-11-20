import { LOCAL_ITEMS_URL } from "../config.js";

let itemCache = null;
let usingSampleData = false;

async function loadSampleItems() {
  const response = await fetch("./data/items.sample.json");
  if (!response.ok) throw new Error(`Could not load items.sample.json (${response.status}).`);
  const sample = await response.json();
  validateItems(sample, "items.sample.json");
  if (sample.length === 0) throw new Error("items.sample.json does not contain any sample items.");
  usingSampleData = true;
  return sample;
}

function validateItems(items, source) {
  if (!Array.isArray(items)) throw new Error(`${source} must contain an array of items.`);
  for (const item of items) {
    if (!item || typeof item.name !== "string" || !("price" in item) ||
        !("quantity" in item) || typeof item.imageUrl !== "string") {
      throw new Error(`${source} has an invalid item. Expected name, price, quantity, and imageUrl.`);
    }
  }
}

export async function getItems() {
  if (itemCache) return itemCache;
  const response = await fetch(LOCAL_ITEMS_URL);
  if (response.status === 404) {
    itemCache = await loadSampleItems();
    return itemCache;
  }
  if (!response.ok) throw new Error(`Could not load items.json (${response.status}).`);
  const items = await response.json();
  validateItems(items, "items.json");
  itemCache = items.length === 0 ? await loadSampleItems() : items;
  return itemCache;
}

export function isUsingSampleData() {
  return usingSampleData;
}
