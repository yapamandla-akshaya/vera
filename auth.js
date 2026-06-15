document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = registerForm.username.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            // For demo purposes, we'll use localStorage.
            // In a real application, you would send this to a server.
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.find(user => user.email === email);

            if (userExists) {
                alert('User with this email already exists.');
            } else {
                users.push({ username, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }
});
