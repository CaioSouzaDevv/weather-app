const selectInput = document.querySelector('input[name="search-city"]');
const btnSearch = document.querySelector('.site-header__btn-search');




// Função de carregamento da API
async function loading(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('Latitude:', lat);
    console.log('Longitude:', lon);
    console.log('Temperatura:', data.current.temperature_2m, '°C');
    console.log('Vento:', data.current.wind_speed_10m, 'km/h');


}

// Função de busca
function searchCity() {
    btnSearch.addEventListener('click', function (e) {
        e.preventDefault();

        const userCity = selectInput.value.toLowerCase().replace(/\s+/g, '_');
        console.log('Cidade digitada:', userCity);


        async function citiesFunction() {


            const apiCities = `https://geocoding-api.open-meteo.com/v1/search?name=${userCity}`;

            const response = await fetch(apiCities);
            const data = await response.json();

            data.results.forEach(e => {

                if (userCity === e.name.toLowerCase().replace(/\s+/g, '_')) {
                    let lat = e.latitude;
                    let long = e.longitude;

                    loading(lat, long);


                    console.log(lat);


                }



            });


        }



        citiesFunction();

    });

}

searchCity();
