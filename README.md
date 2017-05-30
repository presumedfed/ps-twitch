
## Rules:
- Write a simple web app that hits the Twitch API URL shown at the top (there are API docs online)
- Use JSONP when utilizing the Twitch API's
- Build the URL based on the query entered by the user in the search box shown in the mock
- Build out the list as shown in the mock. 
- All UI elements are mandatory and self-explanatory
- Feel free to add more/better UI, as long as you include the mandatory elements
- No frameworks like jQuery/AngularJS, please use vanilla JS to implement UX, hit the API and render content
 
Submit your code to a github repo and send us the link.  You can host the running app on github.io.
 

## TODO 

- gulp
- responsive
- hide arrows for 
-- first page
-- last page
-- count less that limit
- spinner
- case for bade search
-- bug in api that returns next link for last page.  need to do a calculation to hide the 'next' icon when on last page. 
- debounce the clicks on next/prev
