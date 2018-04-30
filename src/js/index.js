import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};


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

        // Await for recipes on new Search object
        await state.search.getResults();

        // Render results on UI after we get it from API
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// RECIPE CONTROLLER
const r = new Recipe();
r.getRecipe();



// http://food2fork.com/api/search