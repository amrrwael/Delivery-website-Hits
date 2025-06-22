// Setup the DOM
document.body.innerHTML = `<div id="cart"></div>`;

// Provide fetch mock globally
global.fetch = jest.fn();

// The functions to test
function fetchAndDisplayCart(token) {
  return fetch('https://food-delivery.int.kreosoft.space/api/cart', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('cart').innerText = JSON.stringify(data);
  })
  .catch(err => console.error(err));
}

function increaseItemQuantity(dishId, token) {
  fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

function decreaseItemQuantity(dishId, token) {
  fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishId}?increase=true`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

function removeItemFromCart(dishId, token) {
  fetch(`https://food-delivery.int.kreosoft.space/api/basket/dish/${dishId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// 🧪 TESTS

test('fetchAndDisplayCart sends GET with correct headers and updates DOM', async () => {
  const mockCart = [{ dish: 'Pizza', quantity: 2 }];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockCart)
  });

  await fetchAndDisplayCart('mockToken');

  expect(global.fetch).toHaveBeenCalledWith(
    'https://food-delivery.int.kreosoft.space/api/cart',
    expect.objectContaining({
      method: 'GET',
      headers: { 'Authorization': 'Bearer mockToken' }
    })
  );

  expect(document.getElementById('cart').innerText).toBe(JSON.stringify(mockCart));

  global.fetch.mockReset();
});

test('increaseItemQuantity should send POST request with correct headers', () => {
  global.fetch.mockResolvedValueOnce({ ok: true });

  increaseItemQuantity('123', 'test-token');

  expect(global.fetch).toHaveBeenCalledWith(
    'https://food-delivery.int.kreosoft.space/api/basket/dish/123',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      })
    })
  );

  global.fetch.mockReset();
});

test('decreaseItemQuantity should send DELETE request with correct headers', () => {
  global.fetch.mockResolvedValueOnce({ ok: true });

  decreaseItemQuantity('456', 'test-token');

  expect(global.fetch).toHaveBeenCalledWith(
    'https://food-delivery.int.kreosoft.space/api/basket/dish/456?increase=true',
    expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      })
    })
  );

  global.fetch.mockReset();
});

test('removeItemFromCart should send DELETE request with correct headers', () => {
  global.fetch.mockResolvedValueOnce({ ok: true });

  removeItemFromCart('789', 'test-token');

  expect(global.fetch).toHaveBeenCalledWith(
    'https://food-delivery.int.kreosoft.space/api/basket/dish/789',
    expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      })
    })
  );

  global.fetch.mockReset();
});
