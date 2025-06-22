document.addEventListener('DOMContentLoaded', function () {
    let authButton = document.getElementById('authButton');
    let logOutBtn = document.getElementById('logOutBtn');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    let popup = document.getElementById('popup');
    let closePopupBtn = document.getElementById('closePopup');
    let popupDishDetails = document.getElementById('popupDishDetails');
    let cartItemCountSpan = document.getElementById("cartItemCount");
    let token = localStorage.getItem('token');
    const map = new Map();

   

    function updateAuthUI() {
        if (token) {
            console.log('User is logged in');
            authButton.style.display = 'none';
            logOutBtn.style.display = 'inline';
            orderIcon.style.display = 'inline';
            profileIcon.style.display = 'inline';
            cartIcon.style.display = 'inline';
        } else {
            console.log('User is not logged in');
            authButton.style.display = 'inline';
            logOutBtn.style.display = 'none';
            profileIcon.style.display = 'none';
            cartIcon.style.display = 'none';
            orderIcon.style.display = 'none';
        }
    }

    function logout() {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    
        fetch('https://food-delivery.int.kreosoft.space/api/account/logout', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                localStorage.removeItem('token');
                updateAuthUI();
                console.log('Logged out successfully.');
            })
            .catch(error => {
                console.error('Error logging out:', error);
                localStorage.removeItem('token');
                updateAuthUI();
            });
    }

    function checkTokenExpiration() {
        const token = localStorage.getItem("token");
        if (!token) return; 

        try {
            const { exp } = JSON.parse(atob(token.split(".")[1]));
            const tokenExp = exp * 1000;
            const currentTime = Date.now();

            if (currentTime >= tokenExp) {
                console.log("Token expired. Logging out...");
                logout();
                location.reload();
            } else {
                const timeToExpire = tokenExp - currentTime;
                setTimeout(checkTokenExpiration, timeToExpire);
            }
        } catch (error) {
            console.error("Error parsing token:", error);
            logout();
            location.reload();
        }
    }

    updateAuthUI();
    checkTokenExpiration();
    
    

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
    // Display the rating popup modal
    const ratingPopup = document.getElementById('ratingPopup');
    ratingPopup.style.display = 'block';
    
    let ratingValue = 0;
    const stars = document.querySelectorAll('.hh');
    const STAR_STATES = {
        FULL: `<i class='bx bxs-star' style='color: gold;'></i>`,
        HALF: `<i class='bx bxs-star-half' style='color: gold;'></i>`,
        EMPTY: `<i class='bx bx-star' style='color: black;'></i>`
    };

    // Helper function to update a single star's display
    function updateStarDisplay(star, percent) {
        const hoverValue = parseFloat(star.getAttribute('data-rating'));
        
        let starHtml;
        if (percent <= 0) {
            starHtml = STAR_STATES.EMPTY;
        } else if (percent < 0.5) {
            starHtml = STAR_STATES.HALF;
        } else {
            starHtml = STAR_STATES.FULL;
        }
        
        star.innerHTML = starHtml;
        return percent >= 0.5 ? hoverValue : hoverValue - 0.5;
    }

    // Handle star hover interactions
    function handleStarHover(event) {
        const star = event.currentTarget;
        const rect = star.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        
        const hoverValue = updateStarDisplay(star, percent);
        
        // Update previous stars to full
        const currentIndex = Array.from(stars).indexOf(star);
        stars.forEach((s, index) => {
            if (index < currentIndex) {
                s.innerHTML = STAR_STATES.FULL;
            } else if (index > currentIndex) {
                s.innerHTML = STAR_STATES.EMPTY;
            }
        });
        
        return hoverValue;
    }

    // Reset stars to their default state
    function resetStars() {
        stars.forEach((star, index) => {
            if (index < Math.floor(ratingValue)) {
                star.innerHTML = STAR_STATES.FULL;
            } else if (index === Math.floor(ratingValue) && !Number.isInteger(ratingValue)) {
                star.innerHTML = STAR_STATES.HALF;
            } else {
                star.innerHTML = STAR_STATES.EMPTY;
            }
        });
    }

    // Set up event listeners for each star
    stars.forEach(star => {
        star.addEventListener('mousemove', handleStarHover);
        
        star.addEventListener('mouseleave', () => {
            resetStars();
        });

        star.addEventListener('click', () => {
            ratingValue = parseFloat(star.getAttribute('data-rating'));
        });
    });

    // Close popup functionality
    const closeRatingPopupButton = document.getElementById('closeRatingPopup');
    closeRatingPopupButton.addEventListener('click', () => {
        ratingPopup.style.display = 'none';
    });

    // Submit rating functionality
    const submitButton = document.getElementById('submitRating');
    submitButton.addEventListener('click', () => {
        submitRating(dishId, ratingValue);
        ratingPopup.style.display = 'none';
    });

    // Initialize stars to empty state
    resetStars();
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
                            <button class="add-to-cart-btn" data-dish-id="${dish.id}" style="display: ${map.get(dish.name) > 0 ? 'none' : 'inline'};">Add to Cart</button>
                            <button class="decrease-quantity-btn" style="display: ${map.get(dish.name) > 0 ? 'inline' : 'none'};">-</button>
                            <p class="amount" style="display: ${map.get(dish.name) > 0 ? 'block' : 'none'}">${map.get(dish.name) || 0}</p>
                            <button class="increase-quantity-btn" style="display: ${map.get(dish.name) > 0 ? 'inline' : 'none'};">+</button>
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

                    if (!token) {
                        addToCartBtn.style.display = 'none';
                        increaseQuantityBtn.style.display = 'none';
                        decreaseQuantityBtn.style.display = 'none';
                        amount.style.display = 'none';
                    }
    
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



  
