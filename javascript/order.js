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
            'Authorization': `Bearer ${token}`
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

    function displayOrders(orders) {
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order');
    
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
    
            const confirmButtonWrapper = document.createElement('div'); // Wrapper div for Confirm Order button
            confirmButtonWrapper.classList.add('confirm-btn-wrapper'); 
    
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm Order';
            confirmButton.classList.add('confirm-order-btn');
    
            confirmButtonWrapper.appendChild(confirmButton); // Append the button to the wrapper
    
            const orderPrice = document.createElement('span');
            orderPrice.classList.add('order-price');
            orderPrice.textContent = `Price: ${order.price} EGP`;
    
            orderDetails.appendChild(orderId);
            orderDetails.appendChild(orderStatus);
            orderDetails.appendChild(deliveryTime);
            orderDetails.appendChild(orderTime);
    
            orderInfo.appendChild(orderDetails);
    
            orderElement.appendChild(orderInfo);
            orderElement.appendChild(orderPrice);
            orderElement.appendChild(confirmButtonWrapper); // Append the wrapper to the order element
    
            confirmButton.addEventListener('click', () => {
                confirmOrder(order.id, token);
            });
    
            ordersList.appendChild(orderElement);
    
            // Remove confirm button if order status is "Delivered"
            if (order.status === 'Delivered') {
                confirmButton.remove();
            }
        });
    }
    
    function fetchOrderDetails(orderId, token) {
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`
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
            // After successfully fetching order details, display them in a modal
            const modal = document.getElementById('orderModal');
            const modalContent = modal.querySelector('.modal-content');
            const orderDetailsDiv = modalContent.querySelector('#orderDetails');
            const confirmButton = modalContent.querySelector('#confirmOrderBtn');
    
            // Clear previous order details
            orderDetailsDiv.innerHTML = '';
    
            // Display order details
            const orderHeader = document.createElement('h3');
            orderHeader.textContent = `Order ID: ${order.id}`;
            orderDetailsDiv.appendChild(orderHeader);
    
            // Display additional details
            const additionalDetails = document.createElement('div');
            additionalDetails.classList.add('additional-details');
            additionalDetails.innerHTML = `
                <p>Delivery Time: <strong>${order.deliveryTime}</strong></p>
                <p>Order Time: <strong>${order.orderTime}</strong></p>
                <p class="order-status">Status: <strong>${order.status}</strong></p> <!-- Wrap status in <strong> tags -->
            `;
            orderDetailsDiv.appendChild(additionalDetails);
    
            // Iterate over dishes
            order.dishes.forEach(dish => {
                const dishContainer = document.createElement('div');
                dishContainer.classList.add('dish-container');
    
                const dishImage = document.createElement('img');
                dishImage.src = dish.image;
                dishImage.alt = dish.name;
                dishImage.classList.add('dish-image');
                dishContainer.appendChild(dishImage);
    
                const dishInfo = document.createElement('div');
                dishInfo.classList.add('dish-info');
    
                const dishName = document.createElement('p');
                dishName.textContent = `${dish.name}`;
                dishName.classList.add('dish-name');
                dishInfo.appendChild(dishName);
    
                const dishPrice = document.createElement('p');
                dishPrice.innerHTML = `Price: <strong>${dish.price}</strong> EGP/Dish`;
                dishPrice.classList.add('dish-price');
                dishInfo.appendChild(dishPrice);
    
                const dishAmount = document.createElement('p');
                dishAmount.textContent = `Amount: ${dish.amount}`;
                dishAmount.classList.add('dish-amount');
                dishInfo.appendChild(dishAmount);

                const dishTotalPrice = document.createElement('p');
                dishTotalPrice.textContent = `Price: ${dish.totalPrice}`;
                dishTotalPrice.classList.add('dish-totalPrice');
                dishInfo.appendChild(dishTotalPrice);
    
                dishContainer.appendChild(dishInfo);
                orderDetailsDiv.appendChild(dishContainer);
            });
    
            // Display total price
            const totalPrice = document.createElement('p');
            totalPrice.textContent = `Total Price: ${order.price} EGP`;
            totalPrice.classList.add('total-price');
            orderDetailsDiv.appendChild(totalPrice);
    
            // Show modal
            modal.style.display = 'block';
    
            // Close modal when close button is clicked
            const closeButton = modalContent.querySelector('.close');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
    
            // Hide confirm button if order status is "Delivered"
            if (order.status === 'Delivered') {
                confirmButton.style.display = 'none';
            } else {
                confirmButton.style.display = 'block';
                confirmButton.addEventListener('click', () => {
                    confirmOrder(order.id, token);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
        });
    }
    
    

    function confirmOrder(orderId, token) {
        const requestOptions = {
            method: 'POST' ,
            headers: {
                'Authorization': `Bearer ${token}`,
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
