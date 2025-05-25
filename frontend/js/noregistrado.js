document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  try {
    const response = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password, role }),
    });

    const data = await response.json();

    if (data.success) {
      alert(`Bienvenido ${data.username}!`);

      // Guardar sesión en localStorage
      localStorage.setItem('usuario', JSON.stringify({
        username: data.username,
        role: role
      }));

      // Redirige según tipo
      if (role === 'admin') {
        window.location.href = '/pages/admin.html';
      } else {
        window.location.href = '/pages/home-cliente.html';
      }

    } else {
      alert('Credenciales incorrectas');
    }

  } catch (error) {
    console.error('Error de login:', error);
    alert('Error al conectar con el servidor');
  }
});
