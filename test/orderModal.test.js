// Mock DOM structure for the tests
document.body.innerHTML = `
  <div id="modalContent">
    <div id="orderDetails"></div>
  </div>
`;

// Test that the long querySelector chain works fine when everything is in place
test('modalContent.querySelector chain works when DOM structure is intact', () => {
  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #123';

  // This is the "bad pattern" where we chain querySelector calls without checking null
  // But here, the DOM is correct, so it should not throw any errors
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).not.toThrow();

  // Now check if the h2 element was actually appended to #orderDetails
  const appended = modalContent.querySelector('#orderDetails').querySelector('h2');
  expect(appended).not.toBeNull();
  expect(appended.textContent).toBe('Order #123');
});

// Test that if part of the chain (#orderDetails) is missing, the long chain throws an error
test('fails if any part of the chain is broken (missing #orderDetails)', () => {
  // Remove #orderDetails from DOM to simulate broken chain
  document.getElementById('orderDetails').remove();

  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #456';

  // Since #orderDetails is gone, this long chain will throw an error
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).toThrow();
});

// Test that if modalContent itself is missing, the chain throws as well
test('fails if modalContent itself is missing', () => {
  // Remove #modalContent from DOM
  document.getElementById('modalContent').remove();

  // modalContent will be null here
  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #789';

  // Trying to call querySelector on null should throw an error
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).toThrow();
});
