document.body.innerHTML = `
  <div id="ordersContainer"></div>
`;

function displayOrders(orders) {
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';

    const title = document.createElement('h3');
    title.innerText = `Order #${order.id}`;

    const time = document.createElement('p');
    time.innerText = `Time: ${new Date(order.time).toLocaleString()}`;

    const btn = document.createElement('button');
    btn.innerText = 'Confirm';
    btn.addEventListener('click', () => {
      console.log(`Order ${order.id} confirmed`);
    });

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(btn);
    container.appendChild(card);
  });
}

test('displayOrders renders orders and buttons work', () => {
  const orders = [
    { id: 1, time: '2025-06-21T10:00:00Z' },
    { id: 2, time: '2025-06-21T11:00:00Z' }
  ];

  console.log = jest.fn();

  displayOrders(orders);

  const container = document.getElementById('ordersContainer');
  const cards = container.querySelectorAll('.order-card');
  expect(cards.length).toBe(2);

  expect(cards[0].querySelector('h3').innerText).toBe('Order #1');
  expect(cards[1].querySelector('h3').innerText).toBe('Order #2');

  const buttons = container.querySelectorAll('button');
  buttons[0].click();
  buttons[1].click();

  expect(console.log).toHaveBeenCalledWith('Order 1 confirmed');
  expect(console.log).toHaveBeenCalledWith('Order 2 confirmed');

  console.log('displayOrders test passed');
});

test('displayOrders clears old content before rendering new', () => {
  displayOrders([{ id: 1, time: '2025-06-21T10:00:00Z' }]);
  expect(document.querySelectorAll('.order-card').length).toBe(1);

  displayOrders([{ id: 2, time: '2025-06-21T11:00:00Z' }]);
  const cards = document.querySelectorAll('.order-card');
  expect(cards.length).toBe(1);
  expect(cards[0].querySelector('h3').innerText).toBe('Order #2');

  console.log('Content replace test passed');
});
