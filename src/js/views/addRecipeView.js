import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _formWindow = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _ErrorMessage = "The input format is wrong";
  _SuccessMessage = "New recipe has been added 🙂";

  constructor() {
    super();

    // add private function that are executed inside the view
    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }

  toggleModalClass() {
    this._overlay.classList.toggle('hidden');
    this._formWindow.classList.toggle('hidden');
  }

  _addHandlerOpenModal() {
    this._btnOpen.addEventListener('click', () => {
      // Direct
      //   this._overlay.classList.toggle('hidden');
      //   this._formWindow.classList.toggle('hidden');

      // Through function
      this.toggleModalClass();
    });
  }

  _addHandlerCloseModal() {
    const closeElements = [this._btnClose, this._overlay];
    closeElements.forEach(el =>
      el.addEventListener('click', () => {
        // Through function
        this.toggleModalClass();
      })
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get the form data using the FormData

        const dataArray = new FormData(this);
        const dataObject = Object.fromEntries(dataArray);

        handler(dataObject);

    })
  }
}

export default new AddRecipeView();
