document.addEventListener("DOMContentLoaded", () => {
  const listaLibros = document.getElementById("listaLibros");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const buscador = document.getElementById("buscador");

  let libros = [];

  // Obtener categorías
  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categorias");
      const data = await res.json();
      data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.idCategoria;
        option.textContent = cat.Category;
        filtroCategoria.appendChild(option);
      });
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  // Obtener libros
  const cargarLibros = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/libros");
      libros = await res.json();
      mostrarLibros(libros);
    } catch (err) {
      console.error("Error cargando libros:", err);
    }
  };

  // Mostrar libros
  const mostrarLibros = (lista) => {
    listaLibros.innerHTML = "";

    if (lista.length === 0) {
      listaLibros.innerHTML = "<p>No se encontraron libros.</p>";
      return;
    }

    lista.forEach(libro => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${libro.RutaDeLaImagen}" alt="${libro.Título}" class="book-image">
        <p>📖 <strong>Título:</strong> ${libro.Título}</p>
        <p>✍️ <strong>Autor:</strong> ${libro.Autor}</p>
        <p>💲 <strong>Precio:</strong> $${libro.Precio} USD</p>
        <a href="login.html" class="btn-cart">Add to cart</a>
      `;
      listaLibros.appendChild(card);
    });
  };

  // Filtro por texto
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();
    const filtrado = libros.filter(libro =>
      libro.Título.toLowerCase().includes(texto) ||
      libro.Autor.toLowerCase().includes(texto)
    );
    mostrarLibros(filtrado);
  });

  // Filtro por categoría
  filtroCategoria.addEventListener("change", () => {
    const id = filtroCategoria.value;
    const filtrado = id
      ? libros.filter(libro => libro.idCategoria == id)
      : libros;
    mostrarLibros(filtrado);
  });

  // Inicializar
  cargarCategorias();
  cargarLibros();
});
