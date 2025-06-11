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
    const iconHTML = item.icon || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C4B8B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    const title = item.title || 'Sin Título';

    // Parte del botón visible
    const buttonHTML = `
        <div data-toggle-submenu="${item.id}" class="text-center hover:bg-slate-100 w-full border-b inline-flex justify-between pb-[10px] pt-[10px] cursor-pointer">
            <div class="inline-flex items-center text-sm font-semibold leading-6 text-gray-900">
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


// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', fetchMenuItems);