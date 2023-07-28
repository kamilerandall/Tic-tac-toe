const playBtn = document.querySelector(".play-btn");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const gameSpace = document.querySelector(".game");
const bannerHeading = document.querySelector(".banner-h1");
const playerX = document.querySelector(".x-player");
const playerO = document.querySelector(".o-player");

const x = "❌";
const o = "⭕️";
let gameCount = 0;
let moveCount = 0;

function createNewElement(tagName, classToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classToAdd;
	newEl.innerText = contentOfEl;
	return newEl;
}

let gameGrid = [
	["", "", ""],
	["", "", ""],
	["", "", ""],
];

gameGrid.forEach((row, i) => {
	let cellId = i.toString();
	let column = createNewElement("section", "column", "");
	gameSpace.appendChild(column);
	row.forEach((cell, i) => {
		cell = createNewElement("div", "cell", "");
		cell.id = cellId + i.toString();
		column.appendChild(cell);
		cell.addEventListener("click", (e) => {
			playGame(e.target);
		});
	});
});

playBtn.addEventListener("click", startGame);

function startGame() {
	banner.style.display = "none";
	scoreBoard.style.display = "inline-block";
}

function playGame(cell) {
	if (!cell.innerText) {
		moveCount++;
		showWhoGoes(gameCount % 2);
		if (gameCount % 2 === 0) {
			cell.innerText = moveCount % 2 === 0 ? o : x;
		} else {
			cell.innerText = moveCount % 2 === 0 ? x : o;
		}
	}
	checkForWins();
}

function showWhoGoes(num) {
	if ((moveCount + num) % 2 === 0) {
		playerX.style.textShadow = "#FC0 1px 0 30px";
		playerO.style.textShadow = "none";
	} else {
		playerO.style.textShadow = "#FC0 1px 0 30px";
		playerX.style.textShadow = "none";
	}
}

function getClickedIdsBySymbol(sym) {
	const wholeGrid = document.querySelectorAll(".cell");
	let allCells = [];
	wholeGrid.forEach((cell) => {
		allCells.push(cell);
	});

	let allOfSelectedSym = allCells.filter((item) => {
		return item.innerText.includes(sym);
	});
	let onlyIds = allOfSelectedSym.map((el) => {
		return el.id;
	});
	return onlyIds;
}

function checkForWins() {
	let xWins, oWins, winner;
	const winCombos = [
		["00", "01", "02"],
		["10", "11", "12"],
		["20", "21", "22"],
		["00", "10", "20"],
		["01", "11", "21"],
		["02", "12", "22"],
		["00", "11", "22"],
		["02", "11", "20"],
	];

	winCombos.forEach((combo) => {
		xWins = combo.every((id) => {
			return getClickedIdsBySymbol(x).includes(id);
		});
		oWins = combo.every((id) => {
			return getClickedIdsBySymbol(o).includes(id);
		});

		if (oWins || xWins) {
			winner = xWins ? x : o;
			concludeGame(winner);
			return;
		} else if (!winner && moveCount === 9) {
			resetBoard("NO ONE WON :(");
		}
	});
}

function concludeGame(winner) {
	const xScore = document.querySelector(".x-score");
	const oScore = document.querySelector(".o-score");
	if (winner === x) {
		addPoints(xScore);
		resetBoard("❌ WON");
	} else if (winner === o) {
		addPoints(oScore);
		resetBoard("⭕️ WON");
	}
}

function resetBoard(text) {
	moveCount = 0;
	gameCount++;
	banner.style.display = "block";
	bannerHeading.innerText = text;
	playBtn.innerText = "Play Again?";
	const wholeGrid = document.querySelectorAll(".cell");
	wholeGrid.forEach((cell) => {
		cell.innerText = "";
	});
}

function addPoints(scoreToIncrease) {
	let points = parseInt(scoreToIncrease.innerText);
	points++;
	scoreToIncrease.innerText = points.toString();
}
// const winCombos = [
// 	["00", "01", "02"],
// 	["03", "04", "05"],
// 	["06", "07", "08"],
// 	["00", "03", "06"],
// 	["01", "04", "07"],
// 	["02", "05", "08"],
// 	["00", "04", "08"],
// 	["02", "04", "06"],
// ];

// 00 10 20
// 01 11 21
// 02 12 22

// 00 03 06
// 01 04 07
// 02 05 08
