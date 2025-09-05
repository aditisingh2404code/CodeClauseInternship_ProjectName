let recipes = [];

const recipeGrid = document.getElementById("recipeGrid");
const addRecipeBtn = document.getElementById("addRecipeBtn");
const recipeModal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const recipeForm = document.getElementById("recipeForm");
const searchInput = document.getElementById("searchInput");

const viewModal = document.getElementById("viewModal");
const closeView = document.getElementById("closeView");

// ============================
// Local Storage
// ============================
function loadRecipes() {
  const data = localStorage.getItem("recipes");
  if (data) {
    recipes = JSON.parse(data);
  } else {
    recipes = [
      {
        title: "Classic Pancakes",
        description: "Fluffy homemade pancakes with butter and maple syrup.",
        ingredients: ["2 cups flour", "2 tbsp sugar", "2 eggs", "1 cup milk"],
        instructions: [
          "Mix flour, sugar, eggs, and milk in a bowl.",
          "Whisk until smooth.",
          "Heat a pan and pour batter.",
          "Flip when bubbles form.",
          "Serve with butter and maple syrup."
        ],
        image: "https://images.unsplash.com/photo-1587732405302-6907b9d02b4a?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Veggie Pasta",
        description: "Creamy pasta with fresh vegetables and tomato sauce.",
        ingredients: ["200g pasta", "1 cup broccoli", "1 bell pepper", "Tomato sauce"],
        instructions: [
          "Boil pasta until al dente.",
          "Saute vegetables in olive oil.",
          "Add tomato sauce and simmer.",
          "Mix pasta with sauce and serve."
        ],
        image: "https://images.unsplash.com/photo-1601924638867-3ec3c8c6c7ad?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Mango Smoothie",
        description: "Refreshing mango smoothie with yogurt and honey.",
        ingredients: ["1 ripe mango", "1 cup yogurt", "1 tbsp honey", "Ice cubes"],
        instructions: [
          "Peel and chop mango.",
          "Blend mango, yogurt, honey, and ice.",
          "Blend until smooth and creamy.",
          "Serve chilled."
        ],
        image: "https://images.unsplash.com/photo-1623428450742-98ec605f8d5f?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Grilled Chicken",
        description: "Juicy grilled chicken breast with herbs and spices.",
        ingredients: ["2 chicken breasts", "1 tbsp olive oil", "Garlic", "Mixed herbs"],
        instructions: [
          "Marinate chicken with oil, garlic, and herbs.",
          "Preheat grill to medium heat.",
          "Grill chicken for 6-7 minutes each side.",
          "Serve hot with salad."
        ],
        image: "https://images.unsplash.com/photo-1604908177522-040d50b2a4d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Chocolate Brownies",
        description: "Rich, fudgy chocolate brownies for dessert lovers.",
        ingredients: ["1 cup butter", "2 cups sugar", "1 cup cocoa", "3 eggs", "1 cup flour"],
        instructions: [
          "Melt butter and mix with sugar and cocoa.",
          "Add eggs one by one and mix.",
          "Fold in flour until combined.",
          "Bake at 180°C for 25 minutes.",
          "Cool and cut into squares."
        ],
        image: "https://images.unsplash.com/photo-1606312619070-1a31d08b5d5f?auto=format&fit=crop&w=800&q=80"
      }
    ];
    saveRecipes();
  }
}

function saveRecipes() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// ============================
// Render Recipes
// ============================
function renderRecipes(list = recipes) {
  recipeGrid.innerHTML = "";
  if (list.length === 0) {
    recipeGrid.innerHTML = "<p>No recipes found. Add some!</p>";
    return;
  }

  list.forEach((recipe, index) => {
    const card = document.createElement("div");
    card.className = "card";

    let imageTag = recipe.image ? `<img src="${recipe.image}" alt="Recipe Image">` : "";

    card.innerHTML = `
      ${imageTag}
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <button class="view-btn" data-action="view" data-index="${index}">View</button>
      <button class="edit-btn" data-action="edit" data-index="${index}">Edit</button>
      <button class="delete-btn" data-action="delete" data-index="${index}">Delete</button>
    `;

    recipeGrid.appendChild(card);
  });
}

// ============================
// Modal Handling
// ============================
addRecipeBtn.addEventListener("click", () => {
  recipeForm.reset();
  document.getElementById("recipeId").value = "";
  document.getElementById("modalTitle").innerText = "Add Recipe";
  recipeModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  recipeModal.classList.add("hidden");
});

closeView.addEventListener("click", () => {
  viewModal.classList.add("hidden");
});

// ============================
// Add / Edit Recipe
// ============================
recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("recipeId").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const ingredients = document.getElementById("ingredients").value.split(",");
  const instructions = document.getElementById("instructions").value.split("\n");
  const imageFile = document.getElementById("image").files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageURL = event.target.result;
      saveOrUpdateRecipe(id, title, description, ingredients, instructions, imageURL);
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveOrUpdateRecipe(id, title, description, ingredients, instructions, "");
  }
});

function saveOrUpdateRecipe(id, title, description, ingredients, instructions, imageURL) {
  const newRecipe = { title, description, ingredients, instructions, image: imageURL };

  if (id) {
    recipes[id] = newRecipe;
  } else {
    recipes.push(newRecipe);
  }

  saveRecipes();
  renderRecipes();
  recipeModal.classList.add("hidden");
}

// ============================
// View Recipe
// ============================
function viewRecipe(index) {
  const recipe = recipes[index];
  document.getElementById("viewTitle").innerText = recipe.title;
  document.getElementById("viewDescription").innerText = recipe.description;

  const ingList = document.getElementById("viewIngredients");
  ingList.innerHTML = "";
  recipe.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing.trim();
    ingList.appendChild(li);
  });

  const instList = document.getElementById("viewInstructions");
  instList.innerHTML = "";
  recipe.instructions.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step.trim();
    instList.appendChild(li);
  });

  document.getElementById("viewImage").src = recipe.image || "";
  viewModal.classList.remove("hidden");
}

// ============================
// Edit Recipe
// ============================
function editRecipe(index) {
  const recipe = recipes[index];
  document.getElementById("recipeId").value = index;
  document.getElementById("title").value = recipe.title;
  document.getElementById("description").value = recipe.description;
  document.getElementById("ingredients").value = recipe.ingredients ? recipe.ingredients.join(", ") : "";
  document.getElementById("instructions").value = recipe.instructions ? recipe.instructions.join("\n") : "";
  document.getElementById("modalTitle").innerText = "Edit Recipe";
  recipeModal.classList.remove("hidden");
}

// ============================
// Delete Recipe
// ============================
function deleteRecipe(index) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes.splice(index, 1);
    saveRecipes();
    renderRecipes();
  }
}

// ============================
// Search
// ============================
searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(term) ||
    r.description.toLowerCase().includes(term)
  );
  renderRecipes(filtered);
});

// ============================
// Event Delegation for Buttons
// ============================
recipeGrid.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const action = e.target.dataset.action;
    const index = parseInt(e.target.dataset.index);
    if (action === "view") viewRecipe(index);
    if (action === "edit") editRecipe(index);
    if (action === "delete") deleteRecipe(index);
  }
});

// ============================
// Close modal by clicking outside
// ============================
window.addEventListener("click", (e) => {
  if (e.target === viewModal) {
    viewModal.classList.add("hidden");
  }
  if (e.target === recipeModal) {
    recipeModal.classList.add("hidden");
  }
});

// ============================
// Init
// ============================
loadRecipes();
renderRecipes();


