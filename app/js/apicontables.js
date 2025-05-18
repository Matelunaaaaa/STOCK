async function cargarAsientos() {
  try {
    const response = await fetch('http://localhost:3000/api/asientos-proxy');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    const tbody = document.querySelector("#asientosTable tbody");
    tbody.innerHTML = ""; // Limpiar tabla antes de agregar datos

    data.forEach(asiento => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${asiento.fechaAsiento || 'N/A'}</td>
        <td>${asiento.descripcionAsiento || 'N/A'}</td>
        <td>${asiento.referenciaAsiento || 'N/A'}</td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al cargar los asientos:', error);
    alert('Error al cargar los asientos. Ver consola para detalles.');
  }
}

document.addEventListener('DOMContentLoaded', cargarAsientos);