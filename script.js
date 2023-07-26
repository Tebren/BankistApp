'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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

// display movements in account
const displayMovements = function (movements, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
		<div class="movements__row">
			<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
			<div class="movements__date">3 days ago</div>
			<div class="movements__value">${mov} €</div>
	  </div>`;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

//calc and display summary cash in account
const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
	labelBalance.textContent = `${acc.balance} €`;
};

//calc and display in out and interest
const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = `${incomes} €`;

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = `${Math.abs(out)} €`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => {
			return int >= 1;
		})
		.reduce((acc, int) => acc + int);
	labelSumInterest.textContent = `${interest} €`;
};

//create usser name with lower case and only first letter
const createUserName = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map((name) => name[0])
			.join('');
	});
};
createUserName(accounts);
const updateUI = function (acc) {
	//Display movements
	displayMovements(acc.movements);
	//Dosplay balance
	calcDisplayBalance(currentAccount);
	//Display summary
	calcDisplaySummary(currentAccount);
};
//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
	//Prevent form from submitting
	e.preventDefault();
	currentAccount = accounts.find(
		(acc) => acc.username === inputLoginUsername.value
	);
	console.log(currentAccount);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		//Display UI and welcome Message
		labelWelcome.textContent = `Welcome back, ${
			currentAccount.owner.split(' ')[0]
		}`;

		containerApp.style.opacity = 100;
		//Clear input fields
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();

		// Update UI
		updateUI(currentAccount);
	}
});
btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);

	if (
		amount > 0 &&
		currentAccount.movements.some((mov) => mov >= amount * 0.1)
	) {
		//Add movement
		currentAccount.movements.push(amount);

		//update UI
		updateUI(currentAccount);
	}
	inputLoanAmount.value = '';
});
btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const reciverAcc = accounts.find(
		(acc) => acc.username === inputTransferTo.value
	);
	inputTransferAmount.value = inputTransferTo.value = '';
	if (
		amount > 0 &&
		reciverAcc &&
		currentAccount.balance >= amount &&
		reciverAcc?.username !== currentAccount.username
	) {
		//Doing the transfer
		currentAccount.movements.push(-amount);
		reciverAcc.movements.push(amount);
		// Update UI
		updateUI(currentAccount);
	}
});
btnClose.addEventListener('click', function (e) {
	e.preventDefault();
	if (
		inputCloseUsername.value === currentAccount.username &&
		Number(inputClosePin.value) === currentAccount.pin
	) {
		const index = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		console.log(index);
		// Delete account
		accounts.splice(index, 1);
		// Hide UI
		containerApp.style.opacity = 0;
	}
	inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//  ///////////////////////////////////////////////

// for (const [i, movment] of movements.entries()) {
// 	if (movment > 0) {
// 		console.log(`Movement ${i + 1}: You deposited ${movment}`);
// 	} else {
// 		console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movment)}`);
// 	}
// }
// console.log('---');
// movements.forEach(function (mov, i, arr) {
// 	if (mov > 0) {
// 		console.log(`Movement ${i + 1}: You deposited ${mov}`);
// 	} else {
// 		console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
// 	}
// });

//Map
// const currencies = new Map([
// 	['USD', 'United States dollar'],
// 	['EUR', 'Euro'],
// 	['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
// 	console.log(`${key}, ${value}, ${map}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// currenciesUnique.forEach(function (value, key, map) {
// 	console.log(`${key}, ${value}`);
// });

//----challenge
/*
const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
	const dogsJuliaAges = dogsJulia.slice();
	dogsJuliaAges.splice(0, 1);
	dogsJuliaAges.splice(-2);

	console.log(dogsJuliaAges);
	const allDogsAges = dogsJuliaAges.concat(dogsKate);
	console.log(allDogsAges);
	allDogsAges.forEach(function (dog, i) {
		const adultDog = dog >= 3 ? `adult, and is ${dog} years old` : 'puppy 🐶';
		console.log(`Dog number ${i + 1} is ${adultDog}`);
	});
};

checkDogs(dogsJulia, dogsKate);
*/
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

//----------map method----------

// // const movmentUsd=movements.map(function (mov) {
// // 	return mov * eurToUsd;
// // });

// const movmentUsd = movements.map((mov) => mov * eurToUsd);
// console.log(movements);
// console.log(movmentUsd);

// const movementsDescriptions = movements.map(
// 	(mov, i) =>
// 		`Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
// 			mov
// 		)}`
// );
// console.log(movementsDescriptions);

//-----------filter method--------

// const deposits = movements.filter(function (mov, i, arr) {
// 	return mov > 5;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawls = movements.filter((mov) => mov < 0);
// console.log(withdrawls);

//-------------reduce method---------------

// const balance = movements.reduce(function (acc, cur, i, arr) {
// 	console.log(`Iteration nr ${i}: ${acc}`);
// 	return acc + cur;
// });

// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

//----- max value----

// const max = movements.reduce(
// 	(acc, mov) => (acc > mov ? acc : mov),
// 	movements[0]
// );

// console.log(max);

//------------challenge 2--------
/*
Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know
from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

/*
const dogsAge1 = [5, 2, 4, 1, 15, 8, 3];
const dogsAge2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
	const humanAge = ages.map((age) => (age <= 2 ? age * 2 : 16 + age * 4));
	const adultDogs = humanAge.filter((age) => age >= 18);
	const averageAges = adultDogs.reduce(
		(acc, age, i, arr) => acc + age / arr.length,
		0
	);
	console.log(humanAge);
	console.log(adultDogs);
	console.log(averageAges);
};
calcAverageHumanAge(dogsAge1);
calcAverageHumanAge(dogsAge2);
*/

//-----------------------------challenge 3-------------------
/*
Coding Challenge #3
Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
as an arrow function, and using chaining!
Test data:
§ Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
/*
const dogsAges = [5, 2, 4, 1, 15, 8, 3];
const dogsAges2 = [16, 6, 10, 5, 6, 1, 4];
const calcAverageHumanAge = function (ages) {
	const humanAges = ages
		.map((age) => (age <= 2 ? age * 2 : 16 + age * 4))
		.filter((age) => age >= 18)
		.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
		console.log(humanAges);
};
calcAverageHumanAge(dogsAges2)
*/

/*
const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === 'Jessica Davis');

console.log(account);
*/

/*
const anyDeposits = movements.some((mov) => mov > 5000);
console.log(anyDeposits);
*/

/*
console.log(account4.movements.every((mov) => mov > 0));

// Separate callback

const arr = [[1, 2, 3], [, 4, 5, 6], 7, 8];

console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [, 4, [5, 6]], 7, 8];
console.log(arrDeep.flat());
console.log(arrDeep.flat(2));

//flat
const overalBalance = accounts
	.map((acc) => acc.movements)
	.flat()
	.reduce((acc, mov) => acc + mov);
console.log(overalBalance);

//flatMap
const overalBalance2 = accounts
	.flatMap((acc) => acc.movements)
	.reduce((acc, mov) => acc + mov);
console.log(overalBalance2);
*/

/*
//Strings
const owners = ['Jacek', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

//Numbers
console.log(movements);

//return < 0, A, B( keep order)
//return > 0, B, A (switch order)

// movements.sort((a, b) => {
// 	if (a > b) return 1;
// 	if (b > a) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);

movements.sort((a, b) => {
	if (a > b) return -1;
	if (b > a) return 1;
});
console.log(movements);
*/
/*
const x = new Array(7);
console.log(x);

// x.fill(1);
// console.log(x);

x.fill(1, 3);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7, 8];

arr.fill(23, 4, 6);
console.log(arr);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

const diceRoll = Array.from({ length: 100 }, (_, i) =>
	Math.floor(Math.random(i) * 6 + 1)
);
console.log(diceRoll);

*/

/*
labelBalance.addEventListener('click', function () {
	const movementsUI = Array.from(
		document.querySelectorAll('.movements__value'),
		(el) => Number(el.textContent.replace('€', ''))
	);
	console.log(movementsUI);
});
*/
/*
//Prefixed ++
let a = 10;
console.log(++a);

//1.
const bankDepositSun = accounts
	.flatMap((acc) => acc.movements)
	.filter((mov) => mov > 0)
	.reduce((acc, cur) => acc + cur, 0);

console.log(bankDepositSun);

//2.
const toUsd = 1.1;
const numDeposits1000 = accounts
	.flatMap((acc) => acc.movements)
	.filter((mov) => mov > 0)
	.map((mov) => mov * toUsd)
	.filter((mov) => mov >= 1000).length;
console.log(numDeposits1000);

const numDeposits100Usd = accounts
	.flatMap((acc) => acc.movements)
	.reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
console.log(numDeposits100Usd);

//3.
const sums = accounts
	.flatMap((acc) => acc.movements)
	.reduce(
		(sums, cur) => {
			cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
			return sums;
		},
		{ deposits: 0, withdrawals: 0 }
	);
console.log(sums);

//4.
//this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
	const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
	const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

	const titleCase = title
		.toLowerCase()
		.split(' ')
		.map((word) =>
			expections.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
		)
		.join(' ');
	return capitalize(title);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not to long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
/*
Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Forumla:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)
The Complete JavaScript Course 26
Hints:
§ Use many different tools to solve these challenges, you can use the summary
lecture to choose between them 😉
§ Being within a range 10% above and below the recommended portion means:
current > (recommended * 0.90) && current < (recommended *
1.10). Basically, the current portion should be between 90% and 110% of the
recommended portion.
*/

const dogs = [
	{ weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
	{ weight: 8, curFood: 200, owners: ['Matilda'] },
	{ weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
	{ weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

//2.
const dogSarah = dogs.find((dog) => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
	`Sarah's dog is eating too ${
		dogSarah.curFood > dogSarah.recFood ? 'much' : 'litle'
	}`
);

//3.

const ownersEatToMuch = dogs
	.filter((dog) => dog.curFood > dog.recFood)
	.flatMap((dog) => dog.owners);
console.log(ownersEatToMuch);

const ownersEatTooLittle = dogs
	.filter((dog) => dog.curFood < dog.recFood)
	.flatMap((dog) => dog.owners);
console.log(ownersEatTooLittle);
//4;

console.log(`${ownersEatToMuch.join(' and ')} dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little `);

//5.

const perfectAmountFood = dogs.some((dog) => dog.curFood === dog.recFood);
console.log(perfectAmountFood);

//6.7.
const checkEatingOkay = (dog) =>
	dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

const okAmountFood = dogs.some(checkEatingOkay);

console.log(okAmountFood);
const numOfDogsEatingOkey = dogs.filter(checkEatingOkay);
console.log(numOfDogsEatingOkey);

const copyDogs = dogs.slice().sort((a, b) => a.recFood - b.recFood);

// const dogsSort = copyDogs.sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSort);
console.log(copyDogs);

/*
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects 😉)
*/
