import { createElement, appendText } from "../utils/dom.js";

function makeFrame(work, category) {
  const frame = createElement("div", {
    className: `work-card__frame work-card__frame--${category.frame} work-card__frame--${category.id}`,
  });
  const image = createElement("img", {
    className: "work-card__image",
    attributes: {
      src: work.cover,
      alt: work.coverAlt,
      width: work.imageWidth,
      height: work.imageHeight,
      loading: "lazy",
      decoding: "async",
    },
  });

  if (category.frame === "browser") {
    const chrome = createElement("div", { className: "frame-chrome", attributes: { "aria-hidden": "true" } });
    const controls = createElement("span", { className: "frame-chrome__controls" });
    controls.append(
      createElement("i"),
      createElement("i"),
      createElement("i"),
    );
    chrome.append(controls, createElement("span", { className: "frame-chrome__address", text: "kantsuo.design / archive" }));
    const viewport = createElement("div", { className: "frame-browser__viewport" });
    viewport.append(image);
    frame.append(chrome, viewport);
  } else if (category.frame === "phone") {
    const speaker = createElement("span", { className: "frame-phone__speaker", attributes: { "aria-hidden": "true" } });
    const viewport = createElement("div", { className: "frame-phone__viewport" });
    viewport.append(image);
    frame.append(speaker, viewport);
  } else {
    frame.append(image);
  }

  const overlay = createElement("div", { className: "work-card__overlay", attributes: { "aria-hidden": "true" } });
  appendText(overlay, "span", category.code, "work-card__sector-code");
  appendText(overlay, "span", "K / ARCHIVE", "work-card__archive-mark");
  frame.append(overlay);

  if (work.placeholder) {
    appendText(frame, "span", "EXEMPLO", "tag tag--example");
  }

  return frame;
}

export function renderWorks(container, works, categories) {
  if (!container) return;

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const fragment = document.createDocumentFragment();

  works.forEach((work, index) => {
    const category = categoryById.get(work.category);
    if (!category) return;

    const card = createElement("article", {
      className: `work-card work-card--${category.id}`,
      attributes: { "data-reveal": "", "data-work-index": String(index + 1).padStart(2, "0") },
    });
    const link = createElement("a", {
      className: "work-card__link",
      attributes: {
        href: `project.html?id=${encodeURIComponent(work.id)}`,
        "aria-label": `${work.title}, ${category.title}, exemplo de ${work.year}`,
      },
    });
    link.append(makeFrame(work, category));

    const meta = createElement("div", { className: "work-card__meta" });
    const categoryLine = createElement("div", { className: "work-card__eyebrow" });
    appendText(categoryLine, "span", category.code, "work-card__category");
    appendText(categoryLine, "span", String(work.year), "work-card__year");
    meta.append(categoryLine);
    appendText(meta, "h3", work.title, "work-card__title");
    appendText(meta, "p", work.summary, "work-card__summary");
    link.append(meta);
    card.append(link);
    fragment.append(card);
  });

  container.replaceChildren(fragment);
}
