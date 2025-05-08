document.addEventListener('DOMContentLoaded', () => {
  console.log("script.js is working!");

  let allProducts = [];

  // === PRODUCT GALLERY ===
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderProducts(products);
    })
    .catch(err => console.error('Error loading products:', err));

  function renderProducts(products) {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">
        <h3>${product.name}</h3>
        <p>${product.price} FCFA</p>
        <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart +</button>
      `;
      container.appendChild(card);
    });
  }

  // === SEARCH FUNCTION ===
  window.searchProducts = function () {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(input)
    );
    renderProducts(filtered);
  };

  // === FILTER BY STYLE ===
  window.filterStyle = function (style) {
    fetch(`http://localhost:5000/api/products/style/${style}`)
      .then(res => res.json())
      .then(renderProducts)
      .catch(err => console.error('Error filtering products:', err));
  };

  window.resetProducts = function () {
    renderProducts(allProducts);
  };

  // === CART ===
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  window.addToCart = function (id, name, price) {
    const image = allProducts.find(p => p._id === id)?.image || '';
    cart.push({ id, name, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  window.clearCart = function () {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
  };

  window.scrollToCart = function () {
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
  };

  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = '';
    cartCount.textContent = `(${cart.length})`;

    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<li>Your cart is empty.</li>';
    }

    cart.forEach((item, index) => {
      total += item.price;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px; height:auto;">
        <div class="cart-info">
          <span>${item.name}</span>
          <span>${item.price} FCFA</span>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
      `;
      cartItems.appendChild(li);
    });

    cartTotal.textContent = total;
  }

  renderCart();

  // === CHATBOT TOGGLE ===
  const toggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  if (toggle && chatWindow && chatMessages && chatInput && chatSend) {
    toggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    chatSend.addEventListener('click', () => {
      sendMessage();
    });

    function sendMessage() {
      const msg = chatInput.value.trim();
      if (msg) {
        addMessage('user', msg);
        respondTo(msg);
        chatInput.value = '';
      }
    }

    function addMessage(sender, text) {
      const div = document.createElement('div');
      div.className = `message ${sender}`;
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function respondTo(msg) {
      const lower = msg.toLowerCase();
      let response = "I'm not sure how to answer that. You can ask me about delivery, contact, payment, location, or returns.";

      if (lower.includes("delivery")) response = "We offer home delivery within 2–3 days.";
      else if (lower.includes("hours")) response = "We are open from 9am to 9pm daily.";
      else if (lower.includes("contact")) response = "Call us at +229 62347410.";
      else if (lower.includes("payment")) response = "We accept cash, Orange Money, Moov, MTN momo and bank transfers.";
      else if (lower.includes("return")) response = "You can return items within 7 days.";
      else if (lower.includes("location")) response = "We are based in Benin, cotonou.";
      else if (lower.includes("discount")) response = "We offer weekend promotions!";
      else if (lower.includes("hi")) response = "How are you doing?!";
      setTimeout(() => addMessage('bot', response), 500);
    }
  }

  // === ADMIN PANEL ===
  loadAdminPanel();

  function loadAdminPanel() {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(products => {
        const adminDiv = document.getElementById('adminProducts');
        adminDiv.innerHTML = '';
        products.forEach(product => {
          const card = document.createElement('div');
          card.className = 'admin-card';
          card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:100%; height:auto;">
            <h4>${product.name}</h4>
            <p>${product.price} FCFA</p>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
          `;
          adminDiv.appendChild(card);
        });
      })
      .catch(err => console.error('Error loading admin products:', err));
  }

  window.deleteProduct = function (productId) {
    fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        loadAdminPanel();
        resetProducts();
      })
      .catch(err => console.error('Error deleting product:', err));
  };

  window.toggleAdminPanel = function () {
    const container = document.getElementById('adminProductsContainer');
    const toggleText = document.getElementById('adminToggle');

    container.classList.toggle('hidden');
    toggleText.innerHTML = container.classList.contains('hidden') ? 'Admin Panel ⬇' : 'Admin Panel ⬆';
  };

  window.checkUploadPassword = function () {
    const password = prompt("Enter upload password:");
    const correctPassword = "upload123"; // Cambia la contraseña si deseas
  
    if (password === correctPassword) {
      document.getElementById("uploadContainer").classList.remove("hidden");
    } else {
      alert("Incorrect password. Upload denied.");
    }
  };
  
  window.checkPassword = function () {
    const password = prompt("Enter admin password:");
    const correctPassword = "santiago123"; // Cambia esta contraseña como desees
  
    if (password === correctPassword) {
      toggleAdminPanel();
    } else {
      alert("Incorrect password. Access denied.");
    }
  };
  

  window.completePurchase = function () {
    if (cart.length === 0) return alert("Your cart is empty.");

    const name = prompt("Enter your name:");
    const phone = prompt("Enter your phone number:");
    const address = prompt("Enter your delivery address:");
    if (!name || !phone || !address) return alert("Please fill in all fields.");

    const total = cart.reduce((t, i) => t + i.price, 0);
    let message = `🛍️ *Order from Santiago Obama Shop*%0A%0A`;
    message += `👤 *Customer:* ${name}%0A`;
    message += `📞 *Phone:* ${phone}%0A`;
    message += `🏠 *Address:* ${address}%0A%0A`;
    message += `🧾 *Order Details:*%0A`;

    cart.forEach(item => {
      message += `• ${item.name} - ${item.price} FCFA%0A`;
    });

    message += `%0A💰 *Total:* ${total} FCFA`;

    const url = `https://wa.me/22962347410?text=${message}`;
    window.open(url, '_blank');
    clearCart();
  };
});

let uploadUnlocked = false;

window.toggleUploadSection = function () {
  const container = document.getElementById('uploadContainer');
  const toggleText = document.getElementById('uploadToggle');

  if (!uploadUnlocked) {
    const password = prompt("Enter upload password:");
    if (password !== "upload123") {
      alert("Incorrect password.");
      return;
    }
    uploadUnlocked = true;
  }

  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    toggleText.textContent = "Upload New Product ⬆";
  } else {
    container.classList.add("hidden");
    toggleText.textContent = "Upload New Product ⬇";
  }
};

window.toggleOrderPanel = function () {
  const container = document.getElementById('orderContainer');
  const toggleText = document.getElementById('orderToggle');

  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    toggleText.innerHTML = 'View Orders ⬆';
    loadOrders();
  } else {
    container.classList.add('hidden');
    toggleText.innerHTML = 'View Orders ⬇';
  }
};

function loadOrders() {
  fetch('http://localhost:5000/api/orders')
    .then(res => res.json())
    .then(orders => {
      const container = document.getElementById('orderContainer');
      container.innerHTML = '';

      orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-card';
        div.innerHTML = `
          <h4>${order.name} - ${order.phone}</h4>
          <p>${order.address}</p>
          <ul>${order.items.map(item => `<li>${item.name} - ${item.price} FCFA</li>`).join('')}</ul>
          <strong>Total: ${order.total} FCFA</strong>
          <hr>
        `;
        container.appendChild(div);
      });
    });
}

