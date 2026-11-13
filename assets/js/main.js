import { site } from "./data/site.js";
import { categories } from "./data/categories.js";
import { works } from "./data/works.js";
import { initializeNavigation } from "./modules/nav.js";
import { initializeReveals } from "./modules/reveal.js";
import { renderCategories } from "./modules/render-categories.js";
import { renderWorks } from "./modules/render-works.js";
import { renderProject } from "./modules/render-project.js";
import { initializeFilters } from "./modules/filter.js";
import { initializeWhatsAppLinks } from "./modules/whatsapp.js";
import { initializeContactForm } from "./modules/contact.js";

function updateDocumentTitle() {
  const titleElement = document.querySelector("[data-page-title]");
  const pageTitle = titleElement?.innerText?.replace(/\s+/g, " ").trim() || titleElement?.textContent.trim();
  if (pageTitle) document.title = `${pageTitle} — ${site.name}`;
}

function populateSiteDetails() {
  document.querySelectorAll("[data-site-name]").forEach((element) => {
    element.textContent = site.name;
  });
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
  document.querySelectorAll("[data-site-city]").forEach((element) => {
    element.textContent = site.city;
  });
  document.querySelectorAll("[data-site-role]").forEach((element) => {
    element.textContent = site.role;
  });
  document.querySelectorAll("[data-site-about]").forEach((element) => {
    element.textContent = site.about;
  });
  document.querySelectorAll("[data-email-value]").forEach((element) => {
    element.textContent = site.email;
  });

  const socialValues = {
    instagram: site.instagram,
    behance: site.behance,
    email: site.email ? `mailto:${site.email}` : "",
  };

  Object.entries(socialValues).forEach(([network, href]) => {
    document.querySelectorAll(`[data-social-link="${network}"]`).forEach((link) => {
      if (!href) {
        link.removeAttribute("href");
        link.hidden = true;
        return;
      }
      link.setAttribute("href", href);
      if (!href.startsWith("mailto:")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
      link.hidden = false;
    });
  });

  const whatsappNote = document.querySelector("[data-whatsapp-note]");
  if (whatsappNote) whatsappNote.hidden = Boolean(site.whatsapp.replace(/\D/g, ""));
  updateDocumentTitle();
}

function markCurrentPage() {
  const currentFile = window.location.pathname.split("/").filter(Boolean).at(-1) || "index.html";
  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const linkFile = new URL(link.href, window.location.href).pathname.split("/").filter(Boolean).at(-1);
    if (linkFile === currentFile) {
      link.setAttribute("aria-current", "page");
      link.classList.add("is-current");
    }
  });
}

function initializeHome() {
  renderCategories(document.querySelector("[data-categories-grid]"), categories, works);
  renderWorks(
    document.querySelector("[data-featured-grid]"),
    works.filter((work) => work.featured),
    categories,
  );
}

function initializeWorkCatalog() {
  const filterContainer = document.querySelector("[data-filters]");
  const workContainer = document.querySelector("[data-works-grid]");
  if (!filterContainer || !workContainer) return;

  initializeFilters(filterContainer, categories, works, (visibleWorks) => {
    renderWorks(workContainer, visibleWorks, categories);
    initializeReveals();
  });
}

function initializeProjectPage() {
  const container = document.querySelector("[data-project-detail]");
  if (!container) return;

  const projectId = new URLSearchParams(window.location.search).get("id");
  const work = works.find((item) => item.id === projectId);
  if (!work) {
    window.location.replace("404.html");
    return;
  }

  renderProject(container, work, categories, works);
  const title = document.querySelector("[data-page-title]");
  if (title) title.textContent = work.title;
  updateDocumentTitle();

  const metaValues = {
    'meta[property="og:title"]': `${work.title} — ${site.name}`,
    'meta[property="og:description"]': work.summary,
    'meta[property="og:image"]': work.cover,
    'meta[name="twitter:title"]': `${work.title} — ${site.name}`,
    'meta[name="twitter:description"]': work.summary,
    'meta[name="twitter:image"]': work.cover,
    'meta[name="description"]': work.summary,
  };
  Object.entries(metaValues).forEach(([selector, value]) => {
    document.querySelector(selector)?.setAttribute("content", value);
  });
}

function initializeAboutPage() {
  const servicesContainer = document.querySelector("[data-site-services]");
  const toolsContainer = document.querySelector("[data-site-tools]");
  const avatar = document.querySelector("[data-site-avatar]");

  if (servicesContainer) {
    servicesContainer.replaceChildren(...site.services.map((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    }));
  }
  if (toolsContainer) {
    toolsContainer.replaceChildren(...site.tools.map((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      return item;
    }));
  }
  if (avatar) avatar.setAttribute("src", site.avatar);
}

function initializeSite() {
  document.documentElement.classList.add("js");
  populateSiteDetails();
  initializeNavigation();
  markCurrentPage();
  initializeHome();
  initializeWorkCatalog();
  initializeProjectPage();
  initializeAboutPage();
  initializeContactForm();
  initializeWhatsAppLinks();
  initializeReveals();
}

initializeSite();
