function solve() {
    var fullName = document.getElementById('name').value;
    var password = document.getElementById('password').value;
    var address = document.getElementById('address').value;
    var birthDate = document.getElementById('dob').value;
	var gender = document.getElementById('gender').value;
    var phoneNumber = document.getElementById('mobile').value;
    var email = document.getElementById('email').value;

    let flag = 1;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
		flag = 0;
		document.getElementById('emailError').innerText = 'Please enter a valid email address.';
		setTimeout(() => {
			document.getElementById('emailError').innerText = "";
		}, 3000);
	}


	let passwordRegex = /^(?=.*\d)\S{6,}$/;
	if (!passwordRegex.test(password)) {
		flag = 0;
		document.getElementById('passwordError').innerText = 'Password must be at least 6 characters long and include at least one number.';
		setTimeout(() => {
			document.getElementById('passwordError').innerText = "";
		}, 3000);
	}


    if (flag) {
        alert("Form submitted");
    }

    var formData = {
        fullName: fullName,
        password: password,
        email: email,
        address: address,
        birthDate: birthDate,
        gender: gender,
        phoneNumber: phoneNumber
    };

    fetch(`https://food-delivery.int.kreosoft.space/api/account/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) { 
            console.log('registeration successful');
           window.location.href = '/'
        } else {
            console.log('registeration failed:'); 
        }

       return response.json();
   })  
   .then(data => {
       console.log(data)
   })
   .catch(error => {
       
       console.error('Error:', error);
   });

}
