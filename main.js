document.addEventListener("DOMContentLoaded", async () => {
    const navImages = document.querySelectorAll('.user-icon img, img.user-icon');
    const accountLinks = document.querySelectorAll('a.user-icon, #logoacc, .nav_right a[href="auth.html"]');
    const continueSection = document.getElementById('continue-watching-section');
    const continueText = document.getElementById('continue-text');
    const continueBtn = document.getElementById('continue-btn');

    // AUTH CHECK 
    try {
        const res = await fetch('/auth/me?t=' + Date.now(), { credentials: 'include' });
        const data = await res.json();

        if (data.loggedIn && data.user) {
            const user = data.user;

            accountLinks.forEach(link => {
                link.href = (user.role === 'admin') ? 'admin.html' : 'user.html';
            });

            let finalSrc;
            if (user.avatar_id && user.avatar_id !== 'default') {
                finalSrc = user.avatar_id;
            } else {
                const name = user.username || "User";
                finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffb26b&color=000&bold=true`;
            }

            navImages.forEach(img => {
                img.src = finalSrc;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.objectFit = "cover";
            });
        }
    } catch (err) {
        console.error("Auth Check Error:", err);
    }

    // WATCH PROGRESS
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
});

// Logout Function 
async function logout() {
    try {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = 'auth.html';
    } catch (err) {
        console.error("Logout failed", err);
    }
}
