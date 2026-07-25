// =======================================
// MarketGo Script
// Part 1 - Config, State & Utilities
// =======================================

// Initialize AOS
AOS.init();

// ===============================
// CONFIG
// ===============================

const MESSENGER_LINK = "https://www.facebook.com/profile.php?id=61592434708876";

// ===============================
// STATE
// ===============================

let favorites = JSON.parse(
    localStorage.getItem("marketgo_favs") || "[]"
);

// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(page){

    document.querySelectorAll(".page").forEach(p=>{
        p.classList.add("d-none");
    });

    document
        .getElementById("page-" + page)
        .classList.remove("d-none");

    document
        .querySelectorAll(".bottom-nav a")
        .forEach(a=>a.classList.remove("active"));

    document
        .getElementById("nav-" + page)
        ?.classList.add("active");

    window.scrollTo(0,0);

}

// ===============================
// STATIC PAGES
// ===============================

function showStatic(page){

    const content={

profile:`

<h5 class="fw-bold my-3">
⚙️ Settings
</h5>

<div class="card p-3 mb-3">
<h5>About MarketGo</h5>

<p class="text-muted mb-0">
MarketGo is a marketplace built to connect buyers and sellers across the Philippines. Buy or sell second-hand and brand-new items quickly and conveniently.
</p>
</div>

<div class="card p-3 mb-3">
<h5>Our Mission</h5>

<p class="text-muted mb-0">
To help every Filipino buy and sell safely, easily, and faster through a trusted marketplace.
</p>
</div>

<div class="card p-3 mb-3">
<b>Version</b><br>
MarketGo v1.0
</div>

<div class="card p-3 mb-3"
onclick="showStatic('privacy')"
style="cursor:pointer;">
🔒 Privacy Policy
</div>

<div class="card p-3 mb-3"
onclick="showStatic('terms')"
style="cursor:pointer;">
📄 Terms & Conditions
</div>

<a href="https://www.facebook.com/profile.php?id=61592434708876"
   target="_blank"
   class="text-decoration-none">

    <div class="card border-0 shadow-sm rounded-4 mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">

            <span>💬 Contact via Messenger</span>

            <i class="fa-solid fa-chevron-right"></i>

        </div>
    </div>

</a>

<div class="text-center text-muted py-4">
    <small>
        MarketGo v1.0<br>
        © 2026 MarketGo<br>
        All Rights Reserved.
    </small>
</div>
`,

about:`
<h5 class="fw-bold my-3">About MarketGo</h5>

<div class="card p-3">
MarketGo connects local buyers and sellers.
No online payments.
We help coordinate safe deals.
</div>
`,

privacy:`
<h5 class="fw-bold my-3">Privacy Policy</h5>

<div class="card p-3">
We respect your privacy.
Data is stored locally.
</div>
`,

terms:`
<h5 class="fw-bold my-3">Terms and Conditions</h5>

<div class="card p-3">
All transactions are coordinated by MarketGo admins.
</div>
`,

contact:`
<h5 class="fw-bold my-3">Contact Us</h5>

<div class="card p-3">

<button
class="btn btn-primary"
onclick="openMessenger('Hello MarketGo')">

Message on Messenger

</button>

</div>
`

    };

    document.getElementById("staticContent").innerHTML =
        content[page];

    showPage("static");

}

// ===============================
// MESSENGER
// ===============================

function openMessenger(message){

    const url =
        MESSENGER_LINK +
        "?text=" +
        encodeURIComponent(message);

    window.open(url,"_blank");

}

// ===============================
// FAVORITES
// ===============================

function toggleFavorite(id){

    if(favorites.includes(id)){

        favorites =
            favorites.filter(f=>f!=id);

    }else{

        favorites.push(id);

    }

    localStorage.setItem(
        "marketgo_favs",
        JSON.stringify(favorites)
    );

    renderFavorites();

}
// =======================================
// Part 2 - Render Functions
// =======================================

// PRODUCT CARD
function productCard(p){

    const isFav = favorites.includes(p.id);

    return `
    <div class="col-6 col-md-3" data-aos="fade-up">

        <div class="card position-relative"
             onclick="viewProduct(${p.id})">

            <img
                src="${p.images[0]}"
                class="product-img w-100">

            <button
                class="favorite-btn border-0"
                onclick="event.stopPropagation();toggleFavorite(${p.id})">

                <i class="fa-${isFav ? 'solid':'regular'} fa-heart"
                   style="color:${isFav ? 'red':'#6b7280'}"></i>

            </button>

            <div class="p-2">

                <div class="price">
                    ₱${p.price.toLocaleString()}
                </div>

                <div class="small fw-semibold text-truncate">
                    ${p.name}
                </div>

                <div class="small text-muted">
                    <i class="fa-solid fa-location-dot"></i>
                    ${p.city}
                </div>

                <span class="badge badge-condition mt-1">
                    ${p.condition}
                </span>

            </div>

        </div>

    </div>
    `;

}

// =======================================
// HOME PAGE
// =======================================

function renderHome(){

    document.getElementById("categoryList").innerHTML =
        categories.map(c=>`

        <button
            class="category-chip btn"
            onclick="viewCategory('${c}')">

            ${c}

        </button>

    `).join("");

    document.getElementById("featuredProducts").innerHTML =
        products
        .filter(p=>p.featured)
        .map(productCard)
        .join("");

    document.getElementById("latestProducts").innerHTML =
        products
        .sort((a,b)=>
            new Date(b.date)-new Date(a.date)
        )
        .slice(0,4)
        .map(productCard)
        .join("");

}

// =======================================
// ALL CATEGORIES
// =======================================

function renderCategories(){

    document.getElementById("allCategories").innerHTML =
        categories.map(c=>`

        <div class="col-4 col-md-2">

            <div
                class="card text-center p-3"
                onclick="viewCategory('${c}')">

                <i class="fa-solid fa-box fa-2x mb-2"
                   style="color:var(--primary)"></i>

                <div class="small fw-semibold">

                    ${c}

                </div>

            </div>

        </div>

    `).join("");

}
// =======================================
// Part 3 - Category, Product & Favorites
// =======================================

// VIEW CATEGORY
function viewCategory(cat){

    document.getElementById("categoryTitle").innerText = cat;

    document.getElementById("categoryProducts").innerHTML =
        products
        .filter(p => p.category === cat)
        .map(productCard)
        .join("");

    showPage("category");

}

// =======================================
// VIEW PRODUCT
// =======================================

function viewProduct(id){

    const p = products.find(x => x.id === id);

    p.views++;

    const msg =
`Hello MarketGo. I am interested in this product.

Product Name: ${p.name}

Price: ₱${p.price}

Location: ${p.city}, ${p.province}`;

    document.getElementById("productDetail").innerHTML = `

        <img
            src="${p.images[0]}"
            class="w-100 rounded-4 mb-3">

        <h5 class="fw-bold">

            ${p.name}

        </h5>

        <div class="price mb-2">

            ₱${p.price.toLocaleString()}

        </div>

        <span class="badge badge-condition mb-2">

            ${p.condition}

        </span>

        <p>

            ${p.description}

        </p>

        <p class="small text-muted">

            <i class="fa-solid fa-location-dot"></i>

            ${p.city}, ${p.province}

            |

            Posted: ${p.date}

            |

            Views: ${p.views}

        </p>

        <p class="small">

            <b>Seller:</b>

            ${p.seller}

        </p>

        <div class="d-grid gap-2">

            <button
                class="btn btn-primary"
                onclick="openMessenger(\`${msg}\`)">

                <i class="fa-brands fa-facebook-messenger"></i>

                Inquire Now

            </button>

            <button
                class="btn btn-outline-secondary"
                onclick="navigator.share ?
                navigator.share({
                    title:p.name,
                    url:window.location
                }) :
                alert('Link copied')">

                <i class="fa-solid fa-share"></i>

                Share Product

            </button>

            <button
                class="btn btn-outline-danger btn-sm"
                onclick="openMessenger('Report: ${p.name} - Reason: ')">

                <i class="fa-solid fa-flag"></i>

                Report Listing

            </button>

        </div>

    `;

    showPage("product");

}

// =======================================
// FAVORITES
// =======================================

function renderFavorites(){

    const favProducts =
        products.filter(p =>
            favorites.includes(p.id)
        );

    document.getElementById("favoriteProducts").innerHTML =

        favProducts.length

        ?

        favProducts
        .map(productCard)
        .join("")

        :

        `<p class="text-muted">
            No favorites yet.
        </p>`;

}
// =======================================
// Part 4 - Search & Initialize
// =======================================

// SEARCH
document.getElementById("searchInput").addEventListener("input", function(e){

    const q = e.target.value.toLowerCase();

    const results = products.filter(p =>

        p.name.toLowerCase().includes(q) ||

        p.category.toLowerCase().includes(q)

    );

    document.getElementById("latestProducts").innerHTML =

        results

        .map(productCard)

        .join("");

});

// =======================================
// INITIALIZE
// =======================================

renderHome();

renderCategories();

renderFavorites();

window.addEventListener("load", function () {

    if (navigator.onLine) {

        setTimeout(function () {
            document.getElementById("splash").style.display = "none";
        }, 2500);

    } else {

        document.querySelector(".loader").style.display = "none";

        document.getElementById("statusText").innerHTML =
            "Please connect to the internet.";

        document.getElementById("retryBtn").style.display = "block";
    }

});
