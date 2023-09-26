import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _succeedMessage = '';

  // Add an event listener to render bookmarks when the window loads
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // Gegerate HTML markup for bookmarks
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();
