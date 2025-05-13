// stock.js
// Verificar si el usuario está logueado
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
