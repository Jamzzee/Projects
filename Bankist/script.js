'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
  movs.forEach((acc, i) => {
    let type = acc > 0 ? 'deposit' : 'withdrawal';
    let strHTML = `
    	<div class="movements__row">
    	<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    	<div class="movements__date">3 days ago</div>
    	<div class="movements__value">${Math.abs(acc)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', strHTML);
  });
};

//TODO Calculate balance and display total balance
const totalBalance = acc => {
  const balance = acc.movements.reduce((acc, mov) => acc + mov);
  acc.totalBalance = balance;
  labelBalance.textContent = `${acc.totalBalance}€`;
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
  labelSumIn.textContent = `${sumIn}€`;
  labelSumOut.textContent = `${sumOut}€`;
  labelSumInterest.textContent = `${totalInterest}€`;
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
let currentUser;
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
    currentUser.movements.push(-Math.abs(amount));
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  displayUI(currentUser);
});

//TODO Request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let amount = +inputLoanAmount.value;
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
  } else console.log('sorry, you cannot request loan');
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
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
