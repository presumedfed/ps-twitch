import * as Utilities from './utilities';
import Twitch from './twitch';

const twitch = new Twitch();
const search = document.getElementById('search');

search.focus();

// listener for the search button. When clicked, get the value of search input
// then retrieve the streams from the twitch endpoint and render
document.querySelector('button').addEventListener('click', function(event) {
  const val = search.value;

  if (val !== '') {
    twitch.getTwitchStream({q: search.value}).then((stream) => {
      twitch.renderStream(stream);
    });
  }
});

// add listeners for the prev/next icons for pagination
const links = document.querySelectorAll('.pagination a')
for (let i=0; i < links.length; i++) {
  links[i].addEventListener('click', function(event) {
    event.preventDefault();

    const url = this.href.split('?');
    let options = {};

    options = Utilities.parseQuery(url[1]);
    options.endpoint = url[0];

    twitch.getTwitchStream(options).then((stream) => {
      twitch.renderStream(stream);
    });
  });
}
