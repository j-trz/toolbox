import { supabase } from '../../supabase/client.js';
import { ICONS_SVG } from '../../libs/icons.js';

// =================================================================================
// 0. SEGURIDAD Y AUTENTICACIÓN
// =================================================================================

//(async function checkAuth() {
 //   const { data: { session }, error } = await supabase.auth.getSession();
    
  //  if (error) {
  //      console.error("Error al obtener la sesión:", error);
        // Si hay un error, por seguridad redirigimos al login
 //       window.location.href = '../login/index.html';
  //      return;
 //   }
    
//    if (!session) {
        // Si no hay sesión de usuario, redirigir a la página de login
//        window.location.href = '../login/index.html';
 //   }
    // Si hay una sesión, el resto del script se ejecuta normalmente.
//})();

// =================================================================================
// 1. DECLARACIÓN DE ELEMENTOS DEL DOM 
// =================================================================================
const form = document.getElementById('tool-form');
const formTitle = document.getElementById('form-title');
const toolIdInput = document.getElementById('tool-id');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const iconInput = document.getElementById('icon');
const iconPreview = document.getElementById('icon-preview');
const isSubmenuCheckbox = document.getElementById('is-submenu');
const parentMenuContainer = document.getElementById('parent-menu-container');
const parentIdSelect = document.getElementById('parent-id');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const menuPreviewList = document.getElementById('menu-preview-list');
const cancelBtn = document.getElementById('cancel-edit-btn');
const submitBtn = form.querySelector('button[type="submit"]');
const iconModal = document.getElementById('icon-modal');
const iconGalleryBtn = document.getElementById('icon-gallery-btn');
const closeIconModalBtn = document.getElementById('close-modal-btn');
const iconGallery = document.getElementById('icon-gallery');
const iconSearchInput = document.getElementById('icon-search-input');
const elementIdInput = document.getElementById('element_id'); 

// =================================================================================
// 2. ESTADO DE LA APLICACIÓN
// =================================================================================
let allItems = [];

// =================================================================================
// 3. DEFINICIÓN DE FUNCIONES
// =================================================================================

// --- Lógica de Iconos ---
function initializeIconGallery(searchTerm = '') {
    iconGallery.innerHTML = '';
    const searchTermLower = searchTerm.toLowerCase();
    const filteredIcons = ICONS_SVG.filter(icon => icon.name.toLowerCase().includes(searchTermLower));
    if (filteredIcons.length === 0) {
        iconGallery.innerHTML = `<p class="col-span-full text-center text-slate-500">No se encontraron iconos.</p>`;
        return;
    }
    filteredIcons.forEach(iconObj => {
        const iconBtn = document.createElement('button');
        iconBtn.type = 'button';
        iconBtn.className = 'p-2 rounded-md hover:bg-slate-200 text-[#2C4B8B]';
        iconBtn.innerHTML = iconObj.svg; 
        iconBtn.title = iconObj.name;
        iconBtn.onclick = () => selectIcon(iconObj.svg); 
        iconGallery.appendChild(iconBtn);
    });
}
function selectIcon(iconSvg) {
    iconInput.value = iconSvg;
    iconPreview.innerHTML = iconSvg;
    iconModal.classList.add('hidden');
}

// --- Renderizado y UI ---
function renderMenuPreview() {
    menuPreviewList.innerHTML = '';
    const mainItems = allItems.filter(item => !item.parent_id).sort((a,b) => a.order - b.order);
    if (mainItems.length === 0) {
        menuPreviewList.innerHTML = `<div class="text-center text-slate-500 p-4">No hay ítems todavía.</div>`;
        return;
    }
    mainItems.forEach(item => {
        const hasSubmenus = allItems.some(sub => sub.parent_id === item.id);
        const itemEl = createMenuItemElement(item, false, hasSubmenus);
        menuPreviewList.appendChild(itemEl);
        if (hasSubmenus) {
            const subItems = allItems.filter(sub => sub.parent_id === item.id).sort((a,b) => a.order - b.order);
            const sublistEl = document.createElement('div');
            sublistEl.className = 'ml-6 space-y-2 hidden transition-all duration-300 ease-in-out'; 
            sublistEl.dataset.submenuFor = item.id;
            subItems.forEach(subItem => {
                const subItemEl = createMenuItemElement(subItem, true);
                sublistEl.appendChild(subItemEl);
            });
            menuPreviewList.appendChild(sublistEl);
        }
    });
}
function createMenuItemElement(item, isSubItem = false, hasSubmenus = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center justify-between gap-4 group';
    wrapper.dataset.id = item.id;
    const previewEl = document.createElement('div');
    previewEl.className = 'flex-grow flex items-center gap-3 p-3 border-b';
    if (hasSubmenus) {
        previewEl.classList.add('cursor-pointer', 'hover:opacity-90');
        previewEl.dataset.toggleSubmenu = item.id;
    }
    previewEl.style.backgroundColor = item.bg_color;
    previewEl.style.color = item.text_color;
    const iconHTML = item.icon || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>`;
    previewEl.innerHTML = `
        <div class="w-8 h-8 content-center flex-shrink-0">${iconHTML}</div>
        <span class="font-semibold flex-grow">${item.title}</span>
        ${isSubItem ? '<span class="text-sm opacity-70">(Sub)</span>' : ''}
        ${hasSubmenus ? '<span class="submenu-arrow text-sm transition-transform"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" /></svg></span>' : ''}
    `;
    const actionsEl = document.createElement('div');
    actionsEl.className = 'flex items-center gap-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity';
    actionsEl.innerHTML = `
        <button class="order-up-btn p-1 hover:bg-slate-200 rounded-full" title="Mover Arriba">🔼</button>
        <button class="order-down-btn p-1 hover:bg-slate-200 rounded-full" title="Mover Abajo">🔽</button>
        <button class="edit-btn p-1 hover:bg-slate-200 rounded-full" title="Editar">✏️</button>
        <button class="copy-btn p-1 hover:bg-slate-200 rounded-full" title="Copiar">📋</button>
        <button class="delete-btn p-1 hover:bg-slate-200 rounded-full" title="Eliminar">🗑️</button>
    `;
    wrapper.appendChild(previewEl);
    wrapper.appendChild(actionsEl);
    return wrapper;
}
function populateParentMenuDropdown() {
    const currentId = toolIdInput.value;
    parentIdSelect.innerHTML = '<option value="">-- Ninguno (Es un menú principal) --</option>';
    const mainItems = allItems.filter(item => !item.parent_id && item.id != currentId);
    mainItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.title;
        parentIdSelect.appendChild(option);
    });
}
function resetFormState() {
    form.reset();
    toolIdInput.value = '';
    elementIdInput.value = '';
    formTitle.textContent = 'Añadir Ítem';
    iconPreview.innerHTML = '';
    textColorInput.value = '#000000'; 
    bgColorInput.value = '#FFFFFF';
    isSubmenuCheckbox.checked = false;
    parentMenuContainer.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar Ítem';
}

// --- Funciones de Datos (CRUD y Lógica de Negocio) ---
async function loadMenuItems() {
    const { data, error } = await supabase.from('tools').select('*');
    if (error) {
        console.error('Error cargando ítems:', error);
        Swal.fire('Error', 'No se pudieron cargar los ítems del menú.', 'error');
        return;
    }
    allItems = data;
    renderMenuPreview();
    populateParentMenuDropdown();
}

function handleEdit(id) {
    const item = allItems.find(i => i.id == id);
    if (!item) return;
    resetFormState();
    formTitle.textContent = 'Editar Ítem';
    toolIdInput.value = item.id;
    titleInput.value = item.title;
    elementIdInput.value = item.element_id;
    urlInput.value = item.url || '#';
    iconInput.value = item.icon;
    iconPreview.innerHTML = item.icon || '';
    bgColorInput.value = item.bg_color || '#ffffff';
    textColorInput.value = item.text_color || '#000000';
    isSubmenuCheckbox.checked = !!item.parent_id;
    parentMenuContainer.classList.toggle('hidden', !item.parent_id);
    populateParentMenuDropdown();
    if (item.parent_id) { parentIdSelect.value = item.parent_id; }
    cancelBtn.classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function handleDelete(id) {
    const result = await Swal.fire({ title: '¿Estás seguro?', text: '¡Esta acción no se puede revertir!', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, ¡bórralo!' });
    if (result.isConfirmed) {
        const { error } = await supabase.from('tools').delete().eq('id', id);
        if (error) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); } 
        else {
            Swal.fire('¡Eliminado!', 'El ítem ha sido eliminado.', 'success');
            await reorderAfterDelete(); 
            loadMenuItems();
        }
    }
}

async function handleCopy(id) {
    const itemToCopy = allItems.find(i => i.id == id);
    if (!itemToCopy) return;
    const { id: _, created_at, ...newItemData } = itemToCopy;
    newItemData.title += ' (Copia)';
    const siblings = allItems.filter(i => i.parent_id == newItemData.parent_id);
    newItemData.order = siblings.length;
    const { error } = await supabase.from('tools').insert([newItemData]).select();
    if (error) { Swal.fire('Error', 'No se pudo copiar.', 'error'); } 
    else {
        Swal.fire('¡Copiado!', 'Se ha creado una copia del ítem.', 'success');
        loadMenuItems();
    }
}

async function handleMove(id, direction) {
    const itemToMove = allItems.find(i => i.id == id);
    if (!itemToMove) return;

    // 1. Obtener la lista de "hermanos" (mismo nivel, mismo padre) y ordenarla.
    const siblings = allItems
        .filter(i => i.parent_id === itemToMove.parent_id)
        .sort((a, b) => a.order - b.order);

    const currentIndex = siblings.findIndex(i => i.id == id);

    // 2. Mover el elemento en el array local.
    if (direction === 'up' && currentIndex > 0) {
        // Intercambia el elemento con su vecino anterior
        [siblings[currentIndex], siblings[currentIndex - 1]] = [siblings[currentIndex - 1], siblings[currentIndex]];
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
        // Intercambia el elemento con su vecino siguiente
        [siblings[currentIndex], siblings[currentIndex + 1]] = [siblings[currentIndex + 1], siblings[currentIndex]];
    } else {
        return; // No se puede mover más en esa dirección
    }

    // 3. Re-indexar: Asignar el nuevo orden (0, 1, 2, ...) a toda la lista de hermanos.
    const updates = siblings.map((sibling, index) => ({
        id: sibling.id,
        order: index // El nuevo orden es simplemente su posición en el array
    }));

    // 4. Enviar todos los cambios a Supabase en una sola operación.
    const { error } = await supabase.from('tools').upsert(updates);

    if (error) {
        console.error("Error al reordenar:", error);
        Swal.fire('Error', 'No se pudo mover el ítem.', 'error');
    } else {
        // 5. Recargar los datos desde la DB para reflejar el nuevo orden.
        await loadMenuItems();
    }
}

async function reorderAfterDelete() {
    const allParentIds = [null, ...new Set(allItems.map(i => i.parent_id).filter(id => id))];
    const allUpdates = [];

    for (const parentId of allParentIds) {
        const siblings = allItems
            .filter(i => i.parent_id === parentId)
            .sort((a, b) => a.order - b.order);
        
        siblings.forEach((sibling, index) => {
            if (sibling.order !== index) {
                allUpdates.push({ id: sibling.id, order: index });
            }
        });
    }

    if (allUpdates.length > 0) {
        await supabase.from('tools').upsert(allUpdates);
    }
}


// =================================================================================
// 5. MANEJO DE EVENTOS (EVENT LISTENERS)
// =================================================================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    
    const isSubmenu = isSubmenuCheckbox.checked;
    const parentId = isSubmenu ? (parentIdSelect.value || null) : null;

    let order;
    if (toolIdInput.value) { // Al editar, mantiene su orden
        order = allItems.find(i => i.id == toolIdInput.value).order;
    } else { // Al crear, se va al final de su grupo
        const siblings = allItems.filter(i => i.parent_id == parentId);
        order = siblings.length;
    }

    const formData = {
        title: titleInput.value, 
        element_id: elementIdInput.value || null, 
        url: urlInput.value || null, 
        icon: iconInput.value,
        parent_id: parentId, 
        bg_color: bgColorInput.value, 
        text_color: textColorInput.value, 
        order: order,
    };

    const { error } = await supabase.from('tools').upsert(toolIdInput.value ? { id: toolIdInput.value, ...formData } : formData);

    if (error) {
        console.error('Error al guardar:', error);
        Swal.fire('Error', 'No se pudo guardar el ítem. Revisa la consola.', 'error');
        
    } else {
        Swal.fire('¡Éxito!', 'Ítem guardado correctamente.', 'success');
        resetFormState();
        await loadMenuItems();
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar Ítem';
});

// El resto de listeners se mantiene igual
menuPreviewList.addEventListener('click', async (e) => {
    const actionButton = e.target.closest('button');
    const toggleButton = e.target.closest('[data-toggle-submenu]');
    if (actionButton) {
        const wrapper = actionButton.closest('[data-id]');
        if (wrapper) {
            const id = wrapper.dataset.id;
            if (actionButton.classList.contains('edit-btn')) handleEdit(id);
            if (actionButton.classList.contains('delete-btn')) handleDelete(id);
            if (actionButton.classList.contains('copy-btn')) handleCopy(id);
            if (actionButton.classList.contains('order-up-btn')) handleMove(id, 'up');
            if (actionButton.classList.contains('order-down-btn')) handleMove(id, 'down');
        }
    }
    if (toggleButton) {
        const id = toggleButton.dataset.toggleSubmenu;
        const submenu = document.querySelector(`[data-submenu-for='${id}']`);
        const arrow = toggleButton.querySelector('.submenu-arrow');
        if (submenu) {
            submenu.classList.toggle('hidden');
            if(arrow) arrow.classList.toggle('rotate-180');
        }
    }
});
iconSearchInput.addEventListener('input', (e) => { 
    initializeIconGallery(e.target.value); });
cancelBtn.addEventListener('click', resetFormState);
isSubmenuCheckbox.addEventListener('change', (e) => { 
    parentMenuContainer.classList.toggle('hidden', !e.target.checked); 
       if (isChecked) {
        textColorInput.value = '#4B5563';
    } else {
        textColorInput.value = '#000000';
    }
});
iconGalleryBtn.addEventListener('click', () => iconModal.classList.remove('hidden'));
closeIconModalBtn.addEventListener('click', () => iconModal.classList.add('hidden'));

// =================================================================================
// 6. INICIALIZACIÓN DE LA APLICACIÓN
// =================================================================================
initializeIconGallery();
loadMenuItems();