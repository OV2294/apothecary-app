document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('phone-reset-form');
    
    // Toast Helper
    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        
        Toastify({
            text: text, duration: 3000, gravity: "top", position: "right",
            style: { background: bg }
        }).showToast();
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value;
            const phone = document.getElementById('reset-phone').value;
            const newPassword = document.getElementById('new-password').value;
            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            if (newPassword.length < 6) {
                showToast("Password must be at least 6 characters", "error");
                return;
            }

            btn.textContent = "Verifying...";
            btn.disabled = true;

            try {
                const res = await fetch('/auth/reset-with-phone', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, phone, newPassword })
                });

                const data = await res.json();

                if (res.ok) {
                    showToast("Success! Redirecting to login...", "success");
                    setTimeout(() => {
                        window.location.href = 'auth.html';
                    }, 2000);
                } else {
                    showToast(data.message || "Verification failed", "error");
                }

            } catch (err) {
                console.error(err);
                showToast("Connection error. Is the backend server running?", "error");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
});