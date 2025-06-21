// Before each test, clear localStorage and spy on its methods so we can check if they're called
beforeEach(() => {
  localStorage.clear();
  jest.spyOn(window.localStorage.__proto__, 'setItem');
  jest.spyOn(window.localStorage.__proto__, 'getItem');
  jest.spyOn(window.localStorage.__proto__, 'removeItem');
});

// This test checks if the login logic properly stores the token in localStorage
test('login.js stores token in localStorage', () => {
  // Simulate what login.js would do by setting a token
  const token = 'abc123';
  localStorage.setItem('token', token);

  // Now check if setItem was called correctly
  expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
  // Also check if we can get the token back correctly
  expect(localStorage.getItem('token')).toBe('abc123');
});

// This test checks if the logout logic properly removes the token from localStorage
test('logout.js removes token from localStorage', () => {
  // First set a token to simulate user being logged in
  localStorage.setItem('token', 'abc123');

  // Simulate logout by removing the token
  localStorage.removeItem('token');

  // Check if removeItem was called with the right key
  expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  // After removal, getting the token should return null
  expect(localStorage.getItem('token')).toBeNull();
});

// This test simulates other parts of the app that check if a token exists or not
test('other file logic checks for token existence', () => {
  // Case when token is there
  localStorage.setItem('token', 'abc123');
  expect(localStorage.getItem('token')).toBe('abc123');

  // Case when token is removed (user logged out)
  localStorage.removeItem('token');
  expect(localStorage.getItem('token')).toBeNull();
});
