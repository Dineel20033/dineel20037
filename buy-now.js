document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded successfully.');

    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart from localStorage:', cart);

    // Show the order summary
    showOrderSummary(cart);

    // Get the payment method radio buttons
    const cardRadio = document.getElementById('card');
    const cashRadio = document.getElementById('cash');
    const cardDetails = document.getElementById('card-details');

    // Show card details if 'Card' payment method is selected
    cardRadio.addEventListener('change', function () {
        if (cardRadio.checked) {
            cardDetails.style.display = 'block'; // Show card details
        }
    });

    // Hide card details if 'Cash' payment method is selected
    cashRadio.addEventListener('change', function () {
        if (cashRadio.checked) {
            cardDetails.style.display = 'none'; // Hide card details
        }
    });

    // When the form is submitted
    const form = document.getElementById('purchase-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Stop the form from submitting

        // Get all form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postcode = document.getElementById('postcode').value;

        // For card payment fields
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Check if all required fields are filled
        if (!name || !email || !phone || !address || !city || !postcode) {
            alert('Please fill out all required personal and delivery details.');
            return;
        }

        // Validate card details only if Card is selected
        if (cardRadio.checked) {
            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill out all card details.');
                return;
            }
        }

        // If everything is filled, show the confirmation message
        showConfirmation();
    });
});

// Function to show the order summary
function showOrderSummary(cart) {
    console.log('Cart contents:', cart); // Log the cart to check if it contains data
    const summaryItems = document.getElementById('summary-items');
    const orderTotal = document.getElementById('order-total');

    // Check if cart is empty
    if (cart.length === 0) {
        summaryItems.innerHTML = '<tr><td colspan="5">No items in the cart.</td></tr>';
        orderTotal.textContent = 'Total: $0.00';
    } else {
        let total = 0;
        summaryItems.innerHTML = ''; // Clear existing summary

        // Add each item to the table
        cart.forEach(function (item) {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
            `;
            summaryItems.innerHTML += row;
            total += item.quantity * item.price;
        });

        // Display the total amount
        orderTotal.textContent = 'Total: $' + total.toFixed(2);
    }
}

// Function to show the confirmation message
function showConfirmation() {
    console.log('Displaying confirmation message.');

    // Hide the form and show the confirmation message
    document.getElementById('user-details').style.display = 'none';
    document.getElementById('confirmation').style.display = 'block';

    // Calculate delivery date (5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const deliveryDateString = deliveryDate.toLocaleDateString();

    // Set the dynamic confirmation message
    const confirmationSection = document.getElementById('confirmation');
    confirmationSection.innerHTML = `
        <h2>Thank You for Your Purchase!</h2>
        <p>Your order has been confirmed and will be delivered on ${deliveryDateString}.</p>
    `;
}
