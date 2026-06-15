document.getElementById('travel-quiz').addEventListener('submit', function(event) {
    event.preventDefault();

    const selectedPlaceTypes = Array.from(
        document.querySelectorAll('input[name="place_type"]:checked')
    ).map(el => el.value);

    const selectedFears = Array.from(
        document.querySelectorAll('input[name="fears"]:checked')
    ).map(el => el.value);

    // Build query params
    const queryParams = new URLSearchParams();
    selectedPlaceTypes.forEach(p => queryParams.append('place_type', p));
    selectedFears.forEach(f => queryParams.append('fears', f));

    // Redirect to recommendations page with query params
    if (selectedPlaceTypes.length > 0) {
        window.location.href = `recommendations.html?${queryParams.toString()}`;
    } else {
        alert("Please select at least one place type.");
    }
});
