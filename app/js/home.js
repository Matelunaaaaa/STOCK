// home.js
async function login() {
  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("usuarioLogueado", usuario);
        alert("Login exitoso");
        window.location.href = "stock.html";
      } else {
        alert("Credenciales incorrectas");
      }
    } else {
      const text = await res.text();
      console.error("Respuesta no JSON:", text);
      alert("Error inesperado en el servidor");
    }
  } catch (err) {
    console.error("Error de red o fetch:", err);
    alert("No se pudo conectar con el servidor.");
  }
}
