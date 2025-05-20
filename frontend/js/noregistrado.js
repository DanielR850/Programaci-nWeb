document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.checkValidity()) {
      const role = form.querySelector(".role-select").value;

      if (role === "admin") {
        window.location.href = "admin.html";
      } else if (role === "client") {
        window.location.href = "home-cliente.html";
      }
    } else {
      form.reportValidity();
    }
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const createAccountForm = document.getElementById("createAccountForm");

  createAccountForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (createAccountForm.checkValidity()) {
      // Si todos los campos están llenos y válidos, redirige:
      window.location.href = "home-cliente.html";
    } else {
      // Muestra mensajes de validación del navegador:
      createAccountForm.reportValidity();
    }
  });
});
