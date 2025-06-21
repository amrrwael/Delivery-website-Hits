function logout() {
    const token = localStorage.getItem('token');

    if (token) {
        fetch('https://food-delivery.int.kreosoft.space/api/account/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('token');
                alert("You have successfully logged out.");
                location.reload();
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error("Error logging out:", error);
        });
    }
}
