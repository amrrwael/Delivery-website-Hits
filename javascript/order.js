document.addEventListener('DOMContentLoaded', function () {
    const ordersList = document.getElementById('ordersList');
    let logOutBtn = document.getElementById('logOutBtn');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    const token = localStorage.getItem('token');

    logOutBtn.style.display = 'inline';
    orderIcon.style.display = 'inline';
    profileIcon.style.display = 'inline';
    cartIcon.style.display = 'inline';
    
    if(!token){
        window.location.href = '../index.html'
    }


    // Fetch orders with authentication token
    fetch('https://food-delivery.int.kreosoft.space/api/order', {
        headers: {
            ...getAuthHeaders(token)
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    })
    .then(orders => {
        displayOrders(orders);
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
    });

    function getAuthHeaders(token) {
    return {
        'Authorization': `Bearer ${token}`
    };
}
// Refactored displayOrders: just loops through and calls small helpers
    function displayOrders(orders) {
        orders.forEach(order => {
            const orderElement = createOrderElement(order, token);
            ordersList.appendChild(orderElement);
        });
    }

    // Builds full order card
    function createOrderElement(order, token) {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        const orderInfo = createOrderDetails(order, token);
        const orderPrice = document.createElement('span');
        orderPrice.classList.add('order-price');
        orderPrice.textContent = `Price: ${order.price} EGP`;

        const confirmButtonWrapper = createConfirmButton(order, token);

        orderElement.appendChild(orderInfo);
        orderElement.appendChild(orderPrice);
        orderElement.appendChild(confirmButtonWrapper);

        return orderElement;
    }

    // Builds order info part
    function createOrderDetails(order, token) {
        const orderInfo = document.createElement('div');
        orderInfo.classList.add('order-info');

        const orderDetails = document.createElement('div');
        orderDetails.classList.add('order-details');

        const orderId = document.createElement('span');
        orderId.classList.add('order-id');
        orderId.textContent = `Order ID: ${order.id}`;
        orderId.setAttribute('data-order-id', order.id);
        orderId.addEventListener('click', () => {
            fetchOrderDetails(order.id, token);
        });

        const orderStatus = document.createElement('span');
        orderStatus.classList.add('order-status');
        orderStatus.innerHTML = `Status: <strong>${order.status}</strong>`;

        const deliveryTime = document.createElement('span');
        deliveryTime.classList.add('order-deliveryTime');
        deliveryTime.innerHTML = `Delivery Time: <strong>${order.deliveryTime}</strong>`;

        const orderTime = document.createElement('span');
        orderTime.classList.add('order-orderTime');
        orderTime.innerHTML = `Order Time: <strong>${order.orderTime}</strong>`;

        orderDetails.appendChild(orderId);
        orderDetails.appendChild(orderStatus);
        orderDetails.appendChild(deliveryTime);
        orderDetails.appendChild(orderTime);

        orderInfo.appendChild(orderDetails);
        return orderInfo;
    }

    // Builds confirm button (if needed)
    function createConfirmButton(order, token) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('confirm-btn-wrapper');

        if (order.status === 'Delivered') {
            return wrapper;
        }

        const button = document.createElement('button');
        button.textContent = 'Confirm Order';
        button.classList.add('confirm-order-btn');
        button.addEventListener('click', () => {
            confirmOrder(order.id, token);
        });

        wrapper.appendChild(button);
        return wrapper;
    }
    
    function fetchOrderDetails(orderId, token) {
    const requestOptions = {
        headers: {
            ...getAuthHeaders(token)
        }
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        return response.json();
    })
    .then(order => {
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.modal-content');
        const orderDetailsDiv = modalContent.querySelector('#orderDetails');
        const confirmButton = modalContent.querySelector('#confirmOrderBtn');

        // Clear previous details
        orderDetailsDiv.innerHTML = '';

        // Build and append new content
        buildModalContent(order, orderDetailsDiv);

        // Setup modal event listeners
        setupModalEvents(modal, modalContent, confirmButton, order, token);

        // Show modal
        modal.style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching order details:', error);
    });
}

// Build the modal's inner content
function buildModalContent(order, container) {
    const header = document.createElement('h3');
    header.textContent = `Order ID: ${order.id}`;
    container.appendChild(header);

    const details = document.createElement('div');
    details.classList.add('additional-details');
    details.innerHTML = `
        <p>Delivery Time: <strong>${order.deliveryTime}</strong></p>
        <p>Order Time: <strong>${order.orderTime}</strong></p>
        <p class="order-status">Status: <strong>${order.status}</strong></p>
    `;
    container.appendChild(details);

    order.dishes.forEach(dish => {
        const dishElement = buildDishElement(dish);
        container.appendChild(dishElement);
    });

    const total = document.createElement('p');
    total.textContent = `Total Price: ${order.price} EGP`;
    total.classList.add('total-price');
    container.appendChild(total);
}

// Build a dish element for the modal
function buildDishElement(dish) {
    const dishContainer = document.createElement('div');
    dishContainer.classList.add('dish-container');

    const image = document.createElement('img');
    image.src = dish.image;
    image.alt = dish.name;
    image.classList.add('dish-image');
    dishContainer.appendChild(image);

    const info = document.createElement('div');
    info.classList.add('dish-info');

    const name = document.createElement('p');
    name.textContent = dish.name;
    name.classList.add('dish-name');
    info.appendChild(name);

    const price = document.createElement('p');
    price.innerHTML = `Price: <strong>${dish.price}</strong> EGP/Dish`;
    price.classList.add('dish-price');
    info.appendChild(price);

    const amount = document.createElement('p');
    amount.textContent = `Amount: ${dish.amount}`;
    amount.classList.add('dish-amount');
    info.appendChild(amount);

    const total = document.createElement('p');
    total.textContent = `Price: ${dish.totalPrice}`;
    total.classList.add('dish-totalPrice');
    info.appendChild(total);

    dishContainer.appendChild(info);
    return dishContainer;
}

// Handle modal-related events
function setupModalEvents(modal, modalContent, confirmButton, order, token) {
    const closeButton = modalContent.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    if (order.status === 'Delivered') {
        confirmButton.style.display = 'none';
    } else {
        confirmButton.style.display = 'block';
        confirmButton.addEventListener('click', () => {
            confirmOrder(order.id, token);
        });
    }
}
    
    

    function confirmOrder(orderId, token) {
        const requestOptions = {
            method: 'POST' ,
            headers: {
                ...getAuthHeaders(token),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        fetch(`https://food-delivery.int.kreosoft.space/api/order/${orderId}/status`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to confirm order');
            }
            console.log('Order status updated successfully.');
            location.reload();
            
        })
        .catch(error => {
            console.log('Error confirming order:', error);
        });
    }
});
