class searchView {
  _parentElement = document.querySelector('.search');

  // Get the user's search query from the input field and clear the input
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // Add a search event handler to the search form
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  // Clear the input field
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new searchView();
