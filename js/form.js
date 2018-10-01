'use strict';
(function () {
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
        priceInput.placeholder = window.card.types.flat.minPrice;
        priceInput.min = window.card.types.flat.minPrice;
        break;
      case 'house':
        priceInput.placeholder = window.card.types.house.minPrice;
        priceInput.min = window.card.types.house.minPrice;
        break;
      case 'palace':
        priceInput.placeholder = window.card.types.palace.minPrice;
        priceInput.min = window.card.types.palace.minPrice;
        break;
      default:
        priceInput.placeholder = window.card.types.bungalo.minPrice;
        priceInput.min = window.card.types.bungalo.minPrice;
    }
  };
  limitationPrice();

  var setDefaultPriceInput = function () {
    priceInput.placeholder = window.card.types.flat.minPrice;
    priceInput.min = window.card.types.flat.minPrice;
  };

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

  // send form

  var onFormSubmit = function (submitEvt) {
    var formData = new FormData(form);

    var onSuccess = function () {
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var successElement = successTemplate.cloneNode(true);
      window.map.mainContainer.insertAdjacentElement('afterbegin', successElement);

      var onSuccessElementClick = function (clickEvt) {
        window.map.removeFeedbackPopup(clickEvt);
        window.map.resetPage(successElement);
        document.removeEventListener('keydown', onEscPress);
      };
      successElement.addEventListener('click', onSuccessElementClick);

      var onEscPress = function (keydownEvt) {
        if (keydownEvt.keyCode === window.map.escButton && successElement) {
          window.map.resetPage(successElement);
          document.removeEventListener('keydown', onEscPress);
        }
      };
      document.addEventListener('keydown', onEscPress);

      resetMainPinPosition();

      window.map.removeCard();
      form.reset();
    };

    var onError = function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorText = errorElement.querySelector('.error__message');
      var errorButton = errorElement.querySelector('.error__button');
      var onErrorButtonClick = function () {
        document.querySelector('.error').remove();
        errorButton.removeEventListener('click', onErrorButtonClick);
        window.backend.request(onSuccess, onError, window.backend.upload.url, window.backend.upload.method, formData);
      };
      errorText.textContent = errorMessage;
      errorButton.addEventListener('click', onErrorButtonClick);
      window.map.mainContainer.insertAdjacentElement('afterbegin', errorElement);

      var onErrorElementClick = function (clickEvt) {
        window.map.removeFeedbackPopup(clickEvt);
        document.removeEventListener('keydown', onEscPress);
      };
      errorElement.addEventListener('click', onErrorElementClick);

      var onEscPress = function (keydownEvt) {
        if (keydownEvt.keyCode === window.map.escButton && errorElement) {
          errorElement.remove();
          document.removeEventListener('keydown', onEscPress);
        }
      };
      window.map.removeCard();
      document.addEventListener('keydown', onEscPress);
    };

    window.backend.request(onSuccess, onError, window.backend.upload.url, window.backend.upload.method, formData);
    submitEvt.preventDefault();
  };

  form.addEventListener('submit', onFormSubmit);

  var resetMainPinPosition = function () {
    var MainPinBasePosition = {
      top: 375,
      left: 570
    };
    window.pin.main.style.top = MainPinBasePosition.top + 'px';
    window.pin.main.style.left = MainPinBasePosition.left + 'px';
  };

  var resetFormButton = form.querySelector('.ad-form__reset');
  var onResetFormButtonClick = function (clickEvt) {
    clickEvt.preventDefault();
    window.pin.deactivatePage();
    window.form.resetMainPinPosition();
    window.map.clearPins();
    setDefaultPriceInput();
    form.reset();
  };

  resetFormButton.addEventListener('click', onResetFormButtonClick);

  window.form = {
    resetMainPinPosition: resetMainPinPosition,
    defaultPriceValue: setDefaultPriceInput
  };
})();
