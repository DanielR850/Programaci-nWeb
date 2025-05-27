document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/contacto");
    const data = await res.json();

    const contenedor = document.getElementById("contactoContenido");

    if (data.success && data.descripcion) {
      contenedor.textContent = data.descripcion;
    } else {
      contenedor.textContent = "No hay información de contacto disponible.";
    }
  } catch (error) {
    console.error("Error al obtener contacto:", error);
    const contenedor = document.getElementById("contactoContenido");
    contenedor.textContent = "Error al cargar la información.";
  }
});
