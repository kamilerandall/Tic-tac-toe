const singlePlayerBtn = document.querySelector(".single-play");
const twoPlayerBtn = document.querySelector(".two-play");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const gameSpace = document.querySelector(".game");
const bannerHeading = document.querySelector(".banner-h1");
const playerX = document.querySelector(".x-player");
const playerO = document.querySelector(".o-player");

function createNewElement(tagName, classToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classToAdd;
	newEl.innerText = contentOfEl;
	return newEl;
}

function makeGameGrid(columns, rows) {
	for (let i = 0; i < columns; i++) {
		let cellId = i.toString();
		let column = createNewElement("section", "column", "");
		gameSpace.appendChild(column);
		for (let j = 0; j < rows; j++) {
			const cell = createNewElement("div", "cell", "");
			cell.id = cellId + j.toString();
			column.appendChild(cell);
		}
	}
}

makeGameGrid(3, 3);

let isSinglePlayerGame;
const x = "❌";
const o = "⭕️";
let nextMove = o;
let humanIcon = x;
let computerIcon = o;

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
			computerMove(computerIcon);
		} else {
			showWhoGoes(nextMove);
			nextMove = nextMove === x ? o : x;
			cell.innerText = nextMove;
		}
	}

	checkForWins();
}

function showWhoGoes(nextMove) {
	playerX.style.textShadow = nextMove === x ? "#FC0 1px 0 30px" : "none";
	playerO.style.textShadow = nextMove === o ? "#FC0 1px 0 30px" : "none";
}

function checkForWins() {
	let xWins, oWins;
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
	function getCellIdsBySymbol(sym) {
		return allCellsArray
			.filter((item) => item.innerText.includes(sym))
			.map((el) => el.id);
	}

	winCombos.forEach((combo) => {
		xWins = combo.every((id) => getCellIdsBySymbol(x).includes(id));
		oWins = combo.every((id) => getCellIdsBySymbol(o).includes(id));

		if (oWins || xWins) {
			const xScore = document.querySelector(".x-score");
			const oScore = document.querySelector(".o-score");

			addPoints(xWins ? xScore : oScore);
			endGame(xWins ? "❌ WON" : "⭕️ WON");

			return;
		}
	});

	//allCells = Array.from(cells);
	if (allCellsArray.every((cell) => cell.innerText)) {
		endGame("NO ONE WON :(");
	}
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
	humanIcon = humanIcon === x ? o : x;
	computerIcon = computerIcon === x ? o : x;
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
			}
		});
	}
}
