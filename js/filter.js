'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var PRICE_LIMIT = {
    low: 10000,
    high: 50000
  };
  var mapFilters = document.querySelector('.map__filters');

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

      selectsFilters.forEach(function (item) {
        if (item.value !== 'any') {
          if (item.id !== 'housing-price') {
            filteredAds = filterByValue(item, FilterRules[item.id]);
          } else {
            filteredAds = filterByPrice(item);
          }
        }
      });
    }

    if (featuresFilters !== null) {
      featuresFilters.forEach(function (item) {
        filteredAds = filterByFeatures(item);
      });
    }

    if (filteredAds.length) {
      window.map.addPins(filteredAds);
    }
  };

  var debounce = function (cb) {
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

