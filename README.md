# Test CloudCannon — maquette de site de collectivité

Site statique rendu modifiable par une équipe non technique depuis l'éditeur
visuel de CloudCannon.

## Ce qui est modifiable

| Zone | Où | Type CloudCannon |
|---|---|---|
| Titre principal | haut de la page d'accueil | `text` |
| Paragraphe d'introduction | sous le titre | `text` (riche) |
| Horaires, 3 lignes | tuile « Centre aquatique » | `array` + `array-item` |
| Image du haut de page | l'arche, à droite du titre | `image` |
| Image de la grille | tuile photo des démarches | `image` |
| 3 cartes d'actualités | section Actualités | `array` + `array-item`, avec ajout, suppression et glisser-déposer |

Le menu, le pied de page, l'agenda, la carte du territoire et toute la
structure ne portent aucun attribut `data-editable` : ils sont donc
invisibles pour l'éditeur et ne peuvent pas être cassés.

## Réglages de build dans CloudCannon

| Champ | Valeur |
|---|---|
| Install command | `npm install` |
| Build command | `npx @11ty/eleventy` |
| Output path | `_site` |
| Node version | 20 (fichier `.nvmrc`) |

Rien à lancer à la main : CloudCannon construit le site à chaque
enregistrement et à chaque commit.

## Organisation des fichiers

```
cloudcannon.config.yaml   réglages CloudCannon (champs, libellés, structures)
eleventy.config.js        build Eleventy (copie des fichiers + 2 filtres de date)
package.json              une seule dépendance : @11ty/eleventy
src/index.njk             la page ; son front matter contient tout le contenu
src/css/style.css         feuille de style
src/js/main.js            JavaScript natif, sans dépendance
src/images/               photos et logos
src/fonts/                Jost, auto-hébergée
_site/                    sortie du build (non versionnée)
```

## En local

```bash
npm install
npm start      # http://localhost:8080
```

## Origine

Reprise de `proposition-tdm.html`, une maquette d'une seule page où les
images, les polices, le CSS et le JS étaient intégrés en base64 ou en ligne
(688 Ko). Tout a été extrait en fichiers séparés ; le HTML fait désormais
63 Ko.
