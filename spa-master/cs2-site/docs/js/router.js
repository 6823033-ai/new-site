import { renderSearchPage } from "./pages/searchPage.js";

export function initRouter() {
  function renderRoute() {
    const route = window.location.hash;
    if (!route.startsWith("#/")) return;
    if (route === "#/items" || route === "#/overview") renderSearchPage();
    else document.getElementById("app").innerHTML = '<section class="state"><h2>Page not found</h2><a href="#/items">Return to items</a></section>';
  }
  window.addEventListener("load", () => {
    if (window.location.hash.startsWith("#/")) renderRoute();
    else renderSearchPage();
  }, { once: true });
  window.addEventListener("hashchange", renderRoute);
}
