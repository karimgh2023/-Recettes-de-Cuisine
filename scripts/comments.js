// ============================================
// COMMENTS.JS - Système de commentaires et notation
// ============================================

let currentRecipe = null;
let ratings = [];
let comments = [];

// Initialiser la page de détail
document.addEventListener('DOMContentLoaded', async function() {
    // Récupérer l'ID de la recette depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    if (!recipeId) {
        document.getElementById('recipeDetail').innerHTML = '<p>Recette non trouvée.</p>';
        return;
    }
    
    // Charger les recettes
    const recipes = await loadRecipes();
    currentRecipe = recipes.find(r => r.id === recipeId);
    
    if (!currentRecipe) {
        document.getElementById('recipeDetail').innerHTML = '<p>Recette non trouvée.</p>';
        return;
    }
    
    // Charger les données depuis localStorage
    loadRatingsAndComments();
    
    // Afficher la recette
    displayRecipeDetail();
    
    // Initialiser les étoiles
    initStarRating();
    
    // Initialiser le formulaire de commentaires
    initCommentForm();
    
    // Initialiser les boutons de partage
    initShareButtons();
});

// Charger les notes et commentaires depuis localStorage
function loadRatingsAndComments() {
    const storedRatings = localStorage.getItem(`ratings_${currentRecipe.id}`);
    const storedComments = localStorage.getItem(`comments_${currentRecipe.id}`);
    
    if (storedRatings) {
        ratings = JSON.parse(storedRatings);
    }
    
    if (storedComments) {
        comments = JSON.parse(storedComments);
    }
}

// Fonction pour créer une image placeholder avec CSS (identique à main.js)
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

// Afficher le détail de la recette
function displayRecipeDetail() {
    const container = document.getElementById('recipeDetail');
    
    const totalTime = currentRecipe.prepTime + (currentRecipe.cookTime || 0);
    const averageRating = calculateAverageRating();
    
    // Créer un placeholder d'image avec CSS si l'image n'est pas disponible
    const hasValidImage = currentRecipe.image && !currentRecipe.image.includes('placeholder');
    const imageStyle = hasValidImage
        ? `background-image: url('${currentRecipe.image}'); background-size: cover; background-position: center;`
        : `background: ${createPlaceholderImage(currentRecipe.name)}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem; min-height: 400px;`;
    
    container.innerHTML = `
        <div class="recipe-detail-header">
            <h2>${currentRecipe.name}</h2>
            <div class="recipe-detail-meta">
                <span>📁 ${getCategoryName(currentRecipe.category)}</span>
                <span>${getDifficultyIcon(currentRecipe.difficulty)} ${getDifficultyName(currentRecipe.difficulty)}</span>
                <span>⏱️ Préparation: ${currentRecipe.prepTime} min</span>
                ${currentRecipe.cookTime ? `<span>🔥 Cuisson: ${currentRecipe.cookTime} min</span>` : ''}
                <span>⏱️ Total: ${formatTime(totalTime)}</span>
                <span>👥 ${currentRecipe.servings} portions</span>
            </div>
        </div>
        
        <div class="recipe-detail-image" style="${imageStyle}">
            ${hasValidImage ? '' : `<span>${currentRecipe.name}</span>`}
        </div>
        
        ${currentRecipe.description ? `<p class="recipe-description">${currentRecipe.description}</p>` : ''}
        
        <div class="recipe-section">
            <h3>Ingrédients</h3>
            <ul class="ingredients-list">
                ${currentRecipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        
        <div class="recipe-section">
            <h3>Étapes de Préparation</h3>
            <ol class="steps-list">
                ${currentRecipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    // Mettre à jour l'affichage de la note moyenne
    updateRatingDisplay(averageRating);
}

// Initialiser le système de notation en étoiles
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = index + 1;
            addRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
    });
    
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const averageRating = calculateAverageRating();
        highlightStars(Math.round(averageRating));
    });
}

// Surligner les étoiles
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Ajouter une note
function addRating(rating) {
    ratings.push({
        rating: rating,
        date: new Date().toISOString()
    });
    
    localStorage.setItem(`ratings_${currentRecipe.id}`, JSON.stringify(ratings));
    
    const averageRating = calculateAverageRating();
    updateRatingDisplay(averageRating);
    highlightStars(rating);
    
    // Afficher un message de confirmation
    showNotification('Merci pour votre note !', 'success');
}

// Calculer la note moyenne
function calculateAverageRating() {
    if (ratings.length === 0) {
        return currentRecipe.rating || 0;
    }
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / ratings.length;
    
    // Combiner avec la note initiale de la recette
    const initialRating = currentRecipe.rating || 0;
    const initialCount = currentRecipe.ratingCount || 0;
    const totalSum = (initialRating * initialCount) + sum;
    const totalCount = initialCount + ratings.length;
    
    return totalCount > 0 ? totalSum / totalCount : 0;
}

// Mettre à jour l'affichage de la note
function updateRatingDisplay(averageRating) {
    const averageRatingEl = document.getElementById('averageRating');
    const ratingCountEl = document.getElementById('ratingCount');
    
    if (averageRatingEl) {
        averageRatingEl.textContent = averageRating.toFixed(1);
    }
    
    if (ratingCountEl) {
        const totalCount = (currentRecipe.ratingCount || 0) + ratings.length;
        ratingCountEl.textContent = totalCount;
    }
    
    // Surligner les étoiles selon la moyenne
    highlightStars(Math.round(averageRating));
}

// Initialiser le formulaire de commentaires
function initCommentForm() {
    const form = document.getElementById('commentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addComment();
        });
    }
    
    displayComments();
}

// Ajouter un commentaire
function addComment() {
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    
    if (!name || !text) {
        showNotification('Veuillez remplir tous les champs.', 'error');
        return;
    }
    
    const comment = {
        id: Date.now(),
        name: name,
        text: text,
        date: new Date().toISOString()
    };
    
    comments.push(comment);
    localStorage.setItem(`comments_${currentRecipe.id}`, JSON.stringify(comments));
    
    // Réinitialiser le formulaire
    document.getElementById('commentForm').reset();
    
    // Afficher les commentaires
    displayComments();
    
    showNotification('Commentaire ajouté avec succès !', 'success');
}

// Afficher les commentaires
function displayComments() {
    const container = document.getElementById('commentsList');
    
    if (!container) return;
    
    if (comments.length === 0) {
        container.innerHTML = '<p>Aucun commentaire pour le moment. Soyez le premier à commenter !</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => {
        const date = new Date(comment.date).toLocaleDateString('fr-FR');
        return `
            <div class="comment-item">
                <div class="comment-author">${comment.name}</div>
                <div class="comment-date">${date}</div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    }).join('');
}

// Initialiser les boutons de partage
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            shareRecipe(platform);
        });
    });
}

// Partager la recette
function shareRecipe(platform) {
    const url = window.location.href;
    const title = currentRecipe.name;
    const text = `Découvrez cette délicieuse recette: ${title}`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showNotification('Partage en cours...', 'success');
    }
}

// Afficher une notification
function showNotification(message, type) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#00b894' : '#d63031'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

