let cart = []; 

// Function to display cart items in the table
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear current cart items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
        // Disable the "Buy Now" button when the cart is empty
        document.getElementById('buy-now').disabled = true;
        return;
    }

    // Enable the "Buy Now" button when there are items in the cart
    document.getElementById('buy-now').disabled = false;

    // Loop through cart items and display each in the table
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-index="${i}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" data-index="${i}">
                    <button class="increase-quantity" data-index="${i}">+</button>
                </div>
            </td>
            
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
            <td>
                <button class="remove-item" data-index="${i}">Remove</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    }

    // Update the total price
    updateTotalPrice();

    // Add event listeners for the quantity buttons in the cart
    const increaseButtons = document.getElementsByClassName('increase-quantity');
    const decreaseButtons = document.getElementsByClassName('decrease-quantity');
    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', handleQuantityChange);
    }

    for (let i = 0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', handleQuantityChange);
    }

    // Add event listeners for the remove buttons
    const removeButtons = document.getElementsByClassName('remove-item');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', removeItem);
    }
}

function updateTotalPrice() {
    let total = 0;

    // Loop through cart items to calculate the total price
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].quantity * cart[i].price;
    }

    // Find the existing span with the "total-price" class
    const totalPriceElement = document.querySelector('.total-price');

    if (totalPriceElement) {
        // Update the total price dynamically
        totalPriceElement.innerHTML = '$' + total.toFixed(2);
    }
}




// Function to handle quantity increase and decrease in the cart
function handleQuantityChange(event) {
    const button = event.target;
    const index = button.getAttribute('data-index');
    const action = button.classList.contains('increase-quantity') ? 'increase' : 'decrease';

    if (action === 'increase') {
        cart[index].quantity += 1; // Increase the quantity
    } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Decrease the quantity but not below 1
    }

    displayCart(); // Re-render the cart with updated quantities
}

// Function to remove an item from the cart
function removeItem(event) {
    const index = event.target.getAttribute('data-index');
    cart.splice(index, 1); // Remove the item from the cart array
    displayCart(); // Re-render the cart
}

// Function to handle the "Add to Cart" button click
function addToCart(event) {
    const button = event.target;
    const name = button.getAttribute('data-name');
    const category = button.getAttribute('data-category');
    const price = parseFloat(button.getAttribute('data-price'));
    const quantity = parseInt(button.previousElementSibling.querySelector('.quantity-input').value, 10);

    // Check if the item already exists in the cart
    let existingItem = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            existingItem = cart[i];
            break;
        }
    }

    if (existingItem) {
        existingItem.quantity += quantity; // Increase quantity if the item already exists
    } else {
        // Add new item to the cart if it doesn't exist
        cart.push({ name, category, quantity, price });
    }

    displayCart(); // Re-render cart after adding an item
}

// Function to handle the "+" and "-" buttons in the product list (before adding to cart)
function handleProductQuantityChange(event) {
    const button = event.target;
    const input = button.closest('.quantity-controls').querySelector('.quantity-input');
    let currentQuantity = parseInt(input.value);

    if (button.classList.contains('increase-quantity')) {
        input.value = currentQuantity + 1;
    } else if (button.classList.contains('decrease-quantity') && currentQuantity > 1) {
        input.value = currentQuantity - 1;
    }
}

// Function to handle the "Add to Favorites" button click
function saveFavorites() {
    // Save cart to localStorage
    localStorage.setItem('favoriteOrder', JSON.stringify(cart));
    alert('Order has been saved as a favorite!');
}

// Function to handle the "Apply Favorites" button click
function applyFavorites() {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteOrder'));

    if (savedFavorites && savedFavorites.length > 0) {
        cart = savedFavorites; // Load favorite order into the cart
        displayCart(); // Re-render the cart with favorite items
        alert('Favorites have been applied!');
    } else {
        alert('No favorites found.');
    }
}

// Function to handle the "Buy Now" button click
function buyNow() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items to your cart.");
        // Prevent navigation if the cart is empty
        return;
    } else {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days later
        alert(`Thank you for your purchase! Your delivery will arrive on ${deliveryDate.toLocaleDateString()}.`);
        // Clear cart after purchase
        cart = [];
        displayCart(); // Re-render the cart to show it is empty
    }
}

// Set up event listeners for quantity buttons in the product list
const increaseButtons = document.getElementsByClassName('increase-quantity');
const decreaseButtons = document.getElementsByClassName('decrease-quantity');
for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener('click', handleProductQuantityChange);
}

for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener('click', handleProductQuantityChange);
}

// Set up event listeners for "Add to Cart" buttons
const addToCartButtons = document.getElementsByClassName('add-to-cart');
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', addToCart);
}

// Set up event listeners for other actions
document.getElementById('add-to-favorites').addEventListener('click', saveFavorites);
document.getElementById('apply-favorites').addEventListener('click', applyFavorites);

// Set up the "Buy Now" button event listener
document.getElementById('buy-now').addEventListener('click', function() {
    // Save the cart to localStorage before navigating to the Buy Now page
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = './buynowpharm.html'; // Redirect to the Buy Now page
    } else {
        alert("Your cart is empty! Please add items to your cart.");
    }
});

// Initial call to display the cart
displayCart();
