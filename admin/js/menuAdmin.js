document.addEventListener('DOMContentLoaded', function () {
  const editIsSubmenu = document.getElementById('editIsSubmenu');
  const submenuInput = document.getElementById('editSubmenu');
  const submenuDropdown = document.getElementById('editSubmenuDropdown');

  if (editIsSubmenu) {
    editIsSubmenu.addEventListener('change', () => {
      submenuInput.style.display = editIsSubmenu.checked ? 'block' : 'none';

      submenuDropdown.innerHTML = menuItems
        .map((item) => `<option value="${item.text}">${item.text}</option>`)
        .join('');
    });
  } else {
    console.error('El elemento editIsSubmenu no existe en el DOM.');
  }
});

// Renderizar el menú y habilitar drag and drop
renderMenu();
enableDragAndDrop();

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}


const menuList = document.getElementById('menuList');
const modal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const editText = document.getElementById('editText');
const editIcon = document.getElementById('editIcon');
const editLink = document.getElementById('editLink');
const editIsSubmenu = document.getElementById('editIsSubmenu');
const editBgColor = document.getElementById('editBgColor');
const editTextColor = document.getElementById('editTextColor');
const saveBtn = document.getElementById('saveEdit');
const cancelBtn = document.getElementById('cancelEdit');
const addItemBtn = document.getElementById('addItem');
const deleteBtn = document.getElementById('deleteItem');

let currentEditIndex = null;
let isNewItem = false;

function renderMenu() {
  menuList.innerHTML = '';
  menuItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `flex justify-between items-center p-3 rounded shadow`;
    li.style.backgroundColor = item.bgColor;
    li.style.color = item.textColor;

    li.innerHTML = `
      <div>
        <span class="mr-2">${item.icon}</span>
        <span class="font-semibold">${item.text}</span>
        <small class="block text-xs">${item.link}</small>
      </div>
      <button class="text-sm text-blue-700 underline" data-index="${index}">Editar</button>
    `;

    menuList.appendChild(li);
  });

  document.querySelectorAll('button[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentEditIndex = parseInt(btn.dataset.index);
      isNewItem = false;
      openModal(menuItems[currentEditIndex]);
    });
  });
}

function openModal(item) {
  modal.classList.remove('hidden');
  modalTitle.textContent = isNewItem ? 'Nuevo ítem de menú' : 'Editar ítem';
  editText.value = item.text;
  editIcon.value = item.icon;
  editLink.value = item.link;
  editIsSubmenu.value = item.isSubmenu;
  editBgColor.value = item.bgColor;
  editTextColor.value = item.textColor;
  deleteBtn.classList.toggle('hidden', isNewItem);
}

cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

saveBtn.addEventListener('click', () => {
  const itemData = {
    id: isNewItem ? generateId() : menuItems[currentEditIndex].id,
    text: editText.value,
    icon: editIcon.value,
    link: editLink.value,
    isSubmenu: editIsSubmenu.value === "true",
    bgColor: editBgColor.value,
    textColor: editTextColor.value
  };

  if (isNewItem) {
    menuItems.push(itemData);
  } else {
    menuItems[currentEditIndex] = itemData;
  }

  modal.classList.add('hidden');
  renderMenu();
});

addItemBtn.addEventListener('click', () => {
  isNewItem = true;
  currentEditIndex = null;
  openModal({
    text: '',
    icon: '',
    link: '',
    isSubmenu: false,
    bgColor: '#ffffff',
    textColor: '#000000'
  });
});

deleteBtn.addEventListener('click', () => {
  if (!isNewItem && currentEditIndex !== null) {
    menuItems.splice(currentEditIndex, 1);
    modal.classList.add('hidden');
    renderMenu();
  }
});

// Habilitar arrastrar y soltar
function enableDragAndDrop() {
  const menuItems = document.querySelectorAll('#menuList li');
  menuItems.forEach((item, index) => {
    item.draggable = true;

    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData('text/plain');
      const targetIndex = index;

      // Reordenar los elementos en el array
      const draggedItem = menuItems[draggedIndex];
      menuItems.splice(draggedIndex, 1);
      menuItems.splice(targetIndex, 0, draggedItem);

      renderMenu();
      updatePopupMenu();
    });
  });
}

// Actualizar el menú en popup.html
function updatePopupMenu() {
  const popupMenu = document.getElementById('menuDropdown');
  popupMenu.innerHTML = menuItems
    .map(
      (item) => `
      <li>
        <a href="${item.link}" class="axs blf big bqe lx aaf adu aqp avz awo awf">
          ${item.icon} ${item.text}
        </a>
      </li>
    `
    )
    .join('');
}