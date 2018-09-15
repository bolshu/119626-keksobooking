'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
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
        photos: AdPamareters.photos
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

var markTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var onCardCloseBtnClick = function () {
  removeCardPopup();
};

var ESC_KEYCODE = 27;
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeCardPopup();
  }
};

var onMarkClick = function (evt) {
  removeCardPopup();
  document.addEventListener('keydown', onPopupEscPress);

  var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < ADS_LENGTH; i++) {
    if (pins[i] === evt.currentTarget) {
      fragment.appendChild(renderCard(ads[i]));
    }
  }
  map.appendChild(fragment);
};

var removeCardPopup = function () {
  if (document.querySelector('.map__card')) {
    map.removeChild(document.querySelector('.map__card'));
  }
};

var renderMark = function (ad) {
  var markElement = markTemplate.cloneNode(true);
  var PIN_ARROW_HEIGHT = 22;
  var pinOffsetX = markElement.offsetWidth / 2;
  var pinOffsetY = markElement.offsetWidth + PIN_ARROW_HEIGHT;
  markElement.querySelector('img').src = ad.author.avatar;
  markElement.querySelector('img').alt = ad.offer.title;
  markElement.style.left = ad.location.x - pinOffsetX + 'px';
  markElement.style.top = ad.location.y - pinOffsetY + 'px';

  markElement.addEventListener('click', onMarkClick, true);

  return markElement;
};

var fragment = document.createDocumentFragment();

var addMarks = function () {
  for (var i = 0; i < ADS_LENGTH; i++) {
    fragment.appendChild(renderMark(ads[i]));
  }
  mapPins.appendChild(fragment);
};

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
    shuffleArray(photos);
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

var mainPin = document.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var formInputs = document.querySelectorAll('.ad-form fieldset');
var filterInputs = document.querySelector('.map__filters').childNodes;

var disableInputs = function () {
  for (var i = 0; i < formInputs.length; i++) {
    formInputs[i].disabled = true;
  }
  for (var j = 0; j < filterInputs.length; j++) {
    filterInputs[j].disabled = true;
  }
};
disableInputs();

var activatePage = function () {
  for (var i = 0; i < formInputs.length; i++) {
    formInputs[i].disabled = false;
  }
  for (var j = 0; j < filterInputs.length; j++) {
    filterInputs[j].disabled = false;
  }
  mapPins.appendChild(fragment);
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  addMarks();

  setAddresCoordinates();
};

var setAddresCoordinates = function () {
  var addressField = form.querySelector('#address');
  var pinWidth = mainPin.offsetWidth;
  var pinHeight = mainPin.offsetHeight;
  var coordinates = (mainPin.offsetLeft + pinWidth / 2).toFixed() + ', ' + (mainPin.offsetTop + pinHeight / 2).toFixed();
  addressField.value = coordinates;
};


mainPin.addEventListener('mouseup', activatePage);
