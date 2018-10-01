'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var PIN_ARROW_HEIGHT = 22;
  var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var ESC_KEYCODE = 27;
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeCardPopup();
    }
  };

  var onMarkClick = function (evt, ad) {
    removeCardPopup();
    document.addEventListener('keydown', onPopupEscPress);
    fragment.appendChild(window.card.render(ad));
    map.appendChild(fragment);
  };

  var removeCardPopup = function () {
    if (document.querySelector('.map__card')) {
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

  var addMarks = function () {
    var onSuccess = function (ads) {
      for (var i = 0; i < ads.length; i++) {
        fragment.appendChild(renderMark(ads[i]));
      }
      mapPins.appendChild(fragment);
    };

    var onError = function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorElement = errorTemplate.cloneNode(true);
      var errorText = errorElement.querySelector('.error__message');
      var errorButton = errorElement.querySelector('.error__button');
      var onErrorButtonClick = function () {
        document.querySelector('.error').remove();
        errorButton.removeEventListener('click', onErrorButtonClick);
        window.backend.loadData(onSuccess, onError);
      };
      errorText.textContent = errorMessage;
      errorButton.addEventListener('click', onErrorButtonClick);
      document.body.insertAdjacentElement('afterbegin', errorElement);
    };

    window.backend.loadData(onSuccess, onError);
  };

  window.map = {
    addMarks: addMarks,
    removeCard: removeCardPopup,
    element: map,
    pins: mapPins,
    pinArrowHeight: PIN_ARROW_HEIGHT,
    fragment: fragment
  };
})();
