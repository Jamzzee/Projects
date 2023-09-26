import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _succeedMessage = '';

  // Generate the HTML markup for the results view
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(result => previewView.render(result, false)) // Render each result using the previewView
      .join(''); // Combine the HTML markup for all results into a single stirng
  }
}

export default new ResultsView();
