'use strict';

// Work Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-05-14T14:43:26.374Z',
    '2023-05-15T18:49:59.371Z',
    '2023-05-16T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-05-11T14:43:26.374Z',
    '2023-05-14T14:43:26.374Z',
    '2023-05-15T18:49:59.371Z',
    '2023-05-16T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-05-11T14:43:26.374Z',
    '2023-05-14T14:43:26.374Z',
    '2023-05-15T18:49:59.371Z',
    '2023-05-16T12:01:20.894Z',
  ],
  currency: 'PLN',
  locale: 'be-BY', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-05-23T14:43:26.374Z',
    '2023-05-14T14:43:26.374Z',
    '2023-05-15T18:49:59.371Z',
    '2023-05-23T12:01:20.894Z',
  ],
  currency: 'UAH',
  locale: 'uk-UA', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//TODO Date format function
const formatDates = (date, locale) => {
  const calcDayPased = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const dayPassed = calcDayPased(new Date(), date);
  if (dayPassed === 0) return 'now';
  if (dayPassed === 1) return `yesterday`;
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
// TODO Currency format function
const currencyFormat = (value, locale, currency) => {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

//TODO Create username of each or new account
const createUserNameofOwner = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNameofOwner(accounts);

//TODO Display movements
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let time = new Date(acc.movementsDates[i]);
    let locale = acc.locale;
    const displayDate = formatDates(time, locale);
    const displayCurrency = currencyFormat(mov, locale, acc.currency);

    let strHTML = `
    	<div class="movements__row">
    	<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    	<div class="movements__date">${displayDate}</div>
    	<div class="movements__value">${displayCurrency}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', strHTML);
  });
};

//TODO Calculate balance and display total balance
const totalBalance = acc => {
  const balance = acc.movements.reduce((acc, mov) => acc + mov);
  acc.totalBalance = balance;
  labelBalance.textContent = currencyFormat(balance, acc.locale, acc.currency);
};

//TODO Calcalute and Display summery of movements
const displayAllSummery = acc => {
  const sumIn = acc.movements.reduce((acc, cur) => (cur > 0 ? acc + cur : acc));
  const sumOut = acc.movements.reduce((acc, cur) =>
    cur < 0 ? acc + cur : acc
  );
  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = currencyFormat(sumIn, acc.locale, acc.currency);
  labelSumOut.textContent = currencyFormat(sumOut, acc.locale, acc.currency);
  labelSumInterest.textContent = currencyFormat(
    totalInterest,
    acc.locale,
    acc.currency
  );
};

//TODO Sorting summery of movements
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted;

  btnSort.textContent === '\u2193 SORT'
    ? (btnSort.textContent = '\u2191 SORT')
    : (btnSort.textContent = '\u2193 SORT');
});

//TODO Display UI function
const displayUI = curUI => {
  displayMovements(curUI);
  totalBalance(curUI);
  displayAllSummery(curUI);
};

//TODO UI logs in
let currentUser, timer; // gobal variable
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentUser = accounts.find(acc => {
    return acc.username === inputLoginUsername.value;
  });
  if (
    inputLoginUsername.value === currentUser.username &&
    +inputLoginPin.value === currentUser.pin
  ) {
    labelWelcome.textContent = `Welcome, ${currentUser.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  const now = new Date();
  labelDate.textContent = new Intl.DateTimeFormat(currentUser.locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(now);

  if (timer) clearInterval(timer);
  timer = countDownTimer();
  displayUI(currentUser);
});

//TODO transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(
    acc => inputTransferTo.value === acc.username
  );
  if (
    amount > 0 &&
    receiveAcc &&
    currentUser.totalBalance >= amount &&
    currentUser.username !== inputTransferTo.value
  ) {
    receiveAcc.movements.push(amount);
    receiveAcc.movementsDates.push(new Date());
    currentUser.movements.push(-Math.abs(amount));
    currentUser.movementsDates.push(new Date());
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  clearInterval(timer);
  timer = countDownTimer();
  displayUI(currentUser);
});

//TODO Request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let amount = +inputLoanAmount.value;
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date());
  } else console.log('sorry, you cannot request loan');
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  clearInterval(timer);
  timer = countDownTimer();
  displayUI(currentUser);
});

//TODO Close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  let currentIndex = accounts.findIndex(
    acc => acc.username === currentUser.username
  );

  if (
    currentUser.username &&
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin &&
    currentUser.pin === +inputClosePin.value
  ) {
    accounts.splice(currentIndex, 1);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
});

//TODO Countdown time for current UI
const countDownTimer = function () {
  let time = 300;
  const tick = function () {
    let minute = String(Math.floor(time / 60)).padStart(2, 0);
    let second = String(time % 60).padStart(2, 0);

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
    labelTimer.textContent = `${minute}:${second}`;
  };
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
};

// Fake account for testing operation
// currentUser = account1;
// displayUI(currentUser);
// containerApp.style.opacity = 1;
