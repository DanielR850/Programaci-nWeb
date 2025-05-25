// admin.js completo corregido y funcional para todas las secciones

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
  });
});

// 👥 Usuarios
async function renderUsuarios() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/usuarios');
    const usuarios = await res.json();
    main.innerHTML = `
      <h2>👥 Usuarios registrados</h2>
      <div class="user-table">
        <div class="user-table-header">
          <span>Username</span><span>Email</span><span>Acciones</span>
        </div>
        ${usuarios.map(u => `
          <div class="user-table-row">
            <span>${u.Username}</span>
            <span>${u.Email}</span>
            <button onclick="verCompras(${u.idUsuario})">Ver Compras</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error cargando usuarios.</p>';
  }
}

function verCompras(idUsuario) {
  alert(`Ver historial de compras del usuario ID ${idUsuario}`);
}

// 📚 Catálogo
async function renderCatalogo() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/libros');
    const libros = await res.json();

    main.innerHTML = `
      <h2>📚 Gestión de Catálogo</h2>
      <button onclick="mostrarFormularioLibro()">➕ Agregar Libro</button>
      <div class="libro-table">
        <div class="libro-header">
          <span>Título</span><span>Autor</span><span>Precio</span><span>Acciones</span>
        </div>
        ${libros.map(libro => `
          <div class="libro-row">
            <span>${libro.Título || libro.titulo}</span>
            <span>${libro.Autor || libro.autor}</span>
            <span>$${libro.Precio || libro.precio}</span>
            <button onclick="editarLibro(${libro.idLibro})">✏️ Editar</button>
            <button onclick="eliminarLibro(${libro.idLibro})">🗑️ Eliminar</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error cargando el catálogo.</p>';
  }
}

function mostrarFormularioLibro() {
  const main = document.getElementById('mainContent');
  main.innerHTML += `
    <form id="formLibro">
      <input type="text" name="Título" placeholder="Título" required />
      <input type="text" name="Autor" placeholder="Autor" required />
      <input type="number" name="Precio" placeholder="Precio" required />
      <input type="number" name="CantidadDisponible" placeholder="Stock" required />
      <input type="text" name="Descripción" placeholder="Descripción" required />
      <input type="text" name="RutaDelLibroDescargable" placeholder="Ruta PDF" required />
      <input type="text" name="RutaDeLaImagen" placeholder="Ruta imagen" required />
      <input type="number" name="idCategoria" placeholder="ID Categoría" required />
      <button type="submit">Guardar</button>
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
        alert('Libro agregado');
        renderCatalogo();
      }
    } catch (err) {
      alert('Error al guardar libro');
    }
  });
}

function editarLibro(id) {
  alert(`✏️ Editar libro ID: ${id}`);
}

async function eliminarLibro(id) {
  try {
    await fetch(`http://localhost:3000/api/libros/${id}`, { method: 'DELETE' });
    alert('Libro eliminado');
    renderCatalogo();
  } catch (err) {
    alert('Error al eliminar libro');
  }
}

// 💸 Ventas
async function renderVentas() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/ventas');
    const ventas = await res.json();
    main.innerHTML = `
      <h2>💸 Historial de Ventas</h2>
      <table>
        <thead><tr><th>Libro</th><th>Autor</th><th>Unidades</th><th>Precio</th></tr></thead>
        <tbody>
          ${ventas.map(v => `
            <tr>
              <td>${v.Título}</td>
              <td>${v.Autor}</td>
              <td>${v.unidades}</td>
              <td>$${v.Precio}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error cargando ventas.</p>';
  }
}

// 📊 Reportes
async function renderReportes() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/reportes');
    const { bestSellers, leastSold } = await res.json();
    main.innerHTML = `
      <h2>📊 Reportes de Ventas</h2>
      <div class="report-block">
        <h3>📈 Más Vendidos</h3>
        <ul>
          ${bestSellers.map(b => `<li>${b.Título} - ${b.ventas} ventas</li>`).join('')}
        </ul>
      </div>
      <div class="report-block">
        <h3>📉 Menos Vendidos</h3>
        <ul>
          ${leastSold.map(b => `<li>${b.Título} - ${b.ventas} ventas</li>`).join('')}
        </ul>
      </div>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error cargando reportes.</p>';
  }
}

// ✉️ Contacto
async function renderContacto() {
  const main = document.getElementById('mainContent');
  try {
    const res = await fetch('http://localhost:3000/api/contacto');
    const contacto = await res.json();
    main.innerHTML = `
      <h2>✉️ Información de Contacto Pública</h2>
      <textarea id="contactoInfo" rows="8" style="width: 100%; font-size: 1rem;">${contacto.Descripcion || ''}</textarea>
      <button onclick="guardarContacto()">Guardar</button>
    `;
  } catch (err) {
    main.innerHTML = '<p>Error al cargar la información de contacto.</p>';
  }
}

async function guardarContacto() {
  const nuevaDescripcion = document.getElementById('contactoInfo').value;
  try {
    const res = await fetch('http://localhost:3000/api/contacto', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion: nuevaDescripcion })
    });
    const data = await res.json();
    alert('Información de contacto actualizada.');
  } catch (err) {
    alert('Error al guardar la información.');
  }
}
