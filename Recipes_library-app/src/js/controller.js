//EXPLAIN here will be one big module for the controllers

// Imports from module.js
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';

// Imports from views.js
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; // for polyfilling async/await

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

// Control function for displaying a recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // take ID from the url tam after hash symbol (removing hash symbol using slice mehtod);
    if (!id) return;
    recipeView.renderSpinner(); // load spinner animation before get response;

    // 0) Update the result view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1) Load recipe
    await model.loadRecipe(id);

    // 2) Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.rederError(); // Render an error message
  }
};

// Control function for handling search result
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // Display a loading spinner

    // 1) Get the search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render the results
    //  console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// Control function for pagination
const controlPagination = goToPage => {
  // 3) Render NEW result for the selected page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Control function  for updating the number of servings
const controlServings = function (newServings) {
  // Update the recipe servings in the model;
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

// Control function for adding/removing bookmarks
const controlAddBookmark = function () {
  // 1) Add/remove a bookmark;
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update the recipe view;
  recipeView.update(model.state.recipe);

  // 3) Render the bookmarks;
  bookmarksView.render(model.state.bookmarks);
};

// Control function for rendering bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Control function for adding a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show a loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render a recipe view
    recipeView.render(model.state.recipe);

    // Display a success message
    addRecipeView.renderMessage();

    // Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change the ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }

  // Reload the page after a delay
  setTimeout(() => {
    location.reload();
  }, MODAL_CLOSE_SEC * 10000);
};

// Initialize the application
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
