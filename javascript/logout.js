function logout() {
    const apiUrl = 'https://food-delivery.int.kreosoft.space/api/account/logout';

    var token = localStorage.getItem('token');

    if (!token) {
        console.log('Token not found. User might not be logged in.');
        return;
    }

    var headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers
    })
    .then(response => {
        console.log('Logout Response:', response);
    
        if (response.ok) {
            console.log('Logout successful');
            localStorage.removeItem('token');
            window.location.href = '/';
        } else {
            console.log('Logout failed:', response.status);
            // Log the response body for more details
            response.text().then(text => console.log('Response body:', text));
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
    });
}
