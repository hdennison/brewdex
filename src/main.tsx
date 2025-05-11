import { loadPageFromRoute } from "@/lib/router/router";

import "./styles/index.css";

/**
 * Initialize the app by loading the current route's page component,
 * invoking it to produce real DOM nodes, and mounting into #app.
 */
async function init() {
  const app = document.getElementById("app");
  if (!app) return;

  // Dynamically load the page component for the current path
  const Page = await loadPageFromRoute(location.pathname);

  // Clear any existing content
  app.innerHTML = "";

  // Invoke the async component to get a Node or DocumentFragment
  const pageNode = await Page();
  app.appendChild(pageNode);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("popstate", init);
