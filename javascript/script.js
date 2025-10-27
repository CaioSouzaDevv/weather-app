const selectInput = document.querySelector('input[name="search-city"]');
const btnSearch = document.querySelector('.site-header__btn-search');

// Elementos do HTML
const titleCity = document.querySelector('.today__location');
let temperatureEl = document.querySelector('.today__temp p.today__temp-temperature');
let windEl = document.querySelectorAll('.stat__value')[2]; // Terceiro card → Wind
let thernalSensation = document.querySelectorAll('.stat__value')[0]; // Primeiro card → Feels Like
let humidityEl = document.querySelectorAll('.stat__value')[1];
let precipitationEl = document.querySelectorAll('.stat__value')[3];

// Função para normalizar nomes (remover acentos e espaços)
function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Função para deixar nomes com a primeira letra maiúscula
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Função para deixar nomes com a primeira letra maiúscula de cada palavra
function capitalizeAll(name) {
    return name
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}
async function testHourly(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&hourly=temperature_2m,precipitation&forecast_days=1&timezone=America/Sao_Paulo`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const times = data.hourly.time;
    const temperatures = data.hourly.temperature_2m;

    let imagePreciptation = document.querySelectorAll('.image__preciptation');

    const dataHourly = data.hourly;

    console.log('Dados do dataHourly', dataHourly)

    const hourlyList = document.querySelector('.hourly__list');

    hourlyList.innerHTML = '';

    for (let i = 0; i < 24; i++) {
        const hour = times[i].split("T")[1].split(":")[0];
        const formattedHour = `${hour}h`;

        const precipitationRain = data.hourly.precipitation[i];

        const iconSrc = precipitationRain > 0
            ? './assets/images/icon-rain.webp'
            : './assets/images/icon-overcast.webp';

        const li = document.createElement('li');
        li.classList.add('hourly__item', 'd-flex', 'justify-content-between', 'align-items-center', 'py-2', 'px-3', 'rounded', 'mb-2');

        li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <time class="small text-secondary">${formattedHour}</time>
        <img src="${iconSrc}" alt="weather icon" width="22">
      </div>
      <data class="fw-semibold">${temperatures[i]} °C</data>
    `;

        hourlyList.appendChild(li);
    }

}


async function testDaily(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Sao_Paulo`;

    const response = await fetch(apiUrl);
    const data = await response.json();



    console.log('Dados do daily:', data.daily);

}


// Função de carregamento da API de clima
async function loading(lat, lon) {
    try {
        // Requisição da previsão atual
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,precipitation`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados do clima:', data);

        // Atualiza a temperatura
        if (temperatureEl) {
            temperatureEl.textContent = `${data.current.temperature_2m} °C`;
        }

        if (humidityEl) {
            humidityEl.textContent = `${data.current.relative_humidity_2m}%`;
        }

        if (precipitationEl) {
            precipitationEl.textContent = `${data.current.precipitation} mm/h`;
        }

        // Atualiza sensação térmica (Feels Like)
        if (thernalSensation) {
            thernalSensation.textContent = `${data.current.apparent_temperature} °C`;
        }

        // Atualiza o vento
        if (windEl) {
            windEl.textContent = `${data.current.wind_speed_10m} km/h`;
        }

    } catch (error) {
        console.error('Erro ao carregar dados do clima:', error.message);
        alert('Erro ao carregar dados do clima. Verifique sua internet ou tente novamente.');
    }
}

// Função de busca de cidade
function searchCity() {
    btnSearch.addEventListener('click', async function (e) {
        e.preventDefault();

        const userCity = normalizeName(selectInput.value.trim());
        console.log('Cidade digitada:', userCity);

        try {
            const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${userCity}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Busca cidade exata
                const city = data.results.find(e => normalizeName(e.name) === userCity);

                if (city) {
                    // Atualiza o título da cidade
                    titleCity.textContent = capitalizeAll(city.name);

                    const lat = city.latitude;
                    const lon = city.longitude;
                    console.log('Coordenadas:', lat, lon);

                    // Carrega os dados do clima
                    loading(lat, lon);
                    testHourly(lat, lon);
                    testDaily(lat, lon);
                } else {
                    alert('Digite uma cidade válida');
                    console.log('Cidade não encontrada na API');
                }
            } else {
                alert('Nenhum resultado encontrado');
                console.log('Nenhum resultado encontrado');
            }

        } catch (error) {
            console.error('Erro ao buscar cidade:', error.message);
            alert('Erro ao buscar cidade. Verifique sua internet ou tente novamente.');
        }
    });
}

searchCity();
