// ============================================
// VALIDATION.JS - Validation des formulaires
// ============================================

// Initialiser la validation pour le formulaire d'ajout de recette
document.addEventListener('DOMContentLoaded', function() {
    const addRecipeForm = document.getElementById('addRecipeForm');
    const contactForm = document.getElementById('contactForm');
    
    if (addRecipeForm) {
        initAddRecipeForm();
    }
    
    if (contactForm) {
        initContactForm();
    }
});

// ============================================
// FORMULAIRE D'AJOUT DE RECETTE
// ============================================

function initAddRecipeForm() {
    const form = document.getElementById('addRecipeForm');
    const addIngredientBtn = document.getElementById('addIngredient');
    const addStepBtn = document.getElementById('addStep');
    
    // Ajouter un ingrédient
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', addIngredientField);
    }
    
    // Ajouter une étape
    if (addStepBtn) {
        addStepBtn.addEventListener('click', addStepField);
    }
    
    // Gérer la suppression d'ingrédients et d'étapes
    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove-ingredient')) {
            removeIngredientField(e.target);
        }
        if (e.target.classList.contains('btn-remove-step')) {
            removeStepField(e.target);
        }
    });
    
    // Validation à la soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateAddRecipeForm()) {
            submitRecipe();
        }
    });
    
    // Validation en temps réel
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Ajouter un champ ingrédient
function addIngredientField() {
    const container = document.getElementById('ingredientsList');
    const item = document.createElement('div');
    item.className = 'ingredient-item';
    item.innerHTML = `
        <input type="text" class="ingredient-input" placeholder="Ex: 200g de farine">
        <button type="button" class="btn-remove-ingredient">✕</button>
    `;
    container.appendChild(item);
}

// Supprimer un champ ingrédient
function removeIngredientField(button) {
    const container = document.getElementById('ingredientsList');
    if (container.children.length > 1) {
        button.closest('.ingredient-item').remove();
    } else {
        showFieldError(button, 'Au moins un ingrédient est requis.');
    }
}

// Ajouter un champ étape
function addStepField() {
    const container = document.getElementById('stepsList');
    const stepNumber = container.children.length + 1;
    const item = document.createElement('div');
    item.className = 'step-item';
    item.innerHTML = `
        <label>Étape ${stepNumber}:</label>
        <textarea class="step-input" rows="3" placeholder="Décrivez l'étape de préparation..."></textarea>
        <button type="button" class="btn-remove-step">✕</button>
    `;
    container.appendChild(item);
}

// Supprimer un champ étape
function removeStepField(button) {
    const container = document.getElementById('stepsList');
    if (container.children.length > 1) {
        button.closest('.step-item').remove();
        // Renuméroter les étapes
        renumberSteps();
    } else {
        showFieldError(button, 'Au moins une étape est requise.');
    }
}

// Renuméroter les étapes
function renumberSteps() {
    const steps = document.querySelectorAll('.step-item');
    steps.forEach((step, index) => {
        const label = step.querySelector('label');
        if (label) {
            label.textContent = `Étape ${index + 1}:`;
        }
    });
}

// Valider le formulaire d'ajout de recette
function validateAddRecipeForm() {
    let isValid = true;
    
    // Valider les champs requis
    const requiredFields = [
        'recipeName',
        'recipeCategory',
        'recipeDifficulty',
        'prepTime',
        'servings'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Valider les ingrédients
    const ingredients = getIngredients();
    if (ingredients.length === 0) {
        showFieldError(document.getElementById('ingredientsError'), 'Au moins un ingrédient est requis.');
        isValid = false;
    } else {
        clearFieldError(document.getElementById('ingredientsError'));
    }
    
    // Valider les étapes
    const steps = getSteps();
    if (steps.length === 0) {
        showFieldError(document.getElementById('stepsError'), 'Au moins une étape est requise.');
        isValid = false;
    } else {
        clearFieldError(document.getElementById('stepsError'));
    }
    
    return isValid;
}

// Obtenir les ingrédients
function getIngredients() {
    const inputs = document.querySelectorAll('.ingredient-input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(ing => ing.length > 0);
}

// Obtenir les étapes
function getSteps() {
    const inputs = document.querySelectorAll('.step-input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(step => step.length > 0);
}

// Valider un champ
function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message') || 
                        field.nextElementSibling;
    
    // Vérifier si le champ est requis
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Ce champ est requis.');
        return false;
    }
    
    // Validation spécifique selon le type
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Veuillez entrer une adresse email valide.');
        return false;
    }
    
    if (field.type === 'number' && value) {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            showFieldError(field, 'Veuillez entrer un nombre valide supérieur à 0.');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// Afficher une erreur de champ
function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.style.borderColor = '#ff6b6b';
}

// Effacer l'erreur d'un champ
function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.style.borderColor = '';
}

// Soumettre la recette
function submitRecipe() {
    const recipe = {
        id: Date.now(),
        name: document.getElementById('recipeName').value.trim(),
        category: document.getElementById('recipeCategory').value,
        difficulty: document.getElementById('recipeDifficulty').value,
        prepTime: parseInt(document.getElementById('prepTime').value),
        cookTime: parseInt(document.getElementById('cookTime').value) || 0,
        servings: parseInt(document.getElementById('servings').value),
        description: document.getElementById('recipeDescription').value.trim(),
        ingredients: getIngredients(),
        steps: getSteps(),
        image: '', // Pas d'image par défaut, le placeholder CSS sera utilisé
        rating: 0,
        ratingCount: 0
    };
    
    // Sauvegarder dans localStorage (simulation)
    let savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    savedRecipes.push(recipe);
    localStorage.setItem('userRecipes', JSON.stringify(savedRecipes));
    
    // Afficher le message de succès
    const form = document.getElementById('addRecipeForm');
    const successMessage = document.getElementById('successMessage');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

// ============================================
// FORMULAIRE DE CONTACT
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    // Validation à la soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateContactForm()) {
            submitContact();
        }
    });
    
    // Validation en temps réel
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Valider le formulaire de contact
function validateContactForm() {
    let isValid = true;
    
    const fields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Soumettre le formulaire de contact
function submitContact() {
    const contactData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        date: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage (simulation)
    let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Afficher le message de succès
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccessMessage');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

// Valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

