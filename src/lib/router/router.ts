export async function loadPageFromRoute(path: string) {
  let module;
  switch (path) {
    case "/":
      module = await import("@/pages/home/home.page");
      return module.default;

    default:
      module = await import("@/pages/not-found/not-found.page");
      return module.default;
  }
}
