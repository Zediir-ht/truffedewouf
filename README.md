# Truffe de Wouf : site du studio photo canin (Millau)

Site vitrine statique (HTML, CSS, JS, sans dépendance ni build). Ouvrir `index.html` ou servir le dossier :

```sh
python3 -m http.server 8000
```

## Structure
- `index.html` : page unique (héro, séances, zone Millau / sud Aveyron, déroulé, FAQ, contact)
- `assets/css/style.css` : styles (palette dans `:root`)
- `assets/js/main.js` : menu mobile, apparitions au scroll, formulaire (ouvre un e-mail pré-rempli)
- `mentions-legales.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Référencement local (Millau)
- `<title>`, meta description, H1 et H2 ciblent « studio photo canin / photographe chien Millau ».
- Données structurées JSON-LD : `LocalBusiness` (adresse Millau, coordonnées GPS, zone desservie) et `FAQPage` (doit rester identique à la FAQ visible).
- Contenu local : Larzac, Gorges du Tarn et de la Dourbie, Viaduc, communes voisines.
- À faire hors site, et c'est ce qui pèse le plus : **fiche Google Business Profile** (catégorie « Photographe animalier »), même nom / adresse / téléphone partout (Pages Jaunes, Facebook, Instagram), avis clients.

## À compléter avant la mise en ligne
| Quoi | Où |
|---|---|
| Nom de domaine (actuellement `www.truffedewouf.fr`) | `index.html` (canonical, og:*, JSON-LD), `robots.txt`, `sitemap.xml`, `mentions-legales.html` |
| E-mail de contact (actuellement `contact@truffedewouf.fr`) | `index.html`, `assets/js/main.js` (`CONTACT_EMAIL`), mentions légales |
| Adresse, téléphone, horaires, Instagram | JSON-LD `LocalBusiness` (`streetAddress`, `telephone`, `openingHoursSpecification`, `sameAs`) |
| Vraies photos du héro | remplacer les `<svg class="frame__dog">` par des `<img>` (WebP, ~600×750) |
| Image de partage `assets/img/og-image.jpg` (1200×630) | à créer |
| Durées et délais annoncés dans la FAQ | à valider avec le studio |
| Mentions légales | `mentions-legales.html` |
