if (!localStorage.getItem("usuarioLogueado")) {
  window.location.href = "home.html"; // redirige al login si no inició sesión
}

// Funcionalidad para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado"); // eliminar el usuario logueado
  window.location.href = "home.html"; // redirigir al login
}

// Funcionalidad para filtrar productos por nombre
document.getElementById("btn-search").addEventListener("click", function () {
  const searchTerm = document
    .getElementById("product-search")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#stock-table tbody tr");

  rows.forEach((row) => {
    const productName = row.cells[0].textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// También filtrar al presionar Enter en el campo de búsqueda
document
  .getElementById("product-search")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      document.getElementById("btn-search").click();
    }
  });

// Funcionalidad para incrementar stock
document.querySelectorAll(".btn-increment").forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest("tr");
    const stockCell = row.querySelector(".stock-value");
    let currentStock = parseInt(stockCell.textContent);
    stockCell.textContent = currentStock + 1;

    // Actualizar clases de advertencia basadas en el nuevo valor de stock
    updateStockWarningClass(row, currentStock + 1);
  });
});

// Funcionalidad para decrementar stock
document.querySelectorAll(".btn-decrement").forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest("tr");
    const stockCell = row.querySelector(".stock-value");
    let currentStock = parseInt(stockCell.textContent);

    if (currentStock > 0) {
      stockCell.textContent = currentStock - 1;

      // Actualizar clases de advertencia basadas en el nuevo valor de stock
      updateStockWarningClass(row, currentStock - 1);
    }
  });
});

// Función para actualizar las clases de advertencia de stock
function updateStockWarningClass(row, stockValue) {
  row.classList.remove("stock-warning", "stock-critical");

  if (stockValue <= 2) {
    row.classList.add("stock-critical");
  } else if (stockValue <= 5) {
    row.classList.add("stock-warning");
  }
}

// Funcionalidad para editar producto
document.querySelectorAll(".btn-edit").forEach((button) => {
  button.addEventListener("click", function () {
    alert("Función de edición en desarrollo.");
  });
});

// Funcionalidad para eliminar producto
document.querySelectorAll(".btn-delete").forEach((button) => {
  button.addEventListener("click", function () {
    if (confirm("¿Está seguro de que desea eliminar este producto?")) {
      this.closest("tr").remove();
    }
  });
});

// Funcionalidad para agregar nuevo producto
document
  .getElementById("btn-add-product")
  .addEventListener("click", function () {
    alert("Función de agregar producto en desarrollo.");
  });

// Funcionalidad para guardar cambios
document
  .getElementById("btn-save-changes")
  .addEventListener("click", function () {
    alert("Función de guardar cambios en desarrollo.");
  });


document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/productos")
    .then((response) => response.json())
    .then((productos) => {
      const tbody = document.querySelector("#stock-table tbody");
      tbody.innerHTML = ""; // limpiar por si acaso

      productos.forEach((producto) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td class="stock-value">${producto.stock}</td>
          <td>${producto.proveedor}</td>
          <td>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
            <button class="btn-increment">+</button>
            <button class="btn-decrement">-</button>
          </td>
        `;

        // Aplicar clase de advertencia si aplica
        updateStockWarningClass(row, producto.stock);
        tbody.appendChild(row);
      });

      // Reasignar eventos a los botones nuevos
      assignRowEventListeners();
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
});

function assignRowEventListeners() {
  document.querySelectorAll(".btn-increment").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const stockCell = row.querySelector(".stock-value");
      let currentStock = parseInt(stockCell.textContent);
      stockCell.textContent = currentStock + 1;
      updateStockWarningClass(row, currentStock + 1);
    });
  });

  document.querySelectorAll(".btn-decrement").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const stockCell = row.querySelector(".stock-value");
      let currentStock = parseInt(stockCell.textContent);
      if (currentStock > 0) {
        stockCell.textContent = currentStock - 1;
        updateStockWarningClass(row, currentStock - 1);
      }
    });
  });

  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", function () {
      alert("Función de edición en desarrollo.");
    });
  });

  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", function () {
      if (confirm("¿Está seguro de que desea eliminar este producto?")) {
        this.closest("tr").remove();
      }
    });
  });
}
