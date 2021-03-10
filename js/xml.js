'use strict';
//Lyssnare som körs funktionen searchMovie när sidan laddats
window.addEventListener('load', searchMovie);

//Funktion som hämtar referens till sök formuläret och lägger en lyssnare
//som körs funktionen handleSearchFormSubmit när användaren submitar
function searchMovie() {
  let form = document.getElementById('search-form');
  form.addEventListener("submit", handleSearchFormSubmit);
}

//Funktionen handleSearchFormSubmit som tar emot ett event och stoppar sidan från att ladda om
//Hämtar en referens till sökfältet och bodyn, sedan skickas värdet i sökfältet och tbodyn
//Med till sökfunktionen
function handleSearchFormSubmit(event) {
  event.preventDefault();
  let searchField = document.getElementById('search');
  let tbody = document.getElementById('tbody');
  search(searchField.value, tbody);
}
//Funktionen search som tar emot det användaren anger i sökfältet och tbodyn som parameter
//Varje gång användaren gör en sökning så tömms containern och error diven
//Och diven blir av med klassen alert-danger.
function search(query, container) {
  container.innerHTML = '';
  errorDiv.innerHTML = '';
  errorDiv.removeAttribute("class", "alert alert-danger");
  //En if sats som kollar om längden på värdet som användaren anget(query) är längre än 0
  //Om längden är 0 så poppar det upp ett felmeddelande i containern.
  //Annars så gör man en fetch på APIn och hämtar hem resultatet
  if (query.length === 0) {
    let errorDiv = document.querySelector('#errorDiv');
    let errorMsg = 'Enter movie name!';
    errorDiv.setAttribute("class", "alert alert-danger text-center");
    errorDiv.innerHTML = errorMsg;
  } else {
    //
    window.fetch('http://www.omdbapi.com/?apikey=87123bac&r=xml&type=movie&s=' + query)
      .then(response => response.text())
      .then(xmlString => {
        handleData(xmlString, container);
      });
  }
}

//Funktionen handleData som tar emot det användaren angivit (xmlString) och containern
function handleData(xmlString, container) {

  //Skapar en instans av DOMParser för att kunna konvertera xmlString
  let parser = new window.DOMParser();
  //Kör sedan metoden parseFromString på xmlstring för att konvertera den
  let xmlDOM = parser.parseFromString(xmlString, 'application/xml');

  console.log(xmlDOM);

  //variabel med resultaten från api sökningen
  let items = xmlDOM.querySelectorAll('result');

  //Hämtar innehållet på error elementet som man får om man söker på en ogiltig film
  //Hämtar en referent till en div som man stoppar error meddelandet i
  let error = xmlDOM.querySelector('error');
  let errorDiv = document.querySelector('#errorDiv');
  //En if sats som kollar om error elementet inte är tomt så skapar man ett felmeddelande
  //Annars skapar man upp tabellen och alla element
  if (error !== null) {
    let errorMsg = error.textContent;
    errorDiv.innerHTML = error.textContent;
    errorDiv.setAttribute("class", "alert alert-danger text-center");
  } else {
    container.innerHTML = '';
    //Foreach loop som skapar upp tabellen med bild, titel och år för varje item
    items.forEach(item => {
      let title = item.getAttribute('title');
      let year = item.getAttribute('year');
      let poster = item.getAttribute('poster');
      let row = document.createElement('tr');
      document.getElementById('tbody').appendChild(row);

      //Skapar ett td och img element som vi sedan ska stoppa posterbilden i
      var posterNode = document.createElement('td');
      var imgNode = document.createElement('img');
      //En if sats som kollar om poster inte är tom så lägger vi in postern i img
      //Och sedan stoppar in bilden i td
      //Finns ingen bild så skriver vi ut n/a där bilden skulle vara
      if (poster !== null) {
        imgNode.setAttribute("src", poster);
        posterNode.appendChild(imgNode);
        row.appendChild(posterNode);
      } else {
        posterNode.innerHTML = 'n/a';
        //imgNode.setAttribute("src", bildens källa);
        row.appendChild(posterNode);
      }

      //Skapar ett td och h6 element och stoppar filmtiteln in i h6
      //Sedan in i td
      let titleNode = document.createElement('td');
      let titleStyle = document.createElement('h6');
      titleNode.textContent = title;
      titleNode.appendChild(titleStyle);
      row.appendChild(titleNode);

      //Skapar en td och stoppar in året filmen släpptes i den
      let yearNode = document.createElement('td');
      yearNode.textContent = year;
      row.appendChild(yearNode);

    });
  }



}