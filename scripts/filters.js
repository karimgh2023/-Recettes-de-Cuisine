// ============================================
// FILTERS.JS - Filtrage dynamique et pagination
// ============================================

let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 6;

// Initialiser les filtres
document.addEventListener('DOMContentLoaded', async function() {
    allRecipes = await loadRecipes();
    filteredRecipes = [...allRecipes];
    
    // Vérifier si un filtre de catégorie est passé dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        document.getElementById('categoryFilter').value = categoryParam;
    }
    
    // Appliquer les filtres initiaux
    applyFilters();
    
    // Écouter les changements de filtres
    const filters = ['categoryFilter', 'difficultyFilter', 'timeFilter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
    
    // Bouton réinitialiser
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
});

// Appliquer tous les filtres
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    const time = document.getElementById('timeFilter').value;
    
    filteredRecipes = allRecipes.filter(recipe => {
        // Filtre par catégorie
        if (category !== 'all' && recipe.category !== category) {
            return false;
        }
        
        // Filtre par difficulté
        if (difficulty !== 'all' && recipe.difficulty !== difficulty) {
            return false;
        }
        
        // Filtre par temps
        if (time !== 'all') {
            const totalTime = recipe.prepTime + (recipe.cookTime || 0);
            if (time === '15' && totalTime >= 15) return false;
            if (time === '30' && totalTime >= 30) return false;
            if (time === '60' && totalTime >= 60) return false;
            if (time === '60+' && totalTime < 60) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    displayRecipes();
    displayPagination();
}

// Réinitialiser tous les filtres
function resetFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('difficultyFilter').value = 'all';
    document.getElementById('timeFilter').value = 'all';
    applyFilters();
}

// Afficher les recettes avec pagination
function displayRecipes() {
    const container = document.getElementById('recipesContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (filteredRecipes.length === 0) {
        container.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // Calculer les recettes à afficher pour la page actuelle
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToShow = filteredRecipes.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    recipesToShow.forEach(recipe => {
        const card = createRecipeCard(recipe);
        container.appendChild(card);
    });
}

// Afficher la pagination
function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Bouton précédent
    if (currentPage > 1) {
        paginationHTML += `<button onclick="goToPage(${currentPage - 1})">‹ Précédent</button>`;
    }
    
    // Numéros de page
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    // Bouton suivant
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="goToPage(${currentPage + 1})">Suivant ›</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Aller à une page spécifique
function goToPage(page) {
    currentPage = page;
    displayRecipes();
    displayPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exposer la fonction globalement
window.goToPage = goToPage;

