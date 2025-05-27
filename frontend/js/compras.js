document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuario?.idUsuario;
  const token = usuario?.token;

  if (!userId || !token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  const catalogBox = document.querySelector('.catalog-box');

  const cargarCompras = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/pedido/usuario/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const libros = await res.json();

      if (!Array.isArray(libros) || libros.length === 0) {
        catalogBox.innerHTML = "<p>No tienes compras registradas.</p>";
        return;
      }

      libros.forEach(libro => {
        const card = document.createElement('div');
        card.className = 'book-card';

        card.innerHTML = `
          <img src="${libro.RutaDeLaImagen}" alt="${libro.Título}" class="book-image">
          <p>📖 Título: ${libro.Título}</p>
          <p>✍️ Autor: ${libro.Autor}</p>
          <p>💲 Precio: $${libro.Precio.toFixed(2)} USD</p>
          <a href="${libro.RutaDelLibroDescargable}" download class="download-link" title="Descargar libro">
            <i class="material-icons">file_download</i> Descargar
          </a>
        `;

        catalogBox.appendChild(card);
      });

    } catch (error) {
      console.error('❌ Error cargando compras:', error);
      catalogBox.innerHTML = "<p>Error al cargar compras.</p>";
    }
  };

  cargarCompras();
});
