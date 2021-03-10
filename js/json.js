  "use strict";
  //Vi använder addEventListener load på searchMusic och topArtist när sidan laddats
  window.addEventListener("load", searchMusic);

  window.addEventListener("load", topArtist);
  //funktionen searchMusic hämtar ut elementId 'search-form', och lägger en lyssnare på submit, då körs funktionen handleSearchFormSubmit
  function searchMusic() {
    let form = document.getElementById('search-form');
    form.addEventListener("submit", handleSearchFormSubmit);
  }
  //funktionen handleSearchFormSubmit har ett event där preventDefault stoppar standardhändelsen för när man trycker på submit
  //Här stoppar vi in search funktionen med parametrarna searchField.value, och tbody
  function handleSearchFormSubmit(event) {
    event.preventDefault();
    let searchField = document.getElementById('search');
    let tbody = document.getElementById('tbody');
    search(searchField.value, tbody);
  }
  //param förser namn, typ och förklaring för en funktions-parameter
  //Vi använder parameterns typ string här och har döpt den till query
  //
  /**
  @param {string} query
  @param {HTMLelement} container
  */
  //I funktionen search händer själva sökfunktionen, där vi först tömmer datan varje gång man söker på nytt, och när man har sökt något fel, och tar bort klassen alert-danger när man söker på nytt
  //kollar om längden på vektorn = 0, om man inte skrivit något, så skrivs errorMsg ut.
  //Vi gör Ajax-anropet med fetch metoden mot URLN och API:t först när man gjort en korrekt sökning. Fetch returnerar ett Promise-objekt som fullbordas med ett respone-objekt
  //därefter hämtas bodyn i JSON, repsone.json returnerar också ett promise-objekt, därför måste vi köra then-metoden igen för att komma åt datan
  //VI kollar om längden på de användare söker på är 0, om de är de så skrivs errorMsg ut, annars skrivs datan ut som man sökte på med hjälp av en for-loop där man kollar igenom all data
  function search(query, container) {
    container.innerHTML = '';
    errorDiv.innerHTML = '';
    errorDiv.removeAttribute("class", "alert alert-danger");
    if (query.length === 0) {
      let errorDiv = document.querySelector('#errorDiv');
      let errorMsg = 'Enter album or artist!';
      errorDiv.setAttribute("class", "alert alert-danger text-center");
      errorDiv.innerHTML = errorMsg;
    } else {
      window.fetch('http://ws.audioscrobbler.com/2.0/?method=album.search&limit=10&api_key=c55b3351c3ea42201230ce538b99c6c8&format=json&album=' + query)
        .then(function(response) {
          return response.json()
        })
        .then(function(data) {
          console.log(data.results.albummatches.album);
          if (data.results.albummatches.album.length === 0) {
            let errorDiv = document.querySelector('#errorDiv');
            let errorMsg = 'Enter valid album or artist!';
            errorDiv.setAttribute("class", "alert alert-danger text-center");
            errorDiv.innerHTML = errorMsg;
          } else {
            for (let songData of data.results.albummatches.album) {
              createTableRow(songData, container);
            }
          }
        });
    }
  }
  //Skapar upp tabellen, och skickar in songData och container. Skapar först upp alla tr element, därefter alla td där daran för bild, artist, och album läggs till
  //Måste först skapa upp ett bild-element, som vi sen sätter ett src attribute på med datan från API:t
  //Sen gör vi samma sak för album och artist, vi skapar upp ett td-element och där i lägger vi datan från API:t

  function createTableRow(songData, container) {

    let row = document.createElement('tr');
    container.appendChild(row);

    let imgAlbum = document.createElement('td');
    let img = document.createElement('img');
    img.setAttribute("src", songData.image[2]["#text"]);
    imgAlbum.appendChild(img);
    row.appendChild(imgAlbum);

    let album = document.createElement('td');
    album.textContent = songData.name;
    row.appendChild(album);

    let artist = document.createElement('td');
    artist.textContent = songData.artist;
    row.appendChild(artist);
  }
  //Här visar vi de artister som lyssnas mest på just nu i en tabell.
  //Hämtar ut referensen till sideTbody och där i lägger vi datan som vi hämtar från API:n med topArtist.
  //Vi gör ett till Fetch anrop som returnerar ett Promise-objekt som fullbordas med ett respone-objekt
  //därefter hämtas bodyn i JSON, repsone.json returnerar också ett promise-objekt, därför måste vi köra then-metoden igen för att komma åt datan
  //Går igenom all data med artister i en for-loop och skickar med artistData parametern till createSideTableRow
  //Skickar med createSideTableRow där vi skapar upp tabellen där datan stoppas.
  function topArtist() {
    let sideTable = document.getElementById("sideTbody");
    window.fetch('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=c55b3351c3ea42201230ce538b99c6c8&format=json&limit=10')
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        console.log(data.artists.artist);
        for (let artistData of data.artists.artist) {
          createSideTableRow(artistData, sideTable);
        }
      });
  }
  //SKapar upp funktionen SideTableRow där vi lägger in top 10 artists
  //Skapar upp tr och td element på samma sätt som tidigare
  function createSideTableRow(artistData, sideTable) {
    let row = document.createElement('tr');
    sideTable.appendChild(row);

    let album = document.createElement('td');
    album.textContent = artistData.name;
    row.appendChild(album);

    let imgArtist = document.createElement('td');
    let img = document.createElement('img');
    img.setAttribute("src", artistData.image[1]["#text"]);
    imgArtist.appendChild(img);
    row.appendChild(imgArtist);

  }