import { site } from "../data/site.js";

export function initializeWhatsAppLinks() {
  const phone = site.whatsapp.replace(/\D/g, "");

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    const message = link.dataset.message ?? "Oi! Quero conversar sobre um projeto de design.";
    if (!phone) {
      link.setAttribute("href", "contact.html#contact-form");
      link.setAttribute("title", "Configure seu número em assets/js/data/site.js para abrir uma conversa no WhatsApp.");
      return;
    }

    link.setAttribute("href", `https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.removeAttribute("title");
  });
}
