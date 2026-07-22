const API_URL = "http://localhost:5025/api/products"; 
let productsList = [];

function getStatus(stock) {
  if (stock <= 0) return { label: "Out of Stock", class: "badge-outstock" };
  if (stock < 5) return { label: "Low Stock", class: "badge-lowstock" };
  return { label: "In Stock", class: "badge-instock" };
}

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API Network response was not ok");
    productsList = await response.json();
    renderUI(productsList);
  } catch (error) {
    console.warn("Could not fetch data from C# API. Make sure backend is running.", error);
  }
}

function renderUI(data) {
  const tbody = document.getElementById("inventoryTable");
  tbody.innerHTML = "";

  let lowStockCount = 0;
  let outOfStockCount = 0;

  data.forEach(item => {
    const statusInfo = getStatus(item.stock);
    if (item.stock === 0) outOfStockCount++;
    else if (item.stock < 5) lowStockCount++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td>$${parseFloat(item.price).toFixed(2)}</td>
      <td>${item.stock} units</td>
      <td><span class="badge ${statusInfo.class}">${statusInfo.label}</span></td>
      <td>
        <button class="btn btn-edit" onclick="editProduct(${item.id})">Edit</button>
        <button class="btn btn-delete" onclick="deleteProduct(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("kpi-total").textContent = data.length;
  document.getElementById("kpi-low").textContent = lowStockCount;
  document.getElementById("kpi-out").textContent = outOfStockCount;
}

async function saveProduct(event) {
  event.preventDefault();

  const id = document.getElementById("productId").value;
  const name = document.getElementById("pName").value;
  const category = document.getElementById("pCategory").value;
  const price = parseFloat(document.getElementById("pPrice").value);
  const stock = parseInt(document.getElementById("pStock").value);

  const payload = {
    name,
    category,
    price,
    stock,
    status: getStatus(stock).label
  };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    closeModal();
    fetchProducts();
  } catch (error) {
    console.error("Error saving product to database:", error);
  }
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product record from SQL?")) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}

function editProduct(id) {
  const item = productsList.find(p => p.id === id);
  if (!item) return;

  document.getElementById("productId").value = item.id;
  document.getElementById("pName").value = item.name;
  document.getElementById("pCategory").value = item.category;
  document.getElementById("pPrice").value = item.price;
  document.getElementById("pStock").value = item.stock;

  document.getElementById("modalTitle").textContent = "Edit Product";
  openModal(true);
}

function filterProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = productsList.filter(p => 
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );
  renderUI(filtered);
}

function openModal(isEdit = false) {
  if (!isEdit) {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("modalTitle").textContent = "Add New Product";
  }
  document.getElementById("productModal").classList.add("active");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", fetchProducts);