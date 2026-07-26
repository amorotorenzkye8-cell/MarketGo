// ===============================
// MARKETGO APP LOGIC
// ===============================

let currentPage = "home";

const app = document.getElementById("app");
const navBtns = document.querySelectorAll(".mg-bottom-nav button");

// ===============================
// FAVORITES
// ===============================

function loadFavorites() {
  const fav = JSON.parse(localStorage.getItem("mg_fav") || "[]");

  PRODUCTS.forEach(p => {
    p.favorite = fav.includes(p.id);
  });
}

function saveFavorite(id) {
  let fav = JSON.parse(localStorage.getItem("mg_fav") || "[]");

  if (fav.includes(id)) {
    fav = fav.filter(x => x != id);
  } else {
    fav.push(id);
  }

  localStorage.setItem("mg_fav", JSON.stringify(fav));

  loadFavorites();
  render();
}
// ===============================
// RENDER
// ===============================

function render() {
  app.innerHTML = "";

  const page = document.createElement("div");
  page.className = "page container py-3";

  if (currentPage === "home") page.innerHTML = renderHome();
  if (currentPage === "categories") page.innerHTML = renderCategories();
  if (currentPage === "favorites") page.innerHTML = renderFavorites();
  if (currentPage === "sell") page.innerHTML = renderSell();
  if (currentPage === "profile") page.innerHTML = renderProfile();
  if (currentPage.startsWith("product-"))
    page.innerHTML = renderProduct(currentPage.split("-")[1]);
  if (currentPage.startsWith("category-"))
    page.innerHTML = renderCategory(currentPage.split("-")[1]);

  app.appendChild(page);

  setActiveNav();
  const banner = document.querySelector("#banner");

if (banner) {
    const oldCarousel = bootstrap.Carousel.getInstance(banner);

    if (oldCarousel) {
        oldCarousel.dispose();
    }

    new bootstrap.Carousel(banner, {
        interval: 4000,
        ride: "carousel",
        wrap: true,
        touch: true,
        pause: false
    });
}
  
}
  
// ===============================
// HOME PAGE
// ===============================

function renderHome() {
  const featured = PRODUCTS.filter(p => p.featured);
  const latest = PRODUCTS.filter(p => p.latest);

  return `
<div id="banner"
     class="carousel slide mb-3"
     data-bs-ride="carousel"
     data-bs-interval="4000"
     data-bs-pause="false">

  <div class="carousel-indicators">
    <button data-bs-target="#banner" data-bs-slide-to="0" class="active"></button>
    <button data-bs-target="#banner" data-bs-slide-to="1"></button>
    <button data-bs-target="#banner" data-bs-slide-to="2"></button>
</div>

  <div class="carousel-inner">
      
      <div class="carousel-item active">
    <img src="marketgo3.jpg" class="d-block w-100">
</div>
            
    <div class="carousel-item ">
    <img src="marketgo1.jpg" class="d-block w-100">
</div>

<div class="carousel-item">
    <img src="marketgo2.jpg" class="d-block w-100">
</div>

  </div>

  <button class="carousel-control-prev"
          type="button"
          data-bs-target="#banner"
          data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>

  <button class="carousel-control-next"
          type="button"
          data-bs-target="#banner"
          data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>

</div>

<div class="d-flex gap-2 overflow-auto mb-3 pb-1">
  ${CATEGORIES.map(c =>
    `<div class="category-chip" onclick="go('category-${c}')">${c}</div>`
  ).join("")}
</div>

<h5 class="fw-bold">Featured Products</h5>
<div class="row g-3">
  ${featured.map(card).join("")}
</div>

<h5 class="fw-bold mt-4">Latest Products</h5>
<div class="row g-3">
  ${latest.map(card).join("")}
</div>
`;
}
// ===============================
// PRODUCT CARD
// ===============================

function card(p) {
  return `
  <div class="col-6">
    <div class="product-card" onclick="go('product-${p.id}')">

      <img loading="lazy"
           src="${p.images[0]}"
           class="product-img">

      <div class="p-2">

        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${p.location}</small>

          <i class="bi bi-heart${p.favorite ? '-fill text-danger' : ''}"
             onclick="event.stopPropagation();saveFavorite(${p.id})">
          </i>
        </div>

        <div class="fw-semibold text-truncate">
          ${p.name}
        </div>

        <div class="d-flex justify-content-between align-items-center mt-2">
    <span class="price">₱${p.price}</span>
    <small class="text-muted">
        <i class="bi bi-eye"></i> ${p.views} Views
    </small>
</div>

        <span class="badge badge-condition">
          ${p.condition}
        </span>

      </div>
    </div>
  </div>
  `;
}

// ===============================
// PRODUCT DETAILS
// ===============================

function renderProduct(id) {

  const p = PRODUCTS.find(x => x.id == id);

  return `
<button class="btn btn-light mb-3"
        onclick="go('home')">
  <i class="bi bi-arrow-left"></i> Back
</button>

<div id="gallery"
     class="carousel slide mb-3">

  <div class="carousel-inner">

    ${p.images.map((img, i) => `
      <div class="carousel-item ${i == 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100">
      </div>
    `).join("")}

  </div>

  <button class="carousel-control-prev"
          data-bs-target="#gallery"
          data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>

  <button class="carousel-control-next"
          data-bs-target="#gallery"
          data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>

</div>

<h4 class="fw-bold">${p.name}</h4>

<h3 class="price">
  ₱${p.price.toLocaleString()}
</h3>

<p>${p.description}</p>

<p>
  <i class="bi bi-geo-alt"></i>
  ${p.location}
</p>

<p>
  <i class="bi bi-shop"></i>
  <strong>Seller:</strong>
  ${p.seller}
</p>

<p>
  <i class="bi bi-calendar-event"></i>
  <strong>Posted:</strong>
  ${p.date}
</p>

<p>
  <span class="badge bg-secondary">
    ${p.condition}
  </span>
</p>

<div class="d-grid gap-2">

  <a href="${p.sellerLink}"
   target="_blank"
   class="btn btn-primary fw-bold btn-ripple">
    <i class="bi bi-messenger"></i>
    Message Seller
</a>
  <button class="btn btn-outline-secondary btn-ripple"
          onclick="alert('Link copied!')">
    Share
  </button>

  <button class="btn btn-outline-danger btn-ripple"
          onclick="saveFavorite(${p.id})">
    ${p.favorite ? 'Remove from' : 'Add to'} Favorites
  </button>

</div>
`;
}
// ===============================
// CATEGORIES
// ===============================

function renderCategories() {
  return `
<h4 class="fw-bold mb-3">Categories</h4>

<div class="row g-2">
  ${CATEGORIES.map(c => `
    <div class="col-6 mb-2">
      <div class="p-2 bg-white rounded-3 text-center fw-medium"
           onclick="go('category-${c}')">
        ${c}
      </div>
    </div>
  `).join("")}
</div>
`;
}

function renderCategory(cat) {

  const list = PRODUCTS.filter(p => p.category === cat);

  return `
<button class="btn btn-light mb-3"
        onclick="go('categories')">
  <i class="bi bi-arrow-left"></i> Back
</button>

<h4 class="fw-bold mb-3">${cat}</h4>

<div class="row g-3">
  ${list.map(card).join("") || "<p>No products</p>"}
</div>
`;
}

// ===============================
// FAVORITES
// ===============================

function renderFavorites() {

  const fav = PRODUCTS.filter(p => p.favorite);

  return `
<h4 class="fw-bold mb-3">My Favorites</h4>

${
  fav.length
    ? `<div class="row g-3">${fav.map(card).join("")}</div>`
    : `<div class="text-center text-muted mt-5">
         <i class="bi bi-heart fs-1"></i>
         <p>No favorites yet</p>
       </div>`
}
`;
}
// ===============================
// SELL PAGE
// ===============================

function renderSell() {
  return `
<h4 class="fw-bold mb-3">Become a Partner Seller</h4>

<p>
Grow your business with <strong>MarketGo</strong> and reach more potential buyers.
We make selling easier by professionally posting and managing your products for you.
</p>

<h5 class="fw-bold mt-4 mb-3">📦 Partner Seller Packages</h5>

<div class="mb-4">
    <h6 class="fw-bold">🟢 Starter Package</h6>
    <p><strong>₱200/month</strong></p>
    <ul>
        <li>1 Product Listing</li>
        <li>We will post your product on MarketGo.</li>
        <li>Free updates for price, photos, and description.</li>
        <li>Remove sold items anytime.</li>
    </ul>
</div>

<div class="mb-4">
    <h6 class="fw-bold">🔵 Basic Package</h6>
    <p><strong>₱380/month</strong></p>
    <ul>
        <li>Up to 2 Product Listings</li>
        <li>We will manage your product listings.</li>
        <li>Unlimited updates during your subscription.</li>
        <li>Save ₱20 every month.</li>
    </ul>
</div>

<div class="mb-4">
    <h6 class="fw-bold">🟠 Business Package</h6>
    <p><strong>₱530/month</strong></p>
    <ul>
        <li>Up to 3 Product Listings</li>
        <li>Full product listing management.</li>
        <li>Unlimited updates.</li>
        <li>Save ₱70 every month.</li>
    </ul>
</div>

<div class="mb-4">
    <h6 class="fw-bold">🟣 Premium Package</h6>
    <p><strong>₱800/month</strong></p>
    <ul>
        <li>Up to 5 Product Listings</li>
        <li>Full product management.</li>
        <li>Unlimited updates.</li>
        <li>Remove sold items anytime.</li>
        <li>Save ₱200 every month.</li>
    </ul>
</div>

<h5 class="fw-bold mt-4 mb-3">📝 How to Join</h5>

<p>Send us the following through Messenger:</p>

<ul>
    <li>Product Name</li>
    <li>Product Photos</li>
    <li>Price</li>
    <li>Product Description</li>
    <li>Location</li>
    <li>Product Condition (Brand New or Second Hand)</li>
</ul>

<p>
After we review your submission and confirm your chosen package,
we will publish your products on MarketGo and manage them throughout your subscription.
</p>

<a href="https://www.facebook.com/profile.php?id=61592434708876"
   target="_blank"
   class="btn btn-primary fw-bold btn-ripple">
    <i class="bi bi-messenger"></i>
    Contact MarketGo
</a>
`;
}

// ===============================
// PROFILE PAGE
// ===============================

function renderProfile() {
  return `
<h4 class="fw-bold">Profile & Settings</h4>

<div class="bg-white p-3 rounded-4 mb-3">

<p>
<b>About MarketGo</b><br>
MarketGo is a marketplace platform designed to help sellers reach more
customers by showcasing their products. It also makes it easier for buyers
to find quality second-hand and brand-new items in one convenient place.
Our goal is to provide a simple, safe, and reliable buying and selling
experience for everyone.
</p>

<p>
<b>Our Mission</b><br>
To connect buyers and sellers through a trusted marketplace where people
can easily buy and sell second-hand and brand-new products while helping
small businesses and individual sellers grow.
</p>

<p><b>Version</b> 1.0</p>

<p>
<a href="#">Privacy Policy</a> |
<a href="#">Terms & Conditions</a>
</p>

<a href="https://www.facebook.com/profile.php?id=61592434708876"
   target="_blank">
   <i class="bi bi-messenger"></i>
   Contact via Messenger
</a>

</div>

<footer class="text-center mt-4 text-muted small">
MarketGo v1.0 © 2026 MarketGo All Rights Reserved.
</footer>
`;
}
// ===============================
// NAVIGATION
// ===============================

function go(page) {
  currentPage = page;
  render();
  window.scrollTo(0, 0);
}

navBtns.forEach(btn => {
  btn.onclick = () => go(btn.dataset.page);
});

function setActiveNav() {
  navBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === currentPage);
  });
}

// ===============================
// SEARCH
// ===============================

document.getElementById("searchInput").oninput = e => {

  const q = e.target.value.toLowerCase();

  if (q === "") {
    render();
    return;
  }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  app.innerHTML = `
  <div class="container py-3 page">

    <h5 class="mb-3">Search Results</h5>

    <div class="row g-3">
      ${results.map(card).join("") || "<p>No results</p>"}
    </div>

  </div>`;
};

// ===============================
// INITIALIZE APP
// ===============================

loadFavorites();

window.addEventListener("load", () => {

  setTimeout(() => {

    const splash = document.getElementById("splash");

    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";
    }, 500);

  }, 1200);

  if (!navigator.onLine) {
    document
      .getElementById("offlineMsg")
      .classList.remove("d-none");
  }

  render();

});
