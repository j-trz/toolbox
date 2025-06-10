import { getAllTools, createNewTool, updateToolById, deleteToolById } from '../api/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tool-form');
    const formTitle = document.getElementById('form-title');
    const toolIdInput = document.getElementById('tool-id');
    const nameInput = document.getElementById('name');
    const urlInput = document.getElementById('url');
    const imageUrlInput = document.getElementById('imageUrl');
    const categoryInput = document.getElementById('category');
    const isActiveInput = document.getElementById('isActive');
    const adminToolsList = document.getElementById('admin-tools-list');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const submitBtn = form.querySelector('button[type="submit"]'); // NUEVO: Referencia al botón de guardar

    const resetForm = () => {
        form.reset();
        toolIdInput.value = '';
        formTitle.textContent = 'Añadir Nueva Herramienta';
        cancelBtn.style.display = 'none';
        submitBtn.disabled = false; // NUEVO: Habilitar el botón
        submitBtn.textContent = 'Guardar'; // NUEVO: Restaurar texto del botón
    };

    const loadTools = async () => {
        try {
            const tools = await getAllTools();
            adminToolsList.innerHTML = '';
            tools.forEach(tool => {
                const toolEl = document.createElement('div');
                toolEl.className = 'admin-tool-item';
                // Usamos el id de Supabase que es numérico
                toolEl.innerHTML = `
                    <span>${tool.name} (${tool.category}) - ${tool.isActive ? 'Activa' : 'Inactiva'}</span>
                    <div>
                        <button class="edit-btn" data-id="${tool.id}">Editar</button>
                        <button class="delete-btn" data-id="${tool.id}">Eliminar</button>
                    </div>
                `;
                adminToolsList.appendChild(toolEl);
            });
        } catch (error) {
            adminToolsList.innerHTML = '<p>Error al cargar herramientas.</p>';
            console.error(error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // NUEVO: Deshabilitar botón para evitar doble submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        const toolData = {
            name: nameInput.value,
            url: urlInput.value,
            imageUrl: imageUrlInput.value,
            category: categoryInput.value,
            isActive: isActiveInput.checked,
        };

        try {
            if (toolIdInput.value) {
                // Actualizar
                await updateToolById(toolIdInput.value, toolData);
                // NUEVO: Notificación de éxito
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'La herramienta ha sido actualizada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                // Crear
                await createNewTool(toolData);
                // NUEVO: Notificación de éxito
                Swal.fire({
                    title: '¡Creado!',
                    text: 'La nueva herramienta ha sido creada.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            resetForm();
            loadTools();
        } catch (error) {
            console.error('Error al guardar:', error);
            // NUEVO: Notificación de error
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar la herramienta. Revisa la consola para más detalles.',
                icon: 'error'
            });
            submitBtn.disabled = false; // NUEVO: Rehabilitar el botón si hay error
            submitBtn.textContent = 'Guardar';
        }
    });

    adminToolsList.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            // NUEVO: Confirmación con SweetAlert
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, ¡bórrala!',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteToolById(id);
                        Swal.fire(
                            '¡Borrado!',
                            'La herramienta ha sido eliminada.',
                            'success'
                        );
                        loadTools();
                    } catch (error) {
                        console.error('Error al eliminar:', error);
                        Swal.fire('Error', 'No se pudo eliminar la herramienta.', 'error');
                    }
                }
            });
        }

        if (e.target.classList.contains('edit-btn')) {
            const allTools = await getAllTools();
            const toolToEdit = allTools.find(t => t.id == id); // Usamos == para comparar string con número si es necesario
            if (toolToEdit) {
                formTitle.textContent = 'Editar Herramienta';
                toolIdInput.value = toolToEdit.id;
                nameInput.value = toolToEdit.name;
                urlInput.value = toolToEdit.url;
                imageUrlInput.value = toolToEdit.imageUrl;
                categoryInput.value = toolToEdit.category;
                isActiveInput.checked = toolToEdit.isActive;
                cancelBtn.style.display = 'inline-block';
                window.scrollTo(0, 0);
            }
        }
    });
    
    cancelBtn.addEventListener('click', resetForm);

    // Carga inicial
    loadTools();
});