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
  id = (Math.random() + '').slice(-10); // specifed special ID for each workout;

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
    const date = new Date(this.date);

    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, '0');

    // prettier-ignore
    this.description = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} on ${monthName} ${day} ${hour}:${minute}`
  }
}

// Create new child class - running with own method
class Running extends Workout {
  type = 'running'; // determines the type of workout
  constructor(coords, distance, duration, date, cadence) {
    super(coords, distance, duration, date);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  // Calc average pace
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}

// Create new child class - cycling with own method
class Cycling extends Workout {
  type = 'cycling'; // determines the type of workout
  constructor(coords, distance, duration, date, elevetionGain) {
    super(coords, distance, duration, date);
    this.elevetionGain = elevetionGain;
    this.calcSpeed(); // km/h
    this._setDescription();
  }

  // Calc average speed
  calcSpeed() {
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

    // Attached event handlers immediately when page is load
    btnView.addEventListener('click', this._showAllMartker.bind(this));
    sortType.addEventListener('change', this._renderSortOptions.bind(this)); // depends on type of sorts, re-create and render;
    sortContainer.addEventListener('click', this._sortWorkouts.bind(this)); // sort logic;
    btnDeleteAll.addEventListener('click', this._deleteAllHandler.bind(this)); // delete all data entries;
    form.addEventListener('submit', this._createNewWorkout.bind(this)); // create new workout depends on type;
    inputType.addEventListener('change', this._toggleElevetionField.bind(this)); // choose type of two workout options in the form field;

    // Attached handlers for interacting with mapty options
    containerWorkouts.addEventListener('change', this._editWorkout.bind(this)); // allows edit workout, rebuild local storage and render actual workout data
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this)); // move-up to the workout on the map, depends on which workout was clicked in the list
  }

  // Wait for the _getCurrentPositionAsync to be resolved and if successful - load map
  async _getPosition() {
    try {
      const position = await this._getCurrentPositionAsync();
      this._loadMap(position);
    } catch (err) {
      alert(
        'Could not get your position, need to accept permission for geolocation to be observed'
      );
    }
  }

  // This method returns a Pormise what wraps "navigator.geolocation.getCurrentPosition"
  _getCurrentPositionAsync() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          () => reject(new Error('Error getting geolocation position'))
        );
      } else reject(new Error('Geolocation is not supported'));
    });
  }

  // Loading map and attached handler
  _loadMap(position) {
    // Destructuring needed coordinates properties from the received position object;
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // Store map in global variable;

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map); // impose layer on the map (read doc);

    // Displaying a Map Marker (Handling clicks on Map)
    this.#map.on('click', this._showForm.bind(this)); // after clicking show form for choose type of workout and other properties;

    // Render markers on the map from the local storage
    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
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

  // Type toggle handler
  _toggleElevetionField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    this._clearInputs(); //TODO is we need to clear all fields or just changeable field ?
  }

  // Creates new workout depending on condition: running or cycling
  _createNewWorkout(e) {
    e.preventDefault(); // work with form, so we need to prevent default behavior;

    // Helper function for validation
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); // Check for number value (must be a number);
    const allPositive = (...inputs) => inputs.every(inp => inp > 0); // Check for positive value, can't be negative;

    // Get data from inputs
    const type = inputType.value; // String: running or cycling;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const cadence = +inputCadence.value; // unique for running
    const elevation = +inputElevation.value; // unique for cycling

    const { lat, lng } = this.#mapEvent.latlng; // takes coordinates, after click
    const date = Date.now(); // Store not formating date;

    const isRunning = type === 'running';

    if (
      (isRunning &&
        validInputs(distance, duration, cadence) &&
        allPositive(distance, duration, cadence)) ||
      (!isRunning &&
        validInputs(distance, duration, elevation) &&
        allPositive(distance, duration))
    ) {
      const workout = isRunning
        ? new Running([lat, lng], distance, duration, date, cadence)
        : new Cycling([lat, lng], distance, duration, date, elevation);

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
      // Render an error message if false
    } else this._errorFormMsg();
  }

  // View workouts marker on the map
  _renderWorkoutMarker(workout) {
    // Custom icon options
    const customOptionMarker = L.icon({
      iconUrl: 'my-icon.png',
      iconSize: [50, 55],
      iconAnchor: [24, 10],
    });

    const popupOptions = {
      maxWidth: 250,
      minWidth: 150,
      autoClose: false,
      closeOnClick: false,
      className: `${workout.type}-popup`,
    };

    // Create a marker with the custom icon and popup options
    const layer = L.marker(workout.coords, {
      icon: customOptionMarker, // apply custom icon
    }).addTo(this.#map);

    // Bind a popup to the marker with the specified options
    const popup = L.popup(popupOptions);
    popup.setContent(
      `${workout.type === 'running' ? `🏃‍♂️` : `🚴‍♀️`} ${workout.description}`
    ); // set our description on the newly created Marker on the map;
    layer.bindPopup(popup);

    // Open popup for this marker
    layer.openPopup();

    // Push the new marker to the global markers array for future manipulation
    this.#markers.push(layer);
  }

  // Adjust the map's view to fit the bounds with all markers
  _showAllMartker() {
    if (this.#workouts.length === 0) return; // if no workout, return early

    // Extract latitude and longitude values from the workout coordinates
    const latitude = this.#workouts.map(w => w.coords[0]);
    const longitude = this.#workouts.map(w => w.coords[1]);

    // Calculate the minimum and maximum latitude and longitude.
    const minLat = Math.min(...latitude);
    const maxLat = Math.max(...latitude);
    const minLong = Math.min(...longitude);
    const maxLong = Math.max(...longitude);

    // Creates a rectangle bounds that encompas all markers and define some options with animation
    const bounds = [
      [minLat, minLong],
      [maxLat, maxLong],
    ];
    const boundsOptions = {
      padding: [25, 25],
      animate: true,
      duration: 1,
    };

    // Adjust the map's view to fit the bounds and options;
    this.#map.fitBounds(bounds, boundsOptions);
  }

  // Render workout
  _renderWorkout(workout) {
    const workoutHTML = this._generateWorkoutHTML(workout);
    devider.insertAdjacentHTML('afterend', workoutHTML);

    this._editWorkoutButton(workout); // for receiving workout data, need for manipulation with this data
    this._deleteButtonHandler(workout); // for receiving workout data, need for access to this workout list
  }
  _generateWorkoutHTML(workout) {
    const icon = workout.type === 'running' ? `🏃‍♂️` : `🚴‍♀️`;

    // Create html for general properties which characteristic for available workouts type
    // prettier-ignore
    const distanceHTML = this._generateInputHTML('distance', workout.distance,'km', icon)
    // prettier-ignore
    const durationHTML = this._generateInputHTML('duration', workout.duration,'min', '⏱')

    let additionalDetailsHTML = ''; // for privat additional for each type;

    // Create html for unique characteristic for each type of workout
    // prettier-ignore
    if(workout.type === 'running') {
      const paceHTML = this._generateInputHTML('pace', workout.pace.toFixed(1), 'min/km', '⚡️')
      const cadenceHTML = this._generateInputHTML('cadence', workout.cadence, 'spm', '🦶🏼')
      additionalDetailsHTML = paceHTML + cadenceHTML
    }
    // prettier-ignore
    if(workout.type === 'cycling') {
      const speedHTML = this._generateInputHTML('speed', workout.speed.toFixed(1), 'km/h', '⚡️')
      const elevationHTML = this._generateInputHTML('elevetionGain', workout.elevetionGain, 'm', '⛰')
      additionalDetailsHTML = speedHTML + elevationHTML
    }

    return `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <button class='workout__btn--edit'>edit</button> 
      <button class='workout__btn--delete'>delete</button>
      ${distanceHTML}
      ${durationHTML}
      ${additionalDetailsHTML}
    </li>
    `;
  }
  _generateInputHTML(dataType, value, unit, additionalIcon = '') {
    return `
    <div class="workout__details">
      <span class="workout__icon">${additionalIcon}</span>
      <input class="workout__value" data-type="${dataType}" value="${value}" disabled size="2">
      <span class="workout__unit">${unit}</span>
    </div>
    `;
  }

  // Sort options list
  _renderSortOptions(e) {
    const typeValue = sortType.value; // 'running' || 'cycling'
    // Display or hide sorting options depends on type value
    const isSorted = typeValue !== 'all' ? false : true;
    sortContainer.classList.toggle('sort__container--view', isSorted);

    // Define an 'Options' object with two properties
    const options = {
      running: [
        { type: 'date', icon: '📅' },
        { type: 'distance', icon: '🏃‍♂️' },
        { type: 'duration', icon: '⏱' },
        { type: 'pace', icon: '⚡️' },
        { type: 'cadence', icon: '🦶🏼' },
      ],
      cycling: [
        { type: 'date', icon: '📅' },
        { type: 'distance', icon: '🚴‍♀️' },
        { type: 'duration', icon: '⏱' },
        { type: 'speed', icon: '⚡️' },
        { type: 'elevetionGain', icon: '⛰' },
      ],
    };

    // Creates a string depends on which type (properties) chose for sorting
    const htmlOptions = (options[typeValue] || [])
      .map(option => {
        return `
      <button class="sort__btn" data-type="${option.type}">
        <span class="sort__icon">${option.icon}</span>
        <span class="sort__arrow" data-type="${option.type}">&#129047;</span>
      </button>
      `;
      })
      .join('');

    sortContainer.innerHTML = ''; // Clear container before inserting
    sortContainer.insertAdjacentHTML('afterbegin', htmlOptions);

    this._renderWorkoutsByType(typeValue); // get access for chose type value, for manipulating data;
    return [typeValue]; // return chosen type of value for future operation;
  }

  // Sort workouts data;
  _sortWorkouts(e) {
    const sortingBtn = e.target.closest('.sort__btn'); // current press sorting btn;
    if (!sortingBtn) return; // if there isn't any elment of sorting - stop execution;
    const [selectedSortType] = this._renderSortOptions(); // get chosen type of value;

    const sortType = sortingBtn.dataset.type; // get type of accessible sort option
    const sortArrows = sortContainer.querySelectorAll('.sort__arrow');

    const sortOrder = this.#sort ? 'descending' : 'ascending';
    this.#sort = !this.#sort; // switch boolean value, each time when we clicked on sort btn - needs for observes sort status;

    const sortedWorkouts = this._sortArray(this.#workouts, sortOrder, sortType); // Store sorted array in the variable, shallow copy;

    // Clear all workouts and markers. Not from the global array;
    this._clearWorkoutsAndMarkers();

    sortedWorkouts.forEach(work => {
      // Render type: all types of workout || certain type: 'running' | 'cycling'
      if (work.type === selectedSortType) this._helperRenderMethod(work);
      if (selectedSortType === 'all') this._helperRenderMethod(work);
    });
    this._toggleArrow(this.#sort, sortArrows, sortType); // depends on sort, change arrow direction for flagging sort direction;
  }

  //  Render workouts by type on the map
  _renderWorkoutsByType(type) {
    if (!type) return;

    // Clear previous workouts and markers
    this._clearWorkoutsAndMarkers();

    // Render workouts based on the selected type
    this.#workouts.forEach(work => {
      if (work.type === type) this._helperRenderMethod(work);
      if (type === 'all') this._helperRenderMethod(work);
    });

    // Focus on the last workout on the list
    const lastWorkout = this.#workouts[this.#workouts.length - 1];
    this._setIntoView(lastWorkout);
  }

  // helper clear workouts and markers method
  _clearWorkoutsAndMarkers() {
    containerWorkouts.querySelectorAll('.workout').forEach(workout => {
      workout.remove();
    });
    this.#markers.forEach(mark => mark.remove());
    this.#markers = [];
  }

  // Arrow direction depends on sort direction;
  _toggleArrow(sort, arrows, type) {
    const arrowIcon = sort ? '&#129045' : '&#129047';
    arrows.forEach(arr => {
      if (arr.dataset.type === type) arr.innerHTML = arrowIcon;
    });
  }

  // Helper sort array method
  _sortArray(array, direction, type) {
    // Create a sorting function based on direction and type
    const sortFunction = (a, b) => {
      const aValue = a[type];
      const bValue = b[type];

      return direction === 'ascending' ? aValue - bValue : bValue - aValue;
    };
    // use toSorted function to sort the array and create shallow copy
    return array.toSorted(sortFunction);
  }

  // Attached view on the workouts, include list and marker
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');

    // Ignore clicks on edit btn and non workout element
    if (!workoutEl || e.target.classList.contains('workout__btn--edit')) return;
    const workoutId = workoutEl.dataset.id;

    // Finds and stores the workout which has been clicked.
    const workout = this.#workouts.find(work => work.id === workoutId);

    if (!workout) return;

    // Attached the view on the map to this workout
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // Get important data
  _getWorkoutData(e) {
    const targetElement = e.target.closest('.workout');
    if (!targetElement) return;

    const targetId = targetElement.dataset.id;
    const currentWorkout = this.#workouts.find(work => targetId === work.id);
    const currentWorkoutIndex = this.#workouts.findIndex(
      work => targetId === work.id
    );

    return [targetElement, targetId, currentWorkout, currentWorkoutIndex];
  }

  // Remove a workout and associated data
  _removeWorkOut(targetElement, workoutIndex) {
    // Remove form the workout list
    targetElement.remove();

    // Remove the workout from the global workouts array
    this.#workouts.splice(workoutIndex, 1);

    // Remove the associated marker from the global markers array
    this.#markers[workoutIndex].remove();
    this.#markers.splice(workoutIndex, 1);

    // Find the last workout in the array
    const lastWorkout = this.#workouts[this.#workouts.length - 1];

    // Set the map view to focus on the last workout
    this._setIntoView(lastWorkout);

    // Update the local storage with the latest data
    this._setLocalStorage();
  }

  // Attach handler for workout delete button
  _deleteButtonHandler() {
    const deleteButton = document.querySelector('.workout__btn--delete');

    deleteButton.addEventListener('click', e => {
      const [targetElement, , , currentWorkoutIndex] = this._getWorkoutData(e); // takes data what we need are;
      this._removeWorkOut(targetElement, currentWorkoutIndex); // call method which have removing logic;
    });
  }

  // Method for removing all workouts (entries);
  _deleteAllHandler() {
    if (this.#workouts.length === 0) return; // if there's no workout, - do nothing;

    const btnClearAll = document.querySelector('.msg__btn--yes');
    const btnCancelClear = document.querySelector('.msg__btn--no');
    const confirmMsg = document.querySelector('.confirm__msg');

    confirmMsg.classList.remove('confirm__msg--hide'); // remove modal window with confirm message as a default;

    btnClearAll.addEventListener('click', () => {
      this._resetLocalStorage();
      confirmMsg.classList.add('confirm__msg--hide');
    });
    btnCancelClear.addEventListener('click', () => {
      confirmMsg.classList.add('confirm__msg--hide');
    });
  }

  // Observing and allowing editing of a workout
  _editWorkoutButton() {
    const editButton = document.querySelector('.workout__btn--edit');
    const deleteButton = document.querySelector('.workout__btn--delete');

    if (!(editButton && deleteButton)) return; // if there is no needed btn, stop execution;

    let editMode = false; // boolean variable to track edit status

    editButton.addEventListener('click', e => {
      // Use setTimeout to avoid a delay on the first click of the button
      setTimeout(() => {
        const [targetElement, targetId, ,] = this._getWorkoutData(e); // Get the needed data;
        if (!targetId) return; // If no workout ID stop execution;

        const inputValue = targetElement // finds and store inpul values of certain workout which were clicked on;
          .closest('.workout')
          .querySelectorAll('.workout__value');

        inputValue.forEach(e => {
          if (
            // Check edit status and prevent access to input values for 'speed' and 'pace' types (calculated automatically)
            editMode &&
            e.dataset.type !== 'speed' &&
            e.dataset.type !== 'pace'
          ) {
            e.removeAttribute('disabled'); // Enable editing of the input value
            editButton.style.backgroundColor =
              rootStyle.getPropertyValue('--color-brand--1');
            editButton.style.gridColumn = 3; // Adjust button position;
            deleteButton.style.display = 'block'; // Display the delete button
          } else {
            e.setAttribute('disabled', ''); // Disable editing of the input value
            editButton.style.backgroundColor =
              rootStyle.getPropertyValue('--color-brand--2');
            editButton.style.gridColumn = 4; // Adjust button position
            deleteButton.style.display = 'none'; // Hide the delete button
          }
        });
      }, 0);

      // Change button text content based on edit mode: true/false;
      editMode
        ? (editButton.textContent = 'edit')
        : (editButton.textContent = 'save');
      editMode = !editMode; // Toggle the edit mode boolean value

      this._setLocalStorage(); // Update local storage
    });
  }

  // Method for editing a workout
  _editWorkout(e) {
    const workoutData = this._getWorkoutData(e);
    if (!workoutData) return; // if no workoutData, stop execution
    const [targetElement, , currentWorkout] = workoutData; // Extract the needed data

    const inputValue = +e.target.value; // Store the target input value and convert it to a number
    const inputProperty = e.target.dataset.type; // Store the target input type value;
    currentWorkout[inputProperty] = inputValue; // Update the target workout value with the new value

    let type; // For checking the workout type

    // Call individual method based on workout type and sets type equivalent for personal method
    if (currentWorkout.type === 'running') {
      currentWorkout.calcPace();
      type = 'pace';
    }

    if (currentWorkout.type === 'cycling') {
      currentWorkout.calcSpeed();
      type = 'speed';
    }

    // Update the input value for the calculated characteristic (pace or speed) of the workout
    // prettier-ignore
    const targetInput = targetElement.querySelector( `input[data-type="${type}"]` );
    targetInput.value = currentWorkout[type].toFixed(1);
  }

  // Storing workout in the local storage
  _setLocalStorage() {
    // Create a key/value pair in the local storage. Key: 'workouts', Value: array of workouts converted to a JSON string
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // Retrieving workouts from local storage
  _getLocalStorage() {
    // Retrieve data from local storage and parse it into a JavaScript object
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return; // Check if there is any data in local storage, if not - stop execution

    // Rebuild the workouts based on the data retrieved from local storage
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
      this.#workouts.push(newData); // Push the new workout object into the global workouts array
    });

    // Render the workouts on the map
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  // Helper method to clear input fields
  _clearInputs() {
    // prettier-ignore
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
  }

  // Helper method to render a workout and its marker on the map
  _helperRenderMethod(type) {
    this._renderWorkoutMarker(type);
    this._renderWorkout(type);
  }

  // Helper method to set the view of the map to a specific workout's marker
  _setIntoView(currentWorkout) {
    if (!currentWorkout) return; // check if a valid workout is provided
    this.#map.setView(currentWorkout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // Helper method to display an error message in the form
  _errorFormMsg() {
    formErrorMsg.classList.remove('form__error-hide'); // Display the error message;

    // Hide the error message after 2,5s;
    setTimeout(() => {
      formErrorMsg.classList.add('form__error-hide');
    }, 2500);
  }

  // Helper method to reset all data and reload the location
  _resetLocalStorage() {
    localStorage.removeItem('workouts');
    location.reload(); // resetting the app
  }
}
const app = new App(); // call

// TODO Display weather data for workout time and place [only after asynchronous JavaScript section];
