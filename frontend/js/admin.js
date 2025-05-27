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



async function renderCatalogo() {
  const main = document.getElementById('mainContent');
  const [resLibros, resCategorias] = await Promise.all([
    fetch('http://localhost:3000/api/libros'),
    fetch('http://localhost:3000/api/categorias')
  ]);
  const libros = await resLibros.json();
  const categorias = await resCategorias.json();

  window.catalogoLibrosOriginal = libros;

  main.innerHTML = `
    <h2>📚 Catálogo de Libros</h2>

    <div class="catalog-toolbar">
      <input type="text" id="busquedaLibro" placeholder="🔍 Buscar por título o autor" />
      
      <select id="filtroCategoria">
        <option value="">Categoría</option>
        ${categorias.map(c => `<option value="${c.Category}">${c.Category}</option>`).join('')}
      </select>

      <input type="text" id="filtroAutor" placeholder="✒️ Autor" />

      <button class="btn-azul" onclick="mostrarFormularioLibro()">Agregar Libro</button>
      <button class="btn-azul" onclick="mostrarCategorias()">Agregar Categoría</button>
      <button class="btn-azul" onclick="mostrarAutores()">Agregar Autor</button>
    </div>

    <div class="catalogo-table">
      <div class="catalogo-header-row">
        <span>Book</span><span>Author</span><span>Price</span><span>Description</span><span>Image</span><span>Category</span><span>Actions</span>
      </div>
      <div id="catalogBody">
        ${libros.map(libro => `
          <div class="catalogo-row">
            <span>${libro.Título ?? 'Sin título'}</span>
            <span>${libro.Autor ?? 'Desconocido'}</span>
            <span>$${libro.Precio}</span>
            <span>${libro.Descripción}</span>
            <span>
              ${libro.RutaDeLaImagen
                ? `<img src="${libro.RutaDeLaImagen}" alt="Imagen" height="60">`
                : 'Sin imagen'}
            </span>
            <span>${libro.Categoria ?? 'Sin categoría'}</span>
            <span>
              <button class="btn-azul" onclick="editarLibro(${libro.idLibro})">Edit</button>
              <button class="btn-rojo" onclick="eliminarLibro(${libro.idLibro})">Remove</button>
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('busquedaLibro').addEventListener('input', filtrarCatalogo);
  document.getElementById('filtroCategoria').addEventListener('change', filtrarCatalogo);
  document.getElementById('filtroAutor').addEventListener('input', filtrarCatalogo);
}





function filtrarCatalogo() {
  const titulo = document.getElementById('busquedaLibro').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value.toLowerCase();
  const autor = document.getElementById('filtroAutor').value.toLowerCase();

  const resultados = window.catalogoLibrosOriginal.filter(libro =>
    (!titulo || libro.Título.toLowerCase().includes(titulo)) &&
    (!categoria || (libro.Categoria && libro.Categoria.toLowerCase() === categoria)) &&
    (!autor || libro.Autor.toLowerCase().includes(autor))
  );

  const contenedor = document.getElementById('catalogBody');
  contenedor.innerHTML = resultados.map(libro => `
    <div class="catalogo-row">
      <span>${libro.Título}</span>
      <span>${libro.Autor}</span>
      <span>$${libro.Precio}</span>
      <span>${libro.Descripción}</span>
      <span>${libro.RutaDeLaImagen}</span>
      <span>${libro.RutaDelLibroDescargable}</span>
      <span>${libro.Categoria ?? 'Sin categoría'}</span>
      <span>
        <button class="btn-azul" onclick="editarLibro(${libro.idLibro})">Edit</button>
        <button class="btn-rojo" onclick="eliminarLibro(${libro.idLibro})">Remove</button>
      </span>
    </div>
  `).join('');
}

async function editarLibro(id) {
  const main = document.getElementById('mainContent');

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

  main.innerHTML = `
    <h2>📘 Editar Libro</h2>
    <form id="formEditarLibro" class="form-libro">

      <label>Título:</label>
      <input type="text" name="Título" value="${libro.Título}" required />

      <label>Autor:</label>
      <input type="text" name="Autor" value="${libro.Autor}" required />

      <label>Precio:</label>
      <input type="number" name="Precio" value="${libro.Precio}" step="0.01" required />

      <label>Descripción:</label>
      <input type="text" name="Descripción" value="${libro.Descripción}" required />

      <label>Categoría:</label>
      <select name="idCategoria" required>
        ${categorias.map(cat => `
          <option value="${cat.idCategoria}" ${cat.idCategoria === libro.idCategoria ? 'selected' : ''}>
            ${cat.Category}
          </option>
        `).join('')}
      </select>

      <button type="submit" class="btn-azul">Guardar cambios</button>
    </form>
  `;

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
        alert('✅ Libro actualizado correctamente');
        renderCatalogo();
      } else {
        alert('❌ No se pudo actualizar el libro');
      }
    } catch (err) {
      alert('❌ Error al enviar cambios');
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
    <h2>📘 Agregar nuevo libro</h2>
    <form id="formLibro" class="form-libro">
      <input type="text" name="Título" placeholder="Título" required />

      <select name="Autor" required>
        <option value="">Selecciona autor</option>
        ${autores.map(a => `<option value="${a.Autor}">${a.Autor}</option>`).join('')}
      </select>

      <input type="number" name="Precio" placeholder="Precio" step="0.01" required />

      <input type="text" name="Descripción" placeholder="Descripción" required />

      <!-- Subir imagen -->
      <label for="archivoImagen">📷 Imagen:</label>
      <input type="file" id="archivoImagen" accept="image/*" required />
      <input type="hidden" name="RutaDeLaImagen" id="RutaDeLaImagen" />

      <!-- Subir PDF -->
      <label for="archivoPDF">📄 PDF:</label>
      <input type="file" id="archivoPDF" accept="application/pdf" required />
      <input type="hidden" name="RutaDelLibroDescargable" id="RutaDelLibroDescargable" />

      <select name="idCategoria" required>
        <option value="">Selecciona categoría</option>
        ${categorias.map(cat => `<option value="${cat.idCategoria}">${cat.Category}</option>`).join('')}
      </select>

      <button type="submit" class="btn-azul">Guardar libro</button>
    </form>
  `;

  document.getElementById('formLibro').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Subir imagen
    const imagenInput = document.getElementById('archivoImagen');
    const imagenData = new FormData();
    imagenData.append('imagen', imagenInput.files[0]);
    const resImg = await fetch('http://localhost:3000/api/libros/imagen', {
      method: 'POST',
      body: imagenData
    });
    const imgResult = await resImg.json();
    if (!imgResult.ruta) return alert('❌ Error al subir imagen');

    // Subir PDF
    const pdfInput = document.getElementById('archivoPDF');
    const pdfData = new FormData();
    pdfData.append('pdf', pdfInput.files[0]);
    const resPdf = await fetch('http://localhost:3000/api/libros/pdf', {
      method: 'POST',
      body: pdfData
    });
    const pdfResult = await resPdf.json();
    if (!pdfResult.ruta) return alert('❌ Error al subir PDF');

    // Construir datos con las rutas resultantes
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    data.RutaDeLaImagen = imgResult.ruta;
    data.RutaDelLibroDescargable = pdfResult.ruta;

    // Guardar libro en la BD
    try {
      const res = await fetch('http://localhost:3000/api/libros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('✅ Libro guardado con éxito.');
        renderCatalogo();
      } else {
        alert('❌ No se pudo guardar el libro.');
      }
    } catch (err) {
      console.error('❌ Error al enviar datos:', err);
      alert('❌ Error de conexión al guardar libro');
    }
  });
}




async function mostrarCategorias() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/categorias');
    const categorias = await res.json();

    main.innerHTML = `
      <h2>📂 Categorías</h2>
      <form class="form-libro" onsubmit="agregarCategoria(); return false;">
        <input type="text" id="nuevaCategoria" placeholder="Nueva categoría" required />
        <button type="submit" class="btn-azul">Agregar</button>
      </form>

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



async function renderVentas() {
  const main = document.getElementById('mainContent');
  const [resLibros, resCategorias, resAutores] = await Promise.all([
    fetch('http://localhost:3000/api/libros'),
    fetch('http://localhost:3000/api/categorias'),
    fetch('http://localhost:3000/api/autores')
  ]);
  const libros = await resLibros.json();
  const categorias = await resCategorias.json();
  const autores = await resAutores.json();

  window.ventasOriginal = libros;

  main.innerHTML = `
    <h2>Ventas</h2>
    <div class="catalogo-header">
      <input type="text" id="buscarVentas" placeholder="🔍 Buscar libro" />
      <select id="filtroCategoriaVentas">
        <option value="">Género</option>
        ${categorias.map(c => `<option value="${c.idCategoria}">${c.Category}</option>`).join('')}
      </select>
      <select id="filtroAutorVentas">
        <option value="">Autor</option>
        ${autores.map(a => `<option value="${a.Autor}">${a.Autor}</option>`).join('')}
      </select>
    </div>

    <div class="ventas-table">
      <div class="ventas-header-row">
        <span>Book</span><span>Author</span><span>Sales</span><span>Price</span><span>Description</span><span>Image</span><span>Category</span>
      </div>
      <div id="ventasBody">
        ${libros.map(libro => `
          <div class="ventas-row">
            <span>${libro.Título}</span>
            <span>${libro.Autor}</span>
            <span>${libro.Ventas ?? 0}</span>
            <span>$${libro.Precio}</span>
            <span>${libro.Descripción}</span>
            <span><img src="${libro.RutaDeLaImagen}" height="60" /></span>
            <span>${libro.Categoria}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('buscarVentas').addEventListener('input', filtrarVentas);
  document.getElementById('filtroAutorVentas').addEventListener('change', filtrarVentas);
  document.getElementById('filtroCategoriaVentas').addEventListener('change', filtrarVentas);
}



async function renderReportes() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/reportes');
    const data = await res.json();

    const safe = libro => ({
      titulo: libro.Título || 'Sin título',
      autor: libro.Autor || 'Sin autor',
      ventas: Number(libro.Ventas) || 0,
      precio: Number(libro.Precio) || 0
    });

    const best = data.bestSellers.map(libro => {
      const l = safe(libro);
      return `
        <tr>
          <td>${l.titulo}</td>
          <td>${l.autor}</td>
          <td>${l.ventas}</td>
          <td>$${l.precio.toFixed(2)}</td>
          <td>$${(l.precio * l.ventas).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const least = data.leastSold.map(libro => {
      const l = safe(libro);
      return `
        <tr>
          <td>${l.titulo}</td>
          <td>${l.autor}</td>
          <td>${l.ventas}</td>
          <td>$${l.precio.toFixed(2)}</td>
          <td>$${(l.precio * l.ventas).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    main.innerHTML = `
      <h2> Reporte Semanal</h2>
      <h3> Más vendidos</h3>
      <table class="reporte-table">
        <thead>
          <tr><th>Book</th><th>Author</th><th>Sales</th><th>Price</th><th>Profit</th></tr>
        </thead>
        <tbody>${best}</tbody>
      </table>
      <h3> Menos vendidos</h3>
      <table class="reporte-table">
        <thead>
          <tr><th>Book</th><th>Author</th><th>Sales</th><th>Price</th><th>Profit</th></tr>
        </thead>
        <tbody>${least}</tbody>
      </table>
    `;
  } catch (err) {
    console.error('Error al cargar reporte:', err);
    main.innerHTML = '<p>❌ Error al cargar reporte.</p>';
  }
}

async function renderContacto() {
  const main = document.getElementById('mainContent');

  // ✅ Validar existencia del usuario en localStorage
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) {
    alert('⚠️ No se encontró sesión iniciada.');
    return;
  }

  let usuario;
  try {
    usuario = JSON.parse(usuarioStr);
  } catch (e) {
    alert('⚠️ Error al leer los datos del usuario.');
    return;
  }

  if (!usuario.idUsuario) {
    alert('⚠️ No se puede identificar al usuario administrador.');
    return;
  }

  try {
    // ✅ Obtener la descripción actual
    const res = await fetch('http://localhost:3000/api/contacto');
    const data = await res.json();
    const descripcion = data?.Descripcion || '';

    // ✅ Mostrar el formulario
    main.innerHTML = `
      <h2>✉️ Editar sección "Contáctanos"</h2>
      <form id="formContacto" class="form-libro">
        <textarea id="contactoDescripcion"
                  rows="12"
                  required
                  style="width: 100%; resize: vertical; padding: 12px; font-size: 1rem; border: 1px solid #ccc; border-radius: 8px;">${descripcion}</textarea>
        <button type="submit" class="btn-azul">Guardar</button>
      </form>
    `;

    // ✅ Guardar cambios
    document.getElementById('formContacto').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nuevaDescripcion = document.getElementById('contactoDescripcion').value.trim();

      try {
        const res = await fetch('http://localhost:3000/api/contacto', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Descripcion: nuevaDescripcion,
            idUsuario: usuario.idUsuario
          })
        });

        const result = await res.json();
        if (result.success) {
          alert('✅ Contacto actualizado correctamente.');
        } else {
          alert('❌ No se pudo actualizar el contacto.');
        }
      } catch (err) {
        console.error('❌ Error al guardar contacto:', err);
        alert('❌ Error al enviar los cambios.');
      }
    });

  } catch (err) {
    console.error('❌ Error al cargar contacto:', err);
    main.innerHTML = '<p>❌ Error al cargar el contenido de contacto.</p>';
  }
}




async function mostrarAutores() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/autores');
    const autores = await res.json();

    main.innerHTML = `
      <h2>✒️ Autores</h2>
      <form class="form-libro" onsubmit="agregarAutor(); return false;">
        <input type="text" id="nuevoAutor" placeholder="Nombre del autor" required />
        <button type="submit" class="btn-azul">Agregar</button>
      </form>

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

function renderFilaVentas(libro) {
  return `
    <div class="catalog-row">
      <span>${libro.Título}</span>
      <span>${libro.Autor}</span>
      <span>${libro.Ventas}</span>
      <span>$${libro.Precio}</span>
      <span>${libro.Descripción}</span>
      <span><img src="${libro.RutaDeLaImagen}" alt="Imagen" height="60"/></span>
      <span>${libro.Categoria}</span>
    </div>
  `;
}


function filtrarVentas() {
  const titulo = document.getElementById('buscarVentas').value.toLowerCase();
  const autor = document.getElementById('filtroAutorVentas').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoriaVentas').value;

  const filtrados = window.ventasOriginal.filter(l =>
    (!titulo || l.Título.toLowerCase().includes(titulo)) &&
    (!autor || l.Autor.toLowerCase() === autor) &&
    (!categoria || l.idCategoria.toString() === categoria)
  );

  document.getElementById('ventasBody').innerHTML = filtrados.map(renderFilaVentas).join('');
}


async function renderUsuarios() {
  const main = document.getElementById('mainContent');
  const res = await fetch('http://localhost:3000/api/usuarios');
  const usuarios = await res.json();

  window.usuariosOriginal = usuarios;

  main.innerHTML = `
    <h2>👥 Lista de Usuarios</h2>
    <div class="catalogo-header">
      <input type="text" id="buscarUsuario" placeholder="🔍 Buscar usuario por nombre" />
    </div>
    <div class="usuarios-table">
      <div class="usuarios-header-row">
        <span>Username</span><span>Email</span><span>Acciones</span>
      </div>
      <div id="usuariosBody">
        ${usuarios.map(user => `
          <div class="usuarios-row">
            <span>${user.Username}</span>
            <span>${user.Email}</span>
            <span>
              <button class="btn-azul" onclick="verComprasUsuario(${user.idUsuario})">Ver compras</button>
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('buscarUsuario').addEventListener('input', () => {
    const valor = document.getElementById('buscarUsuario').value.toLowerCase();
    const filtrados = window.usuariosOriginal.filter(u =>
      u.Username.toLowerCase().includes(valor)
    );
    document.getElementById('usuariosBody').innerHTML = filtrados.map(user => `
      <div class="usuarios-row">
        <span>${user.Username}</span>
        <span>${user.Email}</span>
        <span>
          <button class="btn-azul" onclick="verComprasUsuario(${user.idUsuario})">Ver compras</button>
        </span>
      </div>
    `).join('');
  });
}


function renderFilaUsuario(user) {
  return `
    <div class="usuarios-row">
      <span>${user.Username}</span>
      <span>${user.Email}</span>
      <span>
        <button class="btn-azul" onclick="verComprasUsuario(${user.idUsuario})">Ver compras</button>
      </span>
    </div>
  `;
}

function filtrarUsuarios() {
  const filtro = document.getElementById('buscarUsuario').value.toLowerCase();
  const filtrados = window.usuariosOriginal.filter(u =>
    u.Username.toLowerCase().includes(filtro)
  );
  document.getElementById('usuariosBody').innerHTML = filtrados.map(renderFilaUsuario).join('');
}

async function verComprasUsuario(idUsuario) {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}/compras`);
    const compras = await res.json();

    main.innerHTML = `
      <h2>🛒 Compras del Usuario</h2>
      <table class="reporte-table">
        <thead>
          <tr>
            <th>Book</th><th>Author</th><th>Price</th><th>Order Number</th>
          </tr>
        </thead>
        <tbody>
          ${compras.length === 0 ? `<tr><td colspan="4">No hay compras registradas.</td></tr>` :
            compras.map(c => `
              <tr>
                <td>${c.Título}</td>
                <td>${c.Autor}</td>
                <td>$${Number(c.Precio).toFixed(2)}</td>
                <td>#${c.idPedido}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error('Error al obtener compras:', err);
    main.innerHTML = '<p>Error al mostrar compras.</p>';
  }
}


async function subirPDF() {
  const input = document.getElementById('archivoPDF');
  const formData = new FormData();
  formData.append('pdf', input.files[0]);

  const res = await fetch('http://localhost:3000/api/libros/pdf', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (data.ruta) {
    document.getElementById('rutaPDF').value = data.ruta;
    document.getElementById('previewRutaPDF').textContent = `📄 PDF guardado: ${data.ruta}`;
  } else {
    alert('❌ Error al subir PDF');
  }
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
