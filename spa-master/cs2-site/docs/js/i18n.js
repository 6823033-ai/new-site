const STORAGE_KEY = "market-viewer-locale";
// Indicative reference rates as of 2026-11-24; marketplace fees and live FX can differ.
const CURRENCIES = {
  MN: { code: "MNT", symbol: "₮", rate: 3609.73, locale: "mn-MN" },
  EN: { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  ZH: { code: "CNY", symbol: "¥", rate: 6.6673, locale: "zh-CN" },
};
const dictionaries = {
  MN: {
    "Market Viewer":"Зах зээлийн тойм", "Choose a game":"Тоглоом сонгох", "Open navigation":"Цэс нээх", Home:"Нүүр", Items:"Бараа", Knives:"Хутга", Rifles:"Буу", Gloves:"Бээлий", About:"Тухай", News:"Мэдээ", "Search items":"Бараа хайх", "THE COMMUNITY MARKET, IN FOCUS":"НИЙТИЙН ЗАХ ЗЭЭЛИЙН ТОЙМ", "Find your next":"Өөрийн дараагийн", "favorite item.":"дуртай зүйлээ олоорой.", "Browse a locally saved snapshot of Counter-Strike 2 market listings.":"Counter-Strike 2-ын зах зээлийн жагсаалтыг үзээрэй.", "Browse Dota 2 cosmetic listings from the Steam Community Market.":"Steam Community Market дахь Dota 2 гоёлын зүйлсийг үзээрэй.", "Explore all items":"Бүх барааг үзэх", "TOP MARKET PICKS":"ШИЛДЭГ СОНГОЛТ", "Most Expensive":"Хамгийн өндөр үнэтэй", "The highest priced items in the current collection.":"Цуглуулгын хамгийн өндөр үнэтэй бараанууд.", "LOCAL MARKET SNAPSHOT":"ЗАХ ЗЭЭЛИЙН ЖАГСААЛТ", "LOCAL DOTA MARKET SNAPSHOT":"DOTA ЗАХ ЗЭЭЛИЙН ЖАГСААЛТ", "Explore items":"Бараа үзэх", "Search the collection by item name.":"Нэрээр нь бараа хайх.", "Quick links":"Түргэн холбоос", "All items":"Бүх бараа", Categories:"Ангилал", "A focused way to explore Counter-Strike 2 market items.":"Counter-Strike 2-ын зах зээлийн барааг судлах.", "A focused way to explore Dota 2 cosmetic items.":"Dota 2-ын гоёлын барааг судлах.", "Browse and inspect local listings.":"Орон нутгийн жагсаалтыг үзэж шалгах.", "Item data from Steam Community Market. This site is not affiliated with Valve or any marketplace.":"Барааны мэдээлэл Steam Community Market-аас. Энэ сайт Valve эсвэл зах зээлтэй холбоогүй.", "Back to top":"Дээш буцах", Weapons:"Зэвсэг", Wearables:"Хувцас хэрэглэл", Towers:"Цамхаг", "Loading items…":"Бараа ачаалж байна…", "Loading most expensive items…":"Өндөр үнэтэй барааг ачаалж байна…", "Loading…":"Ачаалж байна…", "No priced items are available.":"Үнэтэй бараа олдсонгүй.", "No items found":"Бараа олдсонгүй", "Try another item name.":"Өөр нэрээр хайна уу.", "Sample data:":"Жишээ мэдээлэл:", "illustrative item names and prices are shown because the local market data file is empty or missing.":"Зах зээлийн мэдээлэл олдоогүй тул жишээ нэр, үнэ харуулж байна.", "Unable to load listings":"Жагсаалт ачаалж чадсангүй", "Items couldn’t be loaded":"Бараа ачаалж чадсангүй", Retry:"Дахин оролдох", listed:"жагсаалтад", item:"бараа", items:"бараа", found:"олдлоо", "View Steam listing":"Steam жагсаалт үзэх", "Item details":"Барааны дэлгэрэнгүй", "MARKET ITEM":"ЗАХ ЗЭЭЛИЙН БАРАА", "Current price":"Одоогийн үнэ", "7 day trend":"7 хоногийн өөрчлөлт", "30 day trend":"30 хоногийн өөрчлөлт", "90 day trend":"90 хоногийн өөрчлөлт", "All time high":"Бүх цагийн дээд үнэ", "All time low":"Бүх цагийн доод үнэ", "Steam market":"Steam зах зээл", "Third party price":"Гуравдагч талын үнэ", "Supply & demand":"Нийлүүлэлт ба эрэлт", "Active listings":"Идэвхтэй жагсаалт", "Daily sales volume":"Өдөр тутмын борлуулалт", "Liquidity rating":"Хөрвөх чадвар", "Trade status":"Арилжааны төлөв", "Growth potential":"Өсөх боломж", "Downside risk":"Буурах эрсдэл", "Rarity tier":"Ховорын зэрэглэл", "Future demand":"Ирээдүйн эрэлт", Recommendation:"Зөвлөмж", "Origin & design":"Гарал ба загвар", "Item type":"Барааны төрөл", "Community popularity":"Олон нийтийн танигдсан байдал", "Pro player usage":"Мэргэжлийн тоглогчдын хэрэглээ", "Rarest pattern":"Хамгийн ховор загвар", "Fun fact":"Сонирхолтой баримт", Market:"Зах зээл", Trading:"Арилжаа", Investment:"Хөрөнгө оруулалт", Lore:"Түүх", "No signal":"Мэдээлэл алга", "Not enough price history":"Үнийн түүх хангалтгүй", Unavailable:"Боломжгүй", Yes:"Тийм", No:"Үгүй", "Tradable":"Арилжаалах боломжтой", "Trade restricted":"Арилжаа хязгаарлагдсан", "Listings visible; sales demand unavailable":"Жагсаалт харагдаж байна; эрэлтийн мэдээлэл алга", "Supply and demand unavailable":"Нийлүүлэлт, эрэлтийн мэдээлэл алга", "Restriction status unavailable":"Хязгаарлалтын мэдээлэл алга",
    "Бүгд":"Бүгд", "Мэдээ ачаалж байна…":"Мэдээ ачаалж байна…", "Зохиогч:":"Зохиогч:", "Эх сурвалж:":"Эх сурвалж:", "Цуглуулсан":"Цуглуулсан", "Цуглуулах":"Цуглуулах", "Одоогоор энэ ангилалд мэдээ алга.":"Одоогоор энэ ангилалд мэдээ алга.", MarketLink:"Зах зээл",
    "View details for":"Дэлгэрэнгүй үзэх", "Language":"Хэл", "Language and currency":"Хэл ба валют", "Open ":"Нээх "
  },
  ZH: {
    "Market Viewer":"市场浏览器", "Choose a game":"选择游戏", "Open navigation":"打开导航", Home:"首页", Items:"物品", Knives:"刀具", Rifles:"步枪", Gloves:"手套", About:"关于", News:"新闻", "Search items":"搜索物品", "THE COMMUNITY MARKET, IN FOCUS":"社区市场精选", "Find your next":"寻找你的下一件", "favorite item.":"心仪物品。", "Browse a locally saved snapshot of Counter-Strike 2 market listings.":"浏览本地保存的 Counter-Strike 2 市场列表。", "Browse Dota 2 cosmetic listings from the Steam Community Market.":"浏览 Steam 社区市场中的 Dota 2 饰品。", "Explore all items":"浏览全部物品", "TOP MARKET PICKS":"市场精选", "Most Expensive":"价格最高", "The highest priced items in the current collection.":"当前收藏中价格最高的物品。", "LOCAL MARKET SNAPSHOT":"本地市场快照", "LOCAL DOTA MARKET SNAPSHOT":"DOTA 本地市场快照", "Explore items":"浏览物品", "Search the collection by item name.":"按名称搜索物品。", "Quick links":"快速链接", "All items":"全部物品", Categories:"分类", "A focused way to explore Counter-Strike 2 market items.":"轻松浏览 Counter-Strike 2 市场物品。", "A focused way to explore Dota 2 cosmetic items.":"轻松浏览 Dota 2 饰品。", "Browse and inspect local listings.":"浏览并查看本地列表。", "Item data from Steam Community Market. This site is not affiliated with Valve or any marketplace.":"物品数据来自 Steam 社区市场。本网站与 Valve 或任何市场均无关联。", "Back to top":"返回顶部", Weapons:"武器", Wearables:"穿戴物", Towers:"防御塔", "Loading items…":"正在加载物品…", "Loading most expensive items…":"正在加载高价物品…", "Loading…":"正在加载…", "No priced items are available.":"没有可用的价格信息。", "No items found":"未找到物品", "Try another item name.":"请尝试其他名称。", "Sample data:":"示例数据：", "illustrative item names and prices are shown because the local market data file is empty or missing.":"本地市场数据为空或缺失，当前显示示例名称和价格。", "Unable to load listings":"无法加载列表", "Items couldn’t be loaded":"物品加载失败", Retry:"重试", listed:"件在售", item:"件物品", items:"件物品", found:"找到", "View Steam listing":"查看 Steam 列表", "Item details":"物品详情", "MARKET ITEM":"市场物品", "Current price":"当前价格", "7 day trend":"7 日趋势", "30 day trend":"30 日趋势", "90 day trend":"90 日趋势", "All time high":"历史最高价", "All time low":"历史最低价", "Steam market":"Steam 市场", "Third party price":"第三方价格", "Supply & demand":"供需情况", "Active listings":"当前在售", "Daily sales volume":"日销量", "Liquidity rating":"流动性评级", "Trade status":"交易状态", "Growth potential":"增长潜力", "Downside risk":"下行风险", "Rarity tier":"稀有度", "Future demand":"未来需求", Recommendation:"建议", "Origin & design":"来源与设计", "Item type":"物品类型", "Community popularity":"社区热度", "Pro player usage":"职业选手使用情况", "Rarest pattern":"最稀有图案", "Fun fact":"趣闻", Market:"市场", Trading:"交易", Investment:"投资", Lore:"背景", "No signal":"暂无信号", "Not enough price history":"价格历史不足", Unavailable:"暂无数据", Yes:"是", No:"否", "Tradable":"可交易", "Trade restricted":"交易受限", "Listings visible; sales demand unavailable":"列表可见；暂无销售需求数据", "Supply and demand unavailable":"暂无供需数据", "Restriction status unavailable":"暂无限制状态信息",
    "Бүгд":"全部", "Мэдээ ачаалж байна…":"正在加载新闻…", "Зохиогч:":"作者：", "Эх сурвалж:":"来源：", "Цуглуулсан":"已收藏", "Цуглуулах":"收藏", "Одоогоор энэ ангилалд мэдээ алга.":"此分类暂无新闻。", MarketLink:"市场",
    "View details for":"查看详情", "Language":"语言", "Language and currency":"语言和货币", "Open ":"打开 "
  }
};
const savedItemTranslations = {
  "Saved Items": { MN: "Хадгалсан бараа", ZH: "已保存物品" },
  "Save Item": { MN: "Бараа хадгалах", ZH: "保存物品" },
  "Remove Saved Item": { MN: "Хадгалснаас хасах", ZH: "从已保存中移除" },
  "Your saved items": { MN: "Таны хадгалсан бараа", ZH: "你保存的物品" },
  "No items saved yet.": { MN: "Одоогоор хадгалсан бараа алга.", ZH: "尚未保存任何物品。" },
  "Total price": { MN: "Нийт үнэ", ZH: "总价" },
  Remove: { MN: "Хасах", ZH: "移除" },
  Close: { MN: "Хаах", ZH: "关闭" },
};
for (const [key, values] of Object.entries(savedItemTranslations)) {
  dictionaries.MN[key] = values.MN;
  dictionaries.ZH[key] = values.ZH;
}

let language = "EN";
const englishOverrides = {
  "Бүгд": "All", "Мэдээ ачаалж байна…": "Loading news…", "Зохиогч:": "Author:",
  "Эх сурвалж:": "Source:", "Цуглуулсан": "Saved", "Цуглуулах": "Save",
  "Одоогоор энэ ангилалд мэдээ алга.": "No news in this category yet.", "Зах зээл": "Market",
};
// Source catalog names are keys; localized forms are reused in cards, carousels, and details.
const itemNameTranslations = {
  "AK-47 | Redline (Field-Tested)": { MN: "AK-47 | Улаан шугам (Талбарт шалгагдсан)", ZH: "AK-47 | 红线（久经沙场）" },
  "AWP | Asiimov (Field-Tested)": { MN: "AWP | Азимов (Талбарт шалгагдсан)", ZH: "AWP | 阿西莫夫（久经沙场）" },
  "M4A1-S | Printstream (Field-Tested)": { MN: "M4A1-S | Хэвлэх урсгал (Талбарт шалгагдсан)", ZH: "M4A1-S | 印花集（久经沙场）" },
  "Glock-18 | Vogue (Minimal Wear)": { MN: "Glock-18 | Загвар (Бага зэрэг элэгдсэн)", ZH: "Glock-18 | 时尚派对（略有磨损）" },
  "USP-S | Kill Confirmed (Field-Tested)": { MN: "USP-S | Устгасан нь батлагдсан (Талбарт шалгагдсан)", ZH: "USP-S | 确认击杀（久经沙场）" },
  "Desert Eagle | Printstream (Field-Tested)": { MN: "Desert Eagle | Хэвлэх урсгал (Талбарт шалгагдсан)", ZH: "沙漠之鹰 | 印花集（久经沙场）" },
  "P250 | See Ya Later (Minimal Wear)": { MN: "P250 | Дараа уулзъя (Бага зэрэг элэгдсэн)", ZH: "P250 | 回头见（略有磨损）" },
  "AK-47 | Neon Rider (Field-Tested)": { MN: "AK-47 | Неон унаач (Талбарт шалгагдсан)", ZH: "AK-47 | 霓虹骑士（久经沙场）" },
  "M4A4 | Neo-Noir (Field-Tested)": { MN: "M4A4 | Нео-нуар (Талбарт шалгагдсан)", ZH: "M4A4 | 新星（久经沙场）" },
  "AWP | Hyper Beast (Field-Tested)": { MN: "AWP | Аварга араатан (Талбарт шалгагдсан)", ZH: "AWP | 二西莫夫巨兽（久经沙场）" },
  "★ Karambit | Doppler (Factory New)": { MN: "★ Керамбит | Допплер (Үйлдвэрээс шинэ)", ZH: "★ 爪子刀 | 多普勒（崭新出厂）" },
  "★ Butterfly Knife | Fade (Factory New)": { MN: "★ Эрвээхэйн хутга | Өнгө шилжилт (Үйлдвэрээс шинэ)", ZH: "★ 蝴蝶刀 | 渐变大理石（崭新出厂）" },
  "★ M9 Bayonet | Crimson Web (Field-Tested)": { MN: "★ M9 жадат хутга | Час улаан тор (Талбарт шалгагдсан)", ZH: "★ M9 刺刀 | 深红之网（久经沙场）" },
  "★ Driver Gloves | Snow Leopard (Field-Tested)": { MN: "★ Жолоочийн бээлий | Цоохор ирвэс (Талбарт шалгагдсан)", ZH: "★ 驾驶手套 | 雪豹（久经沙场）" },
  "★ Sport Gloves | Vice (Field-Tested)": { MN: "★ Спортын бээлий | Дэд (Талбарт шалгагдсан)", ZH: "★ 运动手套 | 维斯（久经沙场）" },
  "AK-47 | Slate (Minimal Wear)": { MN: "AK-47 | Хар саарал (Бага зэрэг элэгдсэн)", ZH: "AK-47 | 石板（略有磨损）" },
  "AWP | Redline (Field-Tested)": { MN: "AWP | Улаан шугам (Талбарт шалгагдсан)", ZH: "AWP | 红线（久经沙场）" },
  "M4A1-S | Decimator (Minimal Wear)": { MN: "M4A1-S | Устгагч (Бага зэрэг элэгдсэн)", ZH: "M4A1-S | 毁灭者（略有磨损）" },
  "USP-S | Cortex (Minimal Wear)": { MN: "USP-S | Тархины гадарга (Бага зэрэг элэгдсэн)", ZH: "USP-S | 颅脑神经（略有磨损）" },
  "Revolution Case": { MN: "Хувьсгалын хайрцаг", ZH: "革命武器箱" },
  "Muh Keen Gun": { MN: "Мух Киний буу", ZH: "穆希金之枪" },
  "Bloodmayne Avenger": { MN: "Цусан дэлт өшөө авагч", ZH: "血鬃复仇者" },
  "Phantom Concord": { MN: "Сүнсэн эв нэгдэл", ZH: "幻影协奏" },
  "Codicil of the Veiled Ones": { MN: "Нууцлагтнуудын зарлиг", ZH: "隐秘者的遗嘱" },
  "Primal Paean": { MN: "Анхдагч магтаал", ZH: "原初颂歌" },
  "Stoneclaw Scavengers Radiant Towers": { MN: "Чулуу сарвуут цуглуулагчдын Гэрэлт цамхаг", ZH: "石爪拾荒者的天辉防御塔" },
  "Arms of Desolation": { MN: "Мөхлийн зэвсгүүд", ZH: "荒芜之臂" },
  "Sufferwood Sapling": { MN: "Зовлонт модны суулгац", ZH: "苦木树苗" },
  "Shifty's Shortblade": { MN: "Шифтийн богино сэлэм", ZH: "希夫提的短刃" },
  "Shadow Masquerade": { MN: "Сүүдрийн багт наадам", ZH: "暗影化装舞会" },
  "Cannonroar Confessor - Weapon": { MN: "Их бууны архираан - Наминчлагчийн зэвсэг", ZH: "炮鸣忏悔者 - 武器" },
  "★ Жолоочийн бээлий": { EN: "★ Driver Gloves", ZH: "★ 驾驶手套" },
  "★ Спортын бээлий": { EN: "★ Sport Gloves", ZH: "★ 运动手套" },
  "M4A1-S | Cyrex": { EN: "M4A1-S | Cyrex", ZH: "M4A1-S | 塞雷克斯" },
  "M4A1-S | Хэвлэх урсгал": { EN: "M4A1-S | Printstream", ZH: "M4A1-S | 印花集" },
  "★ Мэргэжлийн бээлий": { EN: "★ Specialist Gloves", ZH: "★ 专家手套" },
  "AK-47 | Улаан шугам": { EN: "AK-47 | Redline", ZH: "AK-47 | 红线" },
  "★ Эрвээхэйн хутга": { EN: "★ Butterfly Knife", ZH: "★ 蝴蝶刀" },
  "★ M9 Bayonet": { EN: "★ M9 Bayonet", ZH: "★ M9 刺刀" },
  "AK-47 | Мангас Б": { EN: "AK-47 | Monster B", ZH: "AK-47 | 怪物B" },
  "StatTrak™ XM1014": { EN: "StatTrak™ XM1014", ZH: "StatTrak™ XM1014" },
  "★ Амьд үлдэх хутга": { EN: "★ Survival Knife", ZH: "★ 求生匕首" },
  "★ Наваха хутга": { EN: "★ Navaja Knife", ZH: "★ Navaja 刀" },
  "★ Жад": { EN: "★ Bayonet", ZH: "★ 刺刀" },
  "StatTrak™ AK-47": { EN: "StatTrak™ AK-47", ZH: "StatTrak™ AK-47" },
  "P250 | Азимов": { EN: "P250 | Asiimov", ZH: "P250 | 阿西莫夫" },
  "MAG-7 | Лангуун тавц": { EN: "MAG-7 | Counter Terrace", ZH: "MAG-7 | 柜台露台" },
  "Галил AR | Sugar Rush": { EN: "Galil AR | Sugar Rush", ZH: "Galil AR | 甜蜜暴击" },
};
export function getLanguage() { return language; }
export function currencyInfo() { return CURRENCIES[language]; }
function canonicalText(value) {
  const text = String(value ?? "");
  if (Object.prototype.hasOwnProperty.call(dictionaries.MN, text) || Object.prototype.hasOwnProperty.call(dictionaries.ZH, text)) return text;
  for (const [source, localized] of Object.entries(itemNameTranslations)) {
    if (text === source || Object.values(localized).includes(text)) return source;
  }
  for (const entries of Object.values(dictionaries)) {
    for (const [canonical, translated] of Object.entries(entries)) {
      if (text === translated) return canonical;
    }
  }
  const candidates = [];
  for (const entries of Object.values(dictionaries)) {
    for (const [canonical, translated] of Object.entries(entries)) {
      if (translated && text.startsWith(translated)) candidates.push([translated, canonical]);
    }
  }
  for (const [source, localized] of Object.entries(itemNameTranslations)) {
    for (const translated of Object.values(localized)) {
      if (translated && text.startsWith(translated)) candidates.push([translated, source]);
    }
  }
  candidates.sort((a, b) => b[0].length - a[0].length);
  if (candidates.length) return candidates[0][1] + text.slice(candidates[0][0].length);
  return text;
}
export function translate(value) {
  const text = String(value ?? "").replaceAll("â€¦", "…").replaceAll("â†“", "↓").replaceAll("Â©", "©").replaceAll("Ã—", "×").replaceAll("â€™", "’").replaceAll("â˜°", "☰").replaceAll("âŒ•", "⌕");
  const itemName = translateItemName(text);
  if (itemName !== text) return itemName;
  const canonical = canonicalText(text);
  if (language === "EN") {
    const overrideKey = Object.keys(englishOverrides).filter((key) => canonical.startsWith(key)).sort((a, b) => b.length - a.length)[0];
    return overrideKey ? englishOverrides[overrideKey] + canonical.slice(overrideKey.length) : canonical;
  }
  return dictionaries[language][canonical] || canonical;
}
export function translateItemName(value) {
  const name = String(value ?? "");
  const match = Object.entries(itemNameTranslations).find(([source, localized]) => source === name || Object.values(localized).includes(name));
  if (!match) return name;
  const [source, localized] = match;
  return language === "EN" ? localized.EN || source : localized[language] || source;
}
export function formatPrice(value) {
  const current = CURRENCIES[language];
  const text = String(value ?? "");
  const amount = Number(text.replace(/[^\d.,-]/g, "").replace(/,(?=\d{3}(?:\D|$))/g, ""));
  if (!Number.isFinite(amount)) return text;
  let usd = amount;
  if (text.includes("₮")) usd = amount / CURRENCIES.MN.rate;
  else if (text.includes("¥")) usd = amount / CURRENCIES.ZH.rate;
  else if (text.includes("€")) usd = amount / 0.92;
  const converted = usd * current.rate;
  const digits = language === "MN" ? 0 : 2;
  const formatted = new Intl.NumberFormat(current.locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(converted);
  return language === "EN" ? `${current.symbol}${formatted}` : `${formatted} ${current.symbol}`;
}
function localizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue;
    if (!text.trim()) return;
    const matches = text.match(/(?:\$|₮|¥|€)\s*[\d,.]+/g);
    if (matches) {
      node.nodeValue = text.replace(/(?:\$|₮|¥|€)\s*[\d,.]+/g, (price) => formatPrice(price));
      return;
    }
    const trimmed = text.trim();
    const translated = translate(trimmed);
    if (translated !== trimmed) node.nodeValue = text.replace(trimmed, translated);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || node.closest("script,style,template")) return;
  for (const attr of ["placeholder", "aria-label", "title"]) {
    if (node.hasAttribute(attr)) node.setAttribute(attr, translate(node.getAttribute(attr)));
  }
  node.childNodes.forEach(localizeNode);
}
export function applyLanguage(root = document.body) {
  document.documentElement.lang = language === "MN" ? "mn" : language === "ZH" ? "zh-CN" : "en";
  const page = document.body.classList.contains("news-page") ? "news" : document.body.dataset.game === "dota" ? "dota" : "cs";
  const pageTitles = { EN: { cs: "CS2 Market Viewer", dota: "Dota 2 Market Viewer", news: "CS2 & Dota 2 News" }, MN: { cs: "CS2 зах зээлийн тойм", dota: "Dota 2 зах зээлийн тойм", news: "CS2 ба Dota 2 мэдээ" }, ZH: { cs: "CS2 市场浏览器", dota: "Dota 2 市场浏览器", news: "CS2 与 Dota 2 新闻" } };
  document.title = pageTitles[language][page];
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const descriptions = { EN: { cs: "Browse CS2 market items", dota: "Browse Dota 2 market items", news: "CS2 and Dota 2 esports news" }, MN: { cs: "CS2 зах зээлийн барааг үзэх", dota: "Dota 2 зах зээлийн барааг үзэх", news: "CS2 ба Dota 2 цахим спортын мэдээ" }, ZH: { cs: "浏览 CS2 市场物品", dota: "浏览 Dota 2 市场物品", news: "CS2 与 Dota 2 电竞新闻" } };
    description.content = descriptions[language][page];
  }
  localizeNode(root);
  document.querySelectorAll("[data-language-select]").forEach((select) => { select.value = language; });
  document.querySelectorAll("[data-currency-label]").forEach((label) => { label.textContent = `${CURRENCIES[language].code} ${CURRENCIES[language].symbol}`; });
}
export function initLanguage() {
  if (!document.getElementById("locale-styles")) {
    const style = document.createElement("style");
    style.id = "locale-styles";
    style.textContent = ".language-picker,.news-language-picker{display:flex;align-items:center;gap:6px;flex:none;color:var(--muted,#aab8c7);font-size:9px;font-weight:700}.language-picker select,.news-language-picker select{padding:7px 6px;border:1px solid var(--line,#36352e);border-radius:7px;background:#171814;color:inherit;font:inherit;font-size:10px;font-weight:800}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:700px){.language-picker,.news-language-picker{gap:3px;font-size:8px}.language-picker select,.news-language-picker select{padding:6px 4px}.site-header{gap:6px}}";
    document.head.append(style);
  }
  document.querySelectorAll("header").forEach((header) => {
    if (header.querySelector("[data-language-select]")) return;
    const picker = document.createElement("label");
    picker.className = document.body.classList.contains("news-page") ? "news-language-picker" : "language-picker";
    picker.innerHTML = '<span class="sr-only">Language and currency</span><select data-language-select aria-label="Language"><option value="MN">MN</option><option value="EN">EN</option><option value="ZH">ZH</option></select><span data-currency-label></span>';
    const anchor = header.querySelector(".header-search, .news-market-link");
    header.insertBefore(picker, anchor || null);
  });
  try { const stored = localStorage.getItem(STORAGE_KEY); if (CURRENCIES[stored]) language = stored; } catch {}
  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = language;
    select.addEventListener("change", () => {
      language = CURRENCIES[select.value] ? select.value : "EN";
      try { localStorage.setItem(STORAGE_KEY, language); } catch {}
      applyLanguage();
      window.dispatchEvent(new CustomEvent("market-viewer:language", { detail: { language } }));
    });
  });
  applyLanguage();
}
