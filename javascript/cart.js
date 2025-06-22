document.addEventListener('DOMContentLoaded', function () {
    const token = header();
    
    fetchAndDisplayCart(token);

    document.getElementById('checkoutBtn').addEventListener('click', openOrderModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('orderForm').addEventListener('submit', function (event) {
        createOrder(token, event);
    });
    document.getElementById('goToMenuBtn').addEventListener('click', function() {
        window.location.href = '/index.html';
    });

    // Fetch the address when the page loads
    fetchAddress();

    function fetchAddress() {
        fetch(`https://food-delivery.int.kreosoft.space/api/account/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Assuming the address is in a field named 'address'
            const address = data.address;
            // Set the input field value
            const addressInput = document.getElementById('deliveryAddress');
            addressInput.value = address;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
});

function fetchAndDisplayCart(token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/basket`, requestOptions)
    .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
    .then(data => {
        console.log("DATAAAA", data)
        if (data.length === 0) {
            document.getElementById('emptyCartMessage').style.display = 'block';
        } else {
            document.getElementById('emptyCartMessage').style.display = 'none';
            displayCartItems(data, token);
        }
    })
    .catch(error => console.error("Error fetching or displaying cart data:", error));
}

function displayCartItems(data, token) {
    const cartContainer = document.getElementById("cartItems");
    cartContainer.innerHTML = ''; // Clear existing items
    let totalPrice = 0;

    data.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h2 class="cart-item-name">${item.name}</h2>
                <p class="cart-item-price">${item.price} EGP</p>
                <div class="quantity-control">
                    <button onclick="decreaseItemQuantity('${item.id}', '${token}')" class="quantity-dec">-</button>
                    <span id="quantity-${item.id}" class="cart-item-amount">Quantity: ${item.amount}</span>
                    <button onclick="increaseItemQuantity('${item.id}', '${token}')" class="quantity-inc">+</button>
                </div>
                <p class="cart-item-total-price">Total: ${item.totalPrice} EGP</p>
                <button onclick="removeItemFromCart('${item.id}', '${token}')" class="cart-item-remove">Remove</button>
            </div>
        `;
        totalPrice += item.totalPrice;
        cartContainer.appendChild(cartItemElement);
    });

    const totalPriceDiv = document.getElementById("cart-total-price");
    totalPriceDiv.innerText = `Total: ${totalPrice} EGP`;
}

function increaseItemQuantity(itemId, token) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`, requestOptions)
    .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
        fetchAndDisplayCart(token);
    })
    .catch(error => console.error("Error increasing item quantity:", error));
}

function decreaseItemQuantity(itemId, token) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}?increase=true`, requestOptions)
    .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
        location.reload();
    })
    .catch(error => console.error("Error decreasing item quantity:", error));
}

function removeItemFromCart(itemId, token) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}?increase=false`, requestOptions)
    .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
        location.reload();
    })
    .catch(error => console.error("Error removing item from cart:", error));
}

function openOrderModal() {
    const cartItems = document.querySelectorAll(".cart-item");
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
    }

    const modal = document.getElementById('orderModal');
    modal.style.display = 'block';

    const totalPrice = document.getElementById('cart-total-price').textContent;

    let modalCartItemsHtml = "";
    cartItems.forEach(item => {
        const imgSrc = item.querySelector("img").src;
        const itemName = item.querySelector(".cart-item-name").textContent;
        const itemPrice = item.querySelector(".cart-item-price").textContent;
        const itemQuantity = item.querySelector(".cart-item-amount").textContent;
        const itemTotalPrice = item.querySelector(".cart-item-total-price").textContent;

        modalCartItemsHtml += `
            <div class="cart-item">
                <img src="${imgSrc}" alt="${itemName}" class="cart-item-image">
                <div class="cart-item-details">
                    <h2 class="cart-item-name">${itemName}</h2>
                    <p class="cart-item-price">${itemPrice}</p>
                    <span class="cart-item-amount">${itemQuantity}</span>
                    <p class="cart-item-total-price">${itemTotalPrice}</p>
                </div>
            </div>
        `;
    });

    const orderDetails = document.getElementById('orderDetails');
    orderDetails.innerHTML = `
        <div>Cart Items:</div>
        <div>${modalCartItemsHtml}</div>
        <div class="popTotalPrice">Total Price: ${totalPrice}</div>
    `;
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'none';
}

function createOrder(token, event) {
    event.preventDefault();

    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const deliveryTime = document.getElementById('deliveryTime').value;

    // Validate delivery time
    const currentTime = new Date();
    const selectedTime = new Date(deliveryTime);

    if (selectedTime <= currentTime || selectedTime.getTime() < currentTime.getTime() + 3600000) {
        alert('Delivery time must be at least one hour from the current time.');
        return;
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            deliveryTime: deliveryTime,
            address: deliveryAddress
        })
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/order`, requestOptions)
    .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
        alert('Order created successfully!');
        closeModal();
        location.reload();
    })
    .catch(error => console.error("Error creating order:", error));
}
