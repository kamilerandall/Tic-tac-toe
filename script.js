const playBtn = document.querySelector(".play-btn");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const gameSpace = document.querySelector(".game");
const bannerHeading = document.querySelector(".banner-h1");
const playerX = document.querySelector(".x-player");
const playerO = document.querySelector(".o-player");

const x = "❌";
const o = "⭕️";
let winner = "";
let moveCount = 0;
let nextMove = o;

playBtn.addEventListener("click", () => {
	banner.style.display = "none";
	scoreBoard.style.display = "inline-block";
	gameSpace.style.display = "flex";
});

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

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => {
	cell.addEventListener("click", (e) => {
		console.log(winner);
		if (!winner) {
			playGame(e.target);
		}
	});
});

function playGame(cell) {
	if (!cell.innerText) {
		moveCount++;
		showWhoGoes(nextMove);
		nextMove = nextMove === x ? o : x;
		cell.innerText = nextMove;
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
			concludeGame(winner);
		} else if (!winner && moveCount === 9) {
			resetBoard("NO ONE WON :(");
		}
	});
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
	moveCount = 0;
	banner.style.display = "block";
	gameSpace.style.display = "none";
	bannerHeading.innerText = text;
	playBtn.innerText = "Play Again?";
	const wholeGrid = document.querySelectorAll(".cell");
	wholeGrid.forEach((cell) => {
		cell.innerText = "";
	});
	winner = "";
}

// 00 10 20
// 01 11 21
// 02 12 22
