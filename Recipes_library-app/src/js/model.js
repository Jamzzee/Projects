//EXPLAIN here will be one big for for the entire module. For all the modules basically, like: for the recipem, for search, for bookmarks and so on and so far.

// import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
// import { getJson, sendJson } from './helpers.js';

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

const createRecipeObjcet = function (data) {
  const { recipe } = data.data;
  // re-build our object for rids underscores. Makes our object more readable
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // 1) loading recipe
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    console.log(data);

    state.recipe = createRecipeObjcet(data);
    console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10; // 0
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //Formula: newQt = oldQt * (newServings / oldServings)
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete certain bookmark recipe;
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
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

    // console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObjcet(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
// export const uploadRecipe = async function (newRecipe) {
//   try {
//     const ingredients = Object.entries(newRecipe)
//       .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
//       .map(ing => {
//         const ingArr = ing[1].split(',').map(el => el.trim());
//         // const ingArr = ing[1].replaceAll(' ', '').split(',');
//         if (ingArr.length !== 3)
//           throw new Error(
//             'Wrong ingredient format! Please use the correct format'
//           );
//         const [quantity, unit, description] = ingArr;

//         return { quantity: quantity ? +quantity : null, unit, description };
//       });
//     console.log('🚀 ~ uploadRecipe ~ ingredients:', ingredients);

//     const recipe = {
//       title: newRecipe.title,
//       source_url: newRecipe.sourceUrl,
//       image_url: newRecipe.image,
//       publisher: newRecipe.publisher,
//       cooking_time: +newRecipe.cookingTime,
//       servings: +newRecipe.servings,
//       ingredients,
//     };
//     console.log(recipe);

//     const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
//     state.recipe = createRecipeObjcet(data);
//     addBookmark(state.recipe);
//     console.log(data);
//   } catch (err) {
//     throw err;
//   }
// };

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
