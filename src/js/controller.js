import 'core-js/stable';
import 'regenerator-runtime/runtime';

//import modules
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

//Keeping state live with parcel

// if (module.hot) {
//   module.hot.accept(); //Its a parcel thing not JS
// }

// APPLICATION LOGIC

//Load Recipes

const controlRecipes = async () => {
  try {
    // Get id from link path, for loading recipe automatically and dynamically
    const id = window.location.hash.slice(1);

    // !!!!!Guard clause!!!!! if there is no recipe selected
    if (!id) return;

    // Loader
    recipeView.renderSpinner();

    // 0) Update results view
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Fetch the recipe Data   !!!!!!!!!!!!!

    //it returns a promise so you have to await the result
    await model.loadRecipe(id);

    // 2) Render The Recipe On The Screen
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

//Load Search Results

const controlSearchResults = async query => {
  try {
    // Loader
    resultsView.renderSpinner();
    // 1) Get search Query
    const query = searchView.getQuery();
    //Guard clause
    if (!query) return;

    // 2) update the state values by fetching search results
    await model.loadSearchResults(query);

    // 3) Render the search resul1ts in the results div
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination
    if (model.state.search.results.length === 0) {
      return;
    }
    paginationView.render(model.state.search);
  } catch (error) {
    recipeView.renderError();
  }
};

//Load proper pagination

const controlPagination = page => {
  // 1) Render NEW Search Results
  resultsView.render(model.getSearchResultsPage(page));
  // 2) Render NEW pagination
  paginationView.render(model.state.search);
};

//Load new Servings

const controlServings = updateTo => {
  // 1) Swap the state with new servings
  model.updateServings(updateTo);
  // 2) Render new recipe view with updated recipe servings values
  recipeView.update(model.state.recipe);
};

//Add bookmark

const controlBookmark = () => {
  // 1) Add / Remove the bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update the recipe view with the new bookmark icon
  recipeView.update(model.state.recipe);

  // 3) Render the bookmark in the bookmarks modal
  bookmarksView.render(model.state.bookmarks);
};

const controlAddedBookmarks = () => {
  //render all the bookmarks stored in the local storage
  bookmarksView.render(model.state.bookmarks);
};

//Add new recipe

const controlAddNewRecipe = async (newRecipe) => {
  //subscriber publisher pattern to pass down the data got from the dom
  try {
    // 0) Load spinner
    addRecipeView.renderSpinner();

    // 1) Upload new Recipe data
    await model.uploadRecipe(newRecipe);
    
    // 2) Render success message
    addRecipeView.renderSuccess()

    // 3) Render Recipe
    recipeView.render(model.state.recipe)

    // 4) Render the bookmarks again for the new recipe to be shown without reefreshing the page
    bookmarksView.render(model.state.bookmarks);

    // 5) Change the id in the url to the new added recipe
    window.history.pushState(null, "", `#${model.state.recipe.id}`)

    // 6) Close the form after a short delay
    setTimeout(() => {
      addRecipeView.toggleModalClass();
      addRecipeView._
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error);
  }
  
};

//Delete added recipe

const controlDeleteAddedRecipe = async () => {
  try {
    // 0) render spinner
    recipeView.renderSpinner();

    // 1) remove the recipe
    await model.deleteRecipe(model.state.recipe.id)

    // 2) show the success message
    recipeView.renderSuccess("Your recipe has been deleted succesfully!");
    
    // render bookmarks again
    bookmarksView.render(model.state.bookmarks)

    // 3) reset the url 
    setTimeout(() => {
      window.history.pushState(null, "", `#${model.state.recipe.id}`)
      recipeView.render(model.state.recipe)
    }, 2000);
    
    console.log("hello");
  } catch (error) {
    console.log(error);
  }
}

// To initialize connection between the dom and the controller

const init = () => {
  //render the bookmarks if there are bookmarks that need to be loaded
  bookmarksView.addHandlerBookmark(controlAddedBookmarks);

  //render the recipe
  recipeView.addHandlerRender(controlRecipes);

  //update servings
  recipeView.addHandlerChangeServings(controlServings);

  //add bookmark
  recipeView.addHandlerAddBookmark(controlBookmark);

  //load search results
  searchView.addHandlerSearch(controlSearchResults);

  //load different pagination
  paginationView.addHandlerClick(controlPagination);

  //upload new recipes
  addRecipeView.addHandlerUpload(controlAddNewRecipe);

  //delete recipe
  recipeView.addHandlerDeleteRecipe(controlDeleteAddedRecipe);
};
init();

// Private API Key
// d87ee9ce-d87b-4250-bec8-5e5a13530bef
