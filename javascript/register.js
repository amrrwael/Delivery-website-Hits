class User {
  constructor(data) {
    this.fullName = data.name;
    this.password = data.password;
    this.email = data.email;
    this.address = data.address;
    this.birthDate = data.dob;
    this.gender = data.gender;
    this.phoneNumber = data.mobile;
  }

  static fromForm() {
    return new User({
      name: document.getElementById('name').value,
      password: document.getElementById('password').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      mobile: document.getElementById('mobile').value
    });
  }

  validate() {
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('emailError', 'Invalid email');
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)\S{6,}$/;
    if (!passwordRegex.test(this.password)) {
      this.showError('passwordError', 'Password must be 6+ chars with a number');
      isValid = false;
    }

    return isValid;
  }

  showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerText = message;
    setTimeout(() => element.innerText = "", 3000);
  }

  async register() {
    try {
      const response = await fetch(`https://food-delivery.int.kreosoft.space/api/account/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this)
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Registration failed:', await response.json());
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}

// Usage
function solve() {
  const user = User.fromForm();
  if (user.validate()) {
    user.register();
  }
}