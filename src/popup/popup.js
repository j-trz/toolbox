import { supabase } from '../supabase/client.js';


// --- ELEMENTOS DEL DOM ---
const toolsContainer = document.getElementById('tools-container');
const loadingIndicator = document.getElementById('loading-indicator');

// --- ESTADO ---
let allItems = [];

// --- FUNCIONES DE RENDERIZADO ---

function renderMenu() {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    toolsContainer.innerHTML = ''; // Limpiar

    const mainItems = allItems.filter(item => !item.parent_id).sort((a,b) => a.order - b.order);

    if (mainItems.length === 0) {
        toolsContainer.innerHTML = `<p class="text-center text-slate-400 p-4">No hay herramientas configuradas.</p>`;
        return;
    }

    mainItems.forEach(item => {
        const subItems = allItems.filter(sub => sub.parent_id === item.id).sort((a,b) => a.order - b.order);
        const itemEl = createMenuItemElement(item, subItems);
        toolsContainer.appendChild(itemEl);
    });
}

function createMenuItemElement(item, subItems) {
    const hasSubmenus = subItems.length > 0;
    
    // Contenedor principal para un ítem del menú
    const wrapper = document.createElement('div');
    
    // **AQUÍ SE USA TU DISEÑO COMO PLANTILLA**
    const iconHTML = item.icon || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C4B8B" stroke-width="2" class="brq oc se ur"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    const title = item.title || 'Sin Título';

    // Parte del botón visible
    const buttonHTML = `
        <div data-toggle-submenu="${item.id}" class="text-center hover:bg-slate-100 w-full border-b inline-flex grid grid-cols-2 gap-48 pb-[10px] pt-[10px]">
            <div class="m-2 inline-flex items-center text-sm font-semibold leading-6 text-gray-900">
                <div class="brq oc se ur mr-[20px] w-[24px] h-[24px] flex items-center justify-center" style="color: ${item.text_color};">
                    ${iconHTML}
                </div>
                <span style="color: ${item.text_color};">${title}</span>
            </div>
            <div class="flex items-center">
                <svg class="submenu-arrow h-4 w-4 transition-transform" viewBox="0 0 24 24" fill="#2C4B8B" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    `;

    // Parte del menú desplegable (si tiene subítems)
    let dropdownHTML = '';
    if (hasSubmenus) {
        const subItemsHTML = subItems.map(sub => `
            <li>
                <a href="${sub.url}" target="_blank" class="axs blf big bqe lx aaf adu aqp avz awo awf" style="color: ${sub.text_color}; background-color: ${sub.bg_color};">
                    <div class="axo brq oc se ur w-[24px] h-[24px] flex items-center justify-center">${sub.icon}</div>
                    ${sub.title}
                </a>
            </li>
        `).join('');

        dropdownHTML = `
            <div data-submenu-for="${item.id}" class="hidden submenu-container">
                <div class="w-full flex-auto overflow-hidden rounded-b-lg bg-white text-sm leading-6">
                    <nav class="lx um yr pl-[20px] pr-[10px] mt-[10px] mb-[20px]">
                        <ul role="list" class="lx um yr">
                            ${subItemsHTML}
                        </ul>
                    </nav>
                </div>
            </div>
        `;
    } else {
        // Si no hay submenús, el botón principal es un enlace directo
        wrapper.innerHTML = `<a href="${item.url}" target="_blank">${buttonHTML}</a>`;
    }
    
    if(hasSubmenus){
        wrapper.innerHTML = buttonHTML + dropdownHTML;
    }

    return wrapper;
}


// --- LÓGICA DE DATOS ---
async function fetchMenuItems() {
    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('isActive', true);

    if (error) {
        console.error("Error al cargar el menú:", error);
        if (loadingIndicator) loadingIndicator.textContent = "Error al cargar.";
        return;
    }
    
    allItems = data;
    renderMenu();
}

// --- MANEJO DE EVENTOS ---
toolsContainer.addEventListener('click', (e) => {
    const toggleButton = e.target.closest('[data-toggle-submenu]');
    if (toggleButton) {
        const id = toggleButton.dataset.toggleSubmenu;
        const submenu = document.querySelector(`[data-submenu-for='${id}']`);
        const arrow = toggleButton.querySelector('.submenu-arrow');
        
        if (submenu) {
            // Si el ítem principal tiene una URL, no prevenimos la navegación,
            // permitiendo que el usuario decida si hacer clic en el ítem o en la flecha.
            // Si no tiene URL, es solo un contenedor.
            const mainItem = allItems.find(item => item.id == id);
            if (!mainItem.url) {
                e.preventDefault();
            }
            submenu.classList.toggle('hidden');
            if (arrow) arrow.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    const downIcon = document.getElementById('downIcon');
    const rightIcon = document.getElementById('rightIcon');

    const menuButtonSrv = document.getElementById('menuButtonSrv');
    const menuDropdownSrv = document.getElementById('menuDropdownSrv');
    const downIconSrv = document.getElementById('downIconSrv');
    const rightIconSrv = document.getElementById('rightIconSrv');
  
    menuButton.addEventListener('click', function () {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      
      menuButton.setAttribute('aria-expanded', !isExpanded);
      menuDropdown.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdown.classList.remove('opacity-0', 'translate-y-1');
        menuDropdown.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIcon.classList.remove('hidden');
        rightIcon.classList.add('hidden');
      } else {
        menuDropdown.classList.remove('opacity-100', 'translate-y-0');
        menuDropdown.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
    });
  
    menuButtonSrv.addEventListener('click', function () {
      const isExpanded = menuButtonSrv.getAttribute('aria-expanded') === 'true';
      
      menuButtonSrv.setAttribute('aria-expanded', !isExpanded);
      menuDropdownSrv.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdownSrv.classList.remove('opacity-0', 'translate-y-1');
        menuDropdownSrv.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIconSrv.classList.remove('hidden');
        rightIconSrv.classList.add('hidden');
      } else {
        menuDropdownSrv.classList.remove('opacity-100', 'translate-y-0');
        menuDropdownSrv.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
  
    document.addEventListener('click', function (event) {
      if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuDropdown.classList.add('hidden');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
      if (!menuButtonSrv.contains(event.target) && !menuDropdownSrv.contains(event.target)) {
        menuButtonSrv.setAttribute('aria-expanded', 'false');
        menuDropdownSrv.classList.add('hidden');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
});

function hideElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            button.style.display = 'none';
        }
    });
    document.querySelectorAll('.container ').forEach(function (h1) {
        h1.style.display = 'none';
    });
    document.getElementById('reserva-info').style.display = 'none';
}

function showElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            if (isAuthenticated) {
                if (button.id === 'login-button') {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'block';
                }
            } else {
                button.style.display = 'block';
            }
        }
    });
    document.querySelectorAll('.container h1').forEach(function (h1) {
        h1.style.display = 'block';
    });
    document.getElementById('reserva-info').style.display = 'block';
}

document.getElementById('generar-eticket').addEventListener('click', function () {
    console.log('Generando eticket.');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosEticket" });
    });
});

document.getElementById('generar-itinerario').addEventListener('click', function () {
    console.log('Generando itinerario.');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosItinerario" });
    });
});

document.getElementById('generar-chanchito').addEventListener('click', function() {
    const width = 1000;
    const height = 800;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('../routes/itinerario.html', 'popupWindow', features);
});

document.getElementById('login').addEventListener('click', function() {
    const width = 600;
    const height = 400;
    const left = 1000;
    const top = 100;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('../routes/login.html', 'popupWindow', features);
});

document.getElementById('open-chatbot').addEventListener('click', function() {
    const width = 430;
    const height = 560;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('../routes/chatbot.html', 'popupWindow', features);
});

document.getElementById('transacciones').addEventListener('click', function() {
    const width = 1000;
    const height = 800;
    const left = 5000;
    const top = 500;
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;
    
    window.open('../routes/gdsCompare.html', 'popupWindow', features);
});

// document.getElementById('gwc-form-button').addEventListener('click', function() {
//    const width = 620;
//    const height = 850;
//    const left = 5000;
//    const top = 500;
//    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;

//    window.open('../routes/formSugerencias.html', 'popupWindow', features);
    
//});


// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', fetchMenuItems);