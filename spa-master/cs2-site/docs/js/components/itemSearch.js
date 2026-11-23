export function initItemSearch(search, filter) {
  let timer;
  const input = document.getElementById("header-search");
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => search(input.value), 400);
  });
  document.querySelectorAll("[data-filter]").forEach((link) => link.addEventListener("click", () => {
    input.value = "";
    clearTimeout(timer);
    filter(link.dataset.filter);
  }));
}

const CS_FILTERS = {
  knife: ["knife", "dagger", "bayonet", "karambit", "talon", "kukri"],
  rifle: ["ak-", "m4", "aug", "sg 553", "galil", "famas", "awp", "ssg", "scar-20", "g3sg1"],
  gloves: ["gloves", "hand wraps"],
};
const DOTA_FILTERS = {
  weapon: ["weapon", "dagger", "spear", "rifle", "staff"],
  wearable: ["head", "shoulder", "arms", "wearable"],
  towers: ["towers"],
};

export function filterItems(items, query = "", category = "") {
  const terms = document.body.dataset.game === "dota" ? DOTA_FILTERS : CS_FILTERS;
  const search = query.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const name = String(item.name || "").toLocaleLowerCase();
    const detail = `${item.type || ""} ${item.category || ""}`.toLocaleLowerCase();
    const matchesCategory = !category || (terms[category] || []).some((term) =>
      name.includes(term) || detail.includes(term),
    );
    return (!search || name.includes(search)) && matchesCategory;
  });
}