async function cargarAsientos() {
  try {
    const response = await fetch('http://34.225.192.85:8000/api/asientoscontables/');
    const data = await response.json();
    const tbody = document.querySelector('#asientosTable tbody');

    data.forEach(asiento => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${asiento.fechaAsiento}</td>
        <td>${asiento.descripcionAsiento}</td>
        <td>${asiento.referenciaAsiento}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar los asientos:', error);
  }
}

window.onload = cargarAsientos;
