document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!role || !email || !username || !password) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Email: email,
          Username: username,
          Contraseña: password,
          role: role // Asegúrate que el backend también reciba esto
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.idUsuario) {
        alert(data.message || '❌ Credenciales incorrectas o usuario no encontrado.');
        return;
      }

      // ✅ Guardar el usuario correctamente en localStorage
        localStorage.setItem('usuario', JSON.stringify({
        idUsuario: data.idUsuario,
        username: data.username,
        role: data.role,
        token: data.token  // 👈 ¡IMPORTANTE!
        }));

      // Redirección según rol
      if (data.role === 'admin') {
        window.location.href = '/pages/admin.html';
      } else {
        window.location.href = '/pages/home-cliente.html';
      }

    } catch (err) {
      console.error('Error en login:', err);
      alert('❌ Error al iniciar sesión. Intenta nuevamente.');
    }
  });
});
