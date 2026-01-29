document.addEventListener('DOMContentLoaded', () => {

    // === TOAST HELPER ===
    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";

        Toastify({
            text: text,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: bg },
            stopOnFocus: true
        }).showToast();
    };

    // === TAB SWITCHING ===
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetForm = document.querySelector(targetId);
            if (targetForm) targetForm.classList.add('active');
        });
    });

    // === VALIDATION PATTERNS ===
    const patterns = {
        email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        phone: /^\d{10}$/,
        username: /^.{3,}$/,
        password: /^.{6,}$/
    };

    function validateField(field, regex) {
        if (field.name === 'phone' && field.value.trim() === '') {
            field.className = '';
            return true;
        }
        if (regex.test(field.value.trim())) {
            field.className = 'valid';
            return true;
        } else {
            field.className = 'invalid';
            return false;
        }
    }

    function checkMatch(pass1, pass2) {
        if (pass2.value === '' || pass1.value !== pass2.value) {
            pass2.className = 'invalid';
            return false;
        } else {
            pass2.className = 'valid';
            return true;
        }
    }

    // === REGISTER FORM ===
    const registerForm = document.getElementById('register');
    if (registerForm) {
        const inputs = registerForm.querySelectorAll('input');

        inputs.forEach(input => {
            input.addEventListener('keyup', (e) => {
                const name = e.target.name;
                if (name === 'email') validateField(e.target, patterns.email);
                if (name === 'name') validateField(e.target, patterns.username);
                if (name === 'phone') validateField(e.target, patterns.phone);
                if (name === 'password') {
                    validateField(e.target, patterns.password);
                    const confirm = registerForm.querySelector('input[name="confirmPassword"]');
                    if (confirm.value) checkMatch(e.target, confirm);
                }
                if (name === 'confirmPassword') {
                    const mainPass = registerForm.querySelector('input[name="password"]');
                    checkMatch(mainPass, e.target);
                }
            });
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usernameValid = validateField(registerForm.querySelector('input[name="name"]'), patterns.username);
            const emailValid = validateField(registerForm.querySelector('input[name="email"]'), patterns.email);
            const passValid = validateField(registerForm.querySelector('input[name="password"]'), patterns.password);
            
            const passInput = registerForm.querySelector('input[name="password"]');
            const confirmInput = registerForm.querySelector('input[name="confirmPassword"]');
            const matchValid = checkMatch(passInput, confirmInput);

            const phoneInput = registerForm.querySelector('input[name="phone"]');
            let phoneValid = true;
            if (phoneInput.value) phoneValid = validateField(phoneInput, patterns.phone);

            if (!usernameValid || !emailValid || !passValid || !matchValid || !phoneValid) {
                showToast("Please fix the highlighted errors.", "error");
                return;
            }

            const btn = registerForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Creating Account...";
            btn.disabled = true;

            const username = registerForm.querySelector('input[name="name"]').value;
            const email = registerForm.querySelector('input[name="email"]').value;
            const phone = registerForm.querySelector('input[name="phone"]').value;
            const password = registerForm.querySelector('input[name="password"]').value;

            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, phone, password })
                });

                const data = await res.json();

                if (res.ok) {
                    showToast("Account created successfully! Please log in.", "success");
                    document.querySelector('[data-target="#login"]').click();
                    registerForm.reset();
                    inputs.forEach(i => i.className = '');
                } else {
                    showToast(data.message || "Registration failed.", "error");
                }
            } catch (err) {
                console.error("Register Error:", err);
                showToast("Server error. Please check your connection.", "error");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // === LOGIN FORM ===
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = "Logging in...";
            btn.disabled = true;

            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    showToast("Login successful! Redirecting...", "success");
                    setTimeout(() => {
                        window.location.href = 'Anime.html';
                    }, 1000);
                } else {
                    showToast(data.message || "Invalid credentials.", "error");
                }
            } catch (err) {
                console.error("Login Error:", err);
                showToast("Server connection failed.", "error");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }
});