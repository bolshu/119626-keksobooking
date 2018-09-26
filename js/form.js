'use strict';

var form = document.querySelector('.ad-form');
var typeInput = form.querySelector('#type');
var priceInput = form.querySelector('#price');
var timeInInput = form.querySelector('#timein');
var timeOutInput = form.querySelector('#timeout');
var roomNumberInput = form.querySelector('#room_number');
var capacityInput = form.querySelector('#capacity');

var limitationPrice = function () {
  switch (typeInput.value) {
    case 'flat':
      priceInput.placeholder = window.card.TYPES.flat.minPrice;
      priceInput.min = window.card.TYPES.flat.minPrice;
      break;
    case 'house':
      priceInput.placeholder = window.card.TYPES.house.minPrice;
      priceInput.min = window.card.TYPES.house.minPrice;
      break;
    case 'palace':
      priceInput.placeholder = window.card.TYPES.palace.minPrice;
      priceInput.min = window.card.TYPES.palace.minPrice;
      break;
    default:
      priceInput.placeholder = window.card.TYPES.bungalo.minPrice;
      priceInput.min = window.card.TYPES.bungalo.minPrice;
  }
};
limitationPrice();

var onTypeInputChange = function () {
  limitationPrice();
};
typeInput.addEventListener('change', onTypeInputChange);

var syncTime = function (changeElem, repeatElem) {
  repeatElem.value = changeElem.value;
};

var onTimeInInputChange = function () {
  syncTime(timeInInput, timeOutInput);
};
timeInInput.addEventListener('change', onTimeInInputChange);

var onTimeOutInputChange = function () {
  syncTime(timeOutInput, timeInInput);
};
timeOutInput.addEventListener('change', onTimeOutInputChange);

var limitationCapacity = function () {
  var roomInputValue = roomNumberInput.value;
  var capacityOptions = capacityInput.querySelectorAll('option');

  var disableCapacityOptions = function (value) {
    var HUNDRED_ROOMS = '100';
    var NOT_FOR_GUESTS = '0';
    var roomValue = value === HUNDRED_ROOMS ? NOT_FOR_GUESTS : value;
    for (var j = 0; j < capacityOptions.length; j++) {
      var flag = true;
      if ((capacityOptions[j].value > NOT_FOR_GUESTS && capacityOptions[j].value <= roomValue) || (roomValue === NOT_FOR_GUESTS && capacityOptions[j].value === roomValue)) {
        flag = false;
      }
      capacityOptions[j].disabled = flag;
    }
    capacityInput.value = roomValue;
  };
  disableCapacityOptions(roomInputValue);
};
limitationCapacity();

var onRoomNumberInputChange = function () {
  limitationCapacity();
};
roomNumberInput.addEventListener('change', onRoomNumberInputChange);
