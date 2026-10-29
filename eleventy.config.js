// Truffe de Wouf : génération du site à partir des fichiers de src/_data
// (modifiés par le client via Pages CMS) et des gabarits de src/.
import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import MarkdownIt from "markdown-it";

const SRC = "src";
const OUT = "_site";
const IMG_URL = "assets/img/generated/";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Markdown (paragraphes) : les liens prennent le style du site ----------
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
const defaultLink = md.renderer.rules.link_open || ((tokens, i, o, e, self) => self.renderToken(tokens, i, o));
md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
  const t = tokens[i];
  t.attrJoin("class", "link");
  if (/^https?:/.test(t.attrGet("href") || "")) {
    t.attrSet("target", "_blank");
    t.attrSet("rel", "noopener");
  }
  return defaultLink(tokens, i, opts, env, self);
};

// ---------- Téléphone, WhatsApp, Google Maps ----------
const digits = (n) => String(n || "").replace(/[^\d+]/g, "");
const intl = (n) => {
  const d = digits(n);
  if (d.startsWith("+")) return d.slice(1);
  if (d.startsWith("00")) return d.slice(2);
  if (d.startsWith("0")) return "33" + d.slice(1);
  return d;
};
const addressLine = (s) => [s.nom, s.adresse, s.code_postal, s.ville].filter(Boolean).join(" ");
const mapsHref = (s) =>
  s.lien_google || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addressLine(s));
const mapsEmbed = (s) =>
  "https://www.google.com/maps?q=" + encodeURIComponent(addressLine(s)) + "&z=15&output=embed";

// ---------- Données structurées (JSON-LD) ----------
const DAYS = {
  lundi: "Monday", mardi: "Tuesday", mercredi: "Wednesday", jeudi: "Thursday",
  vendredi: "Friday", samedi: "Saturday", dimanche: "Sunday",
};
const ld = (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");
let ogUrl = "";

function localBusiness(site, avis) {
  const o = site.ouverture || {};
  const obj = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.domaine}/#studio`,
    name: site.nom,
    description: site.description_courte,
    url: `${site.domaine}/`,
    logo: `${site.domaine}/assets/img/favicon.svg`,
    telephone: "+" + intl(site.telephone),
    email: site.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.adresse,
      addressLocality: site.ville,
      postalCode: site.code_postal,
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    hasMap: mapsHref(site),
    areaServed: [
      ...(site.communes || []).map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "Aveyron" },
    ],
    knowsAbout: ["photographie canine", "portrait de chien", "photo d'animaux de compagnie"],
  };
  if (ogUrl) obj.image = ogUrl;
  if (site.latitude && site.longitude) {
    obj.geo = { "@type": "GeoCoordinates", latitude: Number(site.latitude), longitude: Number(site.longitude) };
  }
  const jours = [].concat(o.jours || []).map((j) => DAYS[String(j).toLowerCase()]).filter(Boolean);
  if (jours.length && o.de && o.a) {
    obj.openingHoursSpecification = [
      { "@type": "OpeningHoursSpecification", dayOfWeek: jours, opens: o.de, closes: o.a },
    ];
  }
  const same = [site.instagram, site.facebook, site.lien_google].filter(Boolean);
  if (same.length) obj.sameAs = same;
  // La note n'est publiée que si le studio a saisi son vrai nombre d'avis.
  const rating = parseFloat(String(avis?.note || "").replace(",", "."));
  const count = parseInt(avis?.nombre, 10);
  if (rating > 0 && count > 0) {
    obj.aggregateRating = { "@type": "AggregateRating", ratingValue: rating, reviewCount: count, bestRating: 5 };
  }
  return ld(obj);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/assets/css": "assets/css",
    "src/assets/js": "assets/js",
    "src/assets/img/favicon.svg": "assets/img/favicon.svg",
  });
  eleventyConfig.addWatchTarget("src/assets/");

  // ---------- Filtres de texte ----------
  // « Un titre *en italique* » : les étoiles mettent un passage en italique.
  eleventyConfig.addFilter("em", (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"));
  // Nom du studio : le petit mot « de » passe en italique (Truffe *de* Wouf).
  eleventyConfig.addFilter("logo", (s) => esc(s).replace(/\b(de)\b/, "<em>$1</em>"));
  eleventyConfig.addFilter("md", (s) => md.render(String(s ?? "")));
  eleventyConfig.addFilter("mdi", (s) => md.renderInline(String(s ?? "")));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("cycle", (arr, i) => arr[(i - 1) % arr.length]);

  eleventyConfig.addFilter("telHref", (n) => "tel:+" + intl(n));
  eleventyConfig.addFilter("waHref", (n) => "https://wa.me/" + intl(n));
  eleventyConfig.addFilter("mapsHref", mapsHref);
  eleventyConfig.addFilter("mapsEmbed", mapsEmbed);
  eleventyConfig.addFilter("ogUrl", () => ogUrl);

  eleventyConfig.addFilter("localBusinessLd", localBusiness);
  eleventyConfig.addFilter("faqLd", (items) =>
    ld({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (items || []).map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: String(q.reponse || "").replace(/[*_`]|\[([^\]]*)\]\([^)]*\)/g, "$1") },
      })),
    })
  );
  eleventyConfig.addFilter("breadcrumbLd", (name, pageUrl, site) =>
    ld({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${site.domaine}/` },
        { "@type": "ListItem", position: 2, name, item: `${site.domaine}${pageUrl}` },
      ],
    })
  );

  // ---------- Icônes ----------
  const P = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    ne: '<path d="M7 17 17 7M8 7h9v9"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="1"/><path d="m3.5 16 5-5 4 4 2.5-2.5 5 5"/><circle cx="15.5" cy="9" r="1.5"/>',
    chat: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 2.4 4.2 4.5 4.6l1.2-1.2 1.8.8"/>',
    check: '<path d="M4 12.5 9 17 20 6"/>',
  };
  eleventyConfig.addShortcode("icon", (name) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.arrow}</svg>`
  );
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>';
  eleventyConfig.addShortcode("stars", (label) =>
    `<span class="stars" role="img" aria-label="${esc(label || "5 étoiles sur 5")}">${STAR.repeat(5)}</span>`
  );

  // ---------- Photos ----------
  // {% ph { couleur, cap, photo, alt, cls, sizes, priority, natural, cycle } %}
  // Avec une photo : image optimisée (WebP + JPEG, plusieurs largeurs).
  // Sans photo (ou fichier introuvable) : fond de studio coloré.
  const optimise = (file) =>
    Image(file, {
      widths: [480, 800, 1200, 1600],
      formats: ["webp", "jpeg"],
      outputDir: path.join(OUT, IMG_URL),
      urlPath: IMG_URL,
      sharpOptions: { animated: false },
    });

  eleventyConfig.addAsyncShortcode("ph", async (o = {}) => {
    const { couleur = "cobalt", cap = "", photo = "", alt = "", cls = "", sizes = "100vw", priority = false, natural = false, cycle = false } = o;
    const file = photo ? path.join(SRC, String(photo).replace(/^\/+/, "")) : "";
    let inner = "";
    let style = "";
    let attrs = "";
    if (file && fs.existsSync(file)) {
      const meta = await optimise(file);
      inner = Image.generateHTML(meta, {
        alt: alt || "",
        sizes,
        loading: priority ? "eager" : "lazy",
        decoding: "async",
        ...(priority ? { fetchpriority: "high" } : {}),
      });
      if (natural) {
        const m = meta.jpeg[0];
        style = ` style="aspect-ratio: ${m.width} / ${m.height}"`;
      }
    } else {
      if (cycle) {
        attrs = " data-cycle";
        inner = `<span class="ph__cap" data-cycle-label>${esc(cap)}</span>`;
      } else if (cap) {
        inner = `<span class="ph__cap">${esc(cap)}</span>`;
      }
    }
    return `<div class="ph ph--${esc(couleur)} ${esc(cls)}"${attrs}${style}>${inner}</div>`;
  });

  // Image de partage (réseaux sociaux) : 1200 px de large, générée une fois par build.
  eleventyConfig.on("eleventy.before", async () => {
    ogUrl = "";
    try {
      const site = JSON.parse(fs.readFileSync(path.join(SRC, "_data/site.json"), "utf8"));
      const file = site.image_partage ? path.join(SRC, site.image_partage.replace(/^\/+/, "")) : "";
      if (file && fs.existsSync(file)) {
        const meta = await Image(file, {
          widths: [1200], formats: ["jpeg"], outputDir: path.join(OUT, IMG_URL), urlPath: IMG_URL,
        });
        ogUrl = `${site.domaine}/${meta.jpeg[0].url}`;
      }
    } catch (e) {
      console.warn("[image de partage]", e.message);
    }
  });

  return {
    dir: { input: SRC, output: OUT, includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
