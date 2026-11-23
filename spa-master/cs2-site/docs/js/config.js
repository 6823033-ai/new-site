const isDotaPage = document.body?.dataset.game === "dota";
export const LOCAL_ITEMS_URL = isDotaPage ? "./data/dota-items.json" : "./data/items.json";
export const HERO_ITEMS_URL = isDotaPage ? "./data/dota-hero-items.json" : "./data/hero-items.json";
export const ITEM_PLACEHOLDER_IMAGE = "./assets/item-placeholder.svg";

// Local renders for sample market items, all stored in docs/assets/cards/.
const CARD_IMAGES_BY_NAME = [
  ["AK-47 | Redline", "./assets/cards/ak47-redline.png"],
  ["AWP | Asiimov", "./assets/cards/awp-asiimov.png"],
  ["M4A1-S | Printstream", "./assets/cards/m4a1s-printstream.png"],
  ["Glock-18 | Vogue", "./assets/cards/glock18-vogue.png"],
  ["USP-S | Kill Confirmed", "./assets/cards/usp-s-kill-confirmed.png"],
  ["Desert Eagle | Printstream", "./assets/cards/desert-eagle-printstream.png"],
  ["P250 | See Ya Later", "./assets/cards/p250-see-ya-later.png"],
  ["AK-47 | Neon Rider", "./assets/cards/ak47-neon-rider.png"],
  ["M4A4 | Neo-Noir", "./assets/cards/m4a4-neo-noir.png"],
  ["AWP | Hyper Beast", "./assets/cards/awp-hyper-beast.png"],
  ["Karambit | Doppler", "./assets/cards/karambit-doppler.png"],
  ["Butterfly Knife | Fade", "./assets/cards/butterfly-knife-fade.png"],
  ["M9 Bayonet | Crimson Web", "./assets/cards/m9-bayonet-crimson-web.png"],
  ["Driver Gloves | Snow Leopard", "./assets/cards/driver-gloves-snow-leopard.png"],
  ["Sport Gloves | Vice", "./assets/cards/sport-gloves-vice.png"],
  ["AK-47 | Slate", "./assets/cards/ak47-slate.png"],
  ["AWP | Redline", "./assets/cards/awp-redline.png"],
  ["M4A1-S | Decimator", "./assets/cards/m4a1s-decimator.png"],
  ["USP-S | Cortex", "./assets/cards/usp-s-cortex.png"],
  ["Revolution Case", "./assets/cards/revolution-case.png"],
];

export async function resolveGridItemImages(items) {
  return items.map((item) => {
    const localImage = CARD_IMAGES_BY_NAME.find(([name]) => item.name?.includes(name))?.[1];
    return {
      ...item,
      imageUrl: localImage || item.imageUrl || ITEM_PLACEHOLDER_IMAGE,
    };
  });
}
