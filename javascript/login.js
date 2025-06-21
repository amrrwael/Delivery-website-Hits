function solve(e) {
    const apiUrl = 'https://food-delivery.int.kreosoft.space/api/account/login';
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var requestData = {
        email: email,
        password: password
    };

    console.log(requestData);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Login failed:', response.status);
            throw new Error('Login Failed');
        }
    })
    .then(data => {
        console.log('Login successful');
        const token = data.token;
        localStorage.setItem('token', token);
        console.log(token);
        
        // Redirect to the homepage after successful login
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Invalid email or password. Please try again.');
    });
}
