import { supabase } from '../supabase/client.js';

// =================================================================================
// LÓGICA DEL MENÚ DINÁMICO (ARQUITECTURA BASADA EN BOTONES)
// =================================================================================

async function fetchAndRenderMenu() {
    const dynamicMenuContainer = document.getElementById('tools-container');
    if (!dynamicMenuContainer) return;

    const { data: allItems, error } = await supabase.from('tools').select('*').eq('isActive', true).order('order');

    if (error) {
        console.error("Error al cargar el menú:", error);
        dynamicMenuContainer.innerHTML = `<p class="text-center text-red-500 p-2">Error al cargar el menú</p>`;
        return;
    }

    dynamicMenuContainer.innerHTML = '';
    const mainItems = allItems.filter(item => !item.parent_id);

    mainItems.forEach(item => {
        const subItems = allItems.filter(sub => sub.parent_id === item.id);
        const menuItemElement = createMenuItemHTML(item, subItems);
        dynamicMenuContainer.appendChild(menuItemElement);
    });

    attachActionListeners(allItems);
}

function createMenuItemHTML(item, subItems) {
    const hasSubmenus = subItems.length > 0;
    const wrapper = document.createElement('div');

    // 1. SIEMPRE creamos un <button> como elemento principal.
    const mainButton = document.createElement('button');
    mainButton.type = 'button';
    mainButton.className = "text-center hover:bg-slate-100 w-full border-b inline-flex justify-between pb-[15px] pt-[15px] items-center";
    
    // 2. Asignamos atributos de datos para que el JS sepa qué hacer.
    if (item.element_id) { mainButton.id = item.element_id; }
    if (item.url) { mainButton.dataset.url = item.url; }
    if (hasSubmenus) { mainButton.dataset.toggleId = item.id; }

    // 3. Construimos el contenido visual del botón
    const iconHTML = item.icon || `<svg ...></svg>`;
    const title = item.title || 'Sin Título';
    mainButton.innerHTML = `
        <span class="inline-flex items-center text-sm font-semibold leading-6 text-gray-900 pointer-events-none">
            <span class="brq oc se ur mr-[20px] w-[24px] h-[24px] flex items-center justify-center" style="color: ${item.text_color};">
                ${iconHTML}
            </span>
            <span style="color: ${item.text_color};">${title}</span>
        </span>
        <span class="flex items-center pointer-events-none">
            <svg data-arrow-id="${item.id}" class="h-4 w-4 transition-transform ${hasSubmenus ? '' : 'hidden'}" viewBox="0 0 24 24" fill="#2C4B8B">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
            </svg>
        </span>
    `;
    wrapper.appendChild(mainButton);

    // 4. Creamos el desplegable si es necesario
    if (hasSubmenus) {
        const subItemsHTML = subItems.map(sub => {
            const subId = sub.element_id ? `id="${sub.element_id}"` : '';
            const subUrl = sub.url ? sub.url : 'javascript:void(0);';

           
            return `
                <li ${subId} >
                    <a href="${subUrl}"  target="_blank" class="axs blf big bqe lx aaf adu aqp avz awo awf" style="color: ${sub.text_color}; background-color: ${sub.bg_color};">
                        <div class="axo brq oc se ur w-[24px] h-[24px] flex items-center justify-center">${sub.icon}</div>
                        ${sub.title}
                    </a>
                </li>`;
        }).join('');

        const dropdown = document.createElement('div');
        dropdown.dataset.dropdownId = item.id;
        dropdown.className = "hidden";
        dropdown.innerHTML = `
            <div class="w-full flex-auto overflow-hidden rounded-b-lg bg-white text-sm leading-6">
                <nav class="lx um yr pl-[20px] pr-[10px] mt-[10px] mb-[20px]">
                    <ul role="list" class="lx um yr">${subItemsHTML}</ul>
                </nav>
            </div>
        `;
        wrapper.appendChild(dropdown);
    }

    return wrapper;
}

// =================================================================================
// INICIALIZACIÓN Y MANEJO DE EVENTOS
// =================================================================================

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Iniciamos la construcción del menú.
    fetchAndRenderMenu();

    // 2. Creamos UN SOLO gestor de clics para el menú dinámico.
    const dynamicMenuContainer = document.getElementById('tools-container');
    if (dynamicMenuContainer) {
        dynamicMenuContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return; // Si no se hizo clic en un botón, no hacer nada

            const url = button.dataset.url;
            const toggleId = button.dataset.toggleId;

            // PRIORIDAD 1: Si es un menú para desplegar, su única acción es desplegarse.
            if (toggleId) {
                const dropdown = document.querySelector(`[data-dropdown-id="${toggleId}"]`);
                const arrow = document.querySelector(`[data-arrow-id="${toggleId}"]`);
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                    if (arrow) {
                        arrow.style.transform = dropdown.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
                    }
                }
            } 
            // PRIORIDAD 2: Si NO es desplegable pero tiene una URL, se abre la URL.
            else if (url) {
                window.open(url, '_blank');
            }
        });
    }

    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.open('../admin/index.html', '_blank');
        });
    }
});

// =================================================================================
// LISTENERS Y FUNCIONES ORIGINALES (para elementos con ID fijos)
// =================================================================================

function attachActionListeners(allItems) {
    const generarEticket = document.getElementById('generar-eticket');
    if (generarEticket) {
        generarEticket.addEventListener('click', function () {
            console.log('Generando eticket.');
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosEticket" });
            });
        });
    }

    const generarItinerario = document.getElementById('generar-itinerario');
    if (generarItinerario) {
        generarItinerario.addEventListener('click', function () {
            console.log('Generando itinerario.');
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "capturarDatosItinerario" });
            });
        });
    }

    const generarChanchito = document.getElementById('generar-chanchito');
    if (generarChanchito) {
        generarChanchito.addEventListener('click', function() {
            window.open('../routes/itinerario.html', 'popupWindow', `width=1000,height=800,top=500,left=5000,resizable=yes,scrollbars=yes,status=yes`);
        });
    }

    const openChatbot = document.getElementById('open-chatbot');
    if (openChatbot) {
        openChatbot.addEventListener('click', function() {
            window.open('../routes/chatbot.html', 'popupWindow', `width=430,height=560,top=500,left=5000,resizable=yes,scrollbars=yes,status=yes`);
        });
    }

    const transacciones = document.getElementById('transacciones');
    if (transacciones) {
        transacciones.addEventListener('click', function() {
            window.open('../routes/gdsCompare.html', 'popupWindow', `width=1000,height=800,top=500,left=5000,resizable=yes,scrollbars=yes,status=yes`);
        });
    }
}
