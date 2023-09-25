import View from './View.js';
import {
  MAX_INGREDIENTS_WITHOUT_SCROLLBAR,
  MIN_INGREDIENTS,
} from '../config.js';

class AddNewIngredient extends View {
  _parentElement = document.querySelector('.upload__overflow');
  _btnAdd = document.querySelector('.upload__btn--add-ingridient');
  _btnDelete = document.querySelector('.upload__btn--remove-ingridient');
  _totalIngredient = 1;

  constructor() {
    super();

    this.addHandlerIngredient.bind(this);
    this.addHandlerRemoveIngredient.bind(this);
    this._addNewIngredient();
  }

  addHandlerIngredient() {
    this._btnAdd.addEventListener('click', this._addNewIngredient.bind(this));
  }

  addHandlerRemoveIngredient() {
    this._btnDelete.addEventListener(
      'click',
      this._removeLastIngredientFromDOM.bind(this)
    );
  }

  _addNewIngredient() {
    const ingCount = this._totalIngredient;
    this._totalIngredient++;
    this._toggleScrollBar();
    return this._parentElement.insertAdjacentHTML(
      'beforeend',
      this._generateMarkupIngredient(ingCount)
    );
  }

  _removeLastIngredientFromDOM() {
    if (this._totalIngredient === MIN_INGREDIENTS) return;
    const lastIngredient = this._parentElement.lastElementChild;
    // const ingredientLength = this._parentElement.children.length;
    this._parentElement.removeChild(lastIngredient);
    this._totalIngredient--;
    this._toggleScrollBar();
  }

  _toggleScrollBar() {
    this._parentElement.classList.toggle(
      'upload__overflow--hidden',
      this._totalIngredient < MAX_INGREDIENTS_WITHOUT_SCROLLBAR
    );
  }

  _updateLablesLayout() {
    const labels = document.querySelectorAll('.upload__fields');
    // console.log(labels.length);
    if (labels.length >= 7) {
      labels.forEach((label, index) => {
        console.log(index);
        if (index >= 9) {
          const inputs = label.querySelectorAll('input[name^="ingredient-"]');
          inputs.forEach(i => {
            if (i.id) i.style.marginLeft = '1rem';
          });
        }
      });
    }
  }

  _generateMarkupIngredient(ingNumber) {
    setTimeout(() => this._updateLablesLayout(), 0.1);
    return `
						<label class="upload__fields">Ingredient ${ingNumber}:
									<input	value="" type="text" id="setMargin" name="ingredient-${ingNumber}-Quantity" placeholder='Quantity'/>
                  <input  value="" type="text" name="ingredient-${ingNumber}-Unit"  placeholder='Unit'/>
						     <input  value="" type="text" name="ingredient-${ingNumber}-Description"  placeholder='Description'/>
						</label>	
            
		`;
  }
}

export default new AddNewIngredient();
