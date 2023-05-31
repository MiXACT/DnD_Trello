import CardFactory from './cardFactory';

// раскомментировать строку ниже для очищения хранилища
// localStorage.clear();

// сохранение объекта, содержащего колонки с карточками
const workPanel = document.querySelector('.work_panel');

// загрузка данных из хранилища
const pageStorage = localStorage.getItem('page');
if (pageStorage) {
	const { children } = workPanel;
	for (let node = children.length - 1; node >= 0; node -= 1) {
		children[node].remove();
	}
	workPanel.insertAdjacentHTML('afterbegin', pageStorage);
}

// обработка события click на кнопках
const card = new CardFactory();
workPanel.addEventListener('click', (e) => {
	if (e.target.className === 'btn todo_btn'
	|| e.target.className === 'btn progress_btn'
	|| e.target.className === 'btn done_btn') card.newCard(e.target);
	else if (e.target.className === 'addCardBtn') card.addCard(e.target);
	else if (e.target.className === 'crossBtn') card.disCard(e.target);
	else if (e.target.className === 'cardCross') card.delCard(e.target);

	// сохранение результата действий пользователя в хранилище
	localStorage.setItem('page', workPanel.innerHTML);
});

// создание узла с пустым местом для подсказки при перетаскивании элементов
const freeSpace = document.createElement('div');
freeSpace.classList.add('empty');

let actualElement;

// обработка событий при перетаскивании карточек
workPanel.addEventListener('mousedown', (e) => {
	if (!e.target.classList.contains('card')) return;
	// e.preventDefault();
	actualElement = e.target;
	const parentBlock = actualElement.parentNode;
	const nextEl = actualElement.nextElementSibling;
	const elHeight = actualElement.offsetHeight;

	// определение сдвига для позиционирования курсора в месте захвата карточки
	const shiftX = e.clientX - actualElement.getBoundingClientRect().left;
	const shiftY = e.clientY - actualElement.getBoundingClientRect().top;

	// изменение позиционирования эл-та на absolute
	actualElement.classList.remove('card');
	actualElement.classList.add('dragged');

	actualElement.style.height = `${elHeight}px`;

	// ф-ия определяет, над каким эл-ом перетаскиваемый объект
	function getElementUnderCursor(x, y) {
		actualElement.style.display = 'none';
		const elementUnder = document.elementFromPoint(x, y);
		actualElement.style.display = '';
		return elementUnder;
	}

	// ф-ия изменения координат перетаскиваемого объекта
	function moveAt(pageX, pageY) {
		actualElement.style.left = `${pageX - shiftX}px`;
		actualElement.style.top = `${pageY - shiftY}px`;
	}

	// ф-ия обработчика события mousemove
	// eslint-disable-next-line
	function onMouseMove(e) {
		const elUnder = getElementUnderCursor(e.pageX, e.pageY);
		moveAt(e.pageX, e.pageY);
		const spaceSize = actualElement.offsetHeight;
		freeSpace.style.height = `${spaceSize}px`;
		if (elUnder.classList.contains('card')) {
			freeSpace.remove();
			const cardCentre = elUnder.getBoundingClientRect().bottom - elUnder.offsetHeight / 2;
			if (cardCentre > e.pageY) elUnder.parentNode.insertBefore(freeSpace, elUnder);
			else elUnder.parentNode.insertBefore(freeSpace, elUnder.nextSibling);
		} else if ((elUnder.classList.contains('block') || elUnder.closest('.block'))
		&& elUnder.closest('.block').children.length === 1) {
			freeSpace.remove();
			elUnder.closest('.block').insertBefore(freeSpace, elUnder.closest('.block').lastElementChild);
		}
	}

	document.addEventListener('mousemove', onMouseMove);

	// eslint-disable-next-line
	document.onmouseup = function (e) {
		const mouseUpItem = getElementUnderCursor(e.pageX, e.pageY);
		actualElement.classList.remove('dragged');
		actualElement.classList.add('card');
		actualElement.style.top = '';
		actualElement.style.left = '';
		actualElement.style.width = '';
		actualElement.style.height = '';
		if (mouseUpItem.classList.contains('card') || mouseUpItem.className === 'empty') {
			mouseUpItem.parentNode.insertBefore(actualElement, freeSpace);
		} else parentBlock.insertBefore(actualElement, nextEl);
		freeSpace.remove();
		document.removeEventListener('mousemove', onMouseMove);
		document.onmouseup = null;
	};
});
