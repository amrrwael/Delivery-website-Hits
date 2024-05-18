document.addEventListener('DOMContentLoaded', function() {
    const dishDetailsContainer = document.getElementById('dishDetailsContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get('dish_id');
    let authButton = document.getElementById('authButton');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    



    function checkLoginStatus() {
        let token = localStorage.getItem('token');
        let isLoggedIn = token !== null;

        if (isLoggedIn) {
            console.log(token);
            console.log('User is logged in');
            authButton.innerHTML = '<span class="text">LOG OUT</span>';
            orderIcon.style.display = 'inline';
            profileIcon.style.display = 'inline';
            cartIcon.style.display = 'inline';
            authButton.addEventListener('click', function () {
                logout();
            });
        } else {
            token = localStorage.removeItem('token')
            console.log('User is not logged in');
            authButton.innerHTML = '<span class="text">LOG IN / SIGN UP</span>';
            profileIcon.style.display = 'none';
            authButton.addEventListener('click', function () {
                window.location.href = '/html/login.html';
            });
        }
    }

    checkLoginStatus();


    if (dishId) {
        fetchDishDetails(dishId).then(dishDetails => {
            displayDishDetails(dishDetails);
        });
    }

    function fetchDishDetails(dishId) {
        const dishDetailsURL = `https://food-delivery.int.kreosoft.space/api/dish/${dishId}`;

        return fetch(dishDetailsURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching dish details: ', error);
            });
    }

    function displayDishDetails(dish) {
        let vegetarianStatus = dish.vegetarian ? 'Vegetarian' : 'NOT Vegetarian';
        let ratingStars = convertRatingToStars(dish.rating);
    
        dishDetailsContainer.innerHTML = `
            <h2 class="dish-name">${dish.name}</h2>
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <h2 class="dish-category">Category: ${dish.category}</h2>
            <h2 class="dish-vegetarian ">${vegetarianStatus}</h2>
            <p class="dish-description">${dish.description}</p>
            <p class="dish-rating">${ratingStars}</p>
            <p class="dish-price">Price: ${dish.price} EGP</p>
        `;
    }
    

    function convertRatingToStars(rating) {
        let starsHtml = '';
        const fullStarCount = rating;
        const decimalPart = rating % 1;
        const isHalfStar = decimalPart >= 0.25 && decimalPart < 0.75;
        const emptyStarCount = isHalfStar ? 9 - fullStarCount : 10 - fullStarCount; 

        for (let i = 0; i < fullStarCount; i++) {
            starsHtml += `<i class='bx bxs-star' style='color: gold;'></i>`;
        }

        if (isHalfStar) {
            starsHtml += `<i class='bx bxs-star-half' style='color: gold;'></i>`;
        }

        for (let i = 0; i < emptyStarCount; i++) {
            starsHtml += `<i class='bx bx-star' style='color: black;'></i>`;
        }

        return starsHtml;
    }

    
});
