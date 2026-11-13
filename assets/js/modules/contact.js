import { site } from "../data/site.js";

export function initializeContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  const privacy = document.querySelector(".contact-form__privacy");
  if (!form || !status) return;

  const phone = site.whatsapp.replace(/\D/g, "");
  if (privacy) {
    privacy.textContent = phone
      ? "Sem envio para servidor: a mensagem é preparada no seu dispositivo e aberta no WhatsApp."
      : "Para ativar o envio pelo WhatsApp, cadastre seu número internacional em assets/js/data/site.js.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const subject = String(values.get("subject") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();

    if (!phone) {
      status.textContent = "Para enviar a mensagem, adicione seu número com DDI em assets/js/data/site.js (campo whatsapp).";
      return;
    }

    const lines = [
      `Olá! Meu nome é ${name}.`,
      subject ? `Assunto: ${subject}` : "",
      message,
    ].filter(Boolean);
    const target = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
    status.textContent = "Abrindo o WhatsApp…";
    window.location.assign(target);
  });
}
