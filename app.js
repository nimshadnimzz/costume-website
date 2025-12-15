// app.js — vanilla JS glue for the existing UI (cart count, quick-view modal, add-to-cart).
// No design changes. Keep code small, clear and dependency-free.

const products = [
  {
    id: "vampire-odin",
    name: "Nocturne Count — Velvet Vampire",
    price: 149,
    img: "images/vampire.jpg",
    tags: ["classic", "premium"],
    desc: "Elegant velvet coat with satin lapels, embroidered collar, and detachable cloak.",
  },
  {
    id: "galactic-ace",
    name: "Galactic Ace — Space Pilot",
    price: 129,
    img: "images/space.jpg",
    tags: ["sci-fi"],
    desc: "Sculpted chest piece, illuminated trims, and faux-leather jumpsuit.",
  },
  {
    id: "phantom-ballet",
    name: "Phantom Masquerade — Ballerina",
    price: 99,
    img: "images/ballet.jpg",
    tags: ["romantic"],
    desc: "Layered tulle, hand-stitched lace, and ornate mask.",
  },
  {
    id: "neo-samurai",
    name: "Neo-Samurai — Street Ronin",
    price: 179,
    img: "images/samurai.jpg",
    tags: ["cyberpunk", "premium"],
    desc: "Armor plating, braided sash, and LED-accented shoulder pauldrons.",
  }
];

let cart = [];

// DOM refs
const catalog = document.getElementById('catalog');
const cartCountEl = document.getElementById('cartCount');
const productModal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalAdd = document.getElementById('modalAdd');
const modalClose = document.getElementById('modalClose');
const modalContinue = document.getElementById('modalContinue');
const yearEl = document.getElementById('year');

function formatPrice(p){ return `$${p}`; }

function renderProducts() {
  catalog.innerHTML = '';
  products.forEach(p => {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.id = p.id;

    article.innerHTML = `
      <div class="image-wrap" style="background-image: url('${p.img}')">
        <button class="fav" aria-label="Add ${p.name} to wishlist">♡</button>
        <div class="card-controls">
          <button class="btn-ghost quick-view">Quick view</button>
          <button class="btn add-to-cart">Add</button>
        </div>
      </div>

      <div class="p-body">
        <div class="p-top">
          <h3 class="p-title">${p.name}</h3>
          <span class="p-price">${formatPrice(p.price)}</span>
        </div>
        <p class="p-desc">${p.desc}</p>
        <div class="p-tags">
          ${p.tags.map(t => `<span class="tag-soft">${t}</span>`).join('')}
        </div>
      </div>
    `;
    catalog.appendChild(article);
  });
}

function updateCartUI() {
  cartCountEl.textContent = cart.length;
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.setAttribute('aria-label', `Cart: ${cart.length} items`);
}

function openModalForProduct(product) {
  modalImage.src = product.img;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalDesc.textContent = product.desc;
  modalAdd.dataset.productId = product.id;
  productModal.style.display = 'flex';
  productModal.setAttribute('aria-hidden', 'false');

  // trap simple focus on close for keyboard users
  modalClose.focus();
}

function closeModal() {
  productModal.style.display = 'none';
  productModal.setAttribute('aria-hidden', 'true');
  modalAdd.removeAttribute('data-product-id');
}

function addToCartById(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  cart.push(p);
  updateCartUI();
}

function setupEventHandlers() {
  // Delegate clicks inside catalog
  catalog.addEventListener('click', (e) => {
    const quick = e.target.closest('.quick-view');
    const add = e.target.closest('.add-to-cart');

    if (quick || add) {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;

      if (quick) {
        openModalForProduct(product);
      }
      if (add) {
        addToCartById(id);
      }
    }
  });

  // Modal actions
  modalClose.addEventListener('click', closeModal);
  modalContinue.addEventListener('click', closeModal);

  modalAdd.addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.productId;
    if (id) {
      addToCartById(id);
      closeModal();
    }
  });

  // Close modal when clicking backdrop
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
  });

  // ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (productModal.style.display !== 'none') closeModal();
    }
  });

  // Basic search behavior: anchors to catalog (keeps UI intact, no new features)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // simple client-side filter: highlight matches (non-destructive)
        const q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.product-card').forEach(card => {
          const title = card.querySelector('.p-title')?.textContent?.toLowerCase() || '';
          card.style.display = (!q || title.includes(q)) ? '' : 'none';
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = new Date().getFullYear();
  renderProducts();
  setupEventHandlers();
  updateCartUI();
});
