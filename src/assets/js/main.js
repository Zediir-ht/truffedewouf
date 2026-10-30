// Truffe de Wouf : menu, apparitions, galerie, formulaire de contact.

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
  ".sechead, .scard, .bloc, .presta__item, .brandband__points li, .review, .principles article, .places li, .plan, .steps li, .gallery__item, .studio-intro > *, .bio > *"
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
    // La visionneuse reprend le format réel de la photo (4/5 si c'est un emplacement sans photo).
    const ratio = /([\d.]+)\s*\/\s*([\d.]+)/.exec(src.style.aspectRatio || "");
    lbPh.style.setProperty("--r", ratio ? String(ratio[1] / ratio[2]) : "0.8");
    lbPh.querySelectorAll("img, source").forEach((el) => el.setAttribute("sizes", "(min-width: 1200px) 1100px, 92vw"));
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

// Formulaire : envoi réel (Netlify Forms, ou un service externe si une adresse d'envoi est renseignée).
// Si l'envoi échoue (hors ligne, test local), repli sur un e-mail pré-rempli dans la messagerie du visiteur.
const form = document.getElementById("contact-form");
if (form) {
  const note = form.querySelector(".form__note");
  const bouton = form.querySelector("button[type=submit]");

  const ouvrirMessagerie = () => {
    const d = new FormData(form);
    const subject = `Demande de séance : ${d.get("seance")} pour ${d.get("animal")}`;
    const body = [
      "Bonjour,",
      "",
      `Je m'appelle ${d.get("prenom")} et je souhaite réserver une séance « ${d.get("seance")} » pour ${d.get("animal")}.`,
      `Lieu souhaité : ${d.get("lieu")}`,
      "",
      d.get("message"),
      "",
      `E-mail : ${d.get("email")}`,
      `Téléphone : ${d.get("tel") || "non précisé"}`,
    ].join("\n");
    window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = "Merci d'indiquer votre prénom, votre e-mail et votre animal.";
      form.querySelector(":invalid").focus();
      return;
    }
    const data = new FormData(form);
    if (form.dataset.cle) data.set("access_key", form.dataset.cle);
    bouton.disabled = true;
    note.textContent = "Envoi en cours…";
    try {
      const rep = await fetch(form.dataset.endpoint || form.getAttribute("action") || "/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json, text/html" },
        body: new URLSearchParams(data).toString(),
      });
      if (!rep.ok) throw new Error(String(rep.status));
      form.reset();
      note.textContent = form.dataset.succes;
    } catch (err) {
      ouvrirMessagerie();
      note.textContent = form.dataset.secours;
    } finally {
      bouton.disabled = false;
    }
  });
}

// Carte : l'iframe Google Maps n'est créée qu'au clic (aucun cookie tiers avant).
document.querySelectorAll("[data-map]").forEach((box) => {
  const btn = box.querySelector("[data-map-btn]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.title = box.dataset.title;
    f.src = box.dataset.map;
    f.referrerPolicy = "no-referrer-when-downgrade";
    box.replaceChildren(f);
  });
});
