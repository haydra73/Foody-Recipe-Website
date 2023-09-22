class SearchView {
    _parentElement = document.querySelector(".search");
    _searchInput = document.querySelector(".search__field");

    getQuery() {
        return this._searchInput.value;
    };

    clearInput() {
        this._searchInput.value = '';
    }

    addHandlerSearch(handler) {
     this._parentElement.addEventListener("submit", (e) => {
        e.preventDefault();
        handler();
        this.clearInput();
    
     })
    }
}

export default new SearchView();
