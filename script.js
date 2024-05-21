const inputDay = document.getElementById('day');
const inputMonth = document.getElementById('month');
const inputYear = document.getElementById('year');
const inputs = document.querySelectorAll('input');
const previousDate = document.getElementById('prev-date');

let circleButton = document.querySelector('.circle');
let currentDate = new Date();

let resultNumber = document.querySelectorAll('.result-number');
let ageMonth = document.getElementById('result-month');
let ageDay = document.getElementById('result-day');
let ageYear = document.getElementById('result-year');

let invalidMonth = 0,
	invalidDay = 0,
	invalidYear = 0;
let invalidFlag = false;

//Select all content in input on click
inputs.forEach((input) => {
	input.addEventListener('focus', (e) => {
		e.target.select();
	});
});

// Jump to the next input field after finishing the input
inputDay.addEventListener('input', () => {
	if (inputDay.value.length == 2) {
		inputMonth.focus();
	}
});

inputMonth.addEventListener('input', () => {
	if (inputMonth.value.length == 2) {
		inputYear.focus();
	}
});

function isValidDate(year, month, day) {
	// Check if the year is in the past
	const currentYear = new Date().getFullYear();

	if (year > currentYear) {
		invalidYear = 1;
	}

	// Check if the month is valid
	if (month < 1 || month > 12) {
		invalidMonth = 1;
	}

	// Check if the day is valid for the given month
	if (day < 1 || day > new Date(year, month, 0).getDate()) {
		invalidDay = 1;
	}
	if (invalidDay || invalidMonth || invalidYear) return false;
	else return true;
}

function generateErrorMsg() {
	invalidFlag = true;

	inputs.forEach((input) => {
		let inputId = input.id;
		let paragraph = document.createElement('p');

		if (inputId === 'day' && invalidDay) {
			let parentElement = input.parentNode;
			parentElement.classList.add('error');

			paragraph.textContent = 'Must be a valid day';
			input.insertAdjacentElement('afterend', paragraph);
			invalidDay = 0;
		} else if (inputId === 'month' && invalidMonth) {
			let parentElement = input.parentNode;
			parentElement.classList.add('error');

			paragraph.textContent = 'Must be a valid month';
			input.insertAdjacentElement('afterend', paragraph);
			invalidMonth = 0;
		} else if (inputId === 'year' && invalidYear) {
			let parentElement = input.parentNode;
			parentElement.classList.add('error');

			paragraph.textContent = 'Must be in the past';
			input.insertAdjacentElement('afterend', paragraph);
			invalidYear = 0;
		}
	});
}

function removeErrorMsg() {
	invalidFlag = false;

	inputs.forEach((input) => {
		let parentElement = input.parentNode;
		parentElement.classList.remove('error');

		if (input.nextElementSibling && input.nextElementSibling.tagName === 'P') {
			input.nextElementSibling.remove();
		}
	});
}

function calculateAge() {
	let birthYear = parseInt(inputYear.value);
	let birthMonth = parseInt(inputMonth.value);
	let birthDay = parseInt(inputDay.value);

	if (Number.isNaN(birthYear) || Number.isNaN(birthMonth) || Number.isNaN(birthDay)) {
		return false;
	}

	//Check input validity
	let flag = isValidDate(birthYear, birthMonth, birthDay);
	if (!flag) return flag;

	let currentDate = new Date();
	let currentDay = currentDate.getDate();
	let currentMonth = currentDate.getMonth() + 1;
	let currentYear = currentDate.getFullYear();

	let month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (birthDay > currentDay) {
		currentDay = currentDay + month[birthMonth - 1];
		currentMonth = currentMonth - 1;
	}

	if (birthMonth > currentMonth) {
		currentYear = currentYear - 1;
		currentMonth = currentMonth + 12;
	}

	let calculated_date = currentDay - birthDay;
	let calculated_month = currentMonth - birthMonth;
	let calculated_year = currentYear - birthYear;
	return [calculated_year, calculated_month, calculated_date];
}

function addZero(number) {
	return `${number < 10 ? '0' : ''}${number}`;
}

function animateValue(obj, start, end, duration) {
	let startTimestamp = null;
	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp;
		const progress = Math.min((timestamp - startTimestamp) / duration, 1);
		obj.innerHTML = addZero(Math.floor(progress * (end - start) + start));
		if (progress < 1) {
			window.requestAnimationFrame(step);
		}
	};
	window.requestAnimationFrame(step);
}

// Button onclick
circleButton.addEventListener('click', function (e) {
	e.preventDefault();

	let age = calculateAge();

	if (age === false) {
		if (invalidFlag) {
			removeErrorMsg();
		}
		generateErrorMsg();
		ageYear.innerHTML = '--';
		ageMonth.innerHTML = '--';
		ageDay.innerHTML = '--';
	} else {
		previousDate.textContent = inputDay.value + '-' + inputMonth.value + '-' + inputYear.value;
		if (invalidFlag) removeErrorMsg();

		animateValue(ageYear, 0, age[0], 1500);
		animateValue(ageMonth, 0, age[1], 1500);
		animateValue(ageDay, 0, age[2], 1500);

		inputs.forEach((input) => {
			input.blur();
			input.value = '';
		});
		inputDay.focus();
	}
});
