// ============================================
// MAIN.JS - Fonctions communes et utilitaires
// ============================================

// Charger les recettes depuis le fichier JSON + celles ajoutées par l'utilisateur (localStorage)
let recipes = [];

async function loadRecipes() {
    try {
        // Recettes de base depuis le fichier JSON
        const response = await fetch('data/recipes.json');
        const baseRecipes = await response.json();

        // Recettes ajoutées par l'utilisateur (stockées dans le navigateur)
        let userRecipes = [];
        try {
            userRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
        } catch (e) {
            console.warn('Impossible de lire les recettes utilisateur depuis localStorage:', e);
            userRecipes = [];
        }

        // Fusionner les deux listes
        recipes = [...baseRecipes, ...userRecipes];
        return recipes;
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        return [];
    }
}

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }

    // Fermer le menu mobile quand on clique sur un lien
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
        });
    });

    // Initialiser le slider d'images
    initSlider();
});

// Initialiser le slider d'images
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Fonction pour afficher une slide
    function showSlide(index) {
        // S'assurer que l'index est dans les limites
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // Déplacer le slider
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // Mettre à jour les dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Bouton précédent
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    // Bouton suivant
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    // Clic sur les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Diaporama automatique
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000); // Change toutes les 5 secondes
}

// Fonction pour créer une image placeholder avec CSS
function createPlaceholderImage(name) {
    const colors = [
        'linear-gradient(135deg, #ff6b6b, #ff8787)',
        'linear-gradient(135deg, #4ecdc4, #44a08d)',
        'linear-gradient(135deg, #ffe66d, #ffd93d)',
        'linear-gradient(135deg, #a8e6cf, #88d8a3)',
        'linear-gradient(135deg, #ffaaa5, #ff8b94)',
        'linear-gradient(135deg, #95e1d3, #fce38a)'
    ];
    const colorIndex = name.length % colors.length;
    return colors[colorIndex];
}

// Fonction pour créer une carte de recette
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.id = recipe.id;
    
    // Créer un placeholder d'image avec CSS si l'image n'est pas disponible
    const imageStyle = recipe.image && !recipe.image.includes('placeholder') 
        ? `background-image: url('${recipe.image}'); background-size: cover; background-position: center;`
        : `background: ${createPlaceholderImage(recipe.name)}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;`;
    
    card.innerHTML = `
        <div class="recipe-image" style="${imageStyle}">
            ${recipe.image && !recipe.image.includes('placeholder') ? '' : `<span>${recipe.name}</span>`}
        </div>
        <div class="recipe-card-content">
            <h3>${recipe.name}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.prepTime} min</span>
                <span>${getDifficultyIcon(recipe.difficulty)} ${recipe.difficulty}</span>
                <span>👥 ${recipe.servings} portions</span>
            </div>
            <p>${recipe.description || ''}</p>
            <a href="detail-recette.html?id=${recipe.id}" class="btn-primary">Voir la recette</a>
        </div>
    `;
    
    return card;
}

// Fonction pour obtenir l'icône de difficulté
function getDifficultyIcon(difficulty) {
    const icons = {
        'facile': '⭐',
        'intermediaire': '⭐⭐',
        'difficile': '⭐⭐⭐'
    };
    return icons[difficulty] || '⭐';
}

// Fonction pour obtenir le nom de catégorie en français
function getCategoryName(category) {
    const categories = {
        'entree': 'Entrée',
        'plat': 'Plat Principal',
        'dessert': 'Dessert',
        'boisson': 'Boisson'
    };
    return categories[category] || category;
}

// Fonction pour obtenir le nom de difficulté en français
function getDifficultyName(difficulty) {
    const difficulties = {
        'facile': 'Facile',
        'intermediaire': 'Intermédiaire',
        'difficile': 'Difficile'
    };
    return difficulties[difficulty] || difficulty;
}

// Fonction pour formater le temps
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadRecipes,
        createRecipeCard,
        getDifficultyIcon,
        getCategoryName,
        getDifficultyName,
        formatTime
    };
}

