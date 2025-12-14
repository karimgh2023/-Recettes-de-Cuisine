// ============================================
// SEARCH.JS - Recherche dynamique en temps réel
// ============================================

let allRecipes = [];

// Initialiser la recherche
document.addEventListener('DOMContentLoaded', async function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const popularRecipesContainer = document.getElementById('popularRecipes');
    
    if (searchInput) {
        // Charger les recettes
        allRecipes = await loadRecipes();
        
        // Afficher les recettes populaires sur la page d'accueil
        if (popularRecipesContainer) {
            displayPopularRecipes();
        }
        
        // Recherche en temps réel
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length === 0) {
                searchResults.innerHTML = '';
                return;
            }
            
            const filteredRecipes = filterRecipes(query);
            displaySearchResults(filteredRecipes);
        });
    }
});

// Filtrer les recettes selon la recherche
function filterRecipes(query) {
    return allRecipes.filter(recipe => {
        // Recherche dans le nom
        if (recipe.name.toLowerCase().includes(query)) {
            return true;
        }
        
        // Recherche dans la description
        if (recipe.description && recipe.description.toLowerCase().includes(query)) {
            return true;
        }
        
        // Recherche dans les ingrédients
        if (recipe.ingredients.some(ing => ing.toLowerCase().includes(query))) {
            return true;
        }
        
        // Recherche dans la catégorie
        if (getCategoryName(recipe.category).toLowerCase().includes(query)) {
            return true;
        }
        
        return false;
    });
}

// Afficher les résultats de recherche
function displaySearchResults(recipes) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    if (recipes.length === 0) {
        searchResults.innerHTML = '<p class="no-results">Aucune recette trouvée.</p>';
        return;
    }
    
    searchResults.innerHTML = '';
    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        searchResults.appendChild(card);
    });
}

// Afficher les recettes populaires (les 6 premières)
function displayPopularRecipes() {
    const popularRecipesContainer = document.getElementById('popularRecipes');
    
    if (!popularRecipesContainer) return;
    
    // Trier par note décroissante
    const popularRecipes = [...allRecipes]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    
    popularRecipesContainer.innerHTML = '';
    popularRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        popularRecipesContainer.appendChild(card);
    });
}

// Gestion des catégories - redirection vers la page recettes avec filtre
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `recettes.html?category=${category}`;
        });
    });
});

