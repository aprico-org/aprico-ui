/*
 *  Logic for test index.html page
 */


// 1. Render aprico-ui

const apricoUi = require('./aprico-ui.js');

apricoUi('#aprico');


// 2. Display version table

let versions = JSON.stringify(
	apricoUi.version, 
	(key, value) => (typeof value === "string") ? " v" + value : value, 
	""
);

versions = versions.replace(/{|}|"/g, '');

document.getElementById('aprico-version').textContent = versions.replace(/,/g, "\r\n");