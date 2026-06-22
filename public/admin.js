// Load bookings from backend
async function loadBookings() {
  try {
    const response = await fetch('/api/bookings');
    const data = await response.json();

    if (data.success) {
      displayBookings(data.bookings);
      updateStats(data.bookings);
    } else {
      showError('Failed to load bookings');
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
    showError('Error loading bookings');
  }
}

// Display bookings in table
function displayBookings(bookings) {
  const container = document.getElementById('bookingsContainer');

  if (bookings.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No bookings found.</p>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Service</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  bookings.forEach((booking) => {
    html += `
      <tr>
        <td>${booking.id}</td>
        <td>${booking.fullName}</td>
        <td>${booking.phone}</td>
        <td>${booking.service}</td>
        <td>${booking.date}</td>
        <td>${booking.time}</td>
        <td><span class="status ${booking.status}">${booking.status}</span></td>
        <td>
          <div class="actions">
            <select onchange="updateStatus('${booking.id}', this.value)">
              <option value="">Change Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button class="btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

// Update booking status
async function updateStatus(id, status) {
  if (!status) return;

  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Booking status updated successfully');
      loadBookings();
    } else {
      alert('Error updating booking status');
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Error updating booking');
  }
}

// Delete booking
async function deleteBooking(id) {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      alert('Booking deleted successfully');
      loadBookings();
    } else {
      alert('Error deleting booking');
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('Error deleting booking');
  }
}

// Update statistics
function updateStats(bookings) {
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  document.getElementById('totalBookings').textContent = totalBookings;
  document.getElementById('pendingCount').textContent = pendingCount;
  document.getElementById('confirmedCount').textContent = confirmedCount;
  document.getElementById('completedCount').textContent = completedCount;
}

// Show error message
function showError(message) {
  const container = document.getElementById('bookingsContainer');
  container.innerHTML = `<div class="error">${message}</div>`;
}

// Load bookings when page loads
window.addEventListener('load', loadBookings);

// Refresh bookings every 30 seconds
setInterval(loadBookings, 30000);
