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
- Fond sable clair `#ecd7bf` (sections alternées en `#e0c09d`), texte noir : contrastes de 5,4:1 à 13,4:1 sur le texte courant.
- Le brun `#974922`, teinte du fond de studio de la photo du client, structure la page : boutons, bandeau des points forts, bandeau « Je réserve ma séance », formule mise en avant, bouton flottant. Le brun profond `#3b1c0f` remplace le noir pour le bandeau du haut et le pied de page.
- Vert `#016b2d` (fonds verts des photos de Gabriel), toujours avec du texte blanc, en touche de couleur : disque derrière la photo d'accueil, tampon rond « Truffe de Wouf · Studio photo · Aveyron » (rotation lente), en-têtes des pages intérieures (bandeau jaune avec disques vert et brun), relief coloré des photos de la galerie (jaune, vert, brun en alternance).
- Accueil : grande photo en arche à hauteur d'écran, puis bande de portraits défilante (figée si le visiteur a réduit les animations).
- Liens et numéros sur fond clair : brun foncé `#7d3a18` (le brun de marque y serait trop pâle pour être lu).
- Tons secondaires tirés de la même photo pour les emplacements photo vides (`caramel`, `sable`, `chocolat`, `miel`, `creme`, `noir`).
- Polices : Instrument Serif (titres, toujours en romain et en noir) et Inter Tight (texte), hébergées dans `src/assets/fonts/` (licence SIL OFL, aucun appel à Google, conforme RGPD).
- Ombres légères teintées de brun profond (jamais de noir pur), en trois niveaux (`--ombre-sm`, `--ombre-md`, `--ombre-lg`) : en-tête au défilement, boutons, photos, cartes, avis, tarifs, FAQ, bandeaux de couleur, champs du formulaire.
- Les couleurs sont des variables au début de `src/assets/css/style.css` (`:root` pour le clair, un second bloc pour les zones brunes).
- Logo : version foncée sur l'en-tête, version blanche sur le pied de page (`src/assets/img/logo-noir.png` et `logo-blanc.png`).
- Style arrondi et contrasté : étiquettes en pastilles (sans trait devant les titres), boutons en pilules sans flèche, photos en arche avec une ombre pleine jaune ou brune, blocs et bandeaux aux coins arrondis, chiffres dans des ronds. Jaune soleil `#ffd23f` (tiré des fonds jaunes des photos) très présent, toujours avec du texte noir : bandeau du haut, bandeau des points forts, grand bandeau « Je réserve », étiquettes, pastilles numérotées, bouton flottant, soulignement du menu. La section « Qui suis-je » / « Les portraits » est en brun plein. Le bouton de menu mobile est une patte de chien dans un rond (une croix quand le menu est ouvert).
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

## Formulaire, carte et page 404
- **Formulaire** : champs `form-name` et piège anti-robots (`bot-field`) déjà en place. Après le premier déploiement sur Netlify : Site configuration → Forms → Form notifications → Add notification → Email, avec l'adresse du studio. Les messages restent aussi consultables dans l'onglet Forms de Netlify.
- **Carte Google Maps** : remplacée par un encart qui ne charge Google qu'au clic sur « Afficher la carte » (aucun cookie avant). Textes modifiables dans la rubrique Contact. La carte s'affichera sur la vraie adresse une fois `Adresse à compléter` remplacée.
- **Page 404** : `src/404.njk`, publiée en `404.html` (Netlify et Cloudflare Pages l'utilisent automatiquement), `noindex`, absente du sitemap.

## Valeurs provisoires à remplacer (dans l'éditeur ou dans `src/_data/`)

| Valeur provisoire | Où |
|---|---|
| WhatsApp (vide pour l'instant : le numéro 07 48 17 13 05 est en place pour l'appel, à confirmer s'il est aussi sur WhatsApp) | `site.json` |
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
- Le formulaire envoie réellement la demande via Netlify Forms (gratuit jusqu'à 100 envois par mois). Cela ne fonctionne qu'une fois le site déployé sur Netlify : en local ou sur un autre hébergeur, le formulaire retombe sur l'e-mail pré-rempli. Pour un autre hébergeur, renseigner « Adresse d'envoi externe » (et la clé) dans l'éditeur, rubrique Contact (Web3Forms, Formspree…).
- La configuration `.pages.yml` a été écrite d'après la documentation de Pages CMS mais pas testée dans l'interface en ligne : faire un essai de connexion et d'enregistrement avant de la remettre au client.
- Les avis Google sont saisis à la main (pas d'import automatique).
