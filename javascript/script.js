const selectInput = document.querySelector('input[name="search-city"]');
const btnSearch = document.querySelector('.site-header__btn-search');

// Função de carregamento da API
async function loading(lat, lon) {
    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;
        const response = await fetch(apiUrl);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log('Latitude:', lat);
        console.log('Longitude:', lon);
        console.log('Temperatura:', data.current.temperature_2m, '°C');
        console.log('Vento:', data.current.wind_speed_10m, 'km/h');

    } catch (error) {
        console.error('Erro ao carregar dados do clima:', error.message);
    }
}

// Função para normalizar nomes (remover acentos e espaços)
function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Função de busca
function searchCity() {
    btnSearch.addEventListener('click', async function (e) {
        e.preventDefault();

        const userCity = normalizeName(selectInput.value);
        console.log('Cidade digitada:', userCity);

        try {
            const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${userCity}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const city = data.results.find(e => normalizeName(e.name) === userCity);

                if (city) {
                    const lat = city.latitude;
                    const lon = city.longitude;
                    console.log('Coordenadas:', lat, lon);
                    loading(lat, lon);
                } else {
                    console.log("Cidade não encontrada na API");
                }
            } else {
                console.log("Nenhum resultado encontrado");
            }

        } catch (error) {
            console.error('Erro ao buscar cidade:', error.message);
        }
    });
}

searchCity();
