import { createElement, appendText } from "../utils/dom.js";
import { initializeLightbox } from "./lightbox.js";

function createList(parent, values, className) {
  const list = createElement("ul", { className });
  values.forEach((value) => appendText(list, "li", value));
  parent.append(list);
  return list;
}

function addMetaRow(parent, label, value) {
  if (!value) return;
  const row = createElement("div", { className: "project-facts__row" });
  appendText(row, "dt", label, "project-facts__label");
  appendText(row, "dd", value, "project-facts__value");
  parent.append(row);
}

function createWorkLink(work, label, direction) {
  if (!work) return createElement("span", { className: `project-nav__item project-nav__item--${direction}` });
  const link = createElement("a", {
    className: `project-nav__item project-nav__item--${direction}`,
    attributes: { href: `project.html?id=${encodeURIComponent(work.id)}` },
  });
  appendText(link, "span", direction === "previous" ? "← ANTERIOR" : "PRÓXIMO →", "project-nav__direction");
  appendText(link, "strong", work.title, "project-nav__title");
  link.setAttribute("aria-label", `${label}: ${work.title}`);
  return link;
}

export function renderProject(container, work, categories, allWorks) {
  if (!container || !work) return;
  const category = categories.find((item) => item.id === work.category);
  if (!category) return;

  const related = allWorks.filter((item) => item.category === work.category);
  const index = related.findIndex((item) => item.id === work.id);
  const previous = related[(index - 1 + related.length) % related.length];
  const next = related[(index + 1) % related.length];
  const gallery = work.gallery?.length ? work.gallery : [work.cover];
  const imageItems = gallery.map((src) => ({
    src,
    alt: work.coverAlt,
    width: work.imageWidth,
    height: work.imageHeight,
  }));

  const fragment = document.createDocumentFragment();
  const breadcrumb = createElement("nav", { className: "breadcrumbs", attributes: { "aria-label": "Você está aqui" } });
  const backLink = createElement("a", {
    text: `← ${category.title}`,
    attributes: { href: `works.html?c=${encodeURIComponent(category.id)}` },
  });
  breadcrumb.append(backLink);
  appendText(breadcrumb, "span", "/", "breadcrumbs__separator");
  appendText(breadcrumb, "span", work.title, "breadcrumbs__current");
  fragment.append(breadcrumb);

  const header = createElement("header", { className: "project-hero", attributes: { "data-reveal": "" } });
  const eyebrow = createElement("p", { className: "eyebrow" });
  appendText(eyebrow, "span", category.code, "eyebrow__slash");
  appendText(eyebrow, "span", category.kana, "project-hero__kana");
  appendText(eyebrow, "span", String(work.year));
  header.append(eyebrow);
  const title = appendText(header, "h1", work.title, "project-hero__title");
  title.setAttribute("data-page-title", "");
  appendText(header, "p", work.summary, "project-hero__summary");
  const actions = createElement("div", { className: "project-hero__actions" });
  const contactLink = createElement("a", {
    className: "button button--red",
    text: "Quero algo assim",
    attributes: {
      href: "contact.html#contact-form",
      "data-whatsapp-link": "",
      "data-message": `Oi! Vi o projeto ${work.title} e quero conversar sobre algo parecido.`,
    },
  });
  actions.append(contactLink);
  if (work.placeholder) {
    appendText(header, "span", "EXEMPLO — substitua as imagens e os dados antes de divulgar este trabalho como projeto real.", "project-example-note");
  }
  header.append(actions);
  fragment.append(header);

  const preview = createElement("figure", { className: `project-preview project-preview--${category.frame}`, attributes: { "data-reveal": "" } });
  const coverImage = createElement("img", {
    attributes: {
      src: work.cover,
      alt: work.coverAlt,
      width: work.imageWidth,
      height: work.imageHeight,
      fetchpriority: "high",
    },
  });
  preview.append(coverImage);
  fragment.append(preview);

  const body = createElement("section", { className: "project-body", attributes: { "aria-label": "Detalhes do projeto" } });
  const narrative = createElement("div", { className: "project-body__intro", attributes: { "data-reveal": "" } });
  appendText(narrative, "p", "// VISÃO GERAL", "eyebrow project-body__eyebrow");
  appendText(narrative, "h2", "UMA IDEIA,\nUM NOVO FORMATO.", "project-body__heading");
  appendText(narrative, "p", work.summary, "project-body__summary");
  body.append(narrative);

  const facts = createElement("dl", { className: "project-facts", attributes: { "data-reveal": "" } });
  addMetaRow(facts, "Setor", `${category.code} / ${category.title}`);
  addMetaRow(facts, "Ano", String(work.year));
  addMetaRow(facts, "Cliente", work.client);
  body.append(facts);

  const serviceBlock = createElement("section", { className: "project-tags", attributes: { "aria-labelledby": "project-services-title" } });
  appendText(serviceBlock, "h2", "Serviços", "project-tags__title").id = "project-services-title";
  createList(serviceBlock, work.services ?? [], "project-tags__list");
  body.append(serviceBlock);

  const toolsBlock = createElement("section", { className: "project-tags", attributes: { "aria-labelledby": "project-tools-title" } });
  appendText(toolsBlock, "h2", "Ferramentas", "project-tags__title").id = "project-tools-title";
  createList(toolsBlock, work.tools ?? [], "project-tags__list");
  body.append(toolsBlock);
  fragment.append(body);

  const gallerySection = createElement("section", { className: "project-gallery", attributes: { "aria-labelledby": "project-gallery-title" } });
  const galleryHeading = createElement("div", { className: "section-heading", attributes: { "data-reveal": "" } });
  const galleryLabel = createElement("div");
  appendText(galleryLabel, "p", "// DETALHES DO PROJETO", "eyebrow");
  appendText(galleryLabel, "h2", "ABRA A IMAGEM.", "section-title project-gallery__heading").id = "project-gallery-title";
  galleryHeading.append(galleryLabel);
  appendText(galleryHeading, "p", `${String(imageItems.length).padStart(2, "0")} IMAGEM${imageItems.length === 1 ? "" : "S"}`, "project-gallery__count");
  gallerySection.append(galleryHeading);

  const galleryGrid = createElement("div", { className: "project-gallery__grid" });
  imageItems.forEach((item, imageIndex) => {
    const figure = createElement("figure", { className: "project-gallery__item", attributes: { "data-reveal": "" } });
    const button = createElement("button", {
      className: "project-gallery__button",
      attributes: {
        type: "button",
        "data-lightbox-index": imageIndex,
        "aria-label": `Ampliar imagem ${imageIndex + 1} de ${imageItems.length}`,
      },
    });
    const image = createElement("img", {
      attributes: {
        src: item.src,
        alt: item.alt,
        width: item.width,
        height: item.height,
        loading: imageIndex === 0 ? "lazy" : "lazy",
        decoding: "async",
      },
    });
    button.append(image);
    appendText(button, "span", "AMPLIAR ↗", "project-gallery__zoom");
    figure.append(button);
    galleryGrid.append(figure);
  });
  gallerySection.append(galleryGrid);
  fragment.append(gallerySection);

  const externalLinks = createElement("div", { className: "project-links" });
  const behanceLink = createElement("a", {
    className: "button button--paper",
    text: "Ver case no Behance ↗",
    attributes: { href: work.links?.behance || "", target: "_blank", rel: "noopener noreferrer" },
  });
  const liveLink = createElement("a", {
    className: "text-link",
    text: "Ver projeto ao vivo ↗",
    attributes: { href: work.links?.live || "", target: "_blank", rel: "noopener noreferrer" },
  });
  behanceLink.hidden = !work.links?.behance;
  liveLink.hidden = !work.links?.live;
  externalLinks.append(behanceLink, liveLink);
  fragment.append(externalLinks);

  const navigation = createElement("nav", { className: "project-nav", attributes: { "aria-label": "Navegar entre projetos do mesmo setor" } });
  navigation.append(createWorkLink(previous, "Projeto anterior", "previous"));
  navigation.append(createWorkLink(next, "Próximo projeto", "next"));
  fragment.append(navigation);

  container.replaceChildren(fragment);
  initializeLightbox(gallerySection, imageItems);
}
