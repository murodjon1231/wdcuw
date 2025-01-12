const API_URL = "https://6782ae7cc51d092c3dd06dbd.mockapi.io/product/auto_parts";

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
    updateCartCount();
});

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(product => `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text fw-bold">Price: $${product.price}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1,
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    updateCartCount();
    openCartModal();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    updateCartCount();
}

function buyNow() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    alert(`Purchase successful! Total amount: $${totalPrice.toFixed(2)}. Thank you for shopping!`);

    cart = []; 

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    updateCartCount();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceContainer = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceContainer.textContent = 'Total: $0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item  mb-3">
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px;">
            <div>
                <p class="mb-1">${item.name}</p>
                <p class="mb-1">Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <button class="btn1111 btn-danger btn-sm ms-auto" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPriceContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;

    cartItemsContainer.innerHTML += `
        <div class="text-end mt-4">
            <button class="btn btn-success" onclick="buyNow()">Buy Now</button>
        </div>
    `;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('open');
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('open');
}

function login() {
    window.location.href = 'log.html';
}
