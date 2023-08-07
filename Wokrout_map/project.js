'use strict';

const root = document.querySelector(':root');
const rootStyle = getComputedStyle(root);

const form = document.querySelector('.form');
const formErrorMsg = document.querySelector('.form__error-msg');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const devider = document.querySelector('.devider');
const sortContainer = document.querySelector('.sort__container');

const btnSort = document.querySelector('.operation__sort');
const sortType = document.querySelector('.operation__sort--type');
const btnView = document.querySelector('.operation__overwiev');
const btnDeleteAll = document.querySelector('.operation__delete--all');

// Create parent class
class Workout {
  // date = new Date();
  // id = (Date.now() + '').slice(-10); // specified special ID for each workout for future operations. Not a good idea for rebuild local storage;
  id = (Math.random() + '').slice(-10); // specifed special ID for each workout;
  clicks = 0; // not so metter, for experiments with prototype chain;

  //  Build main constructor
  constructor(coords, distance, duration, date) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.date = date; // additional property
  }

  // For rendering descriptions after Mark was created
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Month data

    const date = new Date(this.date); // tranform date format;
    const correctMin = String(date.getMinutes()).padStart(2, 0); // Correct displayed minutes;

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[date.getMonth()]
    } ${date.getDate()} ${date.getHours()}:${correctMin}`; // Create description string, display on the markers;
  }

  // Not so metter, just for test co-working with localStorage in this case it will not work, because of loosing prototype chain
  click() {
    this.clicks++;
  }
}

// Create new child class - running with own method
class Running extends Workout {
  type = 'running'; // variable for future operation and determining type
  constructor(coords, distance, duration, date, cadence) {
    super(coords, distance, duration, date);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  // Personal method
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}

// Create new child class - cycling with own method
class Cycling extends Workout {
  type = 'cycling'; // variable for future operation and determining type
  constructor(coords, distance, duration, date, elevetionGain) {
    super(coords, distance, duration, date);
    this.elevetionGain = elevetionGain;
    this.calcSpeed(); // km/h
    this._setDescription();
  }

  // Personal method
  calcSpeed() {
    // this.speed = this.distance / this.duration;
    this.speed = this.distance / (this.duration / 60);
  }
}

// Application Architecture
class App {
  #map; // global map variable, which render map;
  #mapEvent; // global variable, which contain event while clicking on the map;
  #mapZoomLevel = 13; // additional properties for map options (zoom level);
  #markers = []; // global variable, which contain array of rendering markers for future manipulation ;
  #workouts = []; // global variable, which contain array of the workout data;
  #sort = false; // global variable, uses for observe sort status;

  constructor() {
    // Load methods immediately
    this._getPosition(); // Get user's position;
    this._getLocalStorage(); // Get data form local storage;
    btnView.addEventListener('click', this._showAllMartker.bind(this));
    // Attach event handlers immediately when page is load
    sortType.addEventListener('change', this._toggleSortOptions.bind(this)); // depends on type of sorts, re-create and render;
    sortContainer.addEventListener('click', this._sortEntries.bind(this)); // sort logic;
    btnDeleteAll.addEventListener('click', this._removeAllEntries.bind(this)); // delete all data entries;
    form.addEventListener('submit', this._newWorkOut.bind(this)); // create new workout depends on type;
    inputType.addEventListener('change', this._toggleElevetionField.bind(this)); // choose type of two workout options in the form field;
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this)); // move-up to the workout on the map, depends on which workout was clicked in the list
    containerWorkouts.addEventListener('change', this._editWorkout.bind(this)); // allows edit workout, rebuild local storage and render actual workout data
  }

  // Get position
  _getPosition() {
    // Implement navigator geolocation
    if (navigator.geolocation) {
      // this method take two function properties, first for true, and a second one in case of error;
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // call method for display map;
        function () {
          alert(
            'Could not get your position, need accept permission for geolocation observed'
          ); // in case of error, - inform user;
        }
      );
    }
  }

  // Loading map and attached handler
  _loadMap(position) {
    // console.log(position);
    // Destructuring needed coordinates properties from the received position object;
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // Store map in global variable;
    // console.log(map); // Internals of leaflet code library
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map); // impose layer on the map (read doc);

    // Displaying a Map Marker (Handling clicks on Map)
    this.#map.on('click', this._showForm.bind(this)); // after clicking show form for choose type of workout and other properties;

    // Render the Markers from the local storage
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  // show form after click on the map and get focus for one of the inputs
  _showForm(mapEvent) {
    this.#mapEvent = mapEvent; // Store event in the global variable;
    form.classList.remove('hidden'); // Display form;
    inputDistance.focus(); // Get focus on the corrend field;
  }

  // After create new workout - hide form and clear inputs.
  _hideForm() {
    form.style.display = 'none'; // Hide form;
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
    this._clearInputs(); // Call method for empty all fields;
  }

  // Choose running or cycling option
  _toggleElevetionField() {
    //Attached listener 'change' on inputType (where is two options of type);
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    this._clearInputs(); //TODO is we need to clear all fields or just changeable field ?
  }

  // Create new workout depends on condition: running or cycling
  _newWorkOut(e) {
    e.preventDefault(); // work with form, so we need to prevent default behavior;

    // Helper function for validation
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); // Check for number value (must be a number);
    const allPositive = (...inputs) => inputs.every(inp => inp > 0); // Check for positive value, can't be negative;

    //Get data from the form and converted it to a number;
    let type = inputType.value; // String: running or cycling;
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng; // take coordinates, after clicking on the map (in which place we are clicking on);
    let date = Date.now(); // Store not formating date;
    let workout; // Create variable for stores new workout;

    // If workout is running, then create running object
    if (type === 'running') {
      let cadence = +inputCadence.value;
      // TODO Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return this._errorFormMsg(); //TODO improve functionality;

      // this._errorFormMsg();
      workout = new Running([lat, lng], distance, duration, date, cadence); // Store in our variable;
    }

    // TODO if workout is cycling, then create cycling object
    if (type === 'cycling') {
      let elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!'); //TODO improve functionality;

      workout = new Cycling([lat, lng], distance, duration, date, elevation); // Store in our variable;
    }

    // Add new object to the workout array
    this.#workouts.push(workout); // Each time when we are creating new object depends on choose type, store it in array;

    // Render workout on the list
    this._renderWorkout(workout); // Display this newly workout on the map;

    // Render workout and display the marker on the map for new data
    this._renderWorkoutMarker(workout);

    // Hide form and clear the fields (method call's inside hideForm)
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  // View workouts marker on the map
  _renderWorkoutMarker(workout) {
    // Custom icon options
    const customOptionMarker = L.icon({
      iconUrl: 'my-icon.png',
      iconSize: [50, 55],
      iconAnchor: [24, 10],
    });

    const layer = L.marker(workout.coords, {
      icon: customOptionMarker, // apply custom icon
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 150,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? `🏃‍♂️` : `🚴‍♀️`} ${workout.description}`
      ) // set our description on the newly created Marker on the map;
      .openPopup(); // EXPLAIN

    // Each new marker pushing to global markers array. Needs for future operations and manipulation with data array;
    this.#markers.push(layer);
  }

  // Zooms map for display all markers in one view
  _showAllMartker() {
    if (this.#workouts.length === 0) return; // defender check

    const latitude = this.#workouts.map(w => {
      return w.coords[0];
    }); // looping over global array and store latitude coords of each element;
    const longitude = this.#workouts.map(w => {
      return w.coords[1];
    }); // looping over global array and store longitude of each element;

    // Find min/max of latitude and longitude. Need for creates rectangle bounds for displaying all exists markers in one view;
    const minLat = Math.min(...latitude);
    const maxLat = Math.max(...latitude);
    const minLong = Math.min(...longitude);
    const maxLong = Math.max(...longitude);

    this.#map.fitBounds(
      [
        // Creates rectangle bounds;
        [minLat, minLong],
        [maxLat, maxLong],
      ],
      // Options
      { padding: [100, 100], animate: true, duration: 1 }
    );
  }

  // View workouts list
  _renderWorkout(workout) {
    let html = `
				<li class="workout workout--${workout.type}" data-id="${workout.id}">
				<h2 class="workout__title">${workout.description}</h2>
				<button class='workout__btn--edit'>edit</button> 
				<button class='workout__btn--delete'>delete</button> 
				<div class="workout__details">
				<span class="workout__icon">${workout.type === 'running' ? `🏃‍♂️` : `🚴‍♀️`}</span>
				<input class="workout__value" data-type="distance" value="${
          workout.distance
        }" disabled size="2">
				<span class="workout__unit">km</span>
				</div>
				<div class="workout__details">
				<span class="workout__icon">⏱</span>
				<input class="workout__value" data-type="duration" value="${
          workout.duration
        }" disabled size="2">
				<span class="workout__unit">min</span>
				</div>
		`;

    // depends on which type of workout chose, generate certain list;

    if (workout.type === 'running') {
      html += `	
				<div class="workout__details">
					<span class="workout__icon">⚡️</span>
					<input class="workout__value" data-type="pace" value="${workout.pace.toFixed(
            1
          )}" disabled size="2">
					<span class="workout__unit">min/km</span>
				  </div>
				<div class="workout__details">
					<span class="workout__icon">🦶🏼</span>
					<input class="workout__value" data-type="cadence" value="${
            workout.cadence
          }" disabled size="1">
					<span class="workout__unit">spm</span>
				</div>
			</li>
	`;
    }

    if (workout.type === 'cycling') {
      html += `
			<div class="workout__details">
						<span class="workout__icon">⚡️</span>
						<input class="workout__value" data-type="speed" value="${workout.speed.toFixed(
              1
            )}" disabled size="2">
						<span class="workout__unit">km/h</span>
					</div>
					<div class="workout__details">
						<span class="workout__icon">⛰</span>
						<input class="workout__value" data-type="elevetionGain" value="${
              workout.elevetionGain
            }" disabled size="1">
						<span class="workout__unit">m</span>
					</div>
				</li>
			`;
    }

    devider.insertAdjacentHTML('afterend', html); // insert newly created list after devider element on the web page;
    this._editWorkoutsBtn(workout); // for receiving workout data, need for manipulation with this data
    this._removeHandleBtn(workout); // for receiving workout data, need for access to this workout list
  }

  // Sort options list
  _toggleSortOptions(e) {
    const typeValue = sortType.value;
    let htmlOptions = ``;

    // Depends on choose sort type, displayed certain options
    typeValue !== 'all'
      ? sortContainer.classList.remove('sort__container--view') // if chose 'sort' - then hide sort options;
      : sortContainer.classList.add('sort__container--view'); // if chose any other value instead of 'sort' - display sort options, depending on sort type;

    // Displaying sort option depend on chose type: running or cycling;
    if (typeValue === 'running') {
      htmlOptions = `
      <button class="sort__btn" data-type="date">
      <span class="sort__icon">&#128198</span>
      <span class="sort__arrow" data-type="date">&#129047;</span>
      </button>
      <button class="sort__btn" data-type="distance">
      <span class="sort__icon">🏃‍♂️</span>
      <span class="sort__arrow" data-type="distance">&#129047;</span>
    </button>
    <button class="sort__btn" data-type="duration">
    <span class="sort__icon">⏱</span>
    <span class="sort__arrow" data-type="duration">&#129047;</span>
    </button>
    <button class="sort__btn" data-type="pace">
      <span class="sort__icon">⚡️</span>
      <span class="sort__arrow" data-type="pace">&#129047;</span>
      </button>
    <button class="sort__btn" data-type="cadence">
    <span class="sort__icon">🦶🏼</span>
    <span class="sort__arrow" data-type="cadence">&#129047;</span>
    </button>
    `;
    }
    if (typeValue === 'cycling') {
      htmlOptions = `
      <button class="sort__btn" data-type="date">
      <span class="sort__icon">&#128198</span>
      <span class="sort__arrow" data-type="date">&#129047;</span>
    </button>
    <button class="sort__btn" data-type="distance">
    <span class="sort__icon">🏃‍♂️</span>
    <span class="sort__arrow" data-type="distance">&#129047;</span>
    </button>
    <button class="sort__btn" data-type="duration">
      <span class="sort__icon">⏱</span>
      <span class="sort__arrow" data-type="duration">&#129047;</span>
      </button>
      <button class="sort__btn" data-type="speed">
      <span class="sort__icon">⚡️</span>
      <span class="sort__arrow" data-type="speed">&#129047;</span>
      </button>
      <button class="sort__btn" data-type="elevetionGain">
      <span class="sort__icon">⛰</span>
      <span class="sort__arrow" data-type="elevetionGain">&#129047;</span>
      </button>
      `;
    }
    sortContainer.innerHTML = ''; // if we change type of sort, we need to clear our sortContainer for re-write new options;
    sortContainer.insertAdjacentHTML('afterbegin', htmlOptions); // insert correct string at the beginning of the sortContainer;

    this._renderSortType(typeValue); // get access for chose type value, for manipulating data;
    return [typeValue]; // return chosen type of value for future operation;
  }

  // Sort workot data;
  _sortEntries(e) {
    const element = e.target.closest('.sort__btn'); // current press sorting btn;
    if (!element) return; // if there isn't any elment of sorting - stop execution;
    const [typeValue] = this._toggleSortOptions(); // get chosen type of value;
    let direction; // for observes sor direction: ascending or descending;

    const typeEl = element.dataset.type; // get type of accessible sort option
    const sortArrow = element.querySelector('.sort__arrow');
    const sortArrows = sortContainer.querySelectorAll('.sort__arrow');

    !this.#sort ? (direction = 'ascending') : (direction = 'descending'); // store certain value for direction - depending on current sort value (boolean);

    this.#sort = !this.#sort; // switch boolean value, each time when we clicked on sort btn - needs for observes sort status;

    const sortedArr = this._sortArray(this.#workouts, direction, typeEl); // Store sorted array in the variable, shallow copy;

    // Clear all workouts and markers. Not from the global array;
    containerWorkouts.querySelectorAll('.workout').forEach(workout => {
      workout.remove();
    });
    this.#markers.forEach(mark => mark.remove());
    this.#markers = [];

    sortedArr.forEach(work => {
      // check for type value. We need to sort only a certain type;
      if (work.type === typeValue) {
        this._helperRenderMethod(work); // Render current data depends on sort type and direction;
      }
      if (typeValue === 'all') {
        this._helperRenderMethod(work); // Render all accessible data (take from global array), sort default on date type;
      }
    });
    this._toggleArrow(this.#sort, sortArrow, sortArrows, typeEl); // depends on sort, change arrow direction for flagging sort direction;
  }

  // Arrow direction depends on sort direction;
  _toggleArrow(sort, arr, arrws, type) {
    if (sort) {
      arrws.forEach(arr => {
        if (arr.dataset.type === type) arr.innerHTML = `&#129045`;
      });
    } else arr.innerHTML = `&#129047;`;
  }

  // Sort logic
  _sortArray(array, direction, type) {
    // Depends from direction executes ascending or descending sorted;
    if (direction === 'ascending')
      return array.toSorted((a, b) => a[type] - b[type]);
    if (direction === 'descending')
      return array.toSorted((a, b) => b[type] - a[type]);
  }

  // Rendering certain sort type
  _renderSortType(type) {
    if (!type) return;
    const workoutType = type; // get chose type of sort: running or cycling;

    // Before rendering actual data, need to clear previous data. Include workout list and displayed markers
    containerWorkouts.querySelectorAll('.workout').forEach(workout => {
      workout.remove();
    });
    this.#markers.forEach(mark => mark.remove());
    this.#markers = [];

    // After clear previous data, render all again depends on type which are chosen;
    if (workoutType) {
      this.#workouts.forEach(work => {
        if (work.type === workoutType) {
          this._helperRenderMethod(work);
        }
        if (workoutType === 'all') {
          this._helperRenderMethod(work);
        }
      });
    }
    const focusWorkout = this.#workouts[this.#workouts.length - 1]; // store the last element in the global workout array;
    this._setIntoView(focusWorkout); // take focus on the map on last workout element which store in the array list;
  }

  // Attached view on the workouts, include list and marker
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout'); // store workout data which was clicked;

    if (!workoutEl || e.target.classList.contains('workout__btn--edit')) return; // defender check, also if it was clicked on the btn instead of the workout field - return (do nothing);
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    ); // find workout which was clicked in the global workouts array;

    if (!workout) return;
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      }, // attache view on the map to this workout;
    });

    // using the API (application programming interface);
    // workout.click(); // don't be working when we use local storage because of losing prototype chain
  }

  // Method for getting data which are needed for multiple operations;
  _getWorkoutData(e) {
    const targetElement = e.target.closest('.workout');
    if (!targetElement) return;

    const targetId = targetElement.dataset.id;
    const currentWorkout = this.#workouts.find(work => targetId === work.id);
    const currentWorkoutIndex = this.#workouts.findIndex(
      work => targetId === work.id
    );
    return [targetElement, targetId, currentWorkout, currentWorkoutIndex]; // return data which we need;
  }

  // Removing certain workout - logic;
  _removeWorkOut(targetElement, currentWorkoutIndex) {
    targetElement.remove(); // remove from current list;
    this.#workouts.splice(currentWorkoutIndex, 1); // remove workout from the global workouts array, 1 element from currentIndex;
    this.#markers[currentWorkoutIndex].remove(); // remove marker from the global markers array;
    this.#markers.splice(currentWorkoutIndex, 1); // the same operations as with workouts globa array;

    const lastWork = this.#workouts[this.#workouts.length - 1]; // after deleting find last workout in the array and store it;
    this._setIntoView(lastWork); // take focus on the map on the last workout element;

    this._setLocalStorage(); // actualize local storage;
  }

  // Method for removing certain workout;
  _removeHandleBtn() {
    const btnDelete = document.querySelector('.workout__btn--delete');

    btnDelete.addEventListener('click', e => {
      const [targetElement, , , currentWorkoutIndex] = this._getWorkoutData(e); // takes data what we need are;
      this._removeWorkOut(targetElement, currentWorkoutIndex); // call method which have removing logic;
    });
  }

  // Method for removing all workouts (entries);
  _removeAllEntries() {
    if (this.#workouts.length === 0) return; // if there's no workout, - do nothing;

    const confirmMsg = document.querySelector('.confirm__msg');
    const btnYes = document.querySelector('.msg__btn--yes');
    const btnNo = document.querySelector('.msg__btn--no');

    confirmMsg.classList.remove('confirm__msg--hide'); // remove modal window with confirm message as a default;

    // Do operations below depending from choose;
    btnYes.addEventListener('click', () => {
      // if yes
      this._resetLocalStorage(); // clear local storage;
      confirmMsg.classList.add('confirm__msg--hide'); // show modal window;
    });
    btnNo.addEventListener('click', () => {
      // if no
      confirmMsg.classList.add('confirm__msg--hide'); // just hides up modal window and do nothing;
    });
  }

  // Method for observes and allows edit workout
  _editWorkoutsBtn() {
    const btnEdit = document.querySelector('.workout__btn--edit');
    const btnDelete = document.querySelector('.workout__btn--delete');
    if (!(btnEdit && btnDelete)) return; // if there is no needed btn, stop execution;
    let editMode = false; // boolean variable for flagging edit status;

    btnEdit.addEventListener('click', e => {
      // use setTimeout for avoiding delay in first click on btn
      setTimeout(() => {
        const [targetElement, targetId, ,] = this._getWorkoutData(e); // get needed data;
        if (!targetId) return; // stop execution;
        const inputValue = targetElement // finds and store inpul values of certain workout which were clicked on;
          .closest('.workout')
          .querySelectorAll('.workout__value');

        inputValue.forEach(e => {
          if (
            // check for edit status, and don't access for input value with type speed and pace (are calculating automatically)
            editMode &&
            e.dataset.type !== 'speed' &&
            e.dataset.type !== 'pace'
          ) {
            e.removeAttribute('disabled'); // access for edit value;
            btnEdit.style.backgroundColor =
              rootStyle.getPropertyValue('--color-brand--1'); // styled btn;
            btnEdit.style.gridColumn = 3; // positionates buttons;
            btnDelete.style.display = 'block'; // show delete btn;
          } else {
            e.setAttribute('disabled', ''); // disabled access for edit value where edit status is false;
            btnEdit.style.backgroundColor =
              rootStyle.getPropertyValue('--color-brand--2'); // styled btn;
            btnEdit.style.gridColumn = 4; // positionates buttons;
            btnDelete.style.display = 'none'; // hide delete btn;
          }
        });
      }, 0);
      // Change btn text content depending on edit mode: true/false;
      editMode
        ? (btnEdit.textContent = 'edit')
        : (btnEdit.textContent = 'save');
      editMode = !editMode; // change edit boolean value for opposite each time when edit btn was clicked;
      this._setLocalStorage(); // actualize local storage;
    });
  }

  // After checking and getting access for edit workout value
  _editWorkout(e) {
    if (!this._getWorkoutData(e)) return; // if no any data from workout list - return and stop execution;
    const [targetElement, , currentWorkout] = this._getWorkoutData(e); // get needed data;

    const inputValue = +e.target.value; // store target input value and converts it to a number;
    const inputProperty = e.target.dataset.type; // store target input type value;
    currentWorkout[inputProperty] = inputValue; // apply new value to the target workout value;
    let type; // variable for checked workout type for future operation;
    if (currentWorkout.type === 'running') {
      currentWorkout.calcPace(); // if type running, call method for this object;
      type = 'pace'; // define type as a pace (characteristic for this type of workout);
    }
    if (currentWorkout.type === 'cycling') {
      currentWorkout.calcSpeed(); // if type cycling, call method for this object;
      type = 'speed'; // the same as above;
    }
    targetElement.querySelector(`input[data-type="${type}"]`).value =
      currentWorkout[type].toFixed(1); // apply new value to the certain type of target workout value (means pace or speed privat characteristic);
  }

  // EXPLAIN below two method. Read documentation about stringift and parse.
  // Set local storage
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts)); // Creates key/name value which will be store at local storage; Name: 'workouts', and a key is an array of our created workouts. Stores in a string format, so for future use firstly need to convert it into a Javascript object using JSON.parse()
  }

  // Get local storage
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts')); // JS build-in function: JSON.parse() for convetes the received string into a JavaScript object;
    if (!data) return; // check for existing data received from local storage, if no data - stop execution;

    // Re-build local storage if data has any changes;
    data.forEach(work => {
      const typeOfWorkout = work.type;
      let newData; // for storing new Object depending on type of workout: running or cycling;
      if (typeOfWorkout === 'running') {
        newData = new Running(
          work.coords,
          work.distance,
          work.duration,
          work.date,
          work.cadence
        );
      }
      if (typeOfWorkout === 'cycling') {
        newData = new Cycling(
          work.coords,
          work.distance,
          work.duration,
          work.date,
          work.elevetionGain
        );
      }
      this.#workouts.push(newData); // push new workout object into global variable workout object;
    });

    this.#workouts.forEach(work => {
      this._renderWorkout(work); // rendering newly workouts object on the map;
    });
  }

  // Helper - clear inputs
  _clearInputs() {
    //Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  // Helper - render workout/mark
  _helperRenderMethod(type) {
    this._renderWorkoutMarker(type); // render marker on the map;
    this._renderWorkout(type); // render workout on the map;
  }

  // Helper - view workouts marker on the map
  _setIntoView(currentWorkout) {
    if (!currentWorkout) return; // defender check
    this.#map.setView(currentWorkout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // Helper - error form messages;
  _errorFormMsg() {
    formErrorMsg.classList.remove('form__error-hide'); // display error message;

    // Hide error message after 2,5s;
    setTimeout(() => {
      formErrorMsg.classList.add('form__error-hide');
    }, 2500);
  }

  // Helper -reset all data
  _resetLocalStorage() {
    // Clear all data from local storate and reload location;
    localStorage.removeItem('workouts');
    location.reload();
  }
}
const app = new App(); // call

// Additional feature ideas: challenges
// Ability to edit a workout; //done
// Ability to delete a workout; //done
// Ability to delete all workouts; //done
// Ability to sort workouts by a certain field (e.g distance or by duration); //done
// Re-build Running and Cycling objects coming from Local Storage; //done
// More realistic error and confirmation messages; // done
// Ability to position the map to show all workouts [very hard] - depends on leaflead library; //done
// Implement clear method

// TODO Ability to draw lines and shapes instead of just points [very hard] //
// TODO Geocode location from coordinates ('Run  in Faro, Portugal') [only after asynchronous JavaScript section];
// TODO Display weather data for workout time and place [only after asynchronous JavaScript section];
