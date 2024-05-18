document.addEventListener('DOMContentLoaded', function () {
    let authButton = document.getElementById('authButton');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    let popup = document.getElementById('popup');
    let closePopupBtn = document.getElementById('closePopup');
    let popupDishDetails = document.getElementById('popupDishDetails');
    let cartItemCountSpan = document.getElementById("cartItemCount");
    const token = localStorage.getItem('token');
    const map = new Map();

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

    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    let currentCategories = [];
    let currentSorting = 'none';
    let vegetarian = false;

    let apiURL = 'https://food-delivery.int.kreosoft.space/api/dish';
    let defaultURL = `${apiURL}?vegetarian=false&page=1`;
    let currentURL = defaultURL;

    let categorySelect = document.getElementById('categorySelect');
    let vegetarianCheckbox = document.getElementById('vegetarianCheckbox');
    let sortingSelect = document.getElementById('sortingSelect');
    let applyFiltersBtn = document.getElementById('applyFilters');
    let clearFiltersBtn = document.getElementById('clearFilters');

    categorySelect.addEventListener('change', updateURL);
    vegetarianCheckbox.addEventListener('change', updateURL);
    sortingSelect.addEventListener('change', updateURL);
    applyFiltersBtn.addEventListener('click', fetchData);
    clearFiltersBtn.addEventListener('click', clearFilters);

    function fetchDataFromURL() {
        parseURLParams();
        updateURL();
        
        fetchCart();
    }

    function parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        currentPage = parseInt(urlParams.get('page')) || 1;

        const categories = urlParams.getAll('categories');
        currentCategories = categories.map(category => decodeURIComponent(category)); 

        vegetarian = urlParams.get('vegetarian') === 'true';

        currentSorting = urlParams.get('sorting') || 'none';
    }


    function updateURL() {
        currentCategories = [...document.querySelectorAll('input[name="category"]:checked')].map(checkbox => checkbox.value);
        vegetarian = vegetarianCheckbox.checked;
        currentSorting = sortingSelect.value;

        const params = new URLSearchParams();

        if (currentCategories.length > 0) {
            currentCategories.forEach(category => params.append('categories', category));
        }

        if (vegetarian) {
            params.append('vegetarian', true);
        }

        if (currentSorting !== 'none') {
            params.append('sorting', currentSorting);
        }

        params.append('page', currentPage);


        currentURL = `${apiURL}?${params.toString()}`;
        window.history.pushState(null, null, `?${params.toString()}`); // Update URL
    }

    window.addEventListener('popstate', fetchDataFromURL);

    function addToCart(dishID) {
        var token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishID}`, requestOptions)
            .then(response => {
                
                if (!response.ok)
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                    incrementCartAmount();
            })
            .catch(error => {
                console.error("Error fetching or displaying cart data:", error);
            });
    }

    function increaseItemQuantity(itemId) {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}`, requestOptions)
            .then(data => {
                
                console.log('Item quantity increased', itemId);
                incrementCartAmount();
            })
            .catch(error => console.error("Error increasing item quantity:", error));
    }

    function decreaseItemQuantity(itemId) {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };

        fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${itemId}?increase=true`, requestOptions)
            .then(data => {
                
                console.log('Item quantity decreased', itemId);
                decrementCartAmount();
            })
            .catch(error => console.error("Error increasing item quantity:", error));
    }


    function incrementCartAmount() {
        let cartItemCountSpan = document.getElementById("cartItemCount");
        let currentCartAmount = parseInt(cartItemCountSpan.textContent);
        cartItemCountSpan.textContent = currentCartAmount + 1;
    }
    function decrementCartAmount() {
        let cartItemCountSpan = document.getElementById("cartItemCount");
        let currentCartAmount = parseInt(cartItemCountSpan.textContent);
        cartItemCountSpan.textContent = currentCartAmount - 1;
    }

    function convertRatingToStars(rating) {
        let starsHtml = '';
        const fullStarCount = rating;
        console.log(fullStarCount)
        const decimalPart = rating % 1;
        const isHalfStar = decimalPart >= 0.25 && decimalPart < 0.75;
        const emptyStarCount = isHalfStar ? 9 - fullStarCount : 10 - fullStarCount; 
    
        // Add full stars
        for (let i = 0; i < fullStarCount; i++) {
            starsHtml += `<i class='bx bxs-star' style='color: gold;'></i>`;
            
        }
    
        // Add Half Star
        if (isHalfStar) {
            starsHtml += `<i class='bx bxs-star-half' style='color: gold;'></i>`;
            
        }
        
        // // Add empty stars
        for (let i = 0; i < emptyStarCount; i++) {
            starsHtml += `<i class='bx bx-star' style='color: black;'></i>`;
        }
    
        return starsHtml;
    }
    

    function checkCanRateDish(dishId) {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };
        fetch(`https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating/check`, requestOptions)
            .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
            .then(data => {
                if (data === true) {
                    // If the response indicates the user can rate the dish, show the popup
                    openRatingPopup(dishId);
                } else {
                    
                    alert("User cannot rate this dish.");
                }
            })
            .catch(error => {
                alert("User cannot rate this dish.");
                console.error('Error checking if user can rate the dish:', error);
            });
    }

    function openRatingPopup(dishId) {
    // Display the rating popup modal here
    const ratingPopup = document.getElementById('ratingPopup');
    ratingPopup.style.display = 'block';
    
    
    let ratingValue = 0;

    // Get star elements and add event listeners
    
    const stars = document.querySelectorAll('.hh');
    stars.forEach((star, index) => {

        let hv = 0;

        star.addEventListener('click', function () {
            ratingValue = parseFloat(this.getAttribute('data-rating'));
            ratingValue = hv;
        });



        // Add hover effect
        star.addEventListener('mousemove', function (event) {
            const hoverValue = parseFloat(this.getAttribute('data-rating'));
            const rect = star.getBoundingClientRect();
            const percent = (event.clientX - rect.left) / rect.width;
            if (percent >= 0.5) {
                star.innerHTML = `<i class='bx bxs-star' style='color: gold;'></i>`;
                hv = hoverValue;
            }

            else {
                star.innerHTML= `<i class='bx bxs-star-half' style='color: gold;'></i>`;
                hv = hoverValue - .5;
            }

            if (percent <= 0) {
                star.innerHTML = `<i class='bx bx-star' style='color: black;'></i>`;
            }

            for (let i = 0; i < index; i++) {
                stars[i].innerHTML = `<i class='bx bxs-star' style='color: gold;'></i>`;
            }

            for (let i = index+1; i < stars.length; i++) {
                stars[i].innerHTML = `<i class='bx bx-star' style='color: black;'></i>`;
            }
        });

        
        star.addEventListener('mouseleave', function () {
            
            for (let i = 0; i < ratingValue; i++) {
                stars[i].HTML =`<i class='bx bxs-star-half' style='color: gold;'></i>`;
                if (!Number.isInteger(ratingValue)) stars[Math.floor(ratingValue)].innerHTML = innerHTML= `<i class='bx bxs-star-half' style='color: gold;'></i>`;
            }
            for (let i = Math.ceil(ratingValue); i < stars.length; i++) {
                stars[i].innerHTML = `<i class='bx bx-star' style='color: black;'></i>`;
            }
        });
    });

    
    

    
    const closeRatingPopupButton = document.getElementById('closeRatingPopup');
    closeRatingPopupButton.addEventListener('click', function () {
        ratingPopup.style.display = 'none';
    });

    
    const submitButton = document.getElementById('submitRating');
    submitButton.addEventListener('click', function () {
        // Handle rating submission here
        submitRating(dishId, ratingValue)
        ratingPopup.style.display = 'none';
    });
    }

    
    function submitRating(dishId, ratingValue) {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ratingScore: ratingValue })
        };

        fetch(`https://food-delivery.int.kreosoft.space/api/dish/${dishId}/rating?ratingScore=${ratingValue}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                console.log('Rating fetched and submitted successfully.',dishId);
            })
            .catch(error => {
                console.error("Error submitting rating:", error);
            });
    }

    function fetchCart() {
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
            console.log("DATAAAA", data);

            let cartAmount = 0; // Initialize cart amount
            for (let i = 0; i < data.length; i++) {
                map.set(data[i].name, data[i].amount);
                cartAmount += data[i].amount; // Sum up the amount of each dish
            }

            cartItemCountSpan.textContent = cartAmount; // Update the cart item count span
            
        })
        .catch(error => {
            console.error('Error fetching or processing data: ', error);
        })
        .finally(() => {
            fetchData();
            
        });
    }



    function fetchData() {
        showLoadingSpinner();
        const url = currentURL;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.dishes || !Array.isArray(data.dishes)) {
                    throw new Error('Data format is incorrect');
                }

                const dishes = data.dishes;

                const dishesContainer = document.getElementById('dish-container');
                dishesContainer.innerHTML = '';


                dishes.forEach(dish => {
                    const dishElement = document.createElement('div');
                    dishElement.classList.add('dishCard');

                    const ratingStars = convertRatingToStars(dish.rating);
                    

                    dishElement.innerHTML = `
                        <img src="${dish.image}" alt="${dish.name}" class="dish-image" style="cursor: pointer;">

                        <div class="DivName">
                        <h2 class="dish-name">${dish.name}</h2>
                        </div>

                        <div class="DivRate">
                        <div class="rateButtons">
                        <button class="rate-btn" rate-data-dish-id="${dish.id}">
                        <div class="rating">
                                <div class="star-container">
                                    ${ratingStars}
                                </div>
                        </div>
                        </button>
                        </div>
                        </div>

                        <p class="dish-category">Dish category - ${dish.category}</p>
                        <p class="dish-description">${dish.description}</p>

                        <div class="DivPrice">
                            <h2 class="dish-price">${dish.price} EGP</h2>
                            
                            <div class="AddtoCartBtn">
                            <button class="increase-quantity-btn" style="display: ${map.get(dish.name) > 0 ? 'inline' : 'none'};">+</button>
                            <p class="amount" style="display: ${map.get(dish.name) > 0 ? 'block' : 'none'}">${map.get(dish.name) || 0}</p>
                            <button class="add-to-cart-btn" data-dish-id="${dish.id}" style="display: ${map.get(dish.name) > 0 ? 'none' : 'inline'};">Add to Cart</button>
                            <button class="decrease-quantity-btn" style="display: ${map.get(dish.name) > 0 ? 'inline' : 'none'};">-</button>
                        </div>
                        </div>
                    `;
  
                    const dishImage = dishElement.querySelector('.dish-image');
                    dishImage.addEventListener('click', function () {
                        handleDishImageClick(dish);
                    });


                    const addToCartBtn = dishElement.querySelector('.add-to-cart-btn');
                    const increaseQuantityBtn = dishElement.querySelector('.increase-quantity-btn');
                    const decreaseQuantityBtn = dishElement.querySelector('.decrease-quantity-btn');
                    const amount = dishElement.querySelector('.amount');
    
                    addToCartBtn.addEventListener('click', function () {
                        const dishId = this.getAttribute('data-dish-id');
                        addToCart(dishId);
                        const currentAmount = (map.get(dish.name) || 0) + 1;
                        map.set(dish.name, currentAmount);
                        amount.textContent = currentAmount;
                        if (currentAmount > 0) {
                            amount.style.display = 'block'; // Display the amount if it's greater than 0
                            addToCartBtn.style.display = 'none';
                            increaseQuantityBtn.style.display = 'block';
                            decreaseQuantityBtn.style.display = 'block';
                        }
                        
                    });
                    
    
                    increaseQuantityBtn.addEventListener('click', function () {
                        const dishId = addToCartBtn.getAttribute('data-dish-id');
                        increaseItemQuantity(dishId);
                        map.set(dish.name, (map.get(dish.name) || 0) + 1);
                        amount.textContent = map.get(dish.name);
                    });
    
                    decreaseQuantityBtn.addEventListener('click', function () {
                        const dishId = addToCartBtn.getAttribute('data-dish-id');
                        decreaseItemQuantity(dishId);
                        const currentAmount = (map.get(dish.name) || 0) - 1;
                        map.set(dish.name, currentAmount);
                        amount.textContent = currentAmount;
                        if (currentAmount == 0) {
                            amount.style.display = 'none'; // Hide the amount when it decreases to 0
                            addToCartBtn.style.display = 'block';
                            increaseQuantityBtn.style.display = 'none';
                            decreaseQuantityBtn.style.display = 'none';
                        }
                    });
                    

                    let rateButtons = dishElement.querySelectorAll('.rate-btn'); // Corrected selector
                    rateButtons.forEach(rateButton => {
                        rateButton.addEventListener('click', function () {
                            let dishId = this.getAttribute('rate-data-dish-id');
                            checkCanRateDish(dishId);
                            console.log("Attempting to rate dish:", dishId);
                        });
                    });



                    
                    
                    

                    dishesContainer.appendChild(dishElement);
                });

                const totalPages = data.pagination.count;
                updatePagination(totalPages);

                return data;
            })
            .catch(error => {
                console.error('Error fetching or processing data: ', error);
            })
            .finally(() => {
                hideLoadingSpinner();
            });
    }

    function clearFilters() {
        categorySelect.selectedIndex = 0; // Reset category select
        sortingSelect.selectedIndex = 0; // Reset sorting select
        vegetarianCheckbox.checked = false; // Uncheck vegetarian checkbox
        currentCategories = []; // Reset selected categories
        currentSorting = 'none'; // Reset sorting
        currentPage = 1; // Reset page to 1

        document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
            checkbox.checked = false;
        });

        updateURL();
        fetchData();
    }

    let updatePagination = (totalPages) => {
        let paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            let pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.addEventListener('click', function () {
                currentPage = i;
                updateURL();
                fetchData();
            });

            if (i === currentPage) {
                pageButton.classList.add('active');
            }

            paginationContainer.appendChild(pageButton);
        }

        console.log('Total Pages:', totalPages);
    };

    let showLoadingSpinner = () => {
        let loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
    };

    let hideLoadingSpinner = () => {
        let loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    };

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


    function handleDishImageClick(dish) {
        fetchDishDetails(dish.id)
        window.location.href = `/html/dish-details.html?dish_id=${dish.id}`;
    }
    

    // function handleDishImageClick(dish) {
    //     fetchDishDetails(dish.id)
    //         .then(dishDetails => {
    //             console.log('Dish Details:', dishDetails);
    //             openPopup(dish, dishDetails);
    //         });
    // }

    function openPopup(dish) {
        let vegetarianStatus = dish.vegetarian ? 'Vegetarian' : 'NOT Vegetarian';
        let ratingStars = convertRatingToStars(dish.rating);
        popupDishDetails.innerHTML = `
            <h2 class="pop-name">${dish.name}</h2>
            <img src="${dish.image}" alt="${dish.name}" class="pop-image">
            <h2 class="pop-category">Category: ${dish.category}</h2>
            <h2 class="pop-vegetarian">${vegetarianStatus}</h2>
            <p class="pop-description">${dish.description}</p>
            <p class="pop-rating">${ratingStars}</p>
            <p class="pop-price">Price: ${dish.price} EGP</p>
        `;
        popup.style.display = 'block';

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('dish_id', dish.id);
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
    }

     closePopupBtn.addEventListener('click', closePopup);

    function closePopup() {
        popup.style.display = 'none';
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete('dish_id');
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
    }

    

    fetchDataFromURL();
    
     
});
