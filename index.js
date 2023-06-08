import { menuArray } from './data.js';

const ordered = [];
let total = 0;
let couponApplied = false;

document.addEventListener('click', (e) => {
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add);
    } else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove);
    } else if (e.target.tagName === 'BUTTON' && e.target.textContent === 'Apply') {
        handleCouponApply();
    } else if (e.target.classList.contains('complete__btn')) {
        showCardDetailsPopup();
    }
});

function handleAddClick(addId) {
    const targetAddObj = menuArray.find((add) => add.id == addId);

    if (targetAddObj) {
        document.getElementById("checkout").style.display = "block";

        const checkObj = ordered.find((check) => check.id == targetAddObj.id);

        total += targetAddObj.price;
        if (couponApplied) {
            const discount = total * 0.1; // 10% discount
            document.querySelector('#total__price .prices').textContent = `$${(total - discount).toFixed(2)}`;
        } else {
            document.querySelector('#total__price .prices').textContent = `$${total.toFixed(2)}`;
        }

        if (!checkObj) {
            targetAddObj.quantity = "1";
            ordered.push(targetAddObj);
            const orderedHtml = `
        <div class="item__ordered" data-id="${targetAddObj.id}">
          <p class="ordered__name">${targetAddObj.name} <span data-remove="${targetAddObj.id}">remove</span> <span class="quantity">x${targetAddObj.quantity}</span></p>
          <p class="ordered__prices">$${targetAddObj.price.toFixed(2)}</p>
        </div>
      `;
            document.getElementById("list__ordered").innerHTML += orderedHtml;
        } else {
            checkObj.quantity++;
            document.querySelector(`[data-id="${checkObj.id}"] .quantity`).textContent = `x${checkObj.quantity}`;
            document.querySelector(`[data-id="${checkObj.id}"] .ordered__prices`).textContent = `$${(targetAddObj.price * checkObj.quantity).toFixed(2)}`;
        }
    }
}

function handleRemoveClick(removeId) {
    const index = ordered.findIndex((item) => item.id == removeId);
    if (index !== -1) {
        const removedItem = ordered[index];
        ordered.splice(index, 1);
        total -= removedItem.price * removedItem.quantity;
        if (couponApplied) {
            const discount = total * 0.1; // 10% discount
            document.querySelector('#total__price .prices').textContent = `$${(total - discount).toFixed(2)}`;
        } else {
            document.querySelector('#total__price .prices').textContent = `$${total.toFixed(2)}`;
        }
    }
    renderOrderedItems();
    if (ordered.length === 0) {
        document.getElementById("checkout").style.display = "none";
    }
}

function handleCouponApply() {
    const inputElement = document.querySelector('.input__text input');
    const couponCode = inputElement.value.trim();
    if (couponCode === 'haha') {
        couponApplied = true;
        const discount = total * 0.1; // 10% discount
        document.querySelector('#total__price .prices').textContent = `$${(total - discount).toFixed(2)}`;
        inputElement.disabled = true;
    } else {
        alert('Coupon is wrong');
    }
}

function showCardDetailsPopup() {
    document.querySelector('.container').style.pointerEvents = 'none';
    document.getElementById("popup").style.display = "block";

    const popupSubmitButton = document.querySelector('.popup__pay');
    popupSubmitButton.addEventListener('click', handleCardDetailsSubmit);
}

function handleCardDetailsSubmit() {
    const nameInput = document.getElementById('name');
    const cardNumberInput = document.getElementById('card-number');
    const cvvInput = document.getElementById('cvv');

    const name = nameInput.value.trim();
    const cardNumber = cardNumberInput.value.trim();
    const cvv = cvvInput.value.trim();

    const nameError = document.querySelector('.error__name');
    const cardNumberError = document.querySelector('.error__cardNumber');
    const cvvError = document.querySelector('.error__cvv');

    const nameRegex = /^[A-Za-z\s]+$/; 
    const cardNumberRegex = /^\d{16}$/; 
    const cvvRegex = /^\d{3}$/; 

    let isValid = true;

    if (!nameRegex.test(name)) {
        nameError.textContent = 'Please enter a valid card name.';
        isValid = false;
    } else {
        nameError.textContent = '';
    }

    if (!cardNumberRegex.test(cardNumber)) {
        cardNumberError.textContent = 'Please enter a valid card number.';
        isValid = false;
    } else {
        cardNumberError.textContent = '';
    }

    if (!cvvRegex.test(cvv)) {
        cvvError.textContent = 'Please enter a valid CVV.';
        isValid = false;
    } else {
        cvvError.textContent = '';
    }

    if (isValid) {
        closeCardDetailsPopup();
    }
}

function closeCardDetailsPopup() {
    document.querySelector('#popup').remove();
    document.querySelector('#checkout').remove();
    document.querySelector('.thank__you').style.display = 'flex';
}

function renderOrderedItems() {
    let orderedHtml = '';
    ordered.forEach((item) => {
        orderedHtml += `
      <div class="item__ordered" data-id="${item.id}">
        <p class="ordered__name">${item.name} <span data-remove="${item.id}">remove</span> <span class="quantity">x${item.quantity}</span></p>
        <p class="ordered__prices">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;
    });
    document.getElementById("list__ordered").innerHTML = orderedHtml;
}

function getMenuHtml() {
    let menuHtml = '';

    menuArray.forEach((food) => {
        const { id, emoji, name, ingredients, price } = food;
        menuHtml += `
      <div class="item" id="${id}">
        <p class="item__graphic">${emoji}</p>
        <div class="item__content">
          <h1 class="item__title">${name}</h1>
          <p class="item__description">${ingredients}</p>
          <p class="item__price">$${price.toFixed(2)}</p>
        </div>
        <button class="item__addBtn" data-add="${id}">+</button>
      </div>
    `;
    });

    return menuHtml;
}

function render() {
    document.getElementById('menu').innerHTML = getMenuHtml();
}

render();
