document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const data = {
    Username: username,
    Email: email,
    Contraseña: password,
    idTipoUsuario: 2  // Solo cliente
  };

  try {
    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      alert('✅ Cuenta creada con éxito. Inicia sesión.');
      window.location.href = 'login.html';
    } else {
      alert('❌ No se pudo crear la cuenta.');
    }

  } catch (err) {
    console.error(err);
    alert('❌ Error de conexión con el servidor.');
  }
});
