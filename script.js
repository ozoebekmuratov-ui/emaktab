
const products = [
  {
    id: 1,
    name: "Obi non",
    price: 4000,
    emoji: "🫓",
    description: "Kundalik dasturxon uchun an'anaviy non."
  },
  {
    id: 2,
    name: "Patir non",
    price: 8000,
    emoji: "🥯",
    description: "Yog'li, to'yimli va mazali patir."
  },
  {
    id: 3,
    name: "Shirmoy non",
    price: 7000,
    emoji: "🍞",
    description: "Yumshoq va xushbo'y shirmoy non."
  },
  {
    id: 4,
    name: "Kunjutli non",
    price: 6000,
    emoji: "🥖",
    description: "Ustiga kunjut sepilgan mazali non."
  },
  {
    id: 5,
    name: "Kulcha",
    price: 3000,
    emoji: "🫓",
    description: "Kichik hajmdagi mazali kulcha."
  },
  {
    id: 6,
    name: "Sutli non",
    price: 7000,
    emoji: "🍞",
    description: "Yumshoq va mayin non."
  },
  {
    id: 7,
    name: "Zog'ora non",
    price: 9000,
    emoji: "🌾",
    description: "Makkajo'xori uni qo'shilgan non."
  },
  {
    id: 8,
    name: "Oilaviy non",
    price: 12000,
    emoji: "🥖",
    description: "Oila dasturxoni uchun katta non."
  }
];

const cart = {};

const productsContainer = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const orderForm = document.getElementById("order-form");
const orderResult = document.getElementById("order-result");

function formatPrice(price) {
  return price.toLocaleString("uz-UZ") + " so'm";
}

// Mahsulotlarni sahifaga chiqarish
function renderProducts() {
  productsContainer.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-art" aria-hidden="true">
        ${product.emoji}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          <button
            class="add-btn"
            type="button"
            data-add="${product.id}"
            aria-label="${product.name} savatchaga qo'shish">
            + Qo'shish
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Savatchaga mahsulot qo'shish
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (!cart[id]) {
    cart[id] = { ...product, quantity: 0 };
  }

  cart[id].quantity++;
  renderCart();
}

// Mahsulot miqdorini o'zgartirish
function changeQuantity(id, amount) {
  if (!cart[id]) return;

  cart[id].quantity += amount;

  if (cart[id].quantity <= 0) {
    delete cart[id];
  }

  renderCart();
}

// Savatchani hisoblash va ko'rsatish
function renderCart() {
  const items = Object.values(cart);

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (items.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Savatchangiz hozircha bo‘sh.</p>';
    return;
  }

  cartItems.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <small>${formatPrice(item.price)} × ${item.quantity}</small>
      </div>

      <div class="quantity-controls">
        <button type="button" data-minus="${item.id}"
          aria-label="${item.name} miqdorini kamaytirish">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-plus="${item.id}"
          aria-label="${item.name} miqdorini oshirish">+</button>
        <button type="button" class="remove-btn"
          data-remove="${item.id}" aria-label="${item.name}ni o'chirish">
          ×
        </button>
      </div>
    </div>
  `).join("");
}

// Tugmalarni boshqarish
productsContainer.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.plus) {
    changeQuantity(Number(button.dataset.plus), 1);
  } else if (button.dataset.minus) {
    changeQuantity(Number(button.dataset.minus), -1);
  } else if (button.dataset.remove) {
    delete cart[Number(button.dataset.remove)];
    renderCart();
  }
});

// Buyurtma ma'lumotlarini tayyorlash
orderForm.addEventListener("submit", event => {
  event.preventDefault();

  const items = Object.values(cart);

  if (items.length === 0) {
    orderResult.textContent =
      "Iltimos, avval savatchaga kamida bitta non qo'shing.";
    orderResult.className = "success-message";
    return;
  }

  const formData = new FormData(orderForm);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const address = formData.get("address").trim();
  const note = formData.get("note").trim();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const orderLines = items.map(item =>
    `${item.name} — ${item.quantity} dona — ${formatPrice(item.price * item.quantity)}`
  );

  const message = [
    "DEMO BUYURTMA",
    `Mijoz: ${name}`,
    `Telefon: ${phone}`,
    `Manzil: ${address}`,
    "",
    "Mahsulotlar:",
    ...orderLines,
    "",
    `Jami: ${formatPrice(total)}`,
    `Izoh: ${note || "Kiritilmagan"}`,
    "",
    "Bu buyurtma hali nonvoyxonaga yuborilmadi."
  ].join("\n");

  // Buyurtma matnini sahifada ko'rsatish
  orderResult.textContent = message;
  orderResult.className = "success-message";

  // Matnni nusxalash uchun tugma
  let copyButton = document.getElementById("copy-order");

  if (!copyButton) {
    copyButton = document.createElement("button");
    copyButton.id = "copy-order";
    copyButton.type = "button";
    copyButton.className = "btn";
    copyButton.style.marginTop = "12px";
    copyButton.textContent = "Buyurtmani nusxalash";
    orderResult.after(copyButton);

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(message);
        copyButton.textContent = "Nusxalandi!";
      } catch {
        copyButton.textContent =
          "Nusxalash uchun buyurtma matnini belgilang";
      }
    });
  }
});

// Joriy yilni ko'rsatish
document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();
renderCart();
