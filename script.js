const singleBtn = document.querySelector(".single-play");
const twoPlayBtn = document.querySelector(".two-play");
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
			cell = createNewElement("div", "cell", "");
			cell.id = cellId + j.toString();
			column.appendChild(cell);
		}
	}
}

makeGameGrid(3, 3);

let twoPlayerGame, singlePlayerGame;
const x = "❌";
const o = "⭕️";
let winner = "";
let nextMove = o;
let humanIcon = x;
let computerIcon = o;

singleBtn.addEventListener("click", () => {
	banner.style.display = "none";
	scoreBoard.style.display = "inline-block";
	gameSpace.style.display = "flex";
	singlePlayerGame = true;
	twoPlayerGame = false;
	showWhoGoes(humanIcon);
});

twoPlayBtn.addEventListener("click", () => {
	banner.style.display = "none";
	scoreBoard.style.display = "inline-block";
	gameSpace.style.display = "flex";
	twoPlayerGame = true;
	singlePlayerGame = false;
});

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
	cell.addEventListener("click", (e) => {
		playGame(e.target);
		allCells = Array.from(cells);
		if (
			allCells.every((cell) => {
				return cell.innerText;
			})
		) {
			resetBoard("NO ONE WON :(");
		}
	});
});

function playGame(cell) {
	if (!cell.innerText) {
		if (twoPlayerGame) {
			showWhoGoes(nextMove);
			nextMove = nextMove === x ? o : x;
			cell.innerText = nextMove;
		} else if (singlePlayerGame) {
			cell.innerText = humanIcon;
			computerMove(computerIcon);
		}
	}

	checkForWins();
}

function showWhoGoes(nextMove) {
	if (nextMove === x) {
		playerX.style.textShadow = "#FC0 1px 0 30px";
		playerO.style.textShadow = "none";
	} else {
		playerO.style.textShadow = "#FC0 1px 0 30px";
		playerX.style.textShadow = "none";
	}
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

	winCombos.forEach((combo) => {
		xWins = combo.every((id) => {
			return getClickedIdsBySymbol(x).includes(id);
		});
		oWins = combo.every((id) => {
			return getClickedIdsBySymbol(o).includes(id);
		});

		if (oWins || xWins) {
			winner = xWins ? x : o;
			humanIcon = humanIcon === x ? o : x;
			computerIcon = computerIcon === x ? o : x;
			concludeGame(winner);
		}
	});
}

function getClickedIdsBySymbol(sym) {
	let allCells = Array.from(cells);

	let allOfSelectedSym = allCells.filter((item) => {
		return item.innerText.includes(sym);
	});
	let onlyIds = allOfSelectedSym.map((el) => {
		return el.id;
	});
	return onlyIds;
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

function addPoints(scoreToIncrease) {
	let points = parseInt(scoreToIncrease.innerText);
	points++;
	scoreToIncrease.innerText = points.toString();
}

function resetBoard(text) {
	banner.style.display = "block";
	gameSpace.style.display = "none";
	bannerHeading.innerText = text;
	if (singlePlayerGame) {
		singleBtn.innerText = "Play Again?";
		twoPlayBtn.innerText = "TWO PLAYERS";
	} else if (twoPlayerGame) {
		twoPlayBtn.innerText = "Play Again?";
		singleBtn.innerText = "SINGLE PLAYER";
	}
	const wholeGrid = document.querySelectorAll(".cell");
	wholeGrid.forEach((cell) => {
		cell.innerText = "";
	});
	winner = "";
}

function computerMove(computSym) {
	allCells = Array.from(cells);
	let emptyCells = allCells.filter((cell) => {
		return !cell.innerText;
	});
	if (emptyCells.length === 0) {
		resetBoard("NO ONE WON :(");
	} else {
		let randomIndex = Math.floor(Math.random() * emptyCells.length);
		let computerId = emptyCells[randomIndex].id;
		cells.forEach((cell) => {
			if (cell.id === computerId) {
				cell.innerText = computSym;
			}
		});
	}
}
