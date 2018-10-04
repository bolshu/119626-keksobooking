'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var PRICE_LIMIT = {
    low: 10000,
    high: 50000
  };

  var updatePins = function (ads) {
    var filteredAds = ads.slice();

    var selectsFilters = mapFilters.querySelectorAll('select');
    var featuresFilters = mapFilters.querySelectorAll('input[type=checkbox]:checked');

    var FilterRules = {
      'housing-type': 'type',
      'housing-rooms': 'rooms',
      'housing-guests': 'guests'
    };

    var filterByValue = function (select, property) {
      return filteredAds.filter(function (ad) {
        return ad.offer[property].toString() === select.value;
      });
    };

    var filterByPrice = function (priceFiter) {
      return filteredAds.filter(function (ad) {
        var priceFilterValues = {
          'middle': ad.offer.price >= PRICE_LIMIT.low && ad.offer.price <= PRICE_LIMIT.high,
          'low': ad.offer.price < PRICE_LIMIT.low,
          'high': ad.offer.price >= PRICE_LIMIT.hight
        };

        return priceFilterValues[priceFiter.value];
      });
    };

    var filterByFeatures = function (featuresCheckbox) {
      return filteredAds.filter(function (ad) {
        return ad.offer.features.indexOf(featuresCheckbox.value) >= 0;
      });
    };

    if (selectsFilters.length !== null) {
      for (var i = 0; i < selectsFilters.length; i++) {
        if (selectsFilters[i].value !== 'any') {
          if (selectsFilters[i].id !== 'housing-price') {
            filteredAds = filterByValue(selectsFilters[i], FilterRules[selectsFilters[i].id]);
          } else {
            filteredAds = filterByPrice(selectsFilters[i]);
          }
        }
      }
    }

    if (featuresFilters !== null) {
      for (var j = 0; j < featuresFilters.length; j++) {
        filteredAds = filterByFeatures(featuresFilters[j]);
      }
    }

    if (filteredAds.length) {
      window.map.addPins(filteredAds);
    }
  };

  var debounce = function (cb) {
    var DEBOUNCE_INTERVAL = 500;
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var onMapFiltersChange = debounce(function () {
    window.map.removePins();
    window.map.removeCard();
    updatePins(window.map.ads);
  });

  mapFilters.addEventListener('change', onMapFiltersChange);
})();

