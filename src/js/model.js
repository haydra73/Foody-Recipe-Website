import { API_KEY, API_URL, RESULT_PER_PAGE } from './config';
import { getJSON, sendJSON, deleteJSON } from './helpers';

// BUSINESS LOGIC (main use is update the state/context)

// Our main state where values are fetched from
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

// 1

// LOADING THE RECIPE ON THE VIEW (fetch the data needed, and store in state)
const createRecipeObject = (recipe) => {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key})
  }
}

export const loadRecipe = async function (id) {
  try {
    // 1) Fetch the recipe Data

    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;

    state.recipe = createRecipeObject(recipe);

    // 2) Add bookmarking

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    )
      ? true
      : false;
  } catch (error) {
    throw new Error(error);
    throw error;
  }
};

// 2

// LOADING THE SEARCH RESULTS(fetch the searched results through query)

export const loadSearchResults = async query => {
  try {
    //Fetch the data
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

    //save the search query
    state.search.query = query;

    //map and save the searched results into the state
    state.search.results = data.data.recipes.map(recipes => {
      return {
        id: recipes.id,
        title: recipes.title,
        publisher: recipes.publisher,
        image: recipes.image_url,
        ...(recipes.key && {key: recipes.key})
      };
    });

    state.search.currentPage = 1;
  } catch (error) {
    throw error;
  }
};

// 3

// Pagination

export const getSearchResultsPage = (page = state.search.currentPage) => {
  state.search.currentPage = page;
  const start = (page - 1) * RESULT_PER_PAGE;
  const end = page * RESULT_PER_PAGE;
  return state.search.results.slice(start, end);
};

// 4

// Servings Calculation

export const updateServings = servings => {
  // Update the ingredients quantity
  state.recipe.ingredients.forEach(ing => {
    // Formula for updating the servings
    const ratio = servings / state.recipe.servings;

    ing.quantity = ing.quantity * ratio;
  });

  // Update the servings value
  state.recipe.servings = servings;
};

// 5

// Add Bookmark

const saveBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  // update the state
  state.bookmarks.push(recipe);

  // add a bookmarked property
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  //update localstorage
  saveBookmarks();
};

// 6

// Delete Bookmark

export const deleteBookmark = id => {
  // find the index of the recipe
  const index = state.bookmarks.findIndex(el => el.id === id);
  // remove that element from the bookmarks array
  state.bookmarks.splice(index, 1);
  // change its bookmarked property
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  saveBookmarks();
};

// Initialize bookmarks on load

const init = () => {
  const bookmarkStorage = localStorage.getItem('bookmarks');
  if (bookmarkStorage) state.bookmarks = JSON.parse(bookmarkStorage);
};

init();

// 7

// Upload Recipe

export const uploadRecipe = async newRecipe => {
  try {

    // Split the ingredients from the input into and object with property
    const ingredientsEntry = Object.entries(newRecipe);
    const ingredientsValue = ingredientsEntry.filter(
      entry => entry[0].startsWith('ingredient') && entry[1].length !== 0
    );
    const ingredients = ingredientsValue.map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');

      if (ingArr.length !== 3) {
        throw new Error(
          'Wrong format used for the ingredients input, Please use the correct format :)'
        );
      }

      const [quantity, unit, description] = ingArr;

      return { quantity: quantity ? +quantity : null, unit, description };
    });

    // Prepare the recipe format that is going to be uploaded to the server 

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    

    // Upload the recipe to the server with the api key 
    const {data} = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);

    // create the recipe object and add it into the state
    const addedRecipe = createRecipeObject(data.recipe);

    // UPDATE THE STATE
    state.recipe = addedRecipe

    // Add it to the bookmark and mark it as marked
    addBookmark(addedRecipe);
  } catch (error) {
    throw error;
  }
};


export const deleteRecipe = async(id) => {
  try {
    //delete from the bookmark
    deleteBookmark(id);
    
    //delete from the server
    const data = await deleteJSON(`${API_URL}${id}?key=${API_KEY}`)
  
    //update the state
    state.recipe = state.bookmarks !== 0 ? state.bookmarks[0] : {};
    
  } catch (error) {
    throw error
  }
}
