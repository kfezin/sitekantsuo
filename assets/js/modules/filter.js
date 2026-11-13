import { createElement } from "../utils/dom.js";

export function initializeFilters(container, categories, works, onChange) {
  if (!container) return;

  const filterButtons = [];
  const addFilterButton = (id, label) => {
    const button = createElement("button", {
      className: "filter-chip",
      text: label,
      attributes: { type: "button", "data-filter-id": id, "aria-pressed": "false" },
    });
    filterButtons.push(button);
    container.append(button);
  };

  addFilterButton("all", "Todos");
  categories.forEach((category) => addFilterButton(category.id, category.title));

  const heading = document.querySelector("[data-category-heading]");
  const headingCode = document.querySelector("[data-category-code]");
  const headingTitle = document.querySelector("[data-category-title]");
  const headingKana = document.querySelector("[data-category-kana]");
  const headingDescription = document.querySelector("[data-category-description]");
  const headingCount = document.querySelector("[data-category-count]");

  const renderFromLocation = ({ replaceInvalid = false } = {}) => {
    const url = new URL(window.location.href);
    const queryId = url.searchParams.get("c");
    const category = categories.find((item) => item.id === queryId);
    const selectedId = category ? category.id : "all";

    if (queryId && !category && replaceInvalid) {
      url.searchParams.delete("c");
      window.history.replaceState({}, "", url);
    }

    const visibleWorks = selectedId === "all"
      ? works
      : works.filter((work) => work.category === selectedId);

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filterId === selectedId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (heading) {
      heading.hidden = !category;
      if (category) {
        if (headingCode) headingCode.textContent = category.code;
        if (headingTitle) headingTitle.textContent = category.title;
        if (headingKana) headingKana.textContent = category.kana;
        if (headingDescription) headingDescription.textContent = category.description;
        if (headingCount) headingCount.textContent = `${String(visibleWorks.length).padStart(2, "0")} TRABALHOS`;
      }
    }

    onChange(visibleWorks);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = new URL(window.location.href);
      if (button.dataset.filterId === "all") url.searchParams.delete("c");
      else url.searchParams.set("c", button.dataset.filterId);
      window.history.pushState({}, "", url);
      renderFromLocation();
    });
  });

  window.addEventListener("popstate", () => renderFromLocation({ replaceInvalid: true }));
  renderFromLocation({ replaceInvalid: true });
}
