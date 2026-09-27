const products = [
  {
    id: 1,
    name: "Fresh Carrots",
    description: "Crunchy, naturally sweet carrots packed with nutrients.",
    price: 2.99,
    image:"carrot.jpeg",
    emoji: "🥕",
    color: "orange-bg"
  },
  {
    id: 2,
    name: "Green Broccoli",
    description: "Fresh green broccoli florets, perfect for healthy meals.",
    price: 3.49,
    image:"broccoli.png",
    emoji: "🥦",
    color: "green-bg"
  },
  {
    id: 3,
    name: "Red Tomatoes",
    description: "Juicy vine-ripened tomatoes with a rich fresh flavor.",
    price: 2.49,
    image:"tomato.jpeg",
    emoji: "🍅",
    color: "red-bg"
  },
  {
    id: 4,
    name: "Sweet Corn",
    description: "Golden sweet corn, delicious boiled, grilled, or roasted.",
    price: 1.99,
    image:"corn.jpeg",
    emoji: "🌽",
    color: "yellow-bg"
  },
  {
    id: 5,
    name: "Fresh Spinach",
    description: "Tender leafy spinach for salads, smoothies, and cooking.",
    price: 2.79,
    image:"spinach.jpeg",
    emoji: "🥬",
    color: "green-bg"
  },
  {
    id: 6,
    name: "Purple Eggplant",
    description: "Glossy purple eggplants with a soft, flavorful texture.",
    price: 3.29,
    image:"bringal.jpeg",
    emoji: "🍆",
    color: "purple-bg"
  },
  {
    id: 7,
    name: "Bell Peppers",
    description: "Colorful crisp peppers that add flavor to every dish.",
    price: 4.49,
    emoji: "🫑",
    image:"capsicum.jpeg",
    color: "light-bg"
  },
  {
    id: 8,
    name: "Potatoes",
    description: "Versatile farm-fresh potatoes for everyday cooking.",
    price: 2.39,
    image:"potato.jpeg",
    emoji: "🥔",
    color: "orange-bg"
  }
];

let cart = JSON.parse(localStorage.getItem("veggieCart")) || [];

const productsGrid = document.getElementById("products-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const summaryItems = document.getElementById("summary-items");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-button");

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("veggieCart", JSON.stringify(cart));
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image ${product.color}">
            <img src="${product.image}" alt="${product.name}" class="cart-product-img">
          </div>

          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>

            <div class="product-bottom">
              <span class="price">
                ${formatCurrency(product.price)}
              </span>

              <button
                class="add-button"
                onclick="addToCart(${product.id})"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter((item) => item.id !== productId);

  saveCart();
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🧺</div>
        <h3>Your cart is empty</h3>
        <p>Add some fresh vegetables to get started.</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map((cartItem) => {
        const product = products.find(
          (item) => item.id === cartItem.id
        );

        const itemTotal = product.price * cartItem.quantity;

        return `
          <div class="cart-item">
            <div class="cart-item-image ${product.color}">
              <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="cart-item-details">
              <h3>${product.name}</h3>
              <span class="cart-item-price">
                ${formatCurrency(product.price)} each
              </span>
            </div>

            <div class="quantity-controls">
              <button
                aria-label="Decrease quantity"
                onclick="updateQuantity(${product.id}, -1)"
              >
                −
              </button>

              <span>${cartItem.quantity}</span>

              <button
                aria-label="Increase quantity"
                onclick="updateQuantity(${product.id}, 1)"
              >
                +
              </button>
            </div>

            <strong class="cart-item-total">
              ${formatCurrency(itemTotal)}
            </strong>

            <button
              class="remove-button"
              aria-label="Remove ${product.name}"
              onclick="removeItem(${product.id})"
            >
              ×
            </button>
          </div>
        `;
      })
      .join("");
  }

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce((total, cartItem) => {
    const product = products.find(
      (item) => item.id === cartItem.id
    );

    return total + product.price * cartItem.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  summaryItems.textContent = totalItems;
  subtotalElement.textContent = formatCurrency(subtotal);
  totalElement.textContent = formatCurrency(subtotal);
}

clearCartButton.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add vegetables first.");
    return;
  }

  alert("Thank you for shopping with VeggieCart!");
});

renderProducts();
renderCart();

