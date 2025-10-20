const selectInput = document.querySelector('input[name="search-city"]');
const btnSearch = document.querySelector('.site-header__btn-search');

async function loading() {
  // Faz a requisição para a API
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m');

  // Transforma o resultado da resposta em JSON (objeto JS)
  const data = await response.json();

  // Mostra no console pra gente ver o que veio
  console.log(data);
}




function searchCity(e) {
    e.preventDefault();
    btnSearch.addEventListener('click', function (e) {


    });

}
// Chama a função
loading();
