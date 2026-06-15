document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const destinationId = urlParams.get('id');

    const destination = allDestinations.find(d => d.id === destinationId);

    if (destination) {
        // --- Record Recent View ---
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);
            if (userIndex !== -1) {
                if (!users[userIndex].recentViews) {
                    users[userIndex].recentViews = [];
                }
                // Add to the beginning and remove duplicates
                users[userIndex].recentViews = [destinationId, ...users[userIndex].recentViews.filter(id => id !== destinationId)];
                // Keep only the last 5 views
                users[userIndex].recentViews = users[userIndex].recentViews.slice(0, 5);
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        document.getElementById('destination-name').textContent = destination.name;
        const detailsDiv = document.getElementById('destination-details');

        detailsDiv.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="destination-header-image">
            <div class="destination-content-full">
                <h2>About ${destination.name}</h2>
                <p>${destination.description}</p>

                <div class="details-section">
                    <h3>Weather</h3>
                    <p>${destination.weather}</p>
                </div>

                <div class="details-section">
                    <h3>Must-Try Food</h3>
                    <ul>
                        ${destination.mustTryFood.map(food => `<li>${food}</li>`).join('')}
                    </ul>
                </div>

                <div class="details-section">
                    <h3>Must-Visit Places</h3>
                    <ul>
                        ${destination.mustVisitPlaces.map(place => `<li>${place}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } else {
        document.getElementById('destination-details').innerHTML = '<p>Destination not found.</p>';
    }
});
