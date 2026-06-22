// Form submission handler
const bookingForm = document.querySelector('form');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      fullName: document.querySelector('input[type="text"]').value,
      phone: document.querySelector('input[type="tel"]').value,
      email: document.querySelector('input[type="email"]').value,
      service: document.querySelector('select').value,
      date: document.querySelector('input[type="date"]').value,
      time: document.querySelector('input[type="time"]').value,
      details: document.querySelector('textarea').value,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert(`Booking confirmed! Your Booking ID is: ${data.booking.id}`);
        
        // Clear form
        bookingForm.reset();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    }
  });
}
