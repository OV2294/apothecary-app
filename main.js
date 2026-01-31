document.addEventListener("DOMContentLoaded", async () => {
    const accountBtns = document.querySelectorAll('.user-icon, .account-btn, #logoacc, .nav_right a');
    const navImages = document.querySelectorAll('.user-icon img, img.user-icon');
    const continueSection = document.getElementById('continue-watching-section');
    const continueText = document.getElementById('continue-text');
    const continueBtn = document.getElementById('continue-btn');
    try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        const data = await res.json();

        if (data.loggedIn && navImages.length > 0) {
            const user = data.user;
            const newSrc = (user.avatar_id && user.avatar_id !== 'default') 
                ? user.avatar_id 
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=ffb26b&color=000&bold=true`;

            navImages.forEach(img => {
                img.src = newSrc;
                
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.objectFit = "cover";
            });
        }
    } catch (err) {
        console.error("Error loading navbar avatar:", err);
    }
    // Watch Progress
    if (continueSection) {
        fetch('/user/progress', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.continue) {
                    const { season, episode } = data.continue;
                    continueSection.style.display = "flex";
                    continueText.textContent = `Pick up where you left off: Season ${season}, Episode ${episode}`;
                    continueBtn.textContent = `Play S${season} E${episode}`;
                    continueBtn.href = `stream.html?season=${season}&ep=${episode}`;
                }
            })
            .catch(err => console.error("Error fetching progress:", err));
    }

    // Check Login 
    try {
        const res = await fetch('/auth/me', {
            credentials: 'include'
        });

        const data = await res.json();

        if (data.loggedIn) {
            const user = data.user;
            const initials = user.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

            accountBtns.forEach(btn => {
                const anchor = btn.tagName === 'A' ? btn : btn.closest('a');

                if (anchor) {
                    anchor.href = user.role === 'admin' ? 'admin.html' : 'user.html';

                    anchor.innerHTML = `<div class="initials-avatar">${initials}</div>`;
                    anchor.classList.remove('user-icon');
                }
            });
        }
    } catch (err) {
        console.error("Session check failed.", err);
    }
});

// Logout Function 
async function logout() {
    try {
        await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'auth.html';
    } catch (err) {
        console.error("Logout failed", err);
    }
}