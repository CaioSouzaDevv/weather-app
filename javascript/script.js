const selectInput = document.querySelector('input[name="search-city"]');
const btnSearch = document.querySelector('.site-header__btn-search');

// Mapa de cidades com suas coordenadas
const cities = {
    berlin: { lat: 52.52, lon: 13.41 },
    paris: { lat: 48.85, lon: 2.35 },
    london: { lat: 51.51, lon: -0.13 },
    rome: { lat: 41.90, lon: 12.49 },
    madrid: { lat: 40.42, lon: -3.70 },
    lisbon: { lat: 38.72, lon: -9.14 },
    newyork: { lat: 40.71, lon: -74.01 },
    tokyo: { lat: 35.68, lon: 139.69 },
    sao_paulo: { lat: -23.55, lon: -46.63 },
    rio_de_janeiro: { lat: -22.91, lon: -43.17 }
};

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

        if (cities[userCity]) {
            const { lat, lon } = cities[userCity];
            loading(lat, lon);
        } else {
            console.log('Cidade não encontrada no mapa.');
        }
    });
}

searchCity();
