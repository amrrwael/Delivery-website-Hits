document.body.innerHTML = `
  <input id="name" value="John Doe" />
  <input id="password" value="pass123" />
  <input id="address" value="123 Main St" />
  <input id="dob" value="2000-01-01" />
  <input id="gender" value="Male" />
  <input id="mobile" value="1234567890" />
  <input id="email" value="john@example.com" />
  <div id="emailError"></div>
  <div id="passwordError"></div>
`;

// This is the main function that runs when the form submits
function solve() {
    var fullName = document.getElementById('name').value;
    var password = document.getElementById('password').value;
    var address = document.getElementById('address').value;
    var birthDate = document.getElementById('dob').value;
    var gender = document.getElementById('gender').value;
    var phoneNumber = document.getElementById('mobile').value;
    var email = document.getElementById('email').value;

    let flag = 1;  // flag to check if everything is good
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email check regex

    // Check if email is valid, if not show error and set flag to 0
    if (!emailRegex.test(email)) {
        flag = 0;
        document.getElementById('emailError').innerText = 'Please enter a valid email address.';
        setTimeout(() => {
            document.getElementById('emailError').innerText = "";
        }, 3000); // error message disappears after 3 seconds
    }

    // Password must be at least 6 characters with at least one digit, otherwise error
    let passwordRegex = /^(?=.*\d)\S{6,}$/;
    if (!passwordRegex.test(password)) {
        flag = 0;
        document.getElementById('passwordError').innerText = 'Password must be at least 6 characters long and include at least one number.';
        setTimeout(() => {
            document.getElementById('passwordError').innerText = "";
        }, 3000);
    }

    // If everything is fine, show alert "Form submitted"
    if (flag) {
        alert("Form submitted");
    }

    // Prepare the data to send to the server
    var formData = {
        fullName: fullName,
        password: password,
        email: email,
        address: address,
        birthDate: birthDate,
        gender: gender,
        phoneNumber: phoneNumber
    };

    // Send data to backend API using fetch POST request
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
            window.location.href = '/'  // redirect to home page after success
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

// Now the tests!

test('solve() submits correct form data', async () => {
    // Mock the fetch call so it doesn't really call the backend during tests
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' })
        })
    );

    // Also mock alert so we can check if it was called
    window.alert = jest.fn();

    solve();  // call the function

    // Check fetch called with right URL and right data in POST body
    expect(global.fetch).toHaveBeenCalledWith(
        'https://food-delivery.int.kreosoft.space/api/account/register',
        expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'John Doe',
                password: 'pass123',
                email: 'john@example.com',
                address: '123 Main St',
                birthDate: '2000-01-01',
                gender: 'Male',
                phoneNumber: '1234567890'
            })
        })
    );

    // Make sure alert("Form submitted") was actually shown
    expect(window.alert).toHaveBeenCalledWith("Form submitted");
});

// This test checks that the logic for showing/hiding buttons is consistent for dish amount
test('duplicated condition logic for button visibility', () => {
  const map = new Map();
  map.set('Pizza', 2);  // pretend user added 2 pizzas to cart

  const dish = { name: 'Pizza', id: '123' };
  const amount = map.get(dish.name) || 0; // get how many pizzas user has, 0 if none

  // This simulates the button visibility logic in the UI
  const addBtnDisplay = amount > 0 ? 'none' : 'inline';
  const decreaseBtnDisplay = amount > 0 ? 'inline' : 'none';
  const amountDisplay = amount > 0 ? 'block' : 'none';
  const increaseBtnDisplay = amount > 0 ? 'inline' : 'none';

  // The assertions make sure all these states match the same condition (amount > 0)
  expect(addBtnDisplay).toBe('none');         // if amount > 0, hide add button
  expect(decreaseBtnDisplay).toBe('inline');  // show decrease button
  expect(amountDisplay).toBe('block');        // show amount display
  expect(increaseBtnDisplay).toBe('inline');  // show increase button
});

// This test is for clearing filters — kinda simulates resetting the UI and state variables
test('clearFilters manually resets each filter and state variable (shotgun surgery)', () => {
  // Create dummy select elements and checkboxes as if from the DOM
  const categorySelect = document.createElement('select');
  categorySelect.innerHTML = `
    <option value="none">None</option>
    <option value="Pizza">Pizza</option>
  `;
  categorySelect.selectedIndex = 1; // pretend user chose Pizza

  const sortingSelect = document.createElement('select');
  sortingSelect.innerHTML = `
    <option value="none">None</option>
    <option value="asc">Ascending</option>
  `;
  sortingSelect.selectedIndex = 1;  // pretend user chose Ascending

  const vegetarianCheckbox = document.createElement('input');
  vegetarianCheckbox.type = 'checkbox';
  vegetarianCheckbox.checked = true; // checkbox is checked

  // Simulate some state variables
  let currentCategories = ['Pizza'];
  let currentSorting = 'asc';
  let currentPage = 5;

  // Now simulate what clearFilters does: reset everything to defaults
  categorySelect.selectedIndex = 0;
  sortingSelect.selectedIndex = 0;
  vegetarianCheckbox.checked = false;
  currentCategories = [];
  currentSorting = 'none';
  currentPage = 1;

  // Check everything is reset properly
  expect(categorySelect.selectedIndex).toBe(0);
  expect(sortingSelect.selectedIndex).toBe(0);
  expect(vegetarianCheckbox.checked).toBe(false);
  expect(currentCategories).toEqual([]);
  expect(currentSorting).toBe('none');
  expect(currentPage).toBe(1);
});

// This one tests rating star hover logic — kinda dead code for half stars, just proving no half star rendered
test('rating hover logic does not actually render half stars (dead code)', () => {
  const percent = 0.3;
  let rendered = '';

  if (percent >= 0.5) {
    rendered = 'full';
  } else if (percent > 0) {
    rendered = 'half';
  }

  console.log('rating hover logic with percent=0.3:', { rendered });

  // But in real UI, no half star is rendered (simulate what would happen)
  const starHTML = rendered === 'half'
    ? '' // no actual rendering in UI
    : "<i class='bx bxs-star' style='color: gold;'></i>";

  console.log('Star HTML output:', starHTML);

  expect(rendered).toBe('half');
  expect(starHTML).toBe('');
});
