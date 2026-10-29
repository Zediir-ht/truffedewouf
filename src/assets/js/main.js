// Truffe de Wouf : menu, héro, galerie, formulaire de réservation.

const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
const menu = document.getElementById("menu");

const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("is-open", !open);
  document.body.style.overflow = open ? "" : "hidden";
});

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Apparition au scroll
const revealables = document.querySelectorAll(
  ".sechead, .scard, .feature, .team article, .brandband__points li, .offers li, .mosaic .ph, .review, .local__cols, .principles article, .swatches figure, .places li, .plan, .steps li, .terms div, .gallery__item, .studio-intro > *, .bio > *"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealables.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    io.observe(el);
  });
}

// Héro : le fond de studio change de couleur
const cycle = document.querySelector("[data-cycle]");
const dots = document.querySelectorAll("[data-dots] button");
if (cycle && dots.length) {
  const label = cycle.querySelector("[data-cycle-label]");
  const accent = document.querySelector("[data-accent]");
  let current = 0, timer;
  const show = (i) => {
    current = i;
    const c = dots[i].style.getPropertyValue("--c");
    cycle.style.setProperty("--bd", c);
    if (accent) accent.style.color = c;
    if (label) label.textContent = `Fond n°0${i + 1} · ${dots[i].dataset.name}`;
    dots.forEach((d, k) => d.setAttribute("aria-pressed", String(k === i)));
  };
  const play = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(timer);
    timer = setInterval(() => show((current + 1) % dots.length), 3200);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); play(); }));
  show(0);
  play();
}

// Galerie : filtres + visionneuse
const gallery = document.querySelector(".gallery");
if (gallery) {
  const items = [...gallery.querySelectorAll(".gallery__item")];
  const filters = document.querySelectorAll("[data-filter]");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const f = btn.dataset.filter;
    items.forEach((it) => (it.hidden = f !== "all" && it.dataset.cat !== f));
  }));

  const lb = document.querySelector(".lightbox");
  const lbPh = lb.querySelector("[data-lb-ph]");
  const lbCap = lb.querySelector("[data-lb-cap]");
  const lbCount = lb.querySelector("[data-lb-count]");
  let idx = 0;
  const visible = () => items.filter((it) => !it.hidden);
  const open = (it) => {
    const list = visible();
    idx = list.indexOf(it);
    const src = it.querySelector(".ph");
    lbPh.className = src.className;
    lbPh.innerHTML = src.innerHTML;
    lbPh.querySelectorAll("img, source").forEach((el) => el.setAttribute("sizes", "(min-width: 900px) 700px, 92vw"));
    lbCap.textContent = it.dataset.cap;
    lbCount.textContent = `${idx + 1} / ${list.length}`;
    if (!lb.open) lb.showModal();
  };
  const step = (d) => { const list = visible(); open(list[(idx + d + list.length) % list.length]); };
  items.forEach((it) => it.addEventListener("click", () => open(it)));
  lb.querySelector("[data-lb-close]").addEventListener("click", () => lb.close());
  lb.querySelector("[data-lb-prev]").addEventListener("click", () => step(-1));
  lb.querySelector("[data-lb-next]").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

// Formulaire : sans serveur pour l'instant, il prépare un e-mail dans la messagerie du visiteur.
const form = document.getElementById("contact-form");
if (form) {
  const note = form.querySelector(".form__note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = "Merci d'indiquer votre prénom, votre e-mail et le nom de votre chien.";
      form.querySelector(":invalid").focus();
      return;
    }
    const d = new FormData(form);
    const subject = `Demande de séance ${d.get("seance")} pour ${d.get("chien")}`;
    const body = [
      "Bonjour,",
      "",
      `Je m'appelle ${d.get("prenom")} et je souhaite réserver une séance « ${d.get("seance")} » pour ${d.get("chien")}.`,
      "",
      d.get("message"),
      "",
      `E-mail : ${d.get("email")}`,
      `Téléphone : ${d.get("tel") || "non précisé"}`,
    ].join("\n");
    window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = "Votre messagerie s'ouvre avec la demande pré-remplie. Il ne reste qu'à l'envoyer.";
  });
}
