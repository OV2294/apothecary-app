document.addEventListener("DOMContentLoaded", async () => {
    const accountBtns = document.querySelectorAll('.user-icon, .account-btn, #logoacc, .nav_right a');
    const navImages = document.querySelectorAll('.user-icon img, img.user-icon');
    const continueSection = document.getElementById('continue-watching-section');
    const continueText = document.getElementById('continue-text');
    const continueBtn = document.getElementById('continue-btn');
    // try {
    //     const res = await fetch('/auth/me', { credentials: 'include' });
    //     const data = await res.json();

    //     if (data.loggedIn && navImages.length > 0) {
    //         const user = data.user;
    //         navImages.forEach(img => {
    //             if (user.avatar_id && user.avatar_id !== 'default') {
    //                 img.src = user.avatar_id;
    //             } else {
    //                 const name = user.username || "User";
    //                 img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffb26b&color=000&bold=true`;
    //             }
    //             img.style.width = "40px";
    //             img.style.height = "40px";
    //             img.style.borderRadius = "50%";
    //             img.style.objectFit = "cover";
    //         });
    //     }
    // } catch (err) {
    //     console.error("Navbar Error:", err);
    // }
    try {
        const res = await fetch('/auth/me?t=' + Date.now());
        const data = await res.json();
        
        if (data.loggedIn && data.user) {
            const user = data.user;

            let finalSrc;
            if (user.avatar_id && user.avatar_id !== 'default') {
                finalSrc = user.avatar_id;
            } else {
                const name = user.username || "User";
                finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffb26b&color=000&bold=true`;
            }

            navImages.forEach(img => {
                img.onerror = null; 
                
                img.src = finalSrc;
                img.style.width = "40px";
                img.style.height = "40px";
                img.style.borderRadius = "50%";
                img.style.objectFit = "cover";
            });
        }
    } catch (err) {
        console.error("Navbar Error:", err);
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