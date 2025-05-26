document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  try {
    const response = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, role })
    });

    const data = await response.json();

    if (data.success) {
      // Guardar TODOS los datos necesarios
      localStorage.setItem('usuario', JSON.stringify({
        idUsuario: data.idUsuario, // Nuevo campo
        username: data.username,
        role: role,
        token: data.token // Nuevo campo (si usas JWT)
      }));

      // Redirección
      window.location.href = role === 'admin' 
        ? '/pages/admin.html' 
        : '/pages/home-cliente.html';
    } else {
      alert(data.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error de login:', error);
    alert('Error al conectar con el servidor');
  }
});