/*
File: script.js
Student Name: Tennessee Foster
Assignment: HW4 Part 2 - jQuery UI Slider and Tab Widgets
Email: tennessee_foster@student.uml.edu
Date: 6/15/2026
Description: Multiplication table jQuery UI Slider and Tab Widgets
Copyright (c) 2026 by Tennessee Foster. All rights reserved.
*/
// constants
const minNumber = -50;
const maxNumber = 50;
let tabCounter = 1;

// Generate the user multiplication table from input
function generateUserTable(minX, maxX, minY, maxY) {
	// Create array of x values (multipliers the  horizontal axis)
	let xValues = [];
	for (let number = minX; number <= maxX; number++) xValues.push(number);

	// Create array of y values (multipliers the vertical axis)
	let yValues = [];
	for (let number = minY; number <= maxY; number++) yValues.push(number);

	// Build User table from input
	let table = '<table class="multiplication-table">';
	table += "<thead><tr><th>×</th>";
	for (let x of xValues) table += `<th>${x}</th>`; // Add header row (multipliers)
	table += "</tr></thead><tbody>";
	// Add data rows
	for (let y of yValues) {
		table += "<tr>";
		table += `<th>${y}</th>`; // Row header (multiplicand)
		for (let x of xValues) {
			// Calculate and add each cell
			table += `<td>${x * y}</td>`;
		}
		table += "</tr>";
	}
	table += "</tbody></table>";
	return table;
}
// error message
// emoji last access 6/16/2026 - https://emojipedia.org/
function showError(message) {
	$("#errorArea").html('<div class="error-message">⚠️ ' + message + "</div>");
	$("#tableDisplay").html(
		"<p class='text-danger mt-3'>Waiting for valid input...</p>",
	);
}
// Clear error message
function clearError() {
	$("#errorArea").html("");
}

// check to ensure min <= max for both axes (row and column
function checkMinMax(minX, maxX, minY, maxY) {
	if (minX > maxX)
		return {
			valid: false,
			message: "Horizontal Row: Min must be less than or equal to Max",
		};
	if (minY > maxY)
		return {
			valid: false,
			message: "Vertical Column: Min must be less than or equal to Max",
		};
	return { valid: true, message: "" };
}

//  Check if table size is reasonable (max 2500 cells)
function checkTableSize(minX, maxX, minY, maxY) {
	// Calculate table size to prevent too big of a table
	// if user enter -50 to 50 for x and y -50 to 50 = 100(x rows) * 100(y rows) = 10000
	// 10000 > 2500 yes don't make the table too big
	let totalCells = (Math.abs(maxX - minX) + 1) * (Math.abs(maxY - minY) + 1);
	if (totalCells > 2500) {
		return {
			valid: false,
			message: `Table too large (${totalCells} cells). Please use smaller ranges (max 2500 cells).`,
		};
	}
	return { valid: true, message: "" };
}
// Check if any field is blank or empty(fall back if jquery fails for some reason)
function isAnyFieldBlank(minX, maxX, minY, maxY) {
	return isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY);
}

// updates the live preview table when user enter data/moves slider around
function updateTableLivePreview() {
	if (!$("#tableForm").valid()) {
		$("#tableDisplay").html(
			"<p class='text-danger mt-3 p-5'>Please fix the errors above.</p>",
		);
		return;
	}

	let minX = parseInt($("#minX").val());
	let maxX = parseInt($("#maxX").val());
	let minY = parseInt($("#minY").val());
	let maxY = parseInt($("#maxY").val());

	// fall backs/double checks if jquery fails for some reason for most if not all errors for this table
	// if min is greater than max, blank numbers and table too big
	if (isAnyFieldBlank(minX, maxX, minY, maxY)) return;

	let minMaxCheck = checkMinMax(minX, maxX, minY, maxY);
	if (!minMaxCheck.valid) {
		showError(minMaxCheck.message);
		return;
	}

	let sizeCheck = checkTableSize(minX, maxX, minY, maxY);
	if (!sizeCheck.valid) {
		showError(sizeCheck.message);
		return;
	}

	clearError();
	let tableHTML = generateUserTable(minX, maxX, minY, maxY);
	$("#tableDisplay").html(tableHTML);
}

$(document).ready(function () {
	// Initialize Tabs
	$("#tabs").tabs();

	// Setup Sliders/user manually input
	const inputs = ["minX", "maxX", "minY", "maxY"];

	inputs.forEach((id) => {
		let inputField = $(`#${id}`);
		let sliderDiv = $(`#slider-${id}`);

		// slider numbers - updates the live preview when user is using it
		sliderDiv.slider({
			min: minNumber,
			max: maxNumber,
			value: inputField.val(),
			slide: function (event, ui) {
				inputField.val(ui.value);
				inputField.valid();
				updateTableLivePreview();
			},
		});

		// user input/typing numbers
		inputField.on("input keyup", function () {
			let userNumberInput = parseInt($(this).val());
			if (
				!isNaN(userNumberInput) &&
				userNumberInput >= minNumber &&
				userNumberInput <= maxNumber
			) {
				sliderDiv.slider("value", userNumberInput);
			}
			$(this).valid();
			updateTableLivePreview();
		});
	});

	// rules/what's require from user input
	$("#tableForm").validate({
		rules: {
			minX: { required: true, number: true, min: minNumber, max: maxNumber },
			maxX: { required: true, number: true, min: minNumber, max: maxNumber },
			minY: { required: true, number: true, min: minNumber, max: maxNumber },
			maxY: { required: true, number: true, min: minNumber, max: maxNumber },
		},
		// error messages for user
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
		// simple error messages
		errorPlacement: function (error, element) {
			// Place error right after the slider container(below it)
			error.insertAfter(element.closest(".input-group").next("div"));
			error.addClass("text-danger small d-block mt-1");
		},

		// Create a new Tab containing the generated table from whatever inputs data the user enter
		submitHandler: function (form, event) {
			event.preventDefault();

			let minX = parseInt($("#minX").val());
			let maxX = parseInt($("#maxX").val());
			let minY = parseInt($("#minY").val());
			let maxY = parseInt($("#maxY").val());

			// double check both table size and min>max
			if (
				!checkMinMax(minX, maxX, minY, maxY).valid ||
				!checkTableSize(minX, maxX, minY, maxY).valid
			) {
				return;
			}

			// create the tab header/new tabs for saved tabes generated
			let tabId = `tab-${tabCounter}`;
			let tabTitle = `[${minX}, ${maxX}] × [${minY}, ${maxY}]`;
			let newTableTab = `
                <li>
                    <input type="checkbox" class="tab-checkbox" data-tab-id="${tabId}" title="Select for deletion" style="margin: 0 4px;">
                    <a href="#${tabId}">${tabTitle}</a>
                    <span class="ui-icon ui-icon-close delete-single-tab" role="presentation" title="Remove Tab" style="cursor: pointer;"></span>
                </li>`;

			$("#tabs .ui-tabs-nav").append(newTableTab);

			// Create the tab content box(the tabs with user tables that were generated)
			let tableHTML = generateUserTable(minX, maxX, minY, maxY);
			let tabContent = `
                <div id="${tabId}">
                    <div class="table-container">${tableHTML}</div>
                </div>`;
			$("#tabs").append(tabContent);

			// Refresh Tabs(adding them/switching between them)
			$("#tabs").tabs("refresh");
			$("#tabs").tabs("option", "active", -1); // whatever tab user clicks on is now the main tab
			tabCounter++;
		},
	});

	// Generate the tables for user live
	updateTableLivePreview();

	// Tab deletes when click on the x on tab
	$("#tabs").on("click", ".delete-single-tab", function () {
		let targetTabToRemove = $(this)
			.closest("li")
			.remove()
			.attr("aria-controls");
		$(`#${targetTabToRemove}`).remove();
		$("#tabs").tabs("refresh");
	});

	// select delete button for selected tabs that has a check mark on it if not ignores it
	$("#deleteSelectedTabsBtn").on("click", function () {
		$(".tab-checkbox:checked").each(function () {
			let targetTabToRemove = $(this).attr("data-tab-id");
			$(`#${targetTabToRemove}`).remove();
			$(this).closest("li").remove();
		});
		$("#tabs").tabs("refresh");
	});

	// the reset button
	$("#resetBtn").on("click", function () {
		$("#minX, #minY").val("1");
		$("#maxX, #maxY").val("5");

		$("#slider-minX, #slider-minY").slider("value", 1);
		$("#slider-maxX, #slider-maxY").slider("value", 5);

		$("#tableForm").validate().resetForm();
		clearError();
		updateTableLivePreview();
	});
});
