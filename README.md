# Truffe de Wouf · site du studio photo canin (Millau)

Site vitrine statique (HTML, CSS, JS), sans dépendance ni étape de build. Pour le voir en local :

```sh
python3 -m http.server 8000
```

## Pages
| Page | Fichier | Requête visée |
|---|---|---|
| Accueil | `index.html` | studio photo canin Millau, photographe chien Millau |
| Le studio | `le-studio.html` | studio photo chien Aveyron, séance photo extérieur Larzac |
| Galerie | `galerie.html` | photos de chiens Millau (filtres + visionneuse) |
| Tarifs & réservation | `reservation.html` | tarif séance photo chien Millau |
| Mentions légales | `mentions-legales.html` | (non indexée) |

L'en-tête (bandeau téléphone + adresse, menu) et le pied de page sont identiques sur chaque page : une modification doit être reportée dans tous les fichiers.

## Design
- Polices : Instrument Serif (titres) et Inter Tight (texte), via Google Fonts.
- Palette dans `:root` de `assets/css/style.css` : papier, encre, et six couleurs de fonds de studio (tomate, cobalt, safran, fuchsia, émeraude, lilas).
- Les emplacements photo (`.ph`) affichent un fond de studio coloré en attendant les vraies photos. Pour mettre une photo :
  ```html
  <div class="ph ph--cobalt"><img src="assets/img/galerie/pepite.webp" alt="Pépite, golden retriever, portrait studio fond cobalt à Millau" loading="lazy"></div>
  ```
  Utiliser du WebP (~1600 px de large maxi) et un `alt` descriptif avec la ville : c'est aussi du référencement.

## Référencement local
- Title, description, H1 et canonical propres à chaque page.
- JSON-LD : `LocalBusiness` (accueil), `BreadcrumbList` (pages intérieures), `FAQPage` (réservation, identique à la FAQ visible).
- Contenu local : communes desservies, lieux de séance autour de Millau.
- Hors site, et c'est ce qui pèse le plus : **fiche Google Business Profile** (catégorie « Photographe animalier »), même nom, adresse et téléphone partout, avis clients.

## À compléter avant la mise en ligne
Rechercher-remplacer dans tous les fichiers HTML :

| Valeur provisoire | À remplacer par |
|---|---|
| `00 00 00 00 00` et `+33000000000` | le numéro du studio |
| `Adresse à compléter` | la rue du studio |
| `https://www.google.com/maps/search/?api=1&query=Truffe+de+Wouf+Millau` | le lien de la fiche Google (itinéraire et avis) |
| `www.truffedewouf.fr` | le vrai domaine (aussi dans `robots.txt` et `sitemap.xml`) |
| `contact@truffedewouf.fr` | l'e-mail réel (aussi `CONTACT_EMAIL` dans `assets/js/main.js`) |
| `Du mardi au samedi, sur rendez-vous` | les horaires réels (aussi `openingHoursSpecification` dans le JSON-LD de `index.html`) |

Et aussi :
- **Avis Google** (accueil) : coller 3 vrais avis et la vraie note moyenne. Ne jamais inventer d'avis.
- **Tarifs et conditions** (`reservation.html`) : prix, acompte, délais et frais de déplacement sont des propositions à valider.
- **Bio du photographe** (`le-studio.html`) : texte entre crochets à réécrire.
- **Photos** : héro, mosaïque, galerie, studio, portrait.
- **Image de partage** `assets/img/og-image.jpg` (1200 × 630).
- **Mentions légales** : SIRET, hébergeur, responsable.
