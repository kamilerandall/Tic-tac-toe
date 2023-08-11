const singlePlayerBtn = document.querySelector(".single-play");
const twoPlayerBtn = document.querySelector(".two-play");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const gameSpace = document.querySelector(".game");
const bannerHeading = document.querySelector(".banner-h1");
const playerX = document.querySelector(".x-player");
const playerO = document.querySelector(".o-player");
const count = 4;

function createNewElement(tagName, classToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classToAdd;
	newEl.innerText = contentOfEl;
	return newEl;
}

function makeGameGrid(count) {
	for (let i = 0; i < count; i++) {
		let cellId = i.toString();
		let column = createNewElement("section", "column", "");
		gameSpace.appendChild(column);
		for (let j = 0; j < count; j++) {
			const cell = createNewElement("div", "cell", "");
			cell.style.height = `calc(100%/${count})`;
			cell.id = cellId + j.toString();
			column.appendChild(cell);
		}
	}
}

function makeGridToCheck(count) {
	let gridToCheck = [];
	for (let i = 0; i < count; i++) {
		let row = [];
		for (let j = 0; j < count; j++) {
			row.push("");
		}
		gridToCheck.push(row);
	}
	return gridToCheck;
}

makeGameGrid(count);

let isSinglePlayerGame;
const x = "❌";
const o = "⭕️";
let nextMove = o;
let humanIcon = x;
let computerIcon = o;
let gridToCheck = makeGridToCheck(count);

singlePlayerBtn.addEventListener("click", () => {
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.add("changed")
	);
	isSinglePlayerGame = true;
	showWhoGoes(humanIcon);
});

twoPlayerBtn.addEventListener("click", () => {
	[banner, scoreBoard, gameSpace].forEach((item) =>
		item.classList.add("changed")
	);
	isSinglePlayerGame = false;
});

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
	cell.addEventListener("click", (e) => {
		playGame(e.target);
	});
});
const allCellsArray = Array.from(cells);

function playGame(cell) {
	if (!cell.innerText) {
		if (isSinglePlayerGame) {
			cell.innerText = humanIcon;
			fillGridToCheck(cell, humanIcon);
			computerMove(computerIcon);
		} else {
			showWhoGoes(nextMove);
			nextMove = nextMove === x ? o : x;
			cell.innerText = nextMove;
			fillGridToCheck(cell, nextMove);
		}
	}
	checkForWins();
}

function fillGridToCheck(cell, sym) {
	let selectedCellId = cell.id.split("");
	let firstCoord = Number(selectedCellId[0]);
	let secondCoord = Number(selectedCellId[1]);
	gridToCheck[firstCoord][secondCoord] = sym;
}

function computerMove(computSym) {
	const emptyCells = allCellsArray.filter((cell) => !cell.innerText);
	if (emptyCells.length === 0) {
		endGame("NO ONE WON :(");
	} else {
		const randomIndex = Math.floor(Math.random() * emptyCells.length);
		const computerId = emptyCells[randomIndex].id;
		cells.forEach((cell) => {
			if (cell.id === computerId) {
				cell.innerText = computSym;
				fillGridToCheck(cell, computSym);
			}
		});
	}
}

function showWhoGoes(nextMove) {
	playerX.style.textShadow = nextMove === x ? "#FC0 1px 0 30px" : "none";
	playerO.style.textShadow = nextMove === o ? "#FC0 1px 0 30px" : "none";
}

function checkForWins() {
	let xWins = checkWinningCombos(x, gridToCheck);
	let oWins = checkWinningCombos(o, gridToCheck);

	if (oWins || xWins) {
		const xScore = document.querySelector(".x-score");
		const oScore = document.querySelector(".o-score");

		addPoints(xWins ? xScore : oScore);
		endGame(xWins ? "❌ WON" : "⭕️ WON");

		return;
	}

	if (allCellsArray.every((cell) => cell.innerText)) {
		endGame("NO ONE WON :(");
	}
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

	cells.forEach((cell) => {
		cell.innerText = "";
	});
	gridToCheck = makeGridToCheck(count);
	humanIcon = humanIcon === x ? o : x;
	computerIcon = computerIcon === x ? o : x;
}
