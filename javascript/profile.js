document.addEventListener('DOMContentLoaded', function () {
    const token = header();
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
