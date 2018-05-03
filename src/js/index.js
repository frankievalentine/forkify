import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};
window.state = state;


// SEARCH CONTROLLER
const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results / clear input field / results from previous search
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // Await for recipes on new Search object
            await state.search.getResults();

            // Render results on UI after we get it from API
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert('Something went wrong with the search.');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Handling recipe button clicks using .closest
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    // Get ID from URL hash
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data in background and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            alert('Error processing recipe');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIST CONTROLLER
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// LIKES CONTROLLER
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // NOT liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle like button

        // Add like to UI list
        console.log(state.likes);

    // HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle like button

        // Remove like to UI list
        console.log(state.likes);
    }
};


// Handle update, delete item events on list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    // Count update buttons
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Handling recipe serving button clicks with .matches
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    // List controller for adding 
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

window.l = new List();