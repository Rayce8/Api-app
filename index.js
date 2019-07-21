'use strict';
const GAME_UNIQUE_KEY_ATTRIBUTE = 'data-game-name';

const apiKey = 'AIzaSyAdDw2g3-gjyBqGs1tdxIUhS3S5V_T5gDo'









function findVids (resultsName) {
  const vidURL = `https://www.googleapis.com/youtube/v3/search/?part=snippet&q=${resultsName}&key=AIzaSyAdDw2g3-gjyBqGs1tdxIUhS3S5V_T5gDo&maxResults=3`
  fetch(vidURL)
  .then(response =>{
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => displayYoutubeVid(responseJson, resultsName))
  .catch(err => {
    $('#js-error-message').text('Something went wrong: ${err.message}');
  });
}

function displayYoutubeVid (responseJson, gameName) {

for (let i = 0; i < responseJson.items.length; i++){
$(`*[${GAME_UNIQUE_KEY_ATTRIBUTE}="${gameName}"]`).append(
  `<a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'><img src='${responseJson.items[i].snippet.thumbnails.medium.url}' class = 'youtubeThumbnail'></a>`
)}

}

function displayResults(responseJson) {
  
 $('#results').removeClass('hidden');
  $('#gamesList').empty();
 for (let i = 0; i < responseJson.results.length; i++) { 
  let resultsName = `${responseJson.results[i].name}`;
  $('#gamesList').append(
    `<section class = 'baseInfo'><h3>${responseJson.results[i].name}</h3>
    <img src='${responseJson.results[i].background_image}'></section>
    <section ${GAME_UNIQUE_KEY_ATTRIBUTE}="${resultsName}" class = 'gameResultsInfo'> 
   </section>`);
    findVids (resultsName);
   }
   };

   

  
function displayErrorMessage(message){
   $('#js-error-message').text(`Something went wrong: ${message}`);
}


function findRecommendations (gameInput) {
  const searchUrl = `https://api.rawg.io/api/games/${gameInput}/suggested?page_size=5`
  fetch(searchUrl)
  .then(response =>{
    if (response.ok) {
      return response.json();
    }
    let errmsg = "Network Error";
    
    if( response.status === 404 ){
      errmsg = "No results found for" + `"${gameInput}"`;
    }
    
    throw new Error(errmsg);
  })
  .then( responseJson => displayResults(responseJson) )
  .catch( err => displayErrorMessage(err.message) );
}

function watchForm () {
$('form').submit(event => {
  event.preventDefault();
  let gameInput1 = $('#searchBar').val().trim();
    let gameInput = gameInput1.replace(/\s+/g, '-')

  
  if( gameInput ){
    findRecommendations (gameInput)
  } else {
    
    displayErrorMessage("No search game title provided.");
  }

})
}



$(watchForm);
