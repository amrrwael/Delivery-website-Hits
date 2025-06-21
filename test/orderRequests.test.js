// Mock DOM for testing
document.body.innerHTML = `
  <div id="modalContent">
    <div id="orderDetails"></div>
  </div>
`;

test('modalContent.querySelector chain works when DOM structure is intact', () => {
  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #123';

  console.log('Testing chain with full DOM...');
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).not.toThrow();

  const appended = modalContent.querySelector('#orderDetails').querySelector('h2');
  expect(appended).not.toBeNull();
  expect(appended.textContent).toBe('Order #123');
  console.log('Passed: Element appended successfully');
});

test('fails if any part of the chain is broken (missing #orderDetails)', () => {
  document.getElementById('orderDetails').remove();

  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #456';

  console.log('Testing chain with missing #orderDetails...');
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).toThrow();
  console.log('Passed: Chain throws when #orderDetails missing');
});

test('fails if modalContent itself is missing', () => {
  document.getElementById('modalContent').remove();

  const modalContent = document.getElementById('modalContent');
  const orderHeader = document.createElement('h2');
  orderHeader.textContent = 'Order #789';

  console.log('Testing chain with missing #modalContent...');
  expect(() => {
    modalContent.querySelector('#orderDetails').appendChild(orderHeader);
  }).toThrow();
  console.log('Passed: Chain throws when #modalContent missing');
});
