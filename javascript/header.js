function header() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '../index.html';
        return null;
    }

    // Wait for DOM to be ready before accessing elements
    document.addEventListener('DOMContentLoaded', function() {
        let logOutBtn = document.getElementById('logOutBtn');
        let profileIcon = document.getElementById('profileIcon');
        let orderIcon = document.getElementById('orderIcon');
        let cartIcon = document.getElementById('cartIcon');

        // Show icons if they exist
        if (logOutBtn) logOutBtn.style.display = 'inline';
        if (profileIcon) profileIcon.style.display = 'inline';
        if (orderIcon) orderIcon.style.display = 'inline';
        if (cartIcon) cartIcon.style.display = 'inline';
    });

    return token;
}