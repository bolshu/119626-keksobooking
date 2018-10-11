'use strict';

(function () {
  var TYPES = {
    flat: {
      ru: 'Квартира',
      minPrice: 1000
    },
    bungalo: {
      ru: 'Бунгало',
      minPrice: 0
    },
    house: {
      ru: 'Дом',
      minPrice: 5000
    },
    palace: {
      ru: 'Дворец',
      minPrice: 10000
    }
  };
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var onCardCloseBtnClick = function () {
    window.map.removeCard();
  };

  var renderCard = function (ad) {
    var cardElement = cardTemplate.cloneNode(true);

    var renderTextContent = function (elem, data) {
      if (data.length) {
        cardElement.querySelector(elem).textContent = data;
      } else {
        cardElement.querySelector(elem).style.display = 'none';
      }
    };
    renderTextContent('.popup__title', ad.offer.title);
    renderTextContent('.popup__text--address', ad.offer.address);
    renderTextContent('.popup__text--price', ad.offer.price + '₽/ночь');
    renderTextContent('.popup__type', TYPES[ad.offer.type].ru);
    renderTextContent('.popup__text--capacity', ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    renderTextContent('.popup__text--time', 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    renderTextContent('.popup__description', ad.offer.description);

    var renderAvatar = function () {
      var data = ad.author.avatar;
      var elem = '.popup__avatar';
      if (data.length) {
        cardElement.querySelector(elem).src = data;
      } else {
        cardElement.querySelector(elem).style.display = 'none';
      }
    };
    renderAvatar();

    var renderFeatures = function (features) {
      var featuresFragment = document.createDocumentFragment();
      var featuresList = cardElement.querySelector('.popup__features');
      if (features.length) {
        features.forEach(function (item) {
          var elem = featuresList.querySelector('li').cloneNode(true);
          elem.classList.add('popup__feature', 'popup__feature--' + item);
          featuresFragment.appendChild(elem);
        });
        featuresList.innerHTML = '';
        featuresList.appendChild(featuresFragment);
      } else {
        featuresList.style.display = 'none';
      }
    };
    renderFeatures(ad.offer.features);

    var renderPhoto = function (photos) {
      var photoFragment = document.createDocumentFragment();
      var photosList = cardElement.querySelector('.popup__photos');
      if (photos.length) {
        photos.forEach(function (item) {
          var elem = photosList.querySelector('img').cloneNode(true);
          elem.src = item;
          photoFragment.appendChild(elem);
        });
        photosList.innerHTML = '';
        photosList.appendChild(photoFragment);
      } else {
        photosList.style.display = 'none';
      }
    };
    renderPhoto(ad.offer.photos);

    cardElement.querySelector('.popup__close').addEventListener('click', onCardCloseBtnClick);

    return cardElement;
  };

  window.card = {
    types: TYPES,
    render: renderCard,
    close: onCardCloseBtnClick
  };
})();
