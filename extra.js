function createNewElement(tagName, classesToAdd, contentOfEl) {
	let newEl = document.createElement(tagName);
	newEl.className = classesToAdd.join(" ");
	newEl.innerText = contentOfEl;
	return newEl;
}
