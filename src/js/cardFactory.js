/* eslint-disable */
export default class CardFactory {
	constructor() {
		this.cards = [];
	}

	newCard(btn) {
		if (!btn.parentNode.querySelector('.textField')) {
			const addCardDiv = document.createElement('DIV');
			addCardDiv.setAttribute('class', 'cardFill');
			btn.parentNode.insertBefore(addCardDiv, btn);

			const textArea = document.createElement('TEXTAREA');
			textArea.setAttribute('name', btn.className);
			textArea.setAttribute('class', 'textField');
			textArea.setAttribute('placeholder', 'Your text here...');
			textArea.setAttribute('cols', 54);
			addCardDiv.appendChild(textArea);

			const addCardBtn = document.createElement('BUTTON');
			addCardBtn.setAttribute('class', 'addCardBtn');
			addCardDiv.appendChild(addCardBtn);

			const crossBtn = document.createElement('BUTTON');
			crossBtn.setAttribute('class', 'crossBtn');
			addCardDiv.appendChild(crossBtn);
		}
	}

	addCard(btn) {
		const text = btn.parentNode.querySelector('.textField').value;
		const card = document.createElement('DIV');
		const id = performance.now();

		card.classList.add('card', 'grab');
		card.setAttribute('id', id);
		card.textContent = text;

		this.cards.push({
			id,
			card,
		});
		btn.parentNode.parentNode.insertBefore(card, btn.parentNode.nextSibling);
		btn.parentNode.remove();

		const cardCloseCross = document.createElement('BUTTON');
		cardCloseCross.setAttribute('class', 'cardCross');
		card.appendChild(cardCloseCross);
	}

	disCard(btn) {
		btn.parentNode.remove();
	}

	delCard(btn) {
		btn.parentNode.remove();
	}
}
