import View from './View.js';
import addNewIngredient from './addNewIngredient.js';
import { WARNING_COLOR } from '../config.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnAdd = document.querySelector('.upload__btn--add-ingridient');
  _btnDelete = document.querySelector('.upload__btn--remove-ingridient');
  _succeedMessage = 'Recipe was successfully uploaded :)';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    addNewIngredient.addHandlerIngredient();
    addNewIngredient.addHandlerRemoveIngredient();
    this._addHandlerPreventDefaultBtn();
  }

  // Toggle the recipe upload window
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // Event handler for showing the recipe upload window
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Event handler for hiding the recipe upload window
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Prevent default form submission for certain buttons
  _addHandlerPreventDefaultBtn() {
    this._btnAdd.addEventListener('click', e => e.preventDefault());
    this._btnDelete.addEventListener('click', e => e.preventDefault());
  }

  // Check for empty ingredient imput fields in the form
  _checkIngredientInputsForm(data) {
    const ing = Object.entries(data);

    const hasEmptyValue = ing
      .filter(entry => entry[0].startsWith('ingredient'))
      .some(entry => entry[1].trim() === '');

    if (hasEmptyValue) {
      ing
        .filter(ing => ing[0].startsWith('ingredient'))
        .forEach(entry => {
          const [key, value] = entry;
          if (value.trim() === '') {
            const inputWithEmptyValue = document.querySelector(
              `input[name=${key}]`
            );
            // console.log(inputWithEmptyValue.parentElement);
            const errorMessage = `Please, fill the empty fields`;
            inputWithEmptyValue.style.borderColor = WARNING_COLOR;
            this._addMessageToDOM(errorMessage);
          }
        });
      return false;
    }
    return true;
  }

  // Add an error message to the DOM
  _addMessageToDOM(message) {
    const errorFormInputMsg = document.querySelector('.upload__error--msg');
    errorFormInputMsg.textContent = message;
    errorFormInputMsg.classList.toggle('hidden', false);
  }

  // Add event handler for form submission
  addHandlerUpload(handler) {
    const self = this;
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      // console.log(dataArr);
      // console.log(data);
      if (self._checkIngredientInputsForm(data)) handler(data);
    });
  }
}
export default new AddRecipeView();
