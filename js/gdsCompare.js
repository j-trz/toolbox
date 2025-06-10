import { supabase } from './supabase.js';

const transactionList = document.getElementById('transactionList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');

let data = [];

function render(transactions) {
  const search = searchInput.value.toLowerCase();
  const filter = filterSelect.value;
  transactionList.innerHTML = '';

  const filtered = transactions.filter(tx => {
    return (filter === 'all' || tx.sistema === filter) &&
      (tx.titulo.toLowerCase().includes(search) || tx.comando.toLowerCase().includes(search));
  });

  const sorted = filtered.sort((a, b) => {
    if (a.destacada && !b.destacada) return -1;
    if (!a.destacada && b.destacada) return 1;
    return b.timestamp - a.timestamp;
  });

  if (sorted.length === 0) {
    transactionList.innerHTML = '<p class="text-gray-500 text-center">No se encontraron transacciones.</p>';
    return;
  }

  sorted.forEach(tx => {
     let bgClass = 'bg-white';
    if (tx.sistema.toLowerCase() === 'sabre') {
      bgClass = 'bg-red-50/40';
    } else if (tx.sistema.toLowerCase() === 'amadeus') {
      bgClass = 'bg-sky-50/40';
    }
    const card = document.createElement('div');
    card.className = `${bgClass} p-4 shadow rounded`;
    card.innerHTML = `
      <h2 class="text-lg font-bold">${tx.titulo} <span class="text-md text-gray-500 uppercase">(${tx.sistema})</span> ${tx.destacada ? '<span class="text-yellow-500">⭐</span>' : ''}</h2>
      <p>${tx.descripcion}</p>
      <div class="mt-2 flex justify-between items-center">
        <code class="bg-yellow-200 px-2 py-1 rounded text-blue-800 font-bold mt-3">${tx.comando}</code>
        <button class="text-blue-500 text-sm copy-btn" data-comando="${tx.comando}">Copiar</button>
      </div>
    `;
    transactionList.appendChild(card);
  });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.comando);
      btn.textContent = '¡Copiado!';
      setTimeout(() => (btn.textContent = 'Copiar'), 1000);
    });
  });
}

async function loadTransactions() {
  const { data: transactions, error } = await supabase
    .from('transacciones')
    .select('*');

  if (error) {
    console.error('Error al cargar transacciones:', error);
    return;
  }

  data = transactions;
  render(data);
}

searchInput.addEventListener('input', () => render(data));
filterSelect.addEventListener('change', () => render(data));

loadTransactions();
