'use strict';

(function () {
  var ADS_LENGTH = 8;
  var ads = [];
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
        max: 1200
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

  window.data = {
    ads: ads,
    adsLength: ADS_LENGTH,
    shuffleArray: shuffleArray
  };
})();
