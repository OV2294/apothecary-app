document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');

    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        
        Toastify({
            text: text,
            duration: 3000,
            style: { background: bg },
            gravity: "top",
            position: "right"
        }).showToast();
    };

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('fb-name').value;
            const email = document.getElementById('fb-email').value;
            const message = document.getElementById('fb-message').value;

            if (!message) {
                showToast('Please enter a message.', 'error');
                return;
            }

            try {
                const response = await fetch('/feedback', { // ✅ Relative path for deployment
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    showToast('Feedback sent successfully!', 'success');
                    feedbackForm.reset();
                } else {
                    const result = await response.json();
                    showToast(result.message || 'Error sending feedback.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Server error. Please try again later.', 'error');
            }
        });
    }
});