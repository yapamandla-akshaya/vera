const typeMapping = {
    beach: ['beach', 'island', 'tropical', 'lake'],
    mountain: ['mountain', 'snowy', 'volcano'],
    city: ['city', 'historical'],
    forest: ['forest', 'rainforest'],
    desert: ['desert'],
    historical: ['historical', 'city'],
    island: ['island', 'beach', 'tropical'],
    countryside: ['countryside', 'vineyard']
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const placeTypes = urlParams.getAll('place_type');
    const fears = urlParams.getAll('fears');

    const destinations = getRecommendations(placeTypes, fears);
    displayDestinations(destinations);
});

function getRecommendations(placeTypes, fears) {
    // Collect allowable types from selected placeTypes
    let allowableTypes = new Set();
    placeTypes.forEach(pt => {
        if (typeMapping[pt]) {
            typeMapping[pt].forEach(t => allowableTypes.add(t));
        }
    });

    let filtered = allDestinations.filter(dest => {
        // Match by type (using allowable types)
        const typeMatch = placeTypes.length === 0 || allowableTypes.has(dest.type);

        // Only check fears if the destination has them
        const fearMatch = !fears.length || !(dest.fears && dest.fears.some(fear => fears.includes(fear)));

        return typeMatch && fearMatch;
    });

    // If fear of flying is selected, remove destinations with high flight costs
    if (fears.includes('flying')) {
        filtered = filtered.filter(dest => {
            if (!dest.budget || !dest.budget.flights) return true;
            const flightCost = dest.budget.flights.match(/\d+/);
            return flightCost && parseInt(flightCost[0]) < 1000;
        });
    }

    // Fallback: If less than 3 results, add more fear-safe destinations sorted by relevance
    if (filtered.length < 3) {
        const fearSafe = allDestinations.filter(dest => {
            const fearMatch = !fears.length || !(dest.fears && dest.fears.some(fear => fears.includes(fear)));
            return fearMatch;
        }).filter(dest => !filtered.includes(dest)); // Exclude already included

        // Sort by relevance: count how many selected placeTypes' mappings include dest.type
        fearSafe.sort((a, b) => {
            const aScore = placeTypes.reduce((score, pt) => score + (typeMapping[pt] && typeMapping[pt].includes(a.type) ? 1 : 0), 0);
            const bScore = placeTypes.reduce((score, pt) => score + (typeMapping[pt] && typeMapping[pt].includes(b.type) ? 1 : 0), 0);
            return bScore - aScore;
        });

        // Add up to 3 more
        const additional = fearSafe.slice(0, 3 - filtered.length);
        filtered = filtered.concat(additional);
    }

    return filtered;
}

function displayDestinations(destinations) {
    const destinationsDiv = document.getElementById('destinations');
    destinationsDiv.innerHTML = '';

    if (destinations.length === 0) {
        destinationsDiv.innerHTML = '<p>No destinations match your criteria. Try different options!</p>';
        return;
    }

    destinations.forEach(dest => {
        const imgUrl = dest.image || `https://source.unsplash.com/600x400/?${encodeURIComponent(dest.name)}`;
        const destDiv = document.createElement('div');
        destDiv.className = 'destination-card';
        destDiv.innerHTML = `
            <img src="${imgUrl}" alt="${dest.name}" class="destination-card-image">
            <div class="destination-content">
                <h3><a href="destination.html?id=${dest.id}" class="destination-title-link">${dest.name}</a></h3>
                <p>${dest.description}</p>
                ${dest.budget ? `<h4>Budget Plan</h4><p>${dest.budget}</p>` : ''}
                ${dest.weather ? `<div class="weather-update"><h4>Weather</h4><p>${dest.weather}</p></div>` : ''}
            </div>
        `;
        destinationsDiv.appendChild(destDiv);
    });
}
