import * as Utilities from './utilities';

export default class Twitch {

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
  getTwitchStream(options) {
    options = options || {}

    const endpoint = options.endpoint || 'https://api.twitch.tv/kraken/search/streams';

    const params = { 
      client_id: 'rsxp3j0h78htzh9ieti5h37s01ajkd',
      limit: options.limit || 10,
      offset: options.offset || 0,
      q: options.q || ''
    };

    // create query string from object
    var query = Object.keys(params)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
      .join("&")
      .replace(/%20/g, "+");

    return new Promise((resolve, reject) => {
      // if q doesn't have a value, no need to fetch
      // TODO:  if the q is the same and the previous term, don't search
      if (params.q) {
          const url = endpoint + '?' + query;

          new Utilities.fetchJSONP(url)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
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
  renderStream(stream) {
    const total = stream._total;
    const prev = stream._links.prev || '';
    const next = stream._links.next || '';

    // params for the link to the current page
    const params = new Utilities.parseQuery(stream._links.self.split('?')[1]);
    const page = (params.offset || 0)/params.limit + 1;
    const pageCount = Math.ceil(total/params.limit);
    const q = params.q || '';

    let html = '';

    document.getElementById('count').innerHTML = total;
    document.getElementsByClassName('pagination-count')[0].innerHTML = page + '/' + pageCount;

    // hide pagination when the page number is higher than the pagecount
    const pagination = document.querySelector('#streams-head .pagination');
    if (page < pageCount) {
      pagination.style.display = 'inline-block';
    } else  {
      pagination.style.display = 'none';
    }

    // TODO: update to support multiple pagination components on the page
    const prevEl = document.getElementsByClassName('pagination-prev')[0];
    if (prev) {
      // update the href and show the icon. the eventlistener will use the href to get previous page 
      prevEl.getElementsByTagName('a')[0].href = prev;
      prevEl.style.display = 'inline-block';
    } else {
      // hide when it's not needed
      prevEl.style.display = 'none';
    }

    // if we are on last page, hide 'next' icon. api returns next link for all pages (even last), so we need to track it.
    const showNext = (page < pageCount);
    const nextEl = document.getElementsByClassName('pagination-next')[0];
    if (next && showNext) {
      // update the href and show the icon. the eventlistener will use the href to get next page 
      nextEl.getElementsByTagName('a')[0].href = next;
      nextEl.style.display = 'inline-block';
    } else {
      // hide when it's not needed
      nextEl.style.display = 'none';
    }

    // generate markup for each stream
    for (let key in stream.streams) {
        if (stream.streams.hasOwnProperty(key)) {
          const strm = stream.streams[key];
          const channel = strm.channel;

          html += '<div class="stream">';
          html += '<figure class="stream-screen"><img src="' + strm.preview.medium + ' alt="" /></figure>'
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
}
