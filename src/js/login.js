import { supabase } from '../supabase/client.js';

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-address');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');
const loginButton = document.getElementById('login-button');
const buttonText = document.getElementById('button-text');
const buttonLoader = document.getElementById('button-loader');

// --- LÓGICA DE LOGIN ---

// Al cargar la página, comprobar si ya hay un usuario logueado
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // Si hay sesión, redirigir directamente al admin
        window.location.href = '../admin/index.html';
    }
});

// Manejar el envío del formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mostrar estado de carga
    errorMessageDiv.textContent = '';
    loginButton.disabled = true;
    buttonText.classList.add('hidden');
    buttonLoader.classList.remove('hidden');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Iniciar sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    // Ocultar estado de carga
    loginButton.disabled = false;
    buttonText.classList.remove('hidden');
    buttonLoader.classList.add('hidden');

    if (error) {
        // Mostrar mensaje de error
        errorMessageDiv.textContent = 'Email o contraseña incorrectos.';
        console.error('Error de login:', error.message);
    } else if (data.session) {
        // Si el login es exitoso, redirigir al panel de admin
        window.location.href = '../admin/index.html';
    }
});