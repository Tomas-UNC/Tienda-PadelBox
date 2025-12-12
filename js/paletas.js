// js/paletas.js

async function cargarPaletas(filtroEstado = 'todos') {
    try {
        const response = await fetch('/paletas.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const paletas = await response.json();
        
        // Asegurar que sea array
        const paletasArray = Array.isArray(paletas) ? paletas : [];
        
        let paletasFiltradas = paletasArray.filter(p => 
            p && (p.disponible === undefined || p.disponible === true)
        );
        
        if (filtroEstado !== 'todos') {
            paletasFiltradas = paletasFiltradas.filter(p => p.estado === filtroEstado);
        }
        
        return paletasFiltradas;
    } catch (error) {
        console.error('Error cargando paletas:', error);
        // Productos de ejemplo para desarrollo
        return productosDeEjemplo(filtroEstado);
    }
}

function mostrarPaletas(paletas, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Contenedor ${containerId} no encontrado`);
        return;
    }
    
    container.innerHTML = '';
    
    if (!paletas || paletas.length === 0) {
        container.innerHTML = `
            <div class="no-productos">
                <p>🏸 No hay paletas disponibles en esta categoría.</p>
                <p>Próximamente agregaremos más productos.</p>
            </div>
        `;
        return;
    }
    
    paletas.forEach(paleta => {
        // Escapar caracteres especiales para seguridad
        const nombre = escapeHtml(paleta.title || '');
        const marca = escapeHtml(paleta.marca || '');
        const descripcion = escapeHtml(paleta.descripcion || '');
        
        const badge = paleta.estado === 'nueva' ? 
            '<span class="badge nueva">NUEVA</span>' :
            paleta.estado === 'usada' ? 
            '<span class="badge usada">USADA</span>' :
            '<span class="badge encargo">ENCARGO</span>';
        
        const precio = paleta.precio ? 
            `$${paleta.precio.toLocaleString('es-AR')}` : 
            'Consultar';
        
        const imagen = paleta.imagen || '/images/placeholder.jpg';
        
        const html = `
            <div class="producto-card" data-id="${paleta.slug || ''}">
                ${badge}
                <img src="${imagen}" 
                     alt="${nombre}"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='/images/placeholder.jpg'">
                <div class="producto-info">
                    <h3>${nombre}</h3>
                    ${marca ? `<p class="marca">${marca}</p>` : ''}
                    <p class="precio">${precio}</p>
                    ${descripcion ? `<p class="descripcion">${descripcion}</p>` : ''}
                    <button class="btn-comprar" 
                            data-nombre="${nombre}"
                            data-precio="${paleta.precio || ''}"
                            data-estado="${paleta.estado || ''}">
                        Consultar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
    
    // Agregar event listeners a los botones
    agregarEventListeners();
}

// Función para escapar HTML (seguridad)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para agregar event listeners a los botones
function agregarEventListeners() {
    const botones = document.querySelectorAll('.btn-comprar');
    
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            const precio = this.getAttribute('data-precio');
            const estado = this.getAttribute('data-estado');
            
            consultarPaleta(nombre, precio, estado);
        });
    });
}

// Función para consultar una paleta
function consultarPaleta(nombre, precio, estado) {
    const precioFormateado = precio ? `$${parseInt(precio).toLocaleString('es-AR')}` : 'Consultar';
    
    // Puedes cambiar esto por un modal, formulario, etc.
    const mensaje = `
        🎾 CONSULTA ENVIADA
        ------------------
        Producto: ${nombre}
        Precio: ${precioFormateado}
        Estado: ${estado || 'No especificado'}
        
        📞 Te contactaremos pronto.
    `;
    
    alert(mensaje);
    
    // Opcional: Guardar en localStorage para seguimiento
    const consulta = {
        producto: nombre,
        precio: precio,
        estado: estado,
        fecha: new Date().toISOString()
    };
    
    const consultasPrevias = JSON.parse(localStorage.getItem('consultas_padelbox') || '[]');
    consultasPrevias.push(consulta);
    localStorage.setItem('consultas_padelbox', JSON.stringify(consultasPrevias));
}

// Productos de ejemplo para desarrollo
function productosDeEjemplo(filtro) {
    const ejemplos = [
        {
            title: "Paleta Nox ML10",
            precio: 45000,
            estado: "nueva",
            marca: "Nox",
            descripcion: "Paleta profesional de alta gama",
            disponible: true
        },
        {
            title: "Paleta Head Gravity",
            precio: 38000,
            estado: "usada",
            marca: "Head",
            descripcion: "Excelente estado, usada 3 meses",
            disponible: true
        },
        {
            title: "Paleta Varlion Pro",
            precio: 52000,
            estado: "encargo",
            marca: "Varlion",
            descripcion: "Encargo especial, 15 días de demora",
            disponible: true
        }
    ];
    
    if (filtro === 'todos') return ejemplos;
    return ejemplos.filter(p => p.estado === filtro);
}

// Exportar funciones para uso global
window.cargarPaletas = cargarPaletas;
window.mostrarPaletas = mostrarPaletas;
window.consultarPaleta = consultarPaleta;