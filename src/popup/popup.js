import { getActiveTools } from '../api/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const toolsContainer = document.getElementById('tools-container');
    const loadingMessage = document.getElementById('loading-message');
    const searchInput = document.getElementById('searchInput');

    const renderTools = (tools) => {
        toolsContainer.innerHTML = ''; // Limpiar contenedor
        if (tools.length === 0) {
            toolsContainer.innerHTML = '<p>No se encontraron herramientas.</p>';
            return;
        }

        tools.forEach(tool => {
            const toolElement = document.createElement('a');
            toolElement.href = tool.url;
            toolElement.target = '_blank';
            toolElement.className = 'tool-card';
            toolElement.innerHTML = `
                <img src="${tool.imageUrl}" alt="${tool.name}" class="tool-icon">
                <span class="tool-name">${tool.name}</span>
            `;
            toolsContainer.appendChild(toolElement);
        });
    };

    try {
        const allTools = await getActiveTools();
        loadingMessage.style.display = 'none';
        renderTools(allTools);

        // Lógica de búsqueda
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredTools = allTools.filter(tool =>
                tool.name.toLowerCase().includes(searchTerm)
            );
            renderTools(filteredTools);
        });

    } catch (error) {
        console.error('Error al cargar herramientas:', error);
        loadingMessage.textContent = 'Error al cargar. Inténtalo de nuevo más tarde.';
    }
});