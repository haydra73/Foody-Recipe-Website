import icons from 'url:../../img/icons.svg';
import View from "./View";
import cardView from './cardView';


class BookmarksView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _ErrorMessage = "No bookmarks yet. Please bookmark some recipes";
    _SuccessMessage = "";

    addHandlerBookmark(handler) {
        window.addEventListener("load", handler)
    }

    _generateMarkup() {
        return this._data.map(bookmark => cardView.render(bookmark, false)).join("");
    }
}

export default new BookmarksView();