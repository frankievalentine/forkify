import Search from './models/Search';

// Global state
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = 'pizza'; // todo

    if (query) {
        // New search object and add to state
        state.search = new Search(query);
        // Prepare UI for results

        // Await for recipes on new Search object
        await state.search.getResults();

        // Render results on UI after we get it from API
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// http://food2fork.com/api/search