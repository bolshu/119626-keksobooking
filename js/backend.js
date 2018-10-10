'use strict';

(function () {
  var TIMEOUT = 10000;
  var Load = {
    url: 'https://js.dump.academy/keksobooking/data',
    method: 'GET'
  };
  var Upload = {
    url: 'https://js.dump.academy/keksobooking',
    method: 'POST'
  };

  var getRequest = function (onSuccess, onError, url, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data || null);
  };

  window.backend = {
    Load: Load,
    Upload: Upload,
    request: getRequest
  };
})();
