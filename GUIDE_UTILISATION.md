# Guide d'Utilisation - Site Web Recettes de Cuisine

## 🚀 Démarrage Rapide

### Option 1 : Ouvrir directement
1. Ouvrir `index.html` dans votre navigateur web
2. ⚠️ **Note** : Pour que le chargement des recettes fonctionne, vous devez utiliser un serveur local (voir Option 2)

### Option 2 : Utiliser un serveur local (Recommandé)

#### Avec Python :
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Avec Node.js :
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer le serveur
http-server -p 8000
```

#### Avec PHP :
```bash
php -S localhost:8000
```

#### Avec VS Code :
- Installer l'extension "Live Server"
- Clic droit sur `index.html` → "Open with Live Server"

Puis accéder à : `http://localhost:8000`

## 📱 Navigation du Site

### Page d'Accueil
- **Slider** : Diaporama automatique (change toutes les 5 secondes)
- **Recherche** : Tapez pour rechercher en temps réel
- **Catégories** : Cliquez sur une catégorie pour filtrer
- **Recettes Populaires** : Les 6 meilleures recettes

### Page Recettes
- **Filtres** : Utilisez les menus déroulants pour filtrer
- **Pagination** : Naviguez entre les pages de résultats
- **Clic sur une recette** : Accédez aux détails

### Page Détail
- **Notation** : Cliquez sur les étoiles pour noter (1-5)
- **Commentaires** : Ajoutez un commentaire avec votre nom
- **Partage** : Partagez sur les réseaux sociaux

### Page Ajouter Recette
- **Formulaire dynamique** : Ajoutez/supprimez ingrédients et étapes
- **Validation** : Le formulaire vérifie tous les champs
- **Confirmation** : Message de succès après soumission

### Page Contact
- **Formulaire** : Remplissez tous les champs requis
- **Validation email** : Vérification automatique du format

## 🎯 Fonctionnalités Clés

### Recherche Dynamique
- Recherche en temps réel pendant la saisie
- Recherche dans : nom, description, ingrédients, catégorie
- Résultats instantanés

### Filtrage Avancé
- **Catégorie** : Entrée, Plat, Dessert, Boisson
- **Difficulté** : Facile, Intermédiaire, Difficile
- **Temps** : Moins de 15min, 30min, 1h, Plus de 1h
- Filtres combinables

### Système de Notation
- Notez de 1 à 5 étoiles
- Note moyenne calculée automatiquement
- Stockage persistant (localStorage)

### Commentaires
- Ajoutez des commentaires avec votre nom
- Date automatique
- Stockage persistant

## 💾 Stockage des Données

Les données utilisateur sont stockées dans le **localStorage** du navigateur :
- Notes des recettes
- Commentaires
- Recettes ajoutées par l'utilisateur
- Messages de contact

⚠️ **Note** : Les données sont locales au navigateur. Pour un projet réel, utilisez un backend avec base de données.

## 🎨 Personnalisation

### Modifier les Couleurs
Éditez `styles/main.css` :
```css
:root {
    --primary-color: #ff6b6b;    /* Couleur principale */
    --secondary-color: #4ecdc4;  /* Couleur secondaire */
    --accent-color: #ffe66d;     /* Couleur d'accent */
}
```

### Ajouter des Recettes
1. Modifier `data/recipes.json`
2. Ou utiliser le formulaire "Ajouter une recette"

### Modifier les Animations
Les animations sont dans `styles/main.css` avec les `@keyframes`.

## 🐛 Dépannage

### Les recettes ne se chargent pas
- Utilisez un serveur local (voir Option 2 ci-dessus)
- Vérifiez que `data/recipes.json` existe

### Les images ne s'affichent pas
- Les images utilisent des placeholders
- Remplacez par de vraies images dans `images/`

### Le menu mobile ne fonctionne pas
- Vérifiez que `scripts/main.js` est chargé
- Ouvrez la console du navigateur pour voir les erreurs

## 📊 Structure des Données

### Format d'une Recette
```json
{
  "id": 1,
  "name": "Nom de la recette",
  "category": "plat",
  "difficulty": "facile",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "image": "url_de_l_image",
  "description": "Description",
  "ingredients": ["ingrédient 1", "ingrédient 2"],
  "steps": ["étape 1", "étape 2"],
  "rating": 4.5,
  "ratingCount": 24
}
```

## ✅ Checklist de Test

- [ ] Page d'accueil s'affiche correctement
- [ ] Slider fonctionne (automatique et manuel)
- [ ] Recherche en temps réel fonctionne
- [ ] Catégories redirigent vers la page recettes
- [ ] Filtres fonctionnent sur la page recettes
- [ ] Pagination fonctionne
- [ ] Page détail affiche toutes les informations
- [ ] Notation en étoiles fonctionne
- [ ] Commentaires peuvent être ajoutés
- [ ] Formulaire d'ajout de recette valide correctement
- [ ] Formulaire de contact valide correctement
- [ ] Site responsive sur mobile/tablette/desktop

## 📝 Notes Importantes

1. **CORS** : Pour charger `recipes.json`, utilisez un serveur local
2. **LocalStorage** : Les données sont stockées localement
3. **Images** : Utilisez de vraies images pour un projet final
4. **Backend** : Pour un projet réel, ajoutez un backend avec API

## 🎓 Points à Expliquer lors de l'Évaluation

1. **Structure HTML** : Pages sémantiques avec sections appropriées
2. **CSS Responsive** : Media queries et grid/flexbox
3. **JavaScript Modulaire** : Fichiers séparés par fonctionnalité
4. **LocalStorage** : Stockage des données utilisateur
5. **Animations CSS** : Keyframes et transitions
6. **Validation** : Vérification côté client des formulaires
7. **Accessibilité** : Focus visible, navigation clavier

---

**Bon développement ! 🚀**

