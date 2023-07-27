const playBtn = document.querySelector(".play-btn");
const banner = document.querySelector(".banner");
const scoreBoard = document.querySelector(".score-board");
const cells = document.querySelectorAll(".cell");

function createNewElement(tagName, classesToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classesToAdd.join(" ");
	newEl.innerText = contentOfEl;
	return newEl;
}


let gameGrid = [
	["1", "4", "7"],
	["2", "5", "8"],
	["3", "6", "9"],
];

// gameGrid[0][0] = 1
// gameGrid[0][1] = 4
// gameGrid[0][2] = 7

// gameGrid[1][0] = 2
// gameGrid[1][1] = 5
// gameGrid[1][2] = 8

// gameGrid[2][0] = 3
// gameGrid[2][1] = 6
// gameGrid[2][2] = 9

gameGrid.forEach((row, i) => {
	console.log("row index", i);
	row.forEach((cell, index) => {
		console.log("cell index: ", index);
		console.log("cell value", cell);
	});
});

playBtn.addEventListener("click", startGame);

function startGame() {
	banner.style.display = "none";
	scoreBoard.style.display = "inline-block";
}

const x = "❌";
const o = "⭕️";
let count = 0;

cells.forEach((cell, i) => {
	cell.addEventListener("click", (e) => {
		if (!e.target.innerText) {
			console.log(i);
			count++;
			e.target.innerText = count % 2 === 0 ? o : x;
		}
	});
});

function playGame() {}

