console.log('✅ login.js loaded');

const API_BASE = 'http://localhost:5000';

// Toggle forms
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    if (signupForm) signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
}

// Check auth on load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('foodHubToken');
    if (token) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
});

// Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value?.trim() || '';
    const password = document.getElementById('loginPassword')?.value || '';
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        localStorage.setItem('foodHubToken', data.token);
        localStorage.setItem('foodHubUser', JSON.stringify(data.user));
        alert('✅ Login successful!');
        window.location.href = 'index.html';

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName')?.value?.trim() || '';
    const email = document.getElementById('signupEmail')?.value?.trim() || '';
    const password = document.getElementById('signupPassword')?.value || '';
    const phone = document.getElementById('signupPhone')?.value?.trim() || '';
    const address = document.getElementById('signupAddress')?.value?.trim() || '';

    if (!name || !email || !password || !phone || !address) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, address })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Signup failed');

        localStorage.setItem('foodHubToken', data.token);
        localStorage.setItem('foodHubUser', JSON.stringify(data.user));
        alert('✅ Account created!');
        window.location.href = 'index.html';

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function redirectToHome() {
    window.location.href = 'index.html';
}