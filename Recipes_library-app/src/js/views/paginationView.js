import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _curPage;

  // Generate the HTML markup for pagination
  _generateMarkup() {
    // console.log(this._data);
    this._curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, end there are other pages
    if (this._curPage === 1 && numPages > 1) {
      return [
        this._generateMarkupNextPage(),
        this._genetateMarkupCountPage(numPages),
      ];
    }

    // Last page
    if (this._curPage === numPages && numPages > 1) {
      return [
        this._generateMarkupPrevPage(),
        this._genetateMarkupCountPage(numPages),
      ];
    }
    // Other page
    if (this._curPage < numPages) {
      return [
        this._generateMarkupOtherPage(),
        this._genetateMarkupCountPage(numPages),
      ];
    }

    // New page (query changed)
    if (query !== this._data.query) {
      return this._generateMarkupNewPage();
    }
    // Page 1, and there are NO other pages
    return '';
  }

  // Generate markup for the next page button
  _generateMarkupNextPage() {
    return `
			<button data-goto="${
        this._curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${this._curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
			`;
  }

  // Generate markup for the previous page button
  _generateMarkupPrevPage() {
    return `
    <button data-goto="${
      this._curPage - 1
    }" class="btn--inline pagination__btn--prev">
					<svg class="search__icon">
						<use href="${icons}#icon-arrow-left"></use>
					</svg>
					<span>Page ${this._curPage - 1}</span>
		 </button>
	`;
  }

  // Generate markup for displaying the total number of pages
  _genetateMarkupCountPage(count) {
    return `
    <div class="btn--inline btn--count">
          <p>Total page: ${count}</p>
    </div>
    `;
  }

  // Generate markup for other pages (next and previous buttons)
  _generateMarkupOtherPage() {
    return `
    <button data-goto="${
      this._curPage + 1
    }" class="btn--inline pagination__btn--next">
          <span>Page ${this._curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
    </button>
    <button data-goto="${
      this._curPage - 1
    }" class="btn--inline pagination__btn--prev">
					<svg class="search__icon">
						<use href="${icons}#icon-arrow-left"></use>
					</svg>
					<span>Page ${this._curPage - 1}</span>
		 </button>
    `;
  }

  // Add event listener for pagination button clicks
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.closest('.btn--count')) return;
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}
export default new PaginationView();
