if (!localStorage.getItem("usuarioLogueado")) {
  window.location.href = "home.html";
}

// Funcionalidad para cerrar sesión
function cerrarSesion() {
  fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(() => {
      window.location.href = "home.html";
    });
}

// Buscar productos por nombre
document.getElementById("btn-search").addEventListener("click", function () {
  const searchTerm = document.getElementById("product-search").value.toLowerCase();
  const rows = document.querySelectorAll("#stock-table tbody tr");
  rows.forEach((row) => {
    const productName = row.cells[0].textContent.toLowerCase();
    row.style.display = productName.includes(searchTerm) ? "" : "none";
  });
});

// Buscar al presionar Enter
document.getElementById("product-search").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    document.getElementById("btn-search").click();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const url = "http://52.20.1.18:3000/api/productos";
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((productos) => {
      console.log("Productos obtenidos:", productos);
      const tbody = document.querySelector("#stock-table tbody");
      tbody.innerHTML = "";

      productos.forEach((producto) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", producto.id);

        row.innerHTML = `
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td class="stock-value">${producto.stock}</td>
          <td>${producto.proveedor}</td>
          <td>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
          </td>
        `;

        updateStockWarningClass(row, producto.stock);
        tbody.appendChild(row);
      });

      assignRowEventListeners();
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
});

// Colorea filas según stock
function updateStockWarningClass(row, stockValue) {
  row.classList.remove("stock-warning", "stock-critical");
  if (stockValue <= 2) {
    row.classList.add("stock-critical");
  } else if (stockValue <= 5) {
    row.classList.add("stock-warning");
  }
}

// ================== FUNCIONALIDAD DE BOTONES ==================

// Agregar nuevo producto
document.getElementById("btn-add-product").addEventListener("click", function () {
  const nombre = prompt("Nombre del producto:");
  const categoria = prompt("Categoría:");
  const stock = prompt("Stock inicial:");
  const proveedor = prompt("Proveedor:");
  if (nombre && categoria && stock && proveedor) {
    if (isNaN(stock) || stock < 0) {
      alert("El stock debe ser un número.");
      return;
    }
    else {
    fetch("http://52.20.1.18:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre, categoria, stock: parseInt(stock), proveedor }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Respuesta del servidor (error):", res.status, text);
          throw new Error("No se pudo agregar el producto.");
        }
        return res.json();
      })
      .then(() => location.reload())
      .catch(err => {
        alert("Error al agregar producto. Ver consola.");
        console.log(err);
      });
    }
  }
});

// Guardar cambios (solo recarga)
document.getElementById("btn-save-changes").addEventListener("click", function () {
  alert("Todos los cambios se guardan automáticamente.");
  location.reload();
});

function assignRowEventListeners() {
  // Editar producto
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const id = row.getAttribute("data-id");
      if (!id) {
        alert("Error: No se encontró el ID del producto.");
        return;
      }
      // Cambia los índices para que NO se edite el ID
      const nombre = prompt("Nuevo nombre:", row.cells[1].textContent);
      const categoria = prompt("Nueva categoría:", row.cells[2].textContent);
      const stock = prompt("Nuevo stock:", row.cells[3].textContent);
      const proveedor = prompt("Nuevo proveedor:", row.cells[4].textContent);

      if (nombre && categoria && stock && proveedor) {
        fetch(`http://52.20.1.18:3000/api/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nombre, categoria, stock: parseInt(stock), proveedor }),
        })
          .then((res) => res.json())
          .then(() => location.reload());
      }
    });
  });

  // Eliminar producto
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const id = row.getAttribute("data-id");
      if (!id) {
        alert("Error: No se encontró el ID del producto.");
        return;
      }
      if (confirm("¿Está seguro de que desea eliminar este producto?")) {
        fetch(`http://52.20.1.18:3000/api/productos/${id}`, {
          method: "DELETE",
          credentials: "include"
        })
          .then((res) => res.json())
          .then(() => location.reload());
      }
    });
  });
}

// ================== CÓDIGO ANTERIOR COMENTADO ==================

// Agregar nuevo producto
//document.getElementById("btn-add-product").addEventListener("click", function () {
//  const nombre = prompt("Nombre del producto:");
//  const categoria = prompt("Categoría:");
//  const stock = prompt("Stock inicial:");
//  const proveedor = prompt("Proveedor:");
//  if (nombre && categoria && stock && proveedor) {
//    fetch("http://52.20.1.18:3000/api/productos", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      credentials: "include",
//      body: JSON.stringify({ nombre, categoria, stock: parseInt(stock), proveedor }),
//    })
//      .then(async (res) => {
//        if (!res.ok) {
//          const text = await res.text();
//          console.error("Respuesta del servidor (error):", res.status, text);
//          throw new Error("No se pudo agregar el producto.");
//        }
//        return res.json();
//      })
//      .then(() => location.reload())
//      .catch(err => {
//        alert("Error al agregar producto. Ver consola.");
//        console.log(err);
//      });
//  }
//});
//
//
//// Guardar cambios (solo recarga)
//document.getElementById("btn-save-changes").addEventListener("click", function () {
//  alert("Todos los cambios se guardan automáticamente.");
//  location.reload();
//});
//
//function assignRowEventListeners() {
//  // Editar producto
//  document.querySelectorAll(".btn-edit").forEach((button) => {
//    button.addEventListener("click", function () {
//      const row = this.closest("tr");
//      const id = row.getAttribute("data-id");
//      if (!id) {
//        alert("Error: No se encontró el ID del producto.");
//        return;
//      }
//      // Cambia los índices para que NO se edite el ID
//      const nombre = prompt("Nuevo nombre:", row.cells[1].textContent);
//      const categoria = prompt("Nueva categoría:", row.cells[2].textContent);
//      const stock = prompt("Nuevo stock:", row.cells[3].textContent);
//      const proveedor = prompt("Nuevo proveedor:", row.cells[4].textContent);
//
//      if (nombre && categoria && stock && proveedor) {
//        fetch(`http://52.20.1.18:3000/api/productos/${id}`, {
//          method: "PUT",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({ nombre, categoria, stock: parseInt(stock), proveedor }),
//        })
//          .then((res) => res.json())
//          .then(() => location.reload());
//      }
//    });
//  });
//
//  // Eliminar producto
//  document.querySelectorAll(".btn-delete").forEach((button) => {
//    button.addEventListener("click", function () {
//      const row = this.closest("tr");
//      const id = row.getAttribute("data-id");
//      if (!id) {
//        alert("Error: No se encontró el ID del producto.");
//        return;
//      }
//      if (confirm("¿Está seguro de que desea eliminar este producto?")) {
//        fetch(`http://52.20.1.18:3000/api/productos/${id}`, {
//          method: "DELETE",
//        })
//          .then((res) => res.json())
//          .then(() => location.reload());
//      }
//    });
//  });
//}

