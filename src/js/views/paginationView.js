import { RESULT_PER_PAGE } from '../config';
import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');


  // A publisher reciever handler that connects with the controller
  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--inline");

      if(!btn) return;

      const gotoPage = +btn.dataset.goto;

  
      handler(gotoPage);
    })
  }


  // generate the markup for the pagination buttons

  _generateMarkup() {
    const currentPage = this._data.currentPage;
    const numOfPages = Math.ceil(this._data.results.length / RESULT_PER_PAGE);

    //Four Scenarios

    // 1) Page 1, other pages

    if (currentPage === 1 && numOfPages > 1) {
      return this._generatePaginationButton(currentPage);
    }

    // 2) Currently on other pages

    if (currentPage > 1 && currentPage < numOfPages) {
      return `
      ${this._generatePaginationButton(currentPage, "prev")}

           ${this._generatePaginationButton(currentPage)}
            `;
    }

    // 3) Last Page

    if (currentPage === numOfPages && numOfPages > 1) {
      return `${this._generatePaginationButton(currentPage, "prev")}`;
    }

    // 4) Page 1, no other page

    if (currentPage === 1 && numOfPages === 1) {
      return '';
    }
  }

  // custom function to generate either next or previous button

  _generatePaginationButton(page, direction = 'next') {
    return `
    <button data-goto=${direction === 'next' ? page + 1 : page - 1} class="btn--inline pagination__btn--${
      direction === 'next' ? 'next' : 'prev'
    }">
            <span>Page ${direction === 'next' ? page + 1 : page - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${
      direction === 'next' ? 'right' : 'left'
    }"></use>
            </svg>
          </button>
    `;
  }
}

export default new PaginationView();
