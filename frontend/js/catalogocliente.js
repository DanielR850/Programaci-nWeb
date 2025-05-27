document.addEventListener('DOMContentLoaded', () => {
    // Función mejorada para actualizar el contador del carrito
    const updateCartCounter = async (userId) => {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (!usuario?.token) return;

            const response = await fetch(`/api/carrito/count?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${usuario.token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Para manejar cookies si es necesario
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && document.getElementById('cartCounter')) {
                document.getElementById('cartCounter').textContent = data.count;
            }
        } catch (error) {
            console.error("Error actualizando contador del carrito:", error);
        }
    };

    // Función mejorada para añadir al carrito
    const addToCart = async (idLibro) => {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            
            // Verificar si el usuario está logueado
            if (!usuario?.idUsuario) {
                alert("Debes iniciar sesión para agregar al carrito.");
                window.location.href = "login.html";
                return { success: false };
            }

            // Enviar datos al servidor
            const response = await fetch('/api/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify({
                    idUsuario: usuario.idUsuario,
                    idLibro: idLibro
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Error en la respuesta del servidor");
            }

            return data;
            
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
            throw error;
        }
    };

    // Configurar eventos para los botones "Add to Cart"
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            try {
                const card = e.target.closest('.book-card');
                const idLibro = card.dataset.id;
                
                const result = await addToCart(idLibro);
                
                if (result.success) {
                    alert("✅ Libro añadido al carrito");
                    // Actualizar contador
                    const usuario = JSON.parse(localStorage.getItem('usuario'));
                    if (usuario?.idUsuario) {
                        await updateCartCounter(usuario.idUsuario);
                    }
                } else {
                    alert(`❌ Error: ${result.message || "No se pudo agregar al carrito"}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error al conectar con el servidor. Por favor, intenta nuevamente.");
            }
        });
    });

    // Inicializar contador del carrito al cargar la página
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario?.idUsuario) {
        updateCartCounter(usuario.idUsuario);
    }
});