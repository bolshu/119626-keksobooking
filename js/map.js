'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var PIN_ARROW_HEIGHT = 22;
  var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mainContainer = document.querySelector('main');
  var ADS_AMOUNT = 5;

  var ESC_KEYCODE = 27;
  var onPopupEscPress = function (keydownEvt) {
    if (keydownEvt.keyCode === ESC_KEYCODE) {
      removeCardPopup();
    }
  };

  var removeActiveMark = function () {
    var mapPinsCollection = mapPins.querySelectorAll('.map__pin');
    for (var i = 0; i < mapPinsCollection.length; i++) {
      mapPinsCollection[i].classList.remove('map__pin--active');
    }
  };

  var onMarkClick = function (evt, ad) {
    removeCardPopup();
    document.addEventListener('keydown', onPopupEscPress);
    fragment.appendChild(window.card.render(ad));
    map.appendChild(fragment);
    removeActiveMark();
    evt.currentTarget.classList.add('map__pin--active');
  };

  var removeCardPopup = function () {
    if (document.querySelector('.map__card')) {
      removeActiveMark();
      map.removeChild(document.querySelector('.map__card'));
    }
  };

  var renderMark = function (ad) {
    var markElement = markTemplate.cloneNode(true);
    var pinOffsetX = markElement.offsetWidth / 2;
    var pinOffsetY = markElement.offsetWidth + PIN_ARROW_HEIGHT;
    markElement.querySelector('img').src = ad.author.avatar;
    markElement.querySelector('img').alt = ad.offer.title;
    markElement.style.left = ad.location.x - pinOffsetX + 'px';
    markElement.style.top = ad.location.y - pinOffsetY + 'px';

    markElement.addEventListener('click', function (evt) {
      onMarkClick(evt, ad);
    });

    return markElement;
  };

  var fragment = document.createDocumentFragment();

  var removeFeedbackPopup = function (clickEvt) {
    clickEvt.currentTarget.remove();
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
    removeCardPopup();
  };

  var resetPage = function (element) {
    element.remove();
    window.pin.deactivatePage();
    window.form.resetMainPinPosition();
    window.form.defaultPriceValue();
    removePins();
  };

  var addPins = function (ads) {
    for (var i = 0; i < ADS_AMOUNT; i++) {
      if (ads[i] !== undefined) {
        fragment.appendChild(renderMark(ads[i]));
      } else {
        break;
      }
    }
    mapPins.appendChild(fragment);
  };

  var loadMarks = function () {
    var onSuccess = function (ads) {
      window.map.ads = ads;
      window.pin.activatePage();
      addPins(window.map.ads);
    };

    var onError = function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorText = errorElement.querySelector('.error__message');
      var errorButton = errorElement.querySelector('.error__button');

      var onErrorButtonClick = function () {
        document.querySelector('.error').remove();
        errorButton.removeEventListener('click', onErrorButtonClick);
        window.backend.request(onSuccess, onError, window.backend.load.url, window.backend.load.method);
      };

      errorText.textContent = errorMessage;
      errorButton.addEventListener('click', onErrorButtonClick);
      mainContainer.insertAdjacentElement('afterbegin', errorElement);

      var onEscPress = function (keydownEvt) {
        if (keydownEvt.keyCode === window.map.escButton && errorElement) {
          resetPage(errorElement);
          document.removeEventListener('keydown', onEscPress);
        }
      };
      document.addEventListener('keydown', onEscPress);

      var onErrorPopupClick = function (clickEvt) {
        removeFeedbackPopup(clickEvt);
        window.form.resetMainPinPosition();
        window.pin.deactivatePage();
        document.removeEventListener('keydown', onEscPress);
      };
      errorElement.addEventListener('click', onErrorPopupClick);
    };

    window.backend.request(onSuccess, onError, window.backend.load.url, window.backend.load.method);
  };

  window.map = {
    loadMarks: loadMarks,
    addPins: addPins,
    removePins: removePins,
    removeCard: removeCardPopup,
    element: map,
    pins: mapPins,
    pinArrowHeight: PIN_ARROW_HEIGHT,
    fragment: fragment,
    escButton: ESC_KEYCODE,
    removeFeedbackPopup: removeFeedbackPopup,
    resetPage: resetPage,
    mainContainer: mainContainer
  };
})();
