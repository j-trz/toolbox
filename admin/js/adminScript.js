import { supabase } from './supabase.js';

const form = document.getElementById('transactionForm');
const panel = document.getElementById('transaccionesPanel');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
let transaccionEditandoId = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevaTransaccion = {
    titulo: form.titulo.value,
    descripcion: form.descripcion.value,
    comando: form.comando.value,
    sistema: form.sistema.value,
    destacada: form.destacada.checked,
    timestamp: Date.now()
  };

  const { error } = await supabase
    .from('transacciones')
    .insert(nuevaTransaccion);

  if (error) {
    console.error('Error al guardar:', error);
    Swal.fire('Error', 'No se pudo guardar la transacción.', 'error');
  } else {
    Swal.fire('¡Éxito!', 'Transacción agregada correctamente.', 'success');
    form.reset();
    loadPanel();
  }
});

async function loadPanel() {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*');

  panel.innerHTML = '';

  if (error || !data.length) {
    panel.innerHTML = '<p class="text-gray-500">No hay transacciones registradas.</p>';
    return;
  }

  const transacciones = [...data].sort((a, b) => {
    if (b.destacada && !a.destacada) return 1;
    if (a.destacada && !b.destacada) return -1;
    return b.timestamp - a.timestamp;
  });

  transacciones.forEach(t => {
    const card = document.createElement('div');
    card.className = 'border rounded p-4 bg-gray-50';

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold">${t.titulo} ${t.destacada ? '<span class="text-yellow-500">★</span>' : ''}</h3>
        <div class="space-x-2">
          <button class="text-blue-600 hover:underline" data-edit="${t.id}">Editar</button>
          <button class="text-red-600 hover:underline" data-delete="${t.id}">Eliminar</button>
        </div>
      </div>
      <p class="text-sm text-gray-700 mt-1">${t.descripcion}</p>
      <p class="text-sm mt-1"><strong>Comando:</strong> <code class="bg-gray-200 px-1 rounded">${t.comando}</code></p>
      <p class="text-sm text-gray-500">Sistema: ${t.sistema}</p>
    `;

    panel.appendChild(card);

    card.querySelector(`[data-delete="${t.id}"]`).addEventListener('click', async () => {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await supabase.from('transacciones').delete().eq('id', t.id);
        Swal.fire('Eliminado', 'La transacción fue eliminada.', 'success');
        loadPanel();
      }
    });

    card.querySelector(`[data-edit="${t.id}"]`).addEventListener('click', () => {
      openEditModal(t.id, t);
    });
  });
}

const openEditModal = (id, transaccion) => {
  transaccionEditandoId = id;
  editForm.editTitulo.value = transaccion.titulo;
  editForm.editDescripcion.value = transaccion.descripcion;
  editForm.editComando.value = transaccion.comando;
  editForm.editSistema.value = transaccion.sistema;
  editForm.editDestacada.checked = transaccion.destacada;

  editModal.classList.remove('hidden');
  editModal.classList.add('flex');
};

const closeEditModal = () => {
  editModal.classList.add('hidden');
  editModal.classList.remove('flex');
  transaccionEditandoId = null;
};

document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!transaccionEditandoId) return;

  const nuevaData = {
    titulo: editForm.editTitulo.value,
    descripcion: editForm.editDescripcion.value,
    comando: editForm.editComando.value,
    sistema: editForm.editSistema.value,
    destacada: editForm.editDestacada.checked
  };

  await supabase.from('transacciones').update(nuevaData).eq('id', transaccionEditandoId);
  closeEditModal();
  Swal.fire('¡Éxito!', 'Cambios guardados correctamente.', 'success');
  loadPanel();
});

loadPanel();
