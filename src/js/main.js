/*
 *  Logic for test index.html page
 */


// 1. Render aprico-ui

const apricoUi = require('./aprico-ui.js');

apricoUi('#aprico');


// 2. Display version table

let versionTable = JSON.stringify(
	apricoUi.version, 
	(key, value) => (typeof value === "string") ? " v" + value : value, 
	""
);

versionTable = versionTable.replace(/{|}|"/g, '');

document.getElementById('aprico-version').textContent = versionTable.replace(/,/g, "\r\n");