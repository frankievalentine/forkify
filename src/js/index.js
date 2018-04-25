import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

// Global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results / clear input field / results from previous search
        searchView.clearInput();
        searchView.clearResults();

        // Await for recipes on new Search object
        await state.search.getResults();

        // Render results on UI after we get it from API
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// http://food2fork.com/api/search