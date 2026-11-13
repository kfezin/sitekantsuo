import { createElement } from "../utils/dom.js";

export function initializeLightbox(container, images) {
  if (!container || !images.length) return;

  const dialog = createElement("dialog", { className: "lightbox" });
  dialog.setAttribute("aria-label", "Galeria de imagens do projeto");
  const shell = createElement("div", { className: "lightbox__shell" });
  const toolbar = createElement("div", { className: "lightbox__toolbar" });
  const counter = createElement("span", { className: "lightbox__counter" });
  const closeButton = createElement("button", {
    className: "lightbox__close",
    text: "Fechar",
    attributes: { type: "button", "aria-label": "Fechar galeria" },
  });
  const figure = createElement("figure", { className: "lightbox__figure" });
  const image = createElement("img", { className: "lightbox__image" });
  const previousButton = createElement("button", {
    className: "lightbox__arrow lightbox__arrow--previous",
    text: "←",
    attributes: { type: "button", "aria-label": "Imagem anterior" },
  });
  const nextButton = createElement("button", {
    className: "lightbox__arrow lightbox__arrow--next",
    text: "→",
    attributes: { type: "button", "aria-label": "Próxima imagem" },
  });

  const toolbarClose = createElement("div", { className: "lightbox__toolbar-actions" });
  toolbarClose.append(counter, closeButton);
  toolbar.append(toolbarClose);
  figure.append(previousButton, image, nextButton);
  shell.append(toolbar, figure);
  dialog.append(shell);
  document.body.append(dialog);

  let activeIndex = 0;
  let returnFocus = null;

  const showImage = (index) => {
    activeIndex = (index + images.length) % images.length;
    const activeImage = images[activeIndex];
    image.src = activeImage.src;
    image.alt = activeImage.alt;
    image.width = activeImage.width;
    image.height = activeImage.height;
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
  };

  container.querySelectorAll("[data-lightbox-index]").forEach((button) => {
    button.addEventListener("click", () => {
      returnFocus = button;
      showImage(Number(button.dataset.lightboxIndex));
      dialog.showModal();
      closeButton.focus();
    });
  });

  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => returnFocus?.focus());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
  });
}
