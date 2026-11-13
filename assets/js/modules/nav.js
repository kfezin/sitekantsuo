export function initializeNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-main-nav]");
  if (!toggle || !navigation) return;

  const closeMenu = ({ returnFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-is-open");
    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    navigation.classList.add("is-open");
    document.body.classList.add("menu-is-open");
    navigation.querySelector("a")?.focus();
  };

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) closeMenu();
    else openMenu();
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: true });
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 960px)").matches) closeMenu();
  });
}
