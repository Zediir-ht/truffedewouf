# Truffe de Wouf · site du studio photo pour animaux (Canet-de-Salars, Aveyron)

Site vitrine du studio de Gabriel Salasc, généré avec [Eleventy](https://www.11ty.dev/). Le contenu (textes, photos, tarifs, avis) vit dans des fichiers de données que le client modifie lui-même via [Pages CMS](https://pagescms.org), sans toucher au code.

```sh
npm install
npm start        # serveur local avec rechargement : http://localhost:8080
npm run build    # génère le site dans _site/
```

Node 22 (voir `.nvmrc`).

## Comment ça marche

```
Client ──(Pages CMS)──▶ commit sur GitHub ──▶ Netlify / Cloudflare Pages ──▶ site mis à jour (1 à 2 min)
```

| Dossier / fichier | Rôle |
|---|---|
| `src/_data/*.json` | **Tout le contenu éditable** : `site` (coordonnées), `accueil`, `studio`, `seances`, `galerie`, `contact`, `avis`, `cgv`, `confidentialite`, `mentions`, `seo` |
| `src/*.njk` | Pages : accueil, le studio, les séances, galerie, contact, CGV, confidentialité, mentions légales (+ sitemap, robots, manifest, `_redirects`) |
| `src/_includes/` | Mise en page commune (`layout.njk` : bandeau téléphone/adresse, logo + accroche, menu, pied de page, bouton « Je réserve ma séance », JSON-LD), avis, bloc de réservation, pages légales |
| `src/assets/css/style.css`, `src/assets/js/main.js` | Design et comportements (menu mobile, filtres de galerie, visionneuse, formulaire) |
| `src/assets/img/logo-blanc.png`, `logo-noir.png` | Logo du client (calligraphie), versions blanche (utilisée sur le fond brun) et noire |
| `src/assets/img/uploads/` | Photos du client |
| `.pages.yml` | Configuration de l'éditeur Pages CMS (formulaires en français) |
| `eleventy.config.js` | Optimisation des images et du logo, filtres, données structurées Google |
| `docs/GUIDE-CLIENT.md` | Mode d'emploi pour le client |

### Design
- Fond `#974922` : la teinte la plus foncée du fond de studio de la photo fournie par le client. Texte en blanc (contraste 6,1:1), encadrés en blanc ou en noir, comme demandé.
- Tons secondaires tirés de la même photo pour les emplacements photo vides (`caramel`, `sable`, `chocolat`, `miel`, `creme`, `noir`).
- Polices : Instrument Serif (titres) et Inter Tight (texte).
- Bouton « Je réserve ma séance » fixe sur toutes les pages sauf Contact (barre en bas d'écran sur mobile, avec le téléphone).

### Photos
26 photos de Gabriel (portfolio fourni par WeTransfer) sont déjà en place : galerie, accueil, séances et page Le Studio. Elles ont été réduites à 2400 px maximum et leurs métadonnées (EXIF) retirées avant d'être ajoutées au dépôt. Le client dépose ses prochaines photos telles quelles. Au build, chaque photo est convertie en WebP + JPEG à plusieurs largeurs (`srcset`), chargée en différé, avec le texte alternatif saisi dans l'éditeur. Un emplacement sans photo affiche un fond coloré : le site n'a jamais de trou.

### Données structurées et SEO
Générées à partir des données, jamais écrites en dur :
- `LocalBusiness` (accueil) : téléphone, adresse à Canet-de-Salars, coordonnées GPS, communes desservies, liens sociaux. Horaires et note (`aggregateRating`) publiés seulement s'ils sont renseignés.
- `BreadcrumbList` (pages intérieures) et `FAQPage` (les séances), cette dernière produite depuis la même liste que la FAQ affichée.
- `title`, description et canonical par page, `sitemap.xml`, `robots.txt`, Open Graph (image : la photo du client). Pages légales en `noindex`.
- Ancienne URL `reservation.html` redirigée vers `seances.html` (`_redirects`, lu par Netlify et Cloudflare Pages).

Hors site, ce qui pèse le plus : fiche **Google Business Profile** (catégorie « Photographe animalier »), mêmes nom / adresse / téléphone partout, avis clients.

## Mise en ligne

1. **Fusionner la PR**, puis passer `main` en branche par défaut (Settings → Branches).
2. **Hébergement** (gratuit) : Netlify (fichier `netlify.toml` prêt) ou Cloudflare Pages, relié au dépôt.
   - Commande de build : `npm run build`
   - Dossier de sortie : `_site`
   - Variable `NODE_VERSION` = `22` si l'hébergeur ne lit pas `.node-version`.
3. **Nom de domaine** : le brancher sur l'hébergeur, puis renseigner l'adresse du site dans la rubrique « Coordonnées » (`domaine` dans `src/_data/site.json`).
4. **Adresse e-mail du studio** (question du client) :
   - Gratuit, réception seulement : rediriger `contact@<domaine>` vers son Gmail (par ex. Cloudflare Email Routing ou la redirection proposée par le registrar).
   - Pour aussi envoyer avec cette adresse : une boîte mail chez le registrar (quelques euros par mois), à brancher dans Gmail (« Envoyer des e-mails en tant que »).
5. **Éditeur du client** :
   - Le client crée un compte GitHub gratuit.
   - Inviter son compte sur le dépôt `Zediir-ht/truffedewouf` (Settings → Collaborators, accès en écriture).
   - Il se connecte sur https://app.pagescms.org avec GitHub et choisit le dépôt. Le menu de l'éditeur vient de `.pages.yml`.
   - Lui transmettre `docs/GUIDE-CLIENT.md`.

## Valeurs provisoires à remplacer (dans l'éditeur ou dans `src/_data/`)

| Valeur provisoire | Où |
|---|---|
| Téléphone `00 00 00 00 00` (et WhatsApp, vide pour l'instant) | `site.json` |
| `Adresse à compléter` (rue du studio à Canet-de-Salars) | `site.json` |
| Coordonnées GPS (approximatives, centre de Canet-de-Salars) | `site.json` → `latitude`, `longitude` |
| E-mail `contact@truffedewouf.fr` : n'existe pas encore, voir « Adresse e-mail du studio » | `site.json` |
| Lien de la fiche Google, nom de domaine | `site.json` |
| Tarifs (« Tarif à venir »), nombre de photos remises, zone de déplacement, délai de remise | `seances.json` |
| Avis : 3 textes provisoires. Ne mettre que de vrais avis Google | `avis.json` |
| Bio du photographe (`[À compléter…]`), accès et stationnement | `studio.json`, `contact.json` |
| CGV, confidentialité, mentions légales : passages entre crochets, à faire valider | `cgv.json`, `confidentialite.json`, `mentions.json` |
| Photos manquantes (fonds colorés affichés à la place) : portrait du photographe, photo du studio « Qui suis-je », séance à domicile, animations et événements | via l'éditeur |

## Limites connues
- Le formulaire de contact ouvre un e-mail pré-rempli dans la messagerie du visiteur (pas d'envoi par serveur), choix validé.
- La configuration `.pages.yml` a été écrite d'après la documentation de Pages CMS mais pas testée dans l'interface en ligne : faire un essai de connexion et d'enregistrement avant de la remettre au client.
- Les avis Google sont saisis à la main (pas d'import automatique).
