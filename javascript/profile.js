document.addEventListener("DOMContentLoaded", function() {
    let authButton = document.getElementById('authButton');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    const token = localStorage.getItem('token');

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
    
    fetchProfile(token);

    document.getElementById("editProfileForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const birthDate = document.getElementById("birthDate").value;
        const address = document.getElementById("address").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const updateData = { fullName, birthDate, address, phoneNumber };

        updateProfile(updateData, token);
    });

    console.log("Profile")
});

saveChanges.onclick = function() {
    alert('Saved succesfully');
  };

function fetchProfile(token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/account/profile`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const { fullName, birthDate, gender, address, email, phoneNumber } = data;
        document.getElementById("fullName").value = fullName;
        document.getElementById("birthDate").value = birthDate.split("T")[0]; 
        document.getElementById("address").value = address;
        document.getElementById("phoneNumber").value = phoneNumber;

        document.getElementById("profileInfo").innerHTML = `
            <p>Full Name: ${fullName}</p>
            <p>Birth Date: ${new Date(birthDate).toLocaleString()}</p>
            <p>Gender: ${gender}</p>
            <p>Address: ${address}</p>
            <p>Email: ${email}</p>
            <p>Phone Number: ${phoneNumber}</p>
        `;
    })
    .catch(error => {
        console.log("Error fetching profile data:", error);
    });
}

function updateProfile(data, token) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/account/profile`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(updatedProfile => {
        console.log("Profile updated successfully:", updatedProfile);
        fetchProfile(token); // Refresh the displayed profile information
    })
    .catch(error => {
        console.error("Error updating profile:", error);
    });
}
