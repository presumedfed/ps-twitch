/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utilities = __webpack_require__(1);
	
	var Utilities = _interopRequireWildcard(_utilities);
	
	var _twitch = __webpack_require__(2);
	
	var _twitch2 = _interopRequireDefault(_twitch);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var twitch = new _twitch2.default();
	var search = document.getElementById('search');
	
	search.focus();
	
	// listener for the search button. When clicked, get the value of search input
	// then retrieve the streams from the twitch endpoint and render
	document.querySelector('button').addEventListener('click', function (event) {
	  var val = search.value;
	
	  if (val !== '') {
	    twitch.getTwitchStream({ q: search.value }).then(function (stream) {
	      twitch.renderStream(stream);
	    });
	  }
	});
	
	// add listeners for the prev/next icons for pagination
	var links = document.querySelectorAll('.pagination a');
	for (var i = 0; i < links.length; i++) {
	  links[i].addEventListener('click', function (event) {
	    event.preventDefault();
	
	    var url = this.href.split('?');
	    var options = {};
	
	    options = Utilities.parseQuery(url[1]);
	    options.endpoint = url[0];
	
	    twitch.getTwitchStream(options).then(function (stream) {
	      twitch.renderStream(stream);
	    });
	  });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* Fetches jsponp from a url (with query params). It will clean up after itself, removing the 
	 * script it creates to retrieve the jsonp and the callback it creates to process the jsonp. 
	 * It returns a promise.
	 *
	 * @param {string} url - url to make the request
	 *
	 */
	var fetchJSONP = exports.fetchJSONP = function fetchJSONP(url) {
	  var script = void 0;
	  var timeout = void 0;
	
	  // iniially callbackId was not unique but there were issues when clicking the next/prev icon too quickly. 
	  // The callback would already be deleted by the 'clean' method when subsequent fetches returned
	  // so I needed to make the callbacks unique
	  var callbackId = 'JSONP_CALLBACK_' + new Date().getTime();
	
	  // remove jsonp script tag and callback and clear the timeout
	  var clean = function clean(callback, script, timeout) {
	    delete window[callback];
	
	    if (script && script.parentNode) {
	      script.parentNode.removeChild(script);
	    }
	
	    if (timeout) clearTimeout(timeout);
	  };
	
	  return new Promise(function (resolve, reject) {
	    timeout = setTimeout(function () {
	      clean(callbackId, script, timeout);
	      reject('api timeout');
	    }, 10000);
	
	    url += '&callback=' + callbackId;
	    script = document.createElement('script');
	    script.src = url;
	
	    document.body.appendChild(script);
	
	    window[callbackId] = function (data) {
	      resolve(data);
	      clearTimeout(timeout);
	      clean(callbackId, script, timeout);
	    };
	  });
	};
	
	/* Helper to create json object from query string
	 *
	 * @param {string} query - GET query string
	 * 
	 */
	var parseQuery = exports.parseQuery = function parseQuery(query) {
	  var params = {};
	  var arr = query.split('&');
	
	  for (var i = 0; i < arr.length; i++) {
	    var val = arr[i].split('=');
	    params[decodeURIComponent(val[0])] = decodeURIComponent(val[1] || '');
	  }
	
	  return params;
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utilities = __webpack_require__(1);
	
	var Utilities = _interopRequireWildcard(_utilities);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Twitch = function () {
	  function Twitch() {
	    _classCallCheck(this, Twitch);
	  }
	
	  _createClass(Twitch, [{
	    key: 'getTwitchStream',
	
	
	    /* Creates the url to fetch jsponp from twitch and the make call to reteieve the jsonp. Returns a promise
	     *
	     * @param {Object} options - options for the query to the twitch endpoint
	     * 
	     * ex.  options = {
	     *        endpoint: 'https://api.twitch.tv/kraken/search/streams'   // endpoint
	     *        limit: 10,  // number of streams to get
	     *        offset: 20  // number of streams to skip
	     *        q: 'starcraft' // search term
	     *      }
	     *
	     */
	    value: function getTwitchStream(options) {
	      options = options || {};
	
	      var endpoint = options.endpoint || 'https://api.twitch.tv/kraken/search/streams';
	
	      var params = {
	        client_id: 'rsxp3j0h78htzh9ieti5h37s01ajkd',
	        limit: options.limit || 10,
	        offset: options.offset || 0,
	        q: options.q || ''
	      };
	
	      // create query string from object
	      var query = Object.keys(params).map(function (key) {
	        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
	      }).join("&").replace(/%20/g, "+");
	
	      return new Promise(function (resolve, reject) {
	        // if q doesn't have a value, no need to fetch
	        // TODO:  if the q is the same and the previous term, don't search
	        if (params.q) {
	          var url = endpoint + '?' + query;
	
	          new Utilities.fetchJSONP(url).then(function (response) {
	            resolve(response);
	          }).catch(function (error) {
	            console.log(error);
	          });
	        } else {
	          // reject if the value to search is missing
	          reject('getTwitchStream::missing q');
	        }
	      });
	    }
	
	    /* Renders the markup for the streams
	     *  - update total display
	     *  - update page count
	     *  - set the href for prev/next icons based on links returned by twitch api
	     *  - generate markup for streams to display
	     *
	     * @param {Object} stream - json returned from the twitch endpoint
	     * 
	     */
	
	  }, {
	    key: 'renderStream',
	    value: function renderStream(stream) {
	      var total = stream._total;
	      var prev = stream._links.prev || '';
	      var next = stream._links.next || '';
	
	      // params for the link to the current page
	      var params = new Utilities.parseQuery(stream._links.self.split('?')[1]);
	      var page = (params.offset || 0) / params.limit + 1;
	      var pageCount = Math.ceil(total / params.limit);
	      var q = params.q || '';
	
	      var html = '';
	
	      document.getElementById('count').innerHTML = total;
	      document.getElementsByClassName('pagination-count')[0].innerHTML = page + '/' + pageCount;
	
	      // hide pagination when the page number is higher than the pagecount
	      var pagination = document.querySelector('#streams-head .pagination');
	      if (page < pageCount) {
	        pagination.style.display = 'inline-block';
	      } else {
	        pagination.style.display = 'none';
	      }
	
	      // TODO: update to support multiple pagination components on the page
	      var prevEl = document.getElementsByClassName('pagination-prev')[0];
	      if (prev) {
	        // update the href and show the icon. the eventlistener will use the href to get previous page 
	        prevEl.getElementsByTagName('a')[0].href = prev;
	        prevEl.style.display = 'inline-block';
	      } else {
	        // hide when it's not needed
	        prevEl.style.display = 'none';
	      }
	
	      // if we are on last page, hide 'next' icon. api returns next link for all pages (even last), so we need to track it.
	      var showNext = page < pageCount;
	      var nextEl = document.getElementsByClassName('pagination-next')[0];
	      if (next && showNext) {
	        // update the href and show the icon. the eventlistener will use the href to get next page 
	        nextEl.getElementsByTagName('a')[0].href = next;
	        nextEl.style.display = 'inline-block';
	      } else {
	        // hide when it's not needed
	        nextEl.style.display = 'none';
	      }
	
	      // generate markup for each stream
	      for (var key in stream.streams) {
	        if (stream.streams.hasOwnProperty(key)) {
	          var strm = stream.streams[key];
	          var channel = strm.channel;
	
	          html += '<div class="stream">';
	          html += '<figure class="stream-screen"><img src="' + strm.preview.medium + ' alt="" /></figure>';
	          html += '<div class="stream-info">';
	          html += '<h3>' + channel.display_name + '</h3>';
	          html += '<p class="">' + channel.game + ' - ' + channel.followers + ' viewers</p>';
	          html += '<p class="description">' + channel.status + '</p>';
	          html += '</div>';
	          html += '</div>';
	        }
	      }
	
	      // add the markup to the dom and add class to start the transition
	      document.getElementById('streams-content').innerHTML = html;
	      document.getElementById('streams').classList.add('show');
	    }
	  }]);
	
	  return Twitch;
	}();
	
	exports.default = Twitch;

/***/ })
/******/ ]);
//# sourceMappingURL=twitch.bundle.js.map