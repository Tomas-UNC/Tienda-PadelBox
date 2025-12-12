// js/paletas.js

async function cargarPaletas(filtroEstado = 'todos') {
    try {
        const response = await fetch('/paletas.json');
        const paletas = await response.json();
        
        let paletasFiltradas = paletas.filter(p => p.disponible !== false);
        
        if (filtroEstado !== 'todos') {
            paletasFiltradas = paletasFiltradas.filter(p => p.estado === filtroEstado);
        }
        
        return paletasFiltradas;
    } catch (error) {
        console.error('Error cargando paletas:', error);
        return [];
    }
}

function mostrarPaletas(paletas, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (paletas.length === 0) {
        container.innerHTML = '<p class="no-productos">No hay paletas disponibles en esta categoría.</p>';
        return;
    }
    
    paletas.forEach(paleta => {
        const badge = paleta.estado === 'nueva' ? '<span class="badge nueva">NUEVA</span>' :
                     paleta.estado === 'usada' ? '<span class="badge usada">USADA</span>' :
                     '<span class="badge encargo">ENCARGO</span>';
        
        const html = `
            <div class="producto-card">
                ${badge}
                <img src="${paleta.imagen || '/images/placeholder.jpg'}" 
                     alt="${paleta.title}"
                     onerror="this.src='/images/placeholder.jpg'">
                <div class="producto-info">
                    <h3>${paleta.title}</h3>
                    <p class="marca">${paleta.marca}</p>
                    <p class="precio">$${paleta.precio ? paleta.precio.toLocaleString('es-AR') : 'Consultar'}</p>
                    <p class="descripcion">${paleta.descripcion || ''}</p>
                    <button class="btn-comprar" 
                            onclick="consultarPaleta('${paleta.title}', '${paleta.estado}')">
                        Consultar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// Usar en cada página específica:
// En paletasNuevas.html:
// document.addEventListener('DOMContentLoaded', async () => {
//     const paletas = await cargarPaletas('nueva');
//     mostrarPaletas(paletas, 'paletas-container');
// });