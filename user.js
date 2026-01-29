document.addEventListener("DOMContentLoaded", async () => {

    // === TOAST HELPER ===
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

    const nameEl = document.getElementById('display-name');
    const emailEl = document.getElementById('display-email');
    const phoneEl = document.getElementById('display-phone'); 
    const favEpEl = document.getElementById('display-fav-ep');
    const removeFavBtn = document.getElementById('remove-fav-btn'); 
    const initialsEl = document.getElementById('profile-initials');
    
    const editNameIn = document.getElementById('edit-username');
    const editEmailIn = document.getElementById('edit-email');
    const editPhoneIn = document.getElementById('edit-phone'); 

    // --- 1. Profile Data ---
    try {
        const res = await fetch('/auth/me', { 
            credentials: 'include' 
        });
        const data = await res.json();

        if (!data.loggedIn) {
            window.location.href = 'auth.html'; 
            return;
        }

        const user = data.user;

        if(nameEl) nameEl.textContent = user.username;
        if(emailEl) emailEl.textContent = user.email;
        if(phoneEl) phoneEl.textContent = user.phone || "Not set";
        
        updateFavoriteDisplay(user.favorite_episode);

        if(initialsEl) {
            initialsEl.textContent = user.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

        if(editNameIn) editNameIn.value = user.username;
        if(editEmailIn) editEmailIn.value = user.email;
        if(editPhoneIn) editPhoneIn.value = user.phone || "";

    } catch (err) {
        showToast("Error loading profile data", "error");
    }

    // --- 2. Favorite UI ---
    function updateFavoriteDisplay(favString) {
        if (!favEpEl) return;
        
        if (favString) {
            favEpEl.textContent = favString;
            favEpEl.style.color = "#ffb26b"; 
            if (removeFavBtn) removeFavBtn.style.display = "block"; 
        } else {
            favEpEl.textContent = "None set";
            favEpEl.style.color = "rgba(255,255,255,0.5)"; 
            if (removeFavBtn) removeFavBtn.style.display = "none"; 
        }
    }

    // --- 3. Remove Favorite ---
    if (removeFavBtn) {
        removeFavBtn.addEventListener('click', async () => {
            if (!confirm("Are you sure you want to remove this favorite?")) return;

            try {
                const res = await fetch('/auth/set-favorite', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ favoriteString: null })
                });

                if (res.ok) {
                    updateFavoriteDisplay(null);
                    showToast("Favorite removed successfully.", "info");
                }
            } catch (err) {
                showToast("Failed to remove favorite.", "error");
            }
        });
    }

    // --- 4. Profile Update ---
    const editForm = document.getElementById('edit-profile-form');
    if(editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newName = editNameIn.value;
            const newEmail = editEmailIn.value;
            const newPhone = editPhoneIn.value;

            try {
                const res = await fetch('/auth/update', { 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include', 
                    body: JSON.stringify({ 
                        username: newName, 
                        email: newEmail, 
                        phone: newPhone,
                        favorite_episode: favEpEl.textContent === "None set" ? null : favEpEl.textContent
                    })
                });

                if(res.ok) {
                    showToast("Profile updated successfully!", "success");
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast("Failed to update profile.", "error");
                }
            } catch (err) {
                showToast("Connection error.", "error");
            }
        });
    }

    // --- 5. Logout ---
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => logout());
    }
});