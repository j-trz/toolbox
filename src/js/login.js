import { supabase } from '../supabase/client.js';

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-address');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');
const loginButton = document.getElementById('login-button');
const buttonText = document.getElementById('button-text');
const buttonLoader = document.getElementById('button-loader');

// Redirigir si ya hay sesión
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // **CAMBIO 1:** Abrir admin en una nueva pestaña si ya hay sesión
            const width = 1025;
            const height = 768;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
            
            window.open('../admin/index.html', 'popupWindow', features);
    }
});

// Manejar el login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
    });

    setLoading(false);

    if (error) {
        errorMessageDiv.textContent = 'Email o contraseña incorrectos.';
        console.error('Error de login:', error.message);
    } else {
            const width = 1025;
            const height = 768;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
            
            window.open('../admin/index.html', 'popupWindow', features);
    }
});

function setLoading(isLoading) {
    loginButton.disabled = isLoading;
    buttonText.classList.toggle('hidden', isLoading);
    buttonLoader.classList.toggle('hidden', !isLoading);
}