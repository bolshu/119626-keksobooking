'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

  var onCardCloseBtnClick = function () {
    window.map.removeCard();
  };

  var renderCard = function (ad) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

    cardElement.querySelector('.popup__type').textContent = TYPES[ad.offer.type].ru;

    cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var renderFeatures = function (features) {
      var featuresFragment = document.createDocumentFragment();
      var featuresList = cardElement.querySelector('.popup__features');
      if (features.length) {
        for (var featuresIndex = 0; featuresIndex < features.length; featuresIndex++) {
          var featuresElement = featuresList.querySelector('li').cloneNode(true);
          featuresElement.classList.add('popup__feature', 'popup__feature--' + features[featuresIndex]);
          featuresFragment.appendChild(featuresElement);
        }
      } else {
        featuresList.classList.add('hidden');
      }
      featuresList.innerHTML = '';
      featuresList.appendChild(featuresFragment);
    };
    renderFeatures(ad.offer.features);

    cardElement.querySelector('.popup__description').textContent = ad.offer.description;

    var renderPhoto = function (photos) {
      window.data.shuffleArray(photos);
      var photoFragment = document.createDocumentFragment();
      var photoList = cardElement.querySelector('.popup__photos');
      for (var photoIndex = 0; photoIndex < photos.length; photoIndex++) {
        var photoElement = photoList.querySelector('img').cloneNode(true);
        photoElement.src = photos[photoIndex];
        photoFragment.appendChild(photoElement);
      }
      photoList.innerHTML = '';
      photoList.appendChild(photoFragment);
    };
    renderPhoto(ad.offer.photos);

    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    cardElement.querySelector('.popup__close').addEventListener('click', onCardCloseBtnClick);

    return cardElement;
  };

  window.card = {
    types: TYPES,
    render: renderCard,
    close: onCardCloseBtnClick
  };
})();
