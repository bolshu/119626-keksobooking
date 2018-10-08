'use strict';

(function () {
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

  var setAddresCoords = function () {
    var addressField = form.querySelector('#address');
    var pinWidth = mainPin.offsetWidth;
    var pinHeight = mainPin.offsetHeight;
    var coords = (mainPin.offsetLeft + pinWidth / 2).toFixed() + ', ' + (mainPin.offsetTop + pinHeight + window.map.pinArrowHeight).toFixed();
    addressField.value = coords;
  };

  var activatePage = function () {
    if (window.map.element.classList.contains('map--faded')) {
      for (var i = 0; i < formInputs.length; i++) {
        formInputs[i].disabled = false;
      }
      for (var j = 0; j < filterInputs.length; j++) {
        filterInputs[j].disabled = false;
      }
      window.map.pins.appendChild(window.map.fragment);
      window.map.element.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
    }
  };

  var deactivatePage = function () {
    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = true;
    }
    for (var j = 0; j < filterInputs.length; j++) {
      filterInputs[j].disabled = true;
    }
    window.map.element.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
  };

  var changePageState = function () {
    if (window.map.element.classList.contains('map--faded')) {
      activatePage();
    }
    if (!window.map.ads) {
      window.map.loadMarks();
    } else {
      window.map.addPins(window.map.ads);
    }
  };

  var onMainPinKeyup = function (keyupEvt) {
    var SPACE_KEYCODE = 32;
    var ENTER_KEYCODE = 13;
    if (keyupEvt.keyCode === SPACE_KEYCODE || keyupEvt.keyCode === ENTER_KEYCODE) {
      setAddresCoords();
      changePageState();
      mainPin.removeEventListener('keyup', onMainPinKeyup);
    }
  };

  mainPin.addEventListener('keyup', onMainPinKeyup);

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var PositionLimit = {
        verticalMin: 130,
        verticalMax: 630,
        horizontalMin: 0,
        horizontalMax: window.map.element.offsetWidth - mainPin.offsetWidth
      };

      var top;
      if (mainPin.offsetTop - shift.y <= PositionLimit.verticalMin) {
        top = PositionLimit.verticalMin;
      } else if (mainPin.offsetTop - shift.y >= PositionLimit.verticalMax) {
        top = PositionLimit.verticalMax;
      } else {
        top = mainPin.offsetTop - shift.y;
      }

      var left;
      if (mainPin.offsetLeft - shift.x <= PositionLimit.horizontalMin) {
        left = PositionLimit.horizontalMin;
      } else if (mainPin.offsetLeft - shift.x >= PositionLimit.horizontalMax) {
        left = PositionLimit.horizontalMax;
      } else {
        left = mainPin.offsetLeft - shift.x;
      }

      mainPin.style.top = top + 'px';
      mainPin.style.left = left + 'px';

      setAddresCoords();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }
      setAddresCoords();
      changePageState();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.pin = {
      main: mainPin,
      activatePage: activatePage,
      deactivatePage: deactivatePage
    };
  });
})();
