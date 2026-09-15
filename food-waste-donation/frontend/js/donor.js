document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('foodshareUser')) || {};

  if (user.role === 'Donor') {
    const donorWelcome = document.getElementById('donorWelcome');
    if (donorWelcome) donorWelcome.textContent = `Welcome, ${user.name || 'Donor'}!`;
  }

  const donorDonationList = document.getElementById('donorDonationList');
  const myDonationsList = document.getElementById('myDonationsList');

  if (donorDonationList || myDonationsList) {
    await loadDonorFoods();
  }

  const addFoodForm = document.getElementById('addFoodForm');
  if (addFoodForm) {
    addFoodForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(addFoodForm);
      const payload = {
        foodName: formData.get('foodName'),
        category: formData.get('category'),
        quantity: Number(formData.get('quantity')),
        servings: Number(formData.get('servings')),
        foodType: formData.get('foodType'),
        preparationDate: formData.get('preparationDate'),
        expiryDate: formData.get('expiryDate'),
        pickupLocation: formData.get('pickupLocation'),
        description: formData.get('description'),
        donorEmail: user.email,
        status: 'Available'
      };

      try {
        const response = await fetch(`${API_BASE}/foods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
          showMessage('foodMessage', data.message || 'Unable to add food', true);
          return;
        }

        showMessage('foodMessage', 'Food added successfully');
        addFoodForm.reset();
        setTimeout(() => window.location.href = 'my-donations.html', 700);
      } catch (error) {
        showMessage('foodMessage', 'Server error. Try again.', true);
      }
    });
  }
});

async function loadDonorFoods() {
  const user = JSON.parse(localStorage.getItem('foodshareUser')) || {};
  const donorDonationList = document.getElementById('donorDonationList');
  const myDonationsList = document.getElementById('myDonationsList');

  try {
    const response = await fetch(`${API_BASE}/foods`);
    const foods = await response.json();

    const donorFoods = foods.filter(food => food.donorEmail === user.email);

    if (donorDonationList) {
      donorDonationList.innerHTML = donorFoods.length ? donorFoods.map(renderFoodRow).join('') : '<p>No donations yet.</p>';
    }

    if (myDonationsList) {
      myDonationsList.innerHTML = donorFoods.length ? donorFoods.map(renderFoodRow).join('') : '<p>No donations yet.</p>';
    }

    bindDeleteButtons();
  } catch (error) {
    if (donorDonationList) donorDonationList.innerHTML = '<p>Unable to load donations.</p>';
    if (myDonationsList) myDonationsList.innerHTML = '<p>Unable to load donations.</p>';
  }
}

function renderFoodRow(food) {
  return `<article class="food-item">
    <div>
      <div class="food-item-title">${food.foodName}</div>
      <div class="food-meta">${food.category} • ${food.foodType} • Qty: ${food.quantity} • Servings: ${food.servings}</div>
      <div class="food-meta">Pickup: ${food.pickupLocation} • Expiry: ${food.expiryDate}</div>
      <div class="food-meta">Status: <span class="food-status">${food.status}</span></div>
    </div>
    <div class="food-actions">
      <button class="btn btn-danger delete-food" data-id="${food._id}">Delete</button>
    </div>
  </article>`;
}

function bindDeleteButtons() {
  document.querySelectorAll('.delete-food').forEach(button => {
    button.addEventListener('click', async () => {
      const foodId = button.dataset.id;
      try {
        const response = await fetch(`${API_BASE}/foods/${foodId}`, { method: 'DELETE' });
        if (response.ok) {
          await loadDonorFoods();
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
}
