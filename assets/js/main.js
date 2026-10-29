// Truffe de Wouf : navigation, apparitions au scroll, formulaire de contact.

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("is-open", !open);
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }
});

// Apparition des blocs au scroll
const revealables = document.querySelectorAll(".card, .spots li, .steps li, .faq details, .section__head");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealables.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
}

// Formulaire : sans serveur pour l'instant, il prépare un e-mail dans la messagerie du visiteur.
const CONTACT_EMAIL = "contact@truffedewouf.fr";
const form = document.getElementById("contact-form");
const note = form.querySelector(".form__note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    note.textContent = "Il manque une petite info (prénom, e-mail ou chien) 🐾";
    form.querySelector(":invalid").focus();
    return;
  }
  const d = new FormData(form);
  const subject = `Demande de séance : ${d.get("chien")} (${d.get("seance")})`;
  const body = [
    `Bonjour,`,
    ``,
    `Je m'appelle ${d.get("prenom")} et je souhaite réserver une séance « ${d.get("seance")} » pour ${d.get("chien")}.`,
    ``,
    d.get("message"),
    ``,
    `Mon e-mail : ${d.get("email")}`,
  ].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Votre messagerie s'ouvre, il ne reste qu'à envoyer ✨";
});

document.getElementById("year").textContent = new Date().getFullYear();
