// admin.js completo corregido con búsqueda, filtros, listado y gestión visual de catálogo

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.role !== 'admin') {
    alert('Acceso denegado. Inicia sesión como administrador.');
    window.location.href = '/pages/login.html';
    return;
  }

  const userBtn = document.getElementById('adminUserBtn');
  if (userBtn) userBtn.textContent = usuario.username;

  const contentMap = {
    report: renderReportes,
    catalog: renderCatalogo,
    ventas: renderVentas,
    users: renderUsuarios,
    contact: renderContacto
  };

  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      if (contentMap[section]) contentMap[section]();
    });
    console.log('Detectado:', btn.dataset.section);
  });

  console.log('admin.js cargado');
});



// 📚 Catálogo con búsqueda, filtros, y controles visuales
async function renderCatalogo() {
  const main = document.getElementById('mainContent');
  try {
    const [resLibros, resCategorias] = await Promise.all([
      fetch('http://localhost:3000/api/libros'),
      fetch('http://localhost:3000/api/categorias')
    ]);
    const libros = await resLibros.json();
    const categorias = await resCategorias.json();

    let catalogoHTML = `
      <div class="catalog-header">
        <input type="text" id="busquedaLibro" placeholder="🔍 Buscar por título o autor" />
        <select id="filtroCategoria">
          <option value=""> Categoría</option>
          ${categorias.map(cat => `<option value="${cat.Category}">${cat.Category}</option>`).join('')}
        </select>
        <input type="text" id="filtroAutor" placeholder="✒️ Autor" />
        <button class="btn-azul" onclick="mostrarFormularioLibro()">Add Book</button>
        <button class="btn-azul" onclick="mostrarCategorias()">Add Category</button>
        <button class="btn-azul" onclick="mostrarAutores()">Add Author</button>
      </div>
      <div class="catalog-table">
        <div class="catalog-header-row">
          <span>Book</span><span>Author</span><span>Price</span><span>Description</span><span>Image</span><span>Downloadable</span><span>Category</span><span>Actions</span>
        </div>
        <div id="catalogBody">
          ${libros.map(libro => `
            <div class="catalog-row">
                <span>${libro["Título"]}</span>
                <span>${libro["Autor"]}</span>
                <span>$${libro["Precio"]}</span>
                <span>${libro["Descripción"]}</span>
                <span>${libro["RutaDeLaImagen"]}</span>
                <span>${libro["RutaDelLibroDescargable"]}</span>
                <span>${libro["idCategoria"]}</span>

              <span>
                <button class="btn-azul" onclick="editarLibro(${libro.idLibro})">Edit</button>
                <button class="btn-rojo" onclick="eliminarLibro(${libro.idLibro})">Remove</button>
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    main.innerHTML = catalogoHTML;

    // Eventos para búsqueda y filtros
    document.getElementById('busquedaLibro').addEventListener('input', filtrarCatalogo);
    document.getElementById('filtroCategoria').addEventListener('change', filtrarCatalogo);
    document.getElementById('filtroAutor').addEventListener('input', filtrarCatalogo);

    window.catalogoLibrosOriginal = libros; // para filtrar sin perder el original
  } catch (err) {
  console.error('Error en renderCatalogo:', err);
  main.innerHTML = '<p>Error cargando el catálogo.</p>';
}
}

function filtrarCatalogo() {
  const titulo = document.getElementById('busquedaLibro').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value.toLowerCase();
  const autor = document.getElementById('filtroAutor').value.toLowerCase();

  const resultados = window.catalogoLibrosOriginal.filter(libro => {
    return (
      (!titulo || libro["Título"].toLowerCase().includes(titulo)) &&
      (!categoria || libro["idCategoria"].toString().toLowerCase() === categoria) &&
      (!autor || libro["Autor"].toLowerCase().includes(autor))
    );
  });

  const contenedor = document.getElementById('catalogBody');
  contenedor.innerHTML = resultados.map(libro => `
    <div class="catalog-row">
      <span>${libro["Título"]}</span>
      <span>${libro["Autor"]}</span>
      <span>$${libro["Precio"]}</span>
      <span>${libro["Descripción"]}</span>
      <span>${libro["RutaDeLaImagen"]}</span>
      <span>${libro["RutaDelLibroDescargable"]}</span>
      <span>${libro["idCategoria"]}</span>
      <span>
        <button class="btn-azul" onclick="editarLibro(${libro.idLibro})">Edit</button>
        <button class="btn-rojo" onclick="eliminarLibro(${libro.idLibro})">Remove</button>
      </span>
    </div>
  `).join('');
}

async function editarLibro(id) {
  const main = document.getElementById('mainContent');

  // Obtener libro por ID
  let libro, categorias;
  try {
    const [resLibro, resCategorias] = await Promise.all([
      fetch(`http://localhost:3000/api/libros/${id}`),
      fetch('http://localhost:3000/api/categorias')
    ]);
    libro = await resLibro.json();
    categorias = await resCategorias.json();
  } catch (err) {
    return alert('❌ Error al obtener datos del libro');
  }

  // Formulario con datos llenos
  main.innerHTML = `
    <h2>Editar libro</h2>
    <form id="formEditarLibro" class="form-libro">
      <input type="text" name="Título" value="${libro.Título}" required />
      <input type="text" name="Autor" value="${libro.Autor}" required />
      <input type="number" name="Precio" value="${libro.Precio}" step="0.01" required />
      <input type="number" name="CantidadDisponible" value="${libro.CantidadDisponible}" required />
      <input type="text" name="Descripción" value="${libro.Descripción}" required />
      
      <input type="text" name="RutaDelLibroDescargable" value="${libro.RutaDelLibroDescargable}" required />

      <input type="text" name="RutaDeLaImagen" value="${libro.RutaDeLaImagen}" required />

      <select name="idCategoria" required>
        ${categorias.map(cat => `
          <option value="${cat.idCategoria}" ${cat.idCategoria === libro.idCategoria ? 'selected' : ''}>
            ${cat.Category}
          </option>`).join('')}
      </select>

      <button type="submit" class="btn-azul">Guardar cambios</button>
    </form>
  `;

  // Guardar cambios
  document.getElementById('formEditarLibro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch(`http://localhost:3000/api/libros/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('✅ Libro actualizado');
        renderCatalogo();
      } else {
        alert('❌ No se pudo actualizar');
      }
    } catch (err) {
      alert('❌ Error al actualizar');
    }
  });
}

async function eliminarLibro(id) {
  if (!confirm('¿Estás seguro de eliminar este libro?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/libros/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.success) {
      alert('Libro eliminado');
      renderCatalogo();
    } else {
      alert('No se pudo eliminar');
    }
  } catch (err) {
    alert('Error al eliminar libro');
  }
}


async function mostrarFormularioLibro() {
  const main = document.getElementById('mainContent');

  let categorias = [];
  let autores = [];

  try {
    const [resCat, resAut] = await Promise.all([
      fetch('http://localhost:3000/api/categorias'),
      fetch('http://localhost:3000/api/autores')
    ]);
    categorias = await resCat.json();
    autores = await resAut.json();
  } catch (err) {
    return alert('❌ Error al cargar categorías o autores');
  }

  main.innerHTML = `
    <h2>Agregar nuevo libro</h2>
    <form id="formLibro" class="form-libro">
      <input type="text" name="Título" placeholder="Título" required />

      <select name="Autor" required>
        <option value="">Selecciona autor</option>
        ${autores.map(a => `<option value="${a.Autor}">${a.Autor}</option>`).join('')}
      </select>

      <input type="number" name="Precio" placeholder="Precio" step="0.01" required />
      <input type="number" name="CantidadDisponible" placeholder="Cantidad disponible" required />
      <input type="text" name="Descripción" placeholder="Descripción" required />

      <div class="subir-imagen">
        <label for="archivoImagen">Subir imagen:</label>
        <input type="file" id="archivoImagen" accept="image/*" />
        <button type="button" class="btn-azul" onclick="subirImagen()">Subir Imagen</button>
        <input type="hidden" name="RutaDeLaImagen" id="rutaImagen" required />
        <small id="previewRuta"></small>
      </div>

      <input type="text" name="RutaDelLibroDescargable" placeholder="Ruta del archivo PDF" required />

      <select name="idCategoria" required>
        <option value="">Selecciona categoría</option>
        ${categorias.map(cat => `<option value="${cat.idCategoria}">${cat.Category}</option>`).join('')}
      </select>

      <button type="submit" class="btn-azul">Guardar libro</button>
    </form>
  `;

  document.getElementById('formLibro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch('http://localhost:3000/api/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('✅ Libro agregado correctamente');
        renderCatalogo();
      } else {
        alert('❌ Error al agregar el libro');
      }
    } catch (err) {
      console.error('❌ Error al enviar libro:', err);
      alert('❌ No se pudo agregar el libro');
    }
  });
}


async function mostrarCategorias() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/categorias');
    const categorias = await res.json();

    main.innerHTML = `
      <h2>Categorías</h2>
      <div class="form-libro">
        <input type="text" id="nuevaCategoria" placeholder="Nueva categoría" />
        <button class="btn-azul" onclick="agregarCategoria()">Agregar</button>
      </div>
      <div class="lista-horizontal">
        ${categorias.map(cat => `
          <div class="item-lista">
            <span>${cat.Category}</span>
            <button class="btn-rojo" onclick="eliminarCategoria(${cat.idCategoria})">Eliminar</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error al cargar las categorías.</p>';
  }
}

async function agregarCategoria() {
  const nombre = document.getElementById('nuevaCategoria').value.trim();
  if (!nombre) return alert('Ingresa un nombre');

  try {
    const res = await fetch('http://localhost:3000/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Category: nombre })
    });
    const data = await res.json();
    if (data.success) {
      mostrarCategorias();
    } else {
      alert('No se pudo agregar');
    }
  } catch (err) {
    alert('Error de red');
  }
}

async function eliminarCategoria(id) {
  if (!confirm('¿Eliminar esta categoría?')) return;

  try {
    await fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: 'DELETE'
    });
    mostrarCategorias();
  } catch (err) {
    alert('Error al eliminar');
  }
}


function renderUsuarios() {
  document.getElementById('mainContent').innerHTML = '<h2>Usuarios</h2>';
}

function renderVentas() {
  document.getElementById('mainContent').innerHTML = '<h2>Ventas</h2>';
}

async function renderReportes() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/reportes');
    const data = await res.json();

    const best = data.bestSellers.map(b => `
      <tr>
        <td>${b.Título}</td>
        <td>${b.Autor}</td>
        <td>${b.ventas}</td>
        <td>$${b.Precio}</td>
        <td>$${(b.Precio * b.ventas).toFixed(2)}</td>
      </tr>
    `).join('');

    const least = data.leastSold.map(b => `
      <tr>
        <td>${b.Título}</td>
        <td>${b.Autor}</td>
        <td>${b.ventas}</td>
        <td>$${b.Precio}</td>
        <td>$${(b.Precio * b.ventas).toFixed(2)}</td>
      </tr>
    `).join('');

    main.innerHTML = `
      <h2>Reporte Semanal</h2>
      <h3>Más vendidos</h3>
      <table>
        <thead>
          <tr><th>Book</th><th>Author</th><th>Sales</th><th>Price</th><th>Profit</th></tr>
        </thead>
        <tbody>${best}</tbody>
      </table>
      <h3>Menos vendidos</h3>
      <table>
        <thead>
          <tr><th>Book</th><th>Author</th><th>Sales</th><th>Price</th><th>Profit</th></tr>
        </thead>
        <tbody>${least}</tbody>
      </table>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error al cargar el reporte.</p>';
    console.error(err);
  }
}


function renderContacto() {
  document.getElementById('mainContent').innerHTML = '<h2>Contacto</h2>';
}


async function subirImagen() {
  const input = document.getElementById('archivoImagen');
  const formData = new FormData();
  formData.append('imagen', input.files[0]);

  try {
    const res = await fetch('http://localhost:3000/api/libros/imagen', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.ruta) {
      document.getElementById('rutaImagen').value = data.ruta;
      document.getElementById('previewRuta').textContent = `Imagen guardada en: ${data.ruta}`;
    } else {
      alert('❌ Error al subir imagen');
    }
  } catch (err) {
    console.error(err);
    alert('❌ No se pudo subir imagen');
  }
}


async function mostrarAutores() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/autores');
    const autores = await res.json();

    main.innerHTML = `
      <h2>Autores</h2>
      <div class="form-libro">
        <input type="text" id="nuevoAutor" placeholder="Nombre del autor" />
        <button class="btn-azul" onclick="agregarAutor()">Agregar</button>
      </div>
      <div class="lista-horizontal">
        ${autores.map(a => `
          <div class="item-lista">
            <span>${a.Autor}</span>
            <button class="btn-rojo" onclick="eliminarAutor('${a.Autor}')">Eliminar</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error al cargar autores</p>';
  }
}


async function agregarAutor() {
  const nombre = document.getElementById('nuevoAutor').value.trim();
  if (!nombre) return alert('Escribe un nombre');

  try {
    const res = await fetch('http://localhost:3000/api/autores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Autor: nombre })
    });
    const data = await res.json();
    if (data.success) mostrarAutores();
  } catch {
    alert('Error al agregar autor');
  }
}

async function eliminarAutor(nombre) {
  if (!confirm('¿Eliminar autor?')) return;

  try {
    await fetch(`http://localhost:3000/api/autores/${encodeURIComponent(nombre)}`, {
      method: 'DELETE'
    });
    mostrarAutores();
  } catch {
    alert('Error al eliminar autor');
  }
}
