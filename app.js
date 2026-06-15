document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const authNav = document.querySelector('.auth-nav');

    if (loggedInUser) {
        authNav.innerHTML = `
            <a href="profile.html" class="profile-link">Profile</a>
            <a href="#" id="logout" class="logout-link">Logout</a>
        `;
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    } else {
        authNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
});
