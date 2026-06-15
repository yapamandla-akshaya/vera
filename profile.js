document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('username').textContent = loggedInUser.username;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserData = users.find(user => user.email === loggedInUser.email);

    // --- Render Recent Views ---
    const recentViewsContainer = document.getElementById('recent-views-container');
    if (currentUserData.recentViews && currentUserData.recentViews.length > 0) {
        const recentViews = currentUserData.recentViews.map(viewId => {
            return allDestinations.find(dest => dest.id === viewId);
        }).filter(Boolean); // Filter out any undefined destinations

        recentViewsContainer.innerHTML = recentViews.map(dest => `
            <div class="recent-view-card">
                <a href="destination.html?id=${dest.id}">
                    <img src="${dest.image}" alt="${dest.name}">
                    <span>${dest.name}</span>
                </a>
            </div>
        `).join('');
    } else {
        recentViewsContainer.innerHTML = '<p>You have not viewed any destinations yet.</p>';
    }

    // --- Render Checklist ---
    const checklistContainer = document.getElementById('checklist-container');
    let checklist = currentUserData.checklist || [];

    function renderChecklist() {
        checklistContainer.innerHTML = checklist.map((item, index) => `
            <li>
                <span>${item}</span>
                <button class="delete-checklist-item" data-index="${index}">Delete</button>
            </li>
        `).join('');
    }

    renderChecklist();

    // --- Add Checklist Item ---
    document.getElementById('checklist-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newItem = document.getElementById('checklist-item').value;
        checklist.push(newItem);
        updateUserChecklist();
        renderChecklist();
        document.getElementById('checklist-form').reset();
    });

    // --- Delete Checklist Item ---
    checklistContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-checklist-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            checklist.splice(index, 1);
            updateUserChecklist();
            renderChecklist();
        }
    });

    function updateUserChecklist() {
        const userIndex = users.findIndex(user => user.email === loggedInUser.email);
        if (userIndex !== -1) {
            users[userIndex].checklist = checklist;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    // --- Logout ---
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });
});
