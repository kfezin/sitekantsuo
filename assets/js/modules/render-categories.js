import { createElement, appendText } from "../utils/dom.js";

export function renderCategories(container, categories, works) {
  if (!container) return;

  const counts = new Map(categories.map((category) => [category.id, 0]));
  for (const work of works) {
    counts.set(work.category, (counts.get(work.category) ?? 0) + 1);
  }

  const fragment = document.createDocumentFragment();

  categories.forEach((category, index) => {
    const item = createElement("article", {
      className: `sector-card sector-card--${category.id}`,
      attributes: { "data-reveal": "", "data-sector-number": String(index + 1).padStart(2, "0") },
    });
    const link = createElement("a", {
      className: "sector-card__link",
      attributes: {
        href: `works.html?c=${encodeURIComponent(category.id)}`,
        "aria-label": `Explorar ${category.title}, ${counts.get(category.id) ?? 0} trabalhos de exemplo`,
      },
    });
    const top = createElement("div", { className: "sector-card__top" });
    appendText(top, "span", category.code, "sector-card__code");
    appendText(top, "span", category.kana, "sector-card__kana");
    link.append(top);

    const title = appendText(link, "h3", category.title, "sector-card__title");
    title.append(createElement("span", { className: "sector-card__arrow", text: "↗", attributes: { "aria-hidden": "true" } }));
    appendText(link, "p", category.description, "sector-card__description");

    const bottom = createElement("div", { className: "sector-card__bottom" });
    appendText(bottom, "span", `${String(counts.get(category.id) ?? 0).padStart(2, "0")} TRABALHOS`, "sector-card__count");
    appendText(bottom, "span", "ABRIR DISTRITO", "sector-card__open");
    link.append(bottom);

    item.append(link);
    fragment.append(item);
  });

  container.replaceChildren(fragment);
}
