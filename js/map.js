'use strict';

var map = document.querySelector('.map');
var ads = [];
var ADS_LENGTH = 8;
var AdPamareters = {
  author: {
    authors: [],
    generateArray: function () {
      for (var i = 0; i < ADS_LENGTH; i++) {
        AdPamareters.author.authors[i] = i + 1;
      }
    }
  },
  titles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  price: {
    min: 1000,
    max: 1000000
  },
  types: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  rooms: {
    min: 1,
    max: 5
  },
  guests: {
    min: 1,
    max: 3
  },
  checkin: [
    '12:00',
    '13:00',
    '14:00'
  ],
  checkout: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  locations: {
    x: {
      min: 0,
      max: map.offsetWidth
    },
    y: {
      min: 130,
      max: 630
    }
  }
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var shuffleArray = function (arr) {
  return arr.sort(compareRandom);
};

shuffleArray(AdPamareters.titles);

AdPamareters.author.generateArray();
shuffleArray(AdPamareters.author.authors);

var generateAds = function () {
  for (var i = 0; i < ADS_LENGTH; i++) {
    ads[i] = {
      author: {
        avatar: 'img/avatars/user0' + AdPamareters.author.authors[i] + '.png'
      },
      offer: {
        title: AdPamareters.titles[i],
        price: getRandomNumber(AdPamareters.price.min, AdPamareters.price.max + 1),
        type: AdPamareters.types[getRandomNumber(0, AdPamareters.types.length)],
        rooms: getRandomNumber(AdPamareters.rooms.min, AdPamareters.rooms.max + 1),
        guests: getRandomNumber(AdPamareters.guests.min, AdPamareters.guests.max + 1),
        checkin: AdPamareters.checkin[getRandomNumber(0, AdPamareters.checkin.length)],
        checkout: AdPamareters.checkout[getRandomNumber(0, AdPamareters.checkout.length)],
        features: AdPamareters.features.slice(0, getRandomNumber(0, AdPamareters.features.length)),
        description: '',
        photos: shuffleArray(AdPamareters.photos)
      },
      location: {
        x: getRandomNumber(AdPamareters.locations.x.min, AdPamareters.locations.x.max),
        y: getRandomNumber(AdPamareters.locations.y.min, AdPamareters.locations.y.max)
      }
    };
    ads[i].offer.address = ads[i].location.x + ', ' + ads[i].location.y;
  }
};

generateAds();

map.classList.remove('map--faded');

var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderMark = function (ad) {
  var markElement = markTemplate.cloneNode(true);
  var PIN_ARROW_HEIGHT = 22;
  var pinOffsetX = markElement.offsetWidth / 2;
  var pinOffsetY = markElement.offsetWidth + PIN_ARROW_HEIGHT;
  markElement.querySelector('img').src = ad.author.avatar;
  markElement.querySelector('img').alt = ad.offer.title;
  markElement.style.left = ad.location.x - pinOffsetX + 'px';
  markElement.style.top = ad.location.y - pinOffsetY + 'px';

  // markElement.addEventListener('click', onMarkClick); // Обработчик события

  return markElement;
};

var fragment = document.createDocumentFragment();

for (var adIndex = 0; adIndex < ads.length; adIndex++) {
  fragment.appendChild(renderMark(ads[adIndex]));
}

document.querySelector('.map__pins').appendChild(fragment);

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var TYPES = {
  flat: {
    ru: 'Квартира'
  },
  bungalo: {
    ru: 'Бунгало'
  },
  house: {
    ru: 'Дом'
  },
  palace: {
    ru: 'Дворец'
  }
};

var renderCard = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

  cardElement.querySelector('.popup__type').textContent = TYPES[ad.offer.type].ru;

  cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featuresList = cardElement.querySelector('.popup__features');
  var renderFeatures = function (features) {
    var featuresFragment = document.createDocumentFragment();
    for (var featuresIndex = 0; featuresIndex < features.length; featuresIndex++) {
      var featuresElement = featuresList.querySelector('li').cloneNode(true);
      featuresElement.classList.add('popup__feature', 'popup__feature--' + features[featuresIndex]);
      featuresFragment.appendChild(featuresElement);
    }
    featuresList.innerHTML = '';
    featuresList.appendChild(featuresFragment);
  };
  renderFeatures(ad.offer.features);

  cardElement.querySelector('.popup__description').textContent = ad.offer.description;

  var photoList = cardElement.querySelector('.popup__photos');
  var renderPhoto = function (photos) {
    var photoFragment = document.createDocumentFragment();
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

  return cardElement;
};

fragment.appendChild(renderCard(ads[getRandomNumber(1, 8)]));
document.querySelector('.map').appendChild(fragment);
