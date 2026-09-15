document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('foodshareUser')) || {};
  const availableFoodList = document.getElementById('availableFoodList');
  const receiverRequestList = document.getElementById('receiverRequestList');
  const receiverWelcome = document.getElementById('receiverWelcome');
  const requestCount = document.getElementById('requestCount');

  if (receiverWelcome && user.name) {
    receiverWelcome.textContent = `Welcome, ${user.name}!`;
  }

  if (availableFoodList) {
    await loadAvailableFoods();
  }

  if (receiverRequestList) {
    await loadReceiverRequests();
  }
});

async function loadAvailableFoods() {
  const list = document.getElementById('availableFoodList');
  if (!list) return;

  try {
    const response = await fetch(`${API_BASE}/foods`);
    const foods = await response.json();
    const available = foods.filter(food => food.status === 'Available');

    list.innerHTML = available.length ? available.map(renderFoodCard).join('') : '<p>No available food donations.</p>';

    list.querySelectorAll('[data-request]').forEach(button => {
      button.addEventListener('click', requestFood);
    });
  } catch (error) {
    list.innerHTML = '<p>Unable to load food donations.</p>';
  }
}

function renderFoodCard(food) {
  return `<article class="food-card">
    <div class="food-card-content">
      <span class="food-status">${food.status}</span>
      <h3>${food.foodName}</h3>
      <p><strong>Category:</strong> ${food.category}</p>
      <p class="food-details"><strong>Quantity:</strong> ${food.quantity} • <strong>Servings:</strong> ${food.servings}</p>
      <p class="food-details"><strong>Food Type:</strong> ${food.foodType}</p>
      <p class="food-details"><strong>Pickup:</strong> ${food.pickupLocation}</p>
      <p class="food-details"><strong>Expiry:</strong> ${food.expiryDate}</p>
      <p class="food-details"><strong>Donor:</strong> ${food.donorEmail}</p>
      <p>${food.description}</p>
      <div class="food-buttons">
        <button class="btn btn-primary" data-request="${food._id}">Request Food</button>
      </div>
    </div>
  </article>`;
}

async function requestFood(event) {
  event.preventDefault();
  const foodId = event.target.dataset.request;
  const user = JSON.parse(localStorage.getItem('foodshareUser')) || {};

  if (!user.email || user.role !== 'Receiver') {
    alert('Please login as a Receiver to request food.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodId,
        receiverEmail: user.email,
        requestedDate: new Date().toISOString().slice(0, 10),
        status: 'Requested'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Unable to request food');
      return;
    }

    alert('Food requested successfully');
    await loadAvailableFoods();
    await loadReceiverRequests();
  } catch (error) {
    alert('Server error. Try again.');
  }
}

async function loadReceiverRequests() {
  const user = JSON.parse(localStorage.getItem('foodshareUser')) || {};
  const list = document.getElementById('receiverRequestList');
  const requestCount = document.getElementById('requestCount');

  if (!list || !requestCount) return;

  try {
    const response = await fetch(`${API_BASE}/requests`);
    const requests = await response.json();
    const myRequests = requests.filter(request => request.receiverEmail === user.email);

    if (requestCount) requestCount.textContent = `Food Requests: ${myRequests.length}`;

    list.innerHTML = myRequests.length ? myRequests.map(renderRequestCard).join('') : '<p>No food requests yet.</p>';
  } catch (error) {
    list.innerHTML = '<p>Unable to load requests.</p>';
  }
}

function renderRequestCard(request) {
  return `<article class="request-card">
    <div class="request-meta"><strong>Food:</strong> ${request.foodName || request.foodId}</div>
    <div class="request-meta"><strong>Status:</strong> ${request.status}</div>
    <div class="request-meta"><strong>Requested Date:</strong> ${request.requestedDate}</div>
  </article>`;
}
