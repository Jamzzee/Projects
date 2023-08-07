'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

console.log('------Lecture: Project Overview------');
// Overwiev lecture
console.log('------Lecture: How to plan a Web Project------');
//EXPLAIN How to plan project step by step
// 1. User stories - description of the application's functionality from the user's perspective. All user stories put together describe the entire application;
// Common format: As a [type of user], I want [an action] so that [a benefit]:
// [type of user] - answer on What?
// [an action] - answer on Why?
// Example:
// As a 'user' I want to log 'my running workouts with location, distance, time, place and steps/minutem,' so I can 'keep a log of all my running';
// Example 2:
// As a 'user', I want to 'log my cycling workouts with location, distance, time, speed and elevation gain, so I can 'keep a log of all my cycling';
// Example 3:
// As a 'user', I want to 'see all my workouts at a glance', so I can easily 'track my progress over time';
// Example 4:
// As a 'user', I want to 'also see my workouts on a map', so I can easily 'check where I work out the most;
// Example 5:
// As a 'user', I want to 'see all my workouts when I leave the  app and come back later', so that I can 'keep using there app over time;

// 2. Features;
// Example 1:
// So first we gonna need a Map where user clicks to add a new workout (best wat to get location coordinates);
// Example 2:
// Since we are working with map, we shoud use a geolocation to display map at current location (more user friendly)
// Example 3:
// We gonna need a Form to input distance, time, place, steps/minute;
// We also need a Form to input for distance, time, speed, elevation gain;
// Example 4:
// Then, as a User wnat to see it in a glace, we need to Display all workouts in a list;
// Example 5:
// Display all workouts on the map;
// Example 6:
// Store workout data in the browser using local storage API
// Example 7:
// Then on page load, read the saved data from local storage and display it;

// 3. Flowchart - WHAT we will build ?
//
// 4. Architecture - HOW we will build it ?
// 5. Development step - Implementation of our plan using code.

console.log('------Lecture: Using the Geolocation API------');
// How geolocation works
// navigator.geolocation.getCurrentPosition (firstArg - is a callbackFn in case successfully found geolocation, secondArg - is a callbackFn in case an error)
/* if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      // Destructuring needed properties from the received position object
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      console.log(latitude, longitude);
    },
    function () {
      alert('Could not get your position');
    }
  );
} */

console.log('------Lecture: Displaying a Map Using Leaflet Library------');
console.log('------Lecture: Displaying a Map Marker------');
console.log('------Lecture: Rendering workout Input Form------');
// Leaflet - a third-party libraty
// Linked hoisted leaflet library in our HTML file.

let map, mapEvent; // Global variable

//TODO Implement navigator geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      // Destructuring needed properties from the received position object
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];
      map = L.map('map').setView(coords, 12);
      // console.log(map); // Internals of leaflet code library
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Displaying a Map Marker (Handling clicks on Map)
      map.on('click', function (mapE) {
        // console.log(mapE);
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function () {
      alert('Could not get your position');
    }
  );
}
//TODO Clear input fields function
const clearInputs = () => {
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  //TODO Display the Marker on the Map after Submit form
  const { lat, lng } = mapEvent.latlng; // take coordinates
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 150,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();

  // Clear inputs
  clearInputs();
});

//TODO Attached listener 'change' on inputType (where is two options of type)
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

console.log('------Lecture: Project Architecture------');
// Architecture: initial approach (theory lection)
//* User stories:
// 1. Log my running workouts with location, distance, time, pace, and steps/minute (cadence);
// 2. Log my cycling workouts with location, distance, time, speed, and elevation gain;

console.log('------Lecture: Refactoring for Project Architecture------');
// work on project.js
console.log('------Lecture: Managing Workout Data: Createing Classes------');
// work on project.js
console.log('------Lecture: Creating a new Workout------');
// work on project.js
console.log('------Lecture: Rendering wokrouts------');
// work on project.js
console.log('------Lecture: Move to Marker on Click------');
// work on project.js
console.log('------Lecture: Working with localStorage ------');
// work on project.js
// Important
//EXPLAIN When we converted our object to a string by JSON.stringify() and then back from the string to object by JSON.parse() - we lost the prototype chain!!!!!
console.log('------Lecture: Final considerations ------');
// work on project.js
