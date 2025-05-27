document.addEventListener('DOMContentLoaded', () => {
  const cartCounter = document.getElementById('cartCounter');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuario?.idUsuario;
  const token = usuario?.token;

  if (!userId || !token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

const cargarCategorias = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/categorias', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const categorias = await res.json();

    const select = document.getElementById('filtroCategoria');
    select.innerHTML = '<option value="">Todas</option>'; // Limpia y agrega opción "Todas"

    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.idCategoria; // ✅ Usa ID numérico
      option.textContent = cat.Category; // ✅ Muestra el nombre visible
      select.appendChild(option);
    });
  } catch (error) {
    console.error('❌ Error cargando categorías:', error);
  }
};

cargarCategorias();

  const cargarLibros = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/libros', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const libros = await res.json();
      renderizarLibros(libros);
    } catch (error) {
      console.error('❌ Error cargando libros:', error);
    }
  };

  const renderizarLibros = (libros) => {
    const catalogBox = document.querySelector('.catalog-box');
    catalogBox.innerHTML = '';

    libros.forEach(libro => {
      const card = document.createElement('article');
      card.className = 'book-card';
      card.dataset.id = libro.idLibro;

      card.innerHTML = `
        <img src="${libro.RutaDeLaImagen}" alt="${libro.Título}" class="book-image">
        <div class="book-info">
          <p>📖 Título: ${libro.Título}</p>
          <p>✍️ Autor: ${libro.Autor}</p>
          <p>💲 Precio: $${libro.Precio} USD</p>
        </div>
        <button class="btn-cart">Add to Cart</button>
      `;

      card.querySelector('.btn-cart').addEventListener('click', async () => {
        await agregarAlCarrito(libro.idLibro);
      });

      catalogBox.appendChild(card);
    });
  };

  const agregarAlCarrito = async (idLibro) => {
    try {
      const response = await fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idUsuario: userId, idLibro })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || '❌ No se pudo agregar al carrito.');
        return;
      }

      alert('✅ Libro añadido al carrito');
      actualizarContadorCarrito();

    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
    }
  };

  const actualizarContadorCarrito = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/carrito/usuario/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const datos = await res.json();
      cartCounter.textContent = Array.isArray(datos) ? datos.length : 0;

    } catch (error) {
      console.error('❌ Error al actualizar contador:', error);
      cartCounter.textContent = '0';
    }
  };
const selectCategoria = document.getElementById('filtroCategoria');

if (selectCategoria) {
  selectCategoria.addEventListener('change', async () => {
    const categoria = selectCategoria.value;

    try {
      const url = categoria 
        ? `http://localhost:3000/api/libros?categoria=${categoria}`
        : 'http://localhost:3000/api/libros';

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const libros = await res.json();
      renderizarLibros(libros);

    } catch (error) {
      console.error('❌ Error filtrando por categoría:', error);
    }
  });
}

const inputBuscador = document.getElementById('buscador');

if (inputBuscador) {
  inputBuscador.addEventListener('input', async () => {
    const texto = inputBuscador.value.trim();

    try {
      const url = texto
        ? `http://localhost:3000/api/libros?q=${encodeURIComponent(texto)}`
        : 'http://localhost:3000/api/libros';

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const libros = await res.json();
      renderizarLibros(libros);

    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
    }
  });
}


  cargarCategorias(); // ✅ Llamar esta función 
  cargarLibros();
  actualizarContadorCarrito();
});
