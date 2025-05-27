document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuario?.idUsuario;
  const token = usuario?.token;

  if (!userId || !token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  const cartContainer = document.querySelector('.cart-items');
  const subtotalEl = document.querySelector('.summary-row span:nth-child(2)');
  const taxEl = document.querySelectorAll('.summary-row span')[3];
  const totalEl = document.querySelector('.summary-row.total span:nth-child(2)');

  let carrito = [];

  const cargarCarrito = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/carrito/usuario/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      carrito = await res.json();
      renderizarCarrito();

    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
    }
  };

  const renderizarCarrito = () => {
    cartContainer.innerHTML = '';

    if (carrito.length === 0) {
      cartContainer.innerHTML = '<p>No hay libros en tu carrito.</p>';
      subtotalEl.textContent = '$0.00 USD';
      taxEl.textContent = '$0.00 USD';
      totalEl.textContent = '$0.00 USD';
      return;
    }

    let subtotal = 0;

    carrito.forEach(libro => {
      subtotal += libro.Precio;

      const item = document.createElement('div');
      item.className = 'cart-item';

      item.innerHTML = `
        <img src="${encodeURI(libro.RutaDeLaImagen)}" alt="${libro.Título}" class="cart-item-image">
        <div class="cart-item-details">
            <h3>${libro.Título}</h3>
            <p>Author: ${libro.Autor}</p>
            <p class="cart-item-price">$${libro.Precio.toFixed(2)} USD</p>
            <button class="remove-btn">Remove</button>
        </div>
      `;

      item.querySelector('.remove-btn').addEventListener('click', () => {
        eliminarDelCarrito(libro.idLibro);
      });

      cartContainer.appendChild(item);
    });

    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)} USD`;
    taxEl.textContent = `$${tax.toFixed(2)} USD`;
    totalEl.textContent = `$${total.toFixed(2)} USD`;
  };

  const eliminarDelCarrito = async (idLibro) => {
    try {
      const res = await fetch(`http://localhost:3000/api/carrito/${userId}/${idLibro}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        carrito = carrito.filter(libro => libro.idLibro !== idLibro);
        renderizarCarrito();
      } else {
        alert('No se pudo eliminar del carrito');
      }
    } catch (err) {
      console.error('❌ Error eliminando libro del carrito:', err);
    }
  };

  const confirmarCompra = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/carrito/confirmar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Compra confirmada con éxito');
        carrito = [];
        renderizarCarrito();
      } else {
        alert('❌ Error al confirmar compra: ' + (data.error || ''));
      }
    } catch (error) {
      console.error('❌ Error confirmando compra:', error);
      alert('❌ Error al confirmar compra');
    }
  };

  const confirmarBtn = document.querySelector('.checkout-btn');
  if (confirmarBtn) {
    confirmarBtn.addEventListener('click', confirmarCompra);
  }

  cargarCarrito();
});
