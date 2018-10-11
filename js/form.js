'use strict';
(function () {
  var HUNDRED_ROOMS = '100';
  var NOT_FOR_GUESTS = '0';
  var form = document.querySelector('.ad-form');
  var typeInput = form.querySelector('#type');
  var titleInput = form.querySelector('#title');
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
      var roomValue = value === HUNDRED_ROOMS ? NOT_FOR_GUESTS : value;
      capacityOptions.forEach(function (item) {
        var flag = true;
        if ((item.value > NOT_FOR_GUESTS && item.value <= roomValue) || (roomValue === NOT_FOR_GUESTS && item.value === roomValue)) {
          flag = false;
        }
        item.disabled = flag;
      });
      capacityInput.value = roomValue;
    };
    disableCapacityOptions(roomInputValue);
  };
  limitationCapacity();

  var onRoomNumberInputChange = function () {
    limitationCapacity();
  };
  roomNumberInput.addEventListener('change', onRoomNumberInputChange);

  // validation

  var submitButton = form.querySelector('.ad-form__submit');
  var BorderColor = {
    error: 'red',
    valid: '#d9d9d3'
  };
  var checkInputValidation = function (input) {
    input.style.borderColor = !input.validity.valid ? BorderColor.error : BorderColor.valid;
  };

  var onTitleInput = function () {
    checkInputValidation(titleInput);
  };
  titleInput.addEventListener('input', onTitleInput);

  var onPriceInput = function () {
    checkInputValidation(priceInput);
  };
  priceInput.addEventListener('input', onPriceInput);

  var onSubmitButtonClick = function () {
    checkInputValidation(titleInput);
    checkInputValidation(priceInput);
  };
  submitButton.addEventListener('click', onSubmitButtonClick);

  var resetInputsBorder = function () {
    var formInputs = form.querySelectorAll('input');
    formInputs.forEach(function (item) {
      item.style.borderColor = BorderColor.valid;
    });
  };

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

      window.map.removeCard();
      form.reset();
    };

    var onError = function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorText = errorElement.querySelector('.error__message');
      var errorButton = errorElement.querySelector('.error__button');
      var onErrorButtonClick = function () {
        errorElement.remove();
        errorButton.removeEventListener('click', onErrorButtonClick);
      };
      errorText.textContent = errorMessage;
      errorButton.addEventListener('click', onErrorButtonClick);
      window.map.mainContainer.insertAdjacentElement('afterbegin', errorElement);

      var onErrorElementClick = function () {
        errorElement.remove();
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

    window.backend.request(onSuccess, onError, window.backend.Upload.url, window.backend.Upload.method, formData);
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
    window.map.removePins();
    resetMainPinPosition();
    setDefaultPriceInput();
    resetInputsBorder();
    form.reset();
  };
  resetFormButton.addEventListener('click', onResetFormButtonClick);

  window.form = {
    resetMainPinPosition: resetMainPinPosition,
    defaultPriceValue: setDefaultPriceInput
  };
})();
