// uiHelper.js
function header() {
    let logOutBtn = document.getElementById('logOutBtn');
    let profileIcon = document.getElementById('profileIcon');
    let orderIcon = document.getElementById('orderIcon');
    let cartIcon = document.getElementById('cartIcon');
    const token = localStorage.getItem('token');

    // Show icons
    if (logOutBtn) logOutBtn.style.display = 'inline';
    if (profileIcon) profileIcon.style.display = 'inline';
    if (orderIcon) orderIcon.style.display = 'inline';
    if (cartIcon) cartIcon.style.display = 'inline';

    // Check token
    if (!token) {
        window.location.href = '../index.html';
    }

    return token;
}
