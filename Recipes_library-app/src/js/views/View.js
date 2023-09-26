import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data; // Data to be rendered

  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the dom
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Vitalii Chalbash
   * @todo FInish implementetion
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Clear the parent element's content
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Update the view with new data
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    // Set the data property of the view to the new data
    this._data = data;

    // Generate new markup based on the update data
    const newMarkup = this._generateMarkup();

    // Create a new DOM fragment from the general markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Get lists of elements in both the new and current DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements, curElements);

    // Iterate through the new elements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update text content if it has changed
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update attributes if the have changed
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Render a loading spinner
  renderSpinner() {
    const markup = `
		<div class="spinner">
		<svg>
		<use href="${icons}#icon-loader"></use>
		</svg>
		</div> -->
		`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render an error message
  renderError(message = this._errorMessage) {
    const markup = `
				<div class="error">
								<div>
									<svg>
										<use href="${icons}#icon-alert-triangle"></use>
									</svg>
								</div>
								<p>${message}</p>
				</div>
		`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render a success message
  renderMessage(message = this._succeedMessage) {
    const markup = `
				<div class="message">
					<div>
						<svg>
							<use href="${icons}#icon-smile"></use>
						</svg>
					</div>
					<p>${message}</p>
				</div>
		`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
