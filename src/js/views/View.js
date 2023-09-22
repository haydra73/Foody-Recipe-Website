import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // Insert html in a container element
  _insertHtml(markup) {
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = ' ';
  }

  // Render the recipes
  render(data, render = true) {
    // Guard class for data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    ///////////

    this._data = data;

    //get markup
    const recipeMarkup = this._generateMarkup();

    // USED ONLY TO RECIEVE THE MARKUP BUT NOT RENDER ANYTHING TO DOM
    if(!render) {
      return recipeMarkup;
    }

    //clear the page
    this._clear();
   
    //render on page
    this._insertHtml(recipeMarkup);
  }

  // Update the dom where it has to be updated (JUST LIKE REACT)
  update(data) {
    
    //Guard clause again if there is no data

    if(!data && Array.isArray(data) && data.length === 0) {
      return this.renderError();
    }

    ///////////////////

    // Get the data
    this._data = data;

    ///////// THE ALGORITHM 💀 ///////////////

    // 1) Generate new markup
    const newMarkup = this._generateMarkup();

    // 2) Create the DOM from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // 3) Choose all elements from the new markup
    const newElements = Array.from(newDOM.querySelectorAll("*"));

    // 4) Choose all elements from the current showing markup
    const currentElements = Array.from(this._parentElement.querySelectorAll("*"));

    // 5) Loop through the new elements and find the ones which are different

    newElements.forEach((newEl, i) => {

      // Select the current element from the outside array according to the new element array indexes
      const currentEl = currentElements[i];

      // Check if the nodes are similar with (isEqualNode) && if the nodeValue of the newElements firstchild isnt empty to that its a node that contains textcontent

      if(!newEl.isEqualNode(currentEl) && newEl.firstChild?.nodeValue.trim() !== "") {
        currentEl.textContent = newEl.textContent;
      }

      // Update the attributes of the elements

      if(!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value)
        })
      }
     
    })


    
  }

  // Render the spinner before loading recipes
  renderSpinner() {
    const spinnerMarkup = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
    `;
    this._clear();
    this._insertHtml(spinnerMarkup);
  }

  // Render an error message

  renderError(message = this._ErrorMessage) {
    const errorMarkup = `<div class="message">
  <div>
    <svg>
      <use href="${icons}#icon-smile"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>`;

    this._clear();
    this._insertHtml(errorMarkup);
  }

  // Render a success message

  renderSuccess(message = this._SuccessMessage) {
    const errorMarkup = `<div class="message">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>`;

    this._clear();
    this._insertHtml(errorMarkup);
  }
}
