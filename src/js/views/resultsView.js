import icons from 'url:../../img/icons.svg';
import View from "./View";
import cardView from './cardView';


class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _ErrorMessage = "No results found with that search. Please try again! ";
    _SuccessMessage = "";

    _generateMarkup() {
      return this._data.map(result => cardView.render(result, false)).join("");
  }
}

export default new ResultsView();