import { renderItemCard } from "./itemCard.js";

const CARD_COUNT = 10;
const INTERVAL_MS = 5000;

function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase();
}

function matchRequestedNames(items, requestedNames, rowName) {
  const used = new Set();
  const missing = [];
  const nonExact = [];
  const matches = requestedNames.flatMap((requested) => {
    const needle = normalize(requested);
    const exact = items.find((item) => normalize(item.name) === needle && !used.has(item));
    if (exact) { used.add(exact); return [{ ...exact, __viewerIndex: items.indexOf(exact) }]; }

    const candidates = items.filter((item) => !used.has(item));
    const partial = candidates.find((item) => normalize(item.name).includes(needle))
      || candidates.find((item) => needle.includes(normalize(item.name)) && normalize(item.name).length > 3);
    if (partial) {
      used.add(partial);
      nonExact.push({ requested, matched: partial.name });
      return [{ ...partial, __viewerIndex: items.indexOf(partial) }];
    }
    missing.push(requested);
    return [];
  });
  if (nonExact.length) console.warn(`[CS2 Market Viewer] ${rowName}: closest partial matches used:`, nonExact);
  if (missing.length) console.warn(`[CS2 Market Viewer] ${rowName}: no item match found for:`, missing);
  return matches;
}

function railMarkup(items, row) {
  if (!items.length) return "";
  const queue = items.slice(0, CARD_COUNT);
  return `<div class="carousel-row" data-row="${row}"><div class="carousel-track">${queue.map((item) => renderItemCard(item, item.__viewerIndex, { eager: true })).join("")}</div></div>`;
}

export function renderCarousels(items, namesByRow) {
  const root = document.getElementById("hero-rails");
  const row1 = matchRequestedNames(items, namesByRow.row1 || [], "row1");
  const row2 = matchRequestedNames(items, namesByRow.row2 || [], "row2");
  root.innerHTML = railMarkup(row1, 1) + railMarkup(row2, 2);
  initCarousels(root);
}

export function initCarousels(root) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  root.querySelectorAll(".carousel-row").forEach((row) => {
    const track = row.querySelector(".carousel-track");
    let timer, paused = false, animating = false;
    const schedule = (delay = INTERVAL_MS) => {
      clearTimeout(timer);
      timer = setTimeout(() => { advance(); if (!paused) schedule(); }, delay);
    };
    const advance = () => {
      if (paused || animating || track.children.length < 2) return;
      const firstCard = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      if (reducedMotion.matches) { track.append(firstCard); return; }
      animating = true;
      track.classList.add("slide");
      track.style.transform = `translateX(-${firstCard.getBoundingClientRect().width + gap}px)`;
      const finish = () => {
        track.removeEventListener("transitionend", finish);
        track.append(firstCard);
        track.classList.remove("slide");
        track.style.transform = "";
        animating = false;
      };
      track.addEventListener("transitionend", finish);
    };
    row.addEventListener("mouseenter", () => { paused = true; clearTimeout(timer); });
    row.addEventListener("mouseleave", () => { paused = false; schedule(); });
    row.addEventListener("focusin", () => { paused = true; clearTimeout(timer); });
    row.addEventListener("focusout", (event) => {
      if (!row.contains(event.relatedTarget)) { paused = false; schedule(); }
    });
    row.addEventListener("viewer:modal", (event) => {
      paused = event.detail.open;
      if (paused) clearTimeout(timer); else schedule();
    });
    new ResizeObserver(() => {
      track.classList.remove("slide");
      track.style.transform = "";
    }).observe(row);
    reducedMotion.addEventListener("change", (event) => track.classList.toggle("motion-disabled", event.matches));
    schedule(Number(row.dataset.row) === 2 ? INTERVAL_MS / 2 : INTERVAL_MS);
  });
}
