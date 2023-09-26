//EXPLAIN here will be one big for for the entire module. For all the modules basically, like: for the recipem, for search, for bookmarks and so on and so far.

// import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
// import { getJson, sendJson } from './helpers.js';

// Define the initial state object
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Function to create a recipe object from the recieved data
const createRecipeObjcet = function (data) {
  const { recipe } = data.data;
  // Re-build out object to improve readability and consistency
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Add key if present
  };
};

// Function to load a recipe by its ID
export const loadRecipe = async function (id) {
  try {
    // 1) Loading the recipe data from the API
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // Set the state's recipe property using the createRecipeObject function
    state.recipe = createRecipeObjcet(data);

    // Check if the recipe is bookmarked and update the state accordingly
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// Function to load search results based on a query
export const loadSearchResults = async function (query) {
  try {
    // Set the search query in the state
    state.search.query = query;

    // Load search results data from the API
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // Map() the API results to a more concise format and set them in the state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Reset the search results page to 1
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// Function to get a specific page of search results
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10; // 0
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

// Function to update recipe servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //Formula: newQt = oldQt * (newServings / oldServings)
  });

  state.recipe.servings = newServings;
};

// Function to persist bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Function to add a bookmarked recipe
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Function to delete a bookmarked recipe
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Initialization function to load bookmarks from local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// Function to update a new recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    // Extract and format ingredients from the newRecipe data
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(subArr => subArr[1].trim())
      .reduce((acc, value, index) => {
        const i = index % 3; // Index within each ingredient
        if (i === 0) acc.push({}); // Start a new ingredient object
        const curIng = acc[acc.length - 1];

        if (i === 0) curIng.quantity = value ? +value : null;
        if (i === 1) curIng.unit = value;
        if (i === 2) curIng.description = value;
        return acc;
      }, []);

    // Create a recipe object with the formatted data
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Send the new recipe data to the API
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // Set the state's recipe property using the createRecipeObject function
    state.recipe = createRecipeObjcet(data);

    // Add the uploaded recipe to bookmarks
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};

// Function to clear bookmarks from local storage (not used in)
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
