console.log("main.js is working!");

// Filter by style
function filterStyle(style) {
  fetch(`http://localhost:5000/api/products/style/${style}`)
    .then(res => res.json())
    .then(products => {
      renderProducts(products);
    });
}

// Render products
function renderProducts(products) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="http://localhost:5000${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} FCFA</p>
      <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart +</button>
    `;
    container.appendChild(card);
  });
}

// Cart functions
function scrollToCart() {
  document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCart() {
  document.getElementById('cart').classList.toggle('hidden');
  renderCart();
}

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price} FCFA`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total;
}

// Chatbot
const toggle = document.getElementById('chatbotToggle');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

toggle.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const msg = chatInput.value;
    addMessage('You', msg);
    respondTo(msg);
    chatInput.value = '';
  }
});

function addMessage(sender, text) {
  const div = document.createElement('div');
  div.textContent = `${sender}: ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function respondTo(msg) {
  let response = "I'm not sure how to answer that.";
  const lower = msg.toLowerCase();

  if (lower.includes('delivery')) response = "Yes, we offer home delivery.";
  else if (lower.includes('hours')) response = "We are open 9am to 9pm, every day.";
  else if (lower.includes('contact')) response = "You can contact us at +229 62347410.";
  
  setTimeout(() => addMessage('Bot', response), 500);
}
