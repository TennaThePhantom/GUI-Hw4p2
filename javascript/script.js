/*
File: script.js
Student Name: Tennessee Foster
Assignment: HW4 Part 2 - jQuery Query UI Slider and Tab Widgets
Email: tennessee_foster@student.uml.edu
Date: 6/14/2026
Description: Multiplication table jQuery UI Slider and Tab Widgets
Copyright (c) 2026 by Tennessee Foster. All rights reserved.
*/

// Get DOM elements
const form = document.getElementById("tableForm");
const resetButton = document.getElementById("resetBtn");
const tableDisplay = document.getElementById("tableDisplay");
const errorArea = document.getElementById("errorArea");  


// Constants
const minNumber = -50;
const maxNumber = 50;

// error message
// emoji last access 6/11/2026 - https://emojipedia.org/
function showError(message) {
	$(errorArea).html('<div class="error-message">⚠️ ' + message + "</div>");
	setTimeout(function () {
		$(errorArea).html("");
	}, 3000);
}

// Clear error message
function clearError() {
	$(errorArea).html("");
}

// Generate the user multiplication table from input
function generateUserTable(minX, maxX, minY, maxY) {
	// Create array of x values (multipliers the  horizontal axis)
	let xValues = [];
	for (let number = minX; number <= maxX; number++) {
		xValues.push(number);
	}

	// Create array of y values (multipliers the vertical axis)
	let yValues = [];
	for (let number = minY; number <= maxY; number++) {
		yValues.push(number);
	}

	// Build User table from input
	let table = '<table class="multiplication-table">';
	table += "<thead>";
	table += "<tr>";
	table += "<th>×</th>"; // Corner cell(multiplication)

	// Add header row (multipliers)
	for (let x of xValues) {
		table += `<th>${x}</th>`;
	}
	table += "</tr>";
	table += "</thead>";
	table += "<tbody>";

	// Add data rows
	for (let y of yValues) {
		table += "<tr>";
		table += `<th>${y}</th>`; // Row header (multiplicand)

		// Calculate and add each cell
		for (let x of xValues) {
			let product = x * y;
			table += `<td>${product}</td>`;
		}
		table += "</tr>";
	}

	table += "</tbody>";
	table += "</table>";

	// Display the table for user
	tableDisplay.innerHTML = table;
}


// reset form to default values 1 and 5 
function resetUserInputs() {
	document.getElementById("minX").value = "1";
	document.getElementById("maxX").value = "5";
	document.getElementById("minY").value = "1";
	document.getElementById("maxY").value = "5";

	// Reset table display message
	tableDisplay.innerHTML =
		"Enter numbers and click Generate Table to create your table";
}

// check to ensure min <= max for both axes (row and column)
function checkMinMax(minX, maxX, minY, maxY) {
	if (minX > maxX) {
		return {
			valid: false,
			message: "Horizontal: Min must be less than or equal to Max",
		};
	}
	if (minY > maxY) {
		return {
			valid: false,
			message: "Vertical: Min must be less than or equal to Max",
		};
	}
	return { valid: true, message: "" };
}

//  Check if table size is reasonable (max 2500 cells)
function checkTableSize(minX, maxX, minY, maxY) {
	// Calculate table size to prevent too big of a table
	// if user enter -50 to 50 for x and y -50 to 50 = 100(x rows) * 100(y rows) = 10000
	// 10000 > 2500 yes don't make the table too big
	let xCount = Math.abs(maxX - minX) + 1;
	let yCount = Math.abs(maxY - minY) + 1;
	let totalCells = xCount * yCount;

	if (totalCells > 2500) {
		return {
			valid: false,
			message: `Table too large (${totalCells} cells). Please use smaller ranges (max 2500 cells).`,
		};
	}
	return { valid: true, message: "" };
}

// Check if any field is blank or empty
function isAnyFieldBlank(minX, maxX, minY, maxY) {
	if (isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY)) {
		return true;
	}
	return false;
}

// Wait for document to be ready for Jquery
$(document).ready(function () {
	// Initialize jQuery Validation plugin
	$("#tableForm").validate({
		// Rules for each form field(user input fields)
		rules: {
			minX: {
				required: true,
				number: true,
				min: minNumber,
				max: maxNumber,
			},
			maxX: {
				required: true,
				number: true,
				min: minNumber,
				max: maxNumber,
			},
			minY: {
				required: true,
				number: true,
				min: minNumber,
				max: maxNumber,
			},
			maxY: {
				required: true,
				number: true,
				min: minNumber,
				max: maxNumber,
			},
		},
		// error messages
		// emoji last access 6/11/2026 - https://emojipedia.org/
		messages: {
			minX: {
				required: "⚠️ Please enter a number",
				number: "⚠️ Must be a valid number",
				min: "⚠️ Must be -50 or greater",
				max: "⚠️ Must be 50 or less",
			},
			maxX: {
				required: "⚠️ Please enter a number",
				number: "⚠️ Must be a valid number",
				min: "⚠️ Must be -50 or greater",
				max: "⚠️ Must be 50 or less",
			},
			minY: {
				required: "⚠️ Please enter a number",
				number: "⚠️ Must be a valid number",
				min: "⚠️ Must be -50 or greater",
				max: "⚠️ Must be 50 or less",
			},
			maxY: {
				required: "⚠️ Please enter a number",
				number: "⚠️ Must be a valid number",
				min: "⚠️ Must be -50 or greater",
				max: "⚠️ Must be 50 or less",
			},
		},

		// simple error messages placement below user input for each form
		errorPlacement: function (error, element) {
			// Insert error message after the input
			if (element.closest(".input-group").length) {
				error.insertAfter(element.closest(".input-group"));
			} else {
				error.insertAfter(element);
			}
			error.addClass("text-danger small d-block mt-1");
		},

		// submit handler jquery validation
		submitHandler: function (form) {
			// Get values from user input
			let minX = parseInt($("#minX").val());
			let maxX = parseInt($("#maxX").val());
			let minY = parseInt($("#minY").val());
			let maxY = parseInt($("#maxY").val());

			// double check if user leaves a field blank display error in case jquery validation doesn't load in properly for some reason
			if (isAnyFieldBlank(minX, maxX, minY, maxY)) {
				showError(
					`Blank Number Error: Please enter valid numbers in all fields (no blank fields)`,
				);
				return;
			}

			// double check user input range before generating table 
			if (
				minX < minNumber ||
				minX > maxNumber ||
				maxX < minNumber ||
				maxX > maxNumber ||
				minY < minNumber ||
				minY > maxNumber ||
				maxY < minNumber ||
				maxY > maxNumber
			) {
				showError(
					`Number Range Error: All numbers must be between ${minNumber} and ${maxNumber}`,
				);
				return;
			}

			// check if min <= max
			let minMaxCheck = checkMinMax(minX, maxX, minY, maxY);
			if (!minMaxCheck.valid) {
				showError(minMaxCheck.message);
				return;
			}

			// check table size
			let sizeCheck = checkTableSize(minX, maxX, minY, maxY);
			if (!sizeCheck.valid) {
				showError(sizeCheck.message);
				return;
			}

			// Generate the table
			generateUserTable(minX, maxX, minY, maxY);
			clearError();
		},

		// Show errors as user types
		onkeyup: function (elementError) {
			$(elementError).valid();
		},

		onfocusout: function (elementError) {
			$(elementError).valid();
		},
	});
});

// Reset button
resetButton.addEventListener("click", function () {
	resetUserInputs();
	// Reset the form validation
	$("#tableForm").validate().resetForm();
	// Remove any visible alerts
	$(".alert").remove();
});

// Initial table display message
tableDisplay.innerHTML =
	"Enter numbers and click Generate Table to create your table";
