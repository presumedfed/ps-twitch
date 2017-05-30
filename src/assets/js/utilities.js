/* Fetches jsponp from a url (with query params). It will clean up after itself, removing the 
 * script it creates to retrieve the jsonp and the callback it creates to process the jsonp. 
 * It returns a promise.
 *
 * @param {string} url - url to make the request
 *
 */
export let fetchJSONP = (url) => {
  let script;
  let timeout;

  // iniially callbackId was not unique but there were issues when clicking the next/prev icon too quickly. 
  // The callback would already be deleted by the 'clean' method when subsequent fetches returned
  // so I needed to make the callbacks unique
  const callbackId = 'JSONP_CALLBACK_' + new Date().getTime();

  // remove jsonp script tag and callback and clear the timeout
  let clean = function(callback, script, timeout) {
    delete window[callback];

    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }

    if (timeout) clearTimeout(timeout);
  }

  return new Promise((resolve, reject) => {
      timeout = setTimeout(function() {
          clean(callbackId, script, timeout);
          reject('api timeout');
      }, 10000);

      url += '&callback=' + callbackId;
      script = document.createElement('script');
      script.src = url;

      document.body.appendChild(script);

      window[callbackId] = function(data) {
        resolve(data);
        clearTimeout(timeout);
        clean(callbackId, script, timeout);
      };  
  });
}

/* Helper to create json object from query string
 *
 * @param {string} query - GET query string
 * 
 */
export let parseQuery = (query) => {
  const params = {};
  const arr = query.split('&');

  for (let i = 0; i < arr.length; i++) {
      const val = arr[i].split('=');
      params[decodeURIComponent(val[0])] = decodeURIComponent(val[1] || '');
  }

  return params;
}
