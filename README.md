# Truffe de Wouf · site du studio photo canin (Millau)

Site vitrine statique généré avec [Eleventy](https://www.11ty.dev/). Le contenu (textes, photos, tarifs, avis) vit dans des fichiers de données que le client modifie lui-même via [Pages CMS](https://pagescms.org), sans toucher au code.

```sh
npm install
npm start        # serveur local avec rechargement : http://localhost:8080
npm run build    # génère le site dans _site/
```

Node 22 (voir `.nvmrc`).

## Comment ça marche

```
Client ──(Pages CMS)──▶ commit sur GitHub ──▶ Cloudflare Pages / Netlify ──▶ site mis à jour (1 à 2 min)
```

| Dossier / fichier | Rôle |
|---|---|
| `src/_data/*.json` | **Tout le contenu éditable** : `site` (coordonnées), `accueil`, `studio`, `galerie`, `reservation`, `avis`, `mentions`, `seo` |
| `src/*.njk` | Gabarits des pages (accueil, le studio, galerie, réservation, mentions légales, sitemap, robots, manifest) |
| `src/_includes/` | Mise en page commune (`layout.njk` : bandeau téléphone/adresse, menu, pied de page, JSON-LD), avis, appel à réserver |
| `src/assets/css/style.css`, `src/assets/js/main.js` | Design et comportements (menu mobile, filtres de galerie, visionneuse, formulaire) |
| `src/assets/img/uploads/` | Photos envoyées par le client |
| `.pages.yml` | Configuration de l'éditeur Pages CMS (formulaires en français) |
| `eleventy.config.js` | Optimisation des images, filtres, données structurées Google |
| `docs/GUIDE-CLIENT.md` | Mode d'emploi pour le client |

### Photos
Le client dépose ses photos telles quelles. Au build, chaque photo est convertie en WebP + JPEG à plusieurs largeurs (`srcset`), chargée en différé, avec le texte alternatif saisi dans l'éditeur. Un emplacement sans photo affiche un fond de studio coloré : le site n'a jamais de trou.

### Données structurées et SEO
Générées à partir des données, jamais écrites en dur :
- `LocalBusiness` (accueil) : téléphone, adresse, horaires, communes desservies, liens sociaux. La note (`aggregateRating`) n'est publiée que si le vrai nombre d'avis est renseigné.
- `BreadcrumbList` (pages intérieures) et `FAQPage` (réservation), cette dernière étant produite depuis la même liste que la FAQ affichée.
- `title`, description et canonical par page (titres et descriptions modifiables dans la rubrique « Référencement Google »), `sitemap.xml`, `robots.txt`, Open Graph.

Hors site, ce qui pèse le plus : fiche **Google Business Profile** (catégorie « Photographe animalier »), mêmes nom / adresse / téléphone partout, avis clients.

## Mise en ligne

1. **Fusionner la PR**, puis passer `main` en branche par défaut (Settings → Branches).
2. **Hébergement** (gratuit) : Cloudflare Pages ou Netlify, relié au dépôt.
   - Commande de build : `npm run build`
   - Dossier de sortie : `_site`
   - Variable `NODE_VERSION` = `22` si l'hébergeur ne lit pas `.node-version`.
3. **Nom de domaine** : le brancher sur l'hébergeur, puis renseigner l'adresse du site dans la rubrique « Coordonnées » (`domaine` dans `src/_data/site.json`).
4. **Éditeur du client** :
   - Le client crée un compte GitHub gratuit.
   - Inviter son compte sur le dépôt `Zediir-ht/truffedewouf` (Settings → Collaborators, accès en écriture).
   - Il se connecte sur https://app.pagescms.org avec GitHub et choisit le dépôt. Le menu de l'éditeur vient de `.pages.yml`.
   - Lui transmettre `docs/GUIDE-CLIENT.md`.

## Valeurs provisoires à remplacer (dans l'éditeur ou dans `src/_data/`)

| Valeur provisoire | Où |
|---|---|
| Téléphone et WhatsApp `00 00 00 00 00` | `site.json` |
| `Adresse à compléter` | `site.json` |
| Lien de la fiche Google (itinéraire et avis) | `site.json` → `lien_google` |
| Nom de domaine `www.truffedewouf.fr`, e-mail `contact@truffedewouf.fr`, horaires | `site.json` |
| Avis Google : 3 textes provisoires et note « 5,0 » fictive. Ne mettre que de vrais avis | `avis.json` |
| Offre « −20 % du mardi au jeudi » : exemple à remplacer ou à masquer | `accueil.json` → `promo` |
| Tarifs, acompte, délais, frais de déplacement, FAQ : propositions à valider | `reservation.json` |
| Bio du photographe (`[Prénom]`, `[X]`), accès et stationnement | `studio.json`, `accueil.json` |
| Photos (accueil, studio, galerie), image de partage | via l'éditeur |
| Mentions légales : SIRET, hébergeur, responsable | `mentions.json` |

## Limites connues
- Le formulaire de réservation ouvre un e-mail pré-rempli dans la messagerie du visiteur (pas d'envoi par serveur).
- La configuration `.pages.yml` a été écrite d'après la documentation de Pages CMS mais pas testée dans l'interface en ligne : faire un essai de connexion et d'enregistrement avant de la remettre au client.
- Les avis Google sont saisis à la main (pas d'import automatique).
