const singlePlayerBtn = document.querySelector(".single-play");
const twoPlayerBtn = document.querySelector(".two-play");
const gameSpace = document.querySelector(".game");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const bannerHeading = document.querySelector(".banner-h1");
const playerX = document.querySelector(".x-player");
const playerO = document.querySelector(".o-player");
const xScore = document.querySelector(".x-score");
const oScore = document.querySelector(".o-score");

const resetBtn = document.querySelector(".reset");

function createNewElement(tagName, classToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classToAdd;
	newEl.innerText = contentOfEl;
	return newEl;
}

const count = 5;

function makeMap(count) {
	let gameMap = [];
	for (let i = 0; i < count; i++) {
		let row = [];
		for (let j = 0; j < count; j++) {
			row.push("");
		}
		gameMap.push(row);
	}
	return gameMap;
}

const savedGame = localStorage.getItem("game");
let isSinglePlayerGame;
const x = "❌";
const o = "⭕️";
let nextMove = o;
let humanIcon = x;
let computerIcon = o;

if (savedGame) {
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.add("changed")
	);
	const savedSingle = localStorage.getItem("singlePlayer");
	isSinglePlayerGame = !!savedSingle;
	let scores = JSON.parse(localStorage.getItem("scores"));
	xScore.innerText = scores[0];
	oScore.innerText = scores[1];
}

let gameMap = savedGame ? JSON.parse(savedGame) : makeMap(count);

drawGameGrid(gameMap);

function drawGameGrid(gameMap) {
	gameSpace.innerHTML = "";
	gameMap.forEach((col, i) => {
		let cellId = i.toString();
		let column = createNewElement("section", "column", "");
		gameSpace.appendChild(column);
		col.forEach((el, j) => {
			const cell = createNewElement("div", "cell", el);
			cell.style.height = `calc(100%/${count})`;
			cell.id = cellId + j.toString();
			column.appendChild(cell);
			cell.addEventListener("click", (e) => {
				playGame(e.target.id);
				localStorage.setItem("game", JSON.stringify(gameMap));
			});
		});
	});
}

singlePlayerBtn.addEventListener("click", () => {
	localStorage.removeItem("game");
	localStorage.removeItem("singlePlayer");
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.add("changed")
	);
	isSinglePlayerGame = true;
	localStorage.setItem("singlePlayer", isSinglePlayerGame);
	showWhoGoes(humanIcon);
});

twoPlayerBtn.addEventListener("click", () => {
	localStorage.removeItem("game");
	localStorage.removeItem("singlePlayer");
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.add("changed")
	);
	isSinglePlayerGame = false;
	localStorage.setItem("singlePlayer", isSinglePlayerGame);
});

resetBtn.addEventListener("click", () => {
	localStorage.clear();
	nextMove = o;
	humanIcon = x;
	computerIcon = o;
	localStorage.removeItem("scores");
	xScore.innerText = "0";
	oScore.innerText = "0";
	gameMap = makeMap(count);
	drawGameGrid(gameMap);
});

function playGame(cellId) {
	if (checkIfCellIsEmpty(cellId)) {
		if (isSinglePlayerGame) {
			humanMove(cellId, humanIcon);
			computerMove(computerIcon);
		} else {
			showWhoGoes(nextMove);
			nextMove = nextMove === x ? o : x;
			fillGameMap(cellId, nextMove);
			drawGameGrid(gameMap);
		}
	}
	checkForWins();
}

function checkIfCellIsEmpty(cellId) {
	const [coord1, coord2] = getCoordinates(cellId);
	return gameMap[coord1][coord2] === "";
}

function getCoordinates(cellId) {
	const selectedCellId = cellId.split("");
	const numCoords = selectedCellId.map((coordinate) => {
		return Number(coordinate);
	});
	return numCoords;
}

function humanMove(cellId, humanIcon) {
	fillGameMap(cellId, humanIcon);
	drawGameGrid(gameMap);
}

function fillGameMap(cellId, sym) {
	const [coord1, coord2] = getCoordinates(cellId);
	gameMap[coord1][coord2] = sym;
}

function computerMove(computSym) {
	if (checkIfNoOneWon()) {
		endGame("NO ONE WON :(");
	} else {
		let computerMoveId;
		do {
			computerMoveId = generateRandomId(count);
		} while (!checkIfCellIsEmpty(computerMoveId));
		fillGameMap(computerMoveId, computSym);
		drawGameGrid(gameMap);
	}
}

function generateRandomId(count) {
	let coord1 = Math.floor(Math.random() * count).toString();
	let coord2 = Math.floor(Math.random() * count).toString();
	return coord1 + coord2;
}

function showWhoGoes(nextMove) {
	playerX.style.textShadow = nextMove === x ? "#FC0 1px 0 30px" : "none";
	playerO.style.textShadow = nextMove === o ? "#FC0 1px 0 30px" : "none";
}

function checkForWins() {
	let xWins = checkWinningCombos(x, gameMap);
	let oWins = checkWinningCombos(o, gameMap);

	if (oWins || xWins) {
		addPoints(xWins ? xScore : oScore);
		localStorage.setItem(
			"scores",
			JSON.stringify([xScore.innerText, oScore.innerText])
		);
		endGame(xWins ? "❌ WON" : "⭕️ WON");

		return;
	}

	if (checkIfNoOneWon()) {
		endGame("NO ONE WON :(");
	}
}

function checkIfNoOneWon() {
	return gameMap.every((col) => col.every((cell) => cell !== ""));
}

function checkWinningCombos(sym, gridToCheck) {
	return (
		checkColCombos(sym, gridToCheck) ||
		checkRowCombos(sym, gridToCheck) ||
		checkDiagonalCombos(sym, gridToCheck)
	);
}

function checkColCombos(sym, gridToCheck) {
	return gridToCheck.some((row) => {
		return row.every((value) => value === sym);
	});
}

function checkRowCombos(sym, gridToCheck) {
	for (let i = 0; i < gridToCheck.length; i++) {
		let row = [];
		gridToCheck.forEach((col) => {
			row.push(col[i]);
		});
		if (row.every((value) => value === sym)) return true;
	}
	return false;
}

function checkDiagonalCombos(sym, gridToCheck) {
	// from left to right
	let diagon = [];
	for (let i in gridToCheck) {
		diagon.push(gridToCheck[i][i]);
	}
	if (diagon.every((value) => value === sym)) {
		return true;
	}
	//from right to left
	diagon = [];
	j = gridToCheck.length - 1;
	for (let i = 0; i < gridToCheck.length; i++) {
		diagon.push(gridToCheck[i][j]);
		j--;
	}

	return diagon.every((value) => value === sym);
}

function addPoints(scoreToIncrease) {
	let points = parseInt(scoreToIncrease.innerText);
	points++;
	scoreToIncrease.innerText = points.toString();
}

function endGame(text) {
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.remove("changed")
	);
	bannerHeading.innerText = text;

	singlePlayerBtn.innerText = isSinglePlayerGame
		? "Play Again?"
		: "SINGLE PLAYER";
	twoPlayerBtn.innerText = isSinglePlayerGame ? "TWO PLAYERS" : "Play Again?";

	// localStorage.clear();
	gameMap = makeMap(count);
	drawGameGrid(gameMap);
	humanIcon = humanIcon === x ? o : x;
	computerIcon = computerIcon === x ? o : x;
}
