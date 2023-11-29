document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});


async function fetchData() {
    try {
        const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
            method: 'POST',
        });

        const data = await response.json();

        if (data.key) {
            const planetsResponse = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
                method: 'GET',
                headers: {'x-zocom': data.key},
            });
            const responseData = await planetsResponse.json();
            console.log('Complete Response Data:', responseData);


            const planetsData = Array.isArray(responseData.bodies) ? responseData.bodies : [];
            if (planetsData.length > 0) {
                displayPlanets(planetsData);
            } else {
                console.error('Invalid data format received from the API');
            }

        } else {
            console.error('Error fetching API key');
        }
    } catch (error) {
        console.error('Error fetching data', error);
    }
}


function displayPlanets(planets) {
    const planetsContainer  = document.getElementById('planets-container');

    planets.forEach(planet => {
        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.classList.add(planet.name.toLowerCase());
        planetElement.onclick = () => showPlanetInfo(planet);
        planetsContainer.appendChild(planetElement);
    }) 
}


function showPlanetInfo(planet) {
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlay-content');
    const planetInfo = document.getElementById('planet-info');
    const planetName = document.getElementById('planet-name');
    const planetlatinName = document.getElementById('planet-latinName');
    const planetDesc = document.getElementById('planet-desc');
    const planetCircumference = document.getElementById('planet-circumference');
    const planetDistance = document.getElementById('planet-distance');
    const maxTemp = document.getElementById('max-temp');
    const minTemp = document.getElementById('min-temp');
    const moons = document.getElementById('moons');
    const moonsContainer = document.getElementById('moons-container');
    const overlaySun = document.querySelector('.overlay .solen');

    if (overlay && overlayContent) {
        overlay.style.display = 'block';

        if(planetInfo) {
            planetName.textContent = planet.name.toUpperCase();
            planetlatinName.textContent = planet.latinName.toUpperCase();
            planetDesc.textContent = planet.desc;
            planetCircumference.textContent = planet.circumference.toLocaleString();
            planetDistance.textContent = planet.distance.toLocaleString();
            maxTemp.textContent = `${planet.temp.day} C`
            minTemp.textContent = `${planet.temp.night} C`

            // ger mellanslag och kommatecken mellan varje måne och max 20 månar per rad.
            const moonsArray = planet.moons.map((moons, index) => {
                const separator = (index > 0) ? ', ' : ''; 
                return separator + moons;
            });
            const maxMoonsPerRow = 20;
            const moonsRow = [];
            for (let i = 0; i < moonsArray.length; i += maxMoonsPerRow) {
                moonsRow.push(moonsArray.slice(i, i + maxMoonsPerRow).join(''));
            }
            moons.textContent = moonsRow;
        }
    }

    // om vi ska visa månecontainern eller inte
    if (planet.type === 'star' && planet.name.toLowerCase() === 'solen') {
        if(moonsContainer) {
            moonsContainer.style.display = 'none';
        }
    } else {
        if(moonsContainer) {
            moonsContainer.style.display = planet.moons.length > 0 ? 'block' : 'none';
       }
        // lägga till planeterna i overlayen
        overlayPlanet = document.createElement('div');
        overlayPlanet.className = 'overlayPlanet';
        overlayPlanet.classList.add(planet.name.toLowerCase());
        overlayContent.appendChild(overlayPlanet);   
    }
    
    if(overlaySun) {
        overlaySun.style.backgroundColor = getComputedStyle(document.querySelector(`.${planet.name.toLowerCase()}`)).backgroundColor;
    }
  
}

function closeOverlay() {
    if(overlay) {
        overlay.style.display = 'none'
    }
    // nollställer overlayplaneterna vid varje öppning av planet så att det inte blir dubbletter
    if(overlayPlanet) {
        overlayPlanet.remove();
        overlayPlanet = null;
    }
}

overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeOverlay();
        }
});
