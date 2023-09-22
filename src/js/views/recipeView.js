import View from "./View.js"

import icons from 'url:../../img/icons.svg';
import { numberToFraction } from '../helpers.js';

//RENDER LOGIC

class RecipeView extends View{
  _parentElement = document.querySelector('.recipe');
  _data;
  _ErrorMessage =
    "The result of your search couldn't be found. Please try again!";
  _SuccessMessage = `The results are successfull`;

 

  // Windows load handler on refresh

  addHandlerRender(handler) {
    const loadEvents = ['hashchange', 'load'];

    loadEvents.forEach(ev => {
      window.addEventListener(ev, handler);
    });
  }

  // Click on serving button to change the quantity

  addHandlerChangeServings(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--update-servings");
      if(!btn) return;

      const updateServingsTo = +btn.dataset.updateServing;
      
      // So that it wont be 0 servings
      if(updateServingsTo < 1) {
        return
      }
     
      handler(updateServingsTo);
    })
  }

  // Click on bookmark button to create a bookmarked recipe

  addHandlerAddBookmark(handler) {

    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--bookmark");
      if(!btn) return;

      handler();
    })
  }

  // Remove a recipe 

  addHandlerDeleteRecipe(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--delete");
      if(!btn) return;

      handler();
    })
  }

  

  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-serving="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-serving="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}${this._data.bookmarked ? "#icon-bookmark-fill" : "#icon-bookmark"}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateIngredients).join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
          <button
            class="btn--delete ${this._data.key ? "" : "hidden"}"
          >
            Delete Recipe
          </button>
         
        </div>
        `;
  }

  _generateIngredients(ing) {
    return `
  <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? numberToFraction(ing.quantity).toString() : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>
  `;
  }
}

export default new RecipeView();
