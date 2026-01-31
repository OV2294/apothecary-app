// document.addEventListener("DOMContentLoaded", async () => {

//     // === TOAST HELPER ===
//     const showToast = (text, type = 'info') => {
//         let bg = "#333";
//         if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
//         if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        
//         Toastify({
//             text: text,
//             duration: 3000,
//             style: { background: bg },
//             gravity: "top",
//             position: "right"
//         }).showToast();
//     };

//     const nameEl = document.getElementById('display-name');
//     const emailEl = document.getElementById('display-email');
//     const phoneEl = document.getElementById('display-phone'); 
//     const favEpEl = document.getElementById('display-fav-ep');
//     const removeFavBtn = document.getElementById('remove-fav-btn'); 
//     const initialsEl = document.getElementById('profile-initials');
    
//     const editNameIn = document.getElementById('edit-username');
//     const editEmailIn = document.getElementById('edit-email');
//     const editPhoneIn = document.getElementById('edit-phone'); 

//     // --- 1. Profile Data ---
//     try {
//         const res = await fetch('/auth/me', { 
//             credentials: 'include' 
//         });
//         const data = await res.json();

//         if (!data.loggedIn) {
//             window.location.href = 'auth.html'; 
//             return;
//         }

//         const user = data.user;

//         if(nameEl) nameEl.textContent = user.username;
//         if(emailEl) emailEl.textContent = user.email;
//         if(phoneEl) phoneEl.textContent = user.phone || "Not set";
        
//         updateFavoriteDisplay(user.favorite_episode);

//         if(initialsEl) {
//             initialsEl.textContent = user.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//         }

//         if(editNameIn) editNameIn.value = user.username;
//         if(editEmailIn) editEmailIn.value = user.email;
//         if(editPhoneIn) editPhoneIn.value = user.phone || "";

//     } catch (err) {
//         showToast("Error loading profile data", "error");
//     }

//     // --- 2. Favorite UI ---
//     function updateFavoriteDisplay(favString) {
//         if (!favEpEl) return;
        
//         if (favString) {
//             favEpEl.textContent = favString;
//             favEpEl.style.color = "#ffb26b"; 
//             if (removeFavBtn) removeFavBtn.style.display = "block"; 
//         } else {
//             favEpEl.textContent = "None set";
//             favEpEl.style.color = "rgba(255,255,255,0.5)"; 
//             if (removeFavBtn) removeFavBtn.style.display = "none"; 
//         }
//     }

//     // --- 3. Remove Favorite ---
//     if (removeFavBtn) {
//         removeFavBtn.addEventListener('click', async () => {
//             if (!confirm("Are you sure you want to remove this favorite?")) return;

//             try {
//                 const res = await fetch('/auth/set-favorite', { 
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     credentials: 'include',
//                     body: JSON.stringify({ favoriteString: null })
//                 });

//                 if (res.ok) {
//                     updateFavoriteDisplay(null);
//                     showToast("Favorite removed successfully.", "info");
//                 }
//             } catch (err) {
//                 showToast("Failed to remove favorite.", "error");
//             }
//         });
//     }

//     // --- 4. Profile Update ---
//     const editForm = document.getElementById('edit-profile-form');
//     if(editForm) {
//         editForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
            
//             const newName = editNameIn.value;
//             const newEmail = editEmailIn.value;
//             const newPhone = editPhoneIn.value;

//             try {
//                 const res = await fetch('/auth/update', { 
//                     method: 'POST',
//                     headers: {'Content-Type': 'application/json'},
//                     credentials: 'include', 
//                     body: JSON.stringify({ 
//                         username: newName, 
//                         email: newEmail, 
//                         phone: newPhone,
//                         favorite_episode: favEpEl.textContent === "None set" ? null : favEpEl.textContent
//                     })
//                 });

//                 if(res.ok) {
//                     showToast("Profile updated successfully!", "success");
//                     setTimeout(() => window.location.reload(), 1500);
//                 } else {
//                     showToast("Failed to update profile.", "error");
//                 }
//             } catch (err) {
//                 showToast("Connection error.", "error");
//             }
//         });
//     }

//     // --- 5. Logout ---
//     const logoutBtn = document.getElementById('logout-btn');
//     if(logoutBtn) {
//         logoutBtn.addEventListener('click', () => logout());
//     }
// });
document.addEventListener("DOMContentLoaded", async () => {

    // === TOAST HELPER ===
    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        if (typeof Toastify !== 'undefined') {
            Toastify({ text: text, duration: 3000, style: { background: bg }, gravity: "top", position: "right" }).showToast();
        } else {
            console.log(text); 
        }
    };

    let currentUserData = {}; 

    // === 1. LOAD USER DATA ===
    try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        const data = await res.json();

        if (!data.loggedIn) {
            window.location.href = 'auth.html';
            return;
        }

        currentUserData = data.user;
        updateUI(currentUserData);

    } catch (err) {
        console.error("Error loading profile:", err);
    }

    // === UPDATE UI ===
    function updateUI(user) {
        const nameDisplay = document.getElementById('display-name');
        if (nameDisplay) nameDisplay.textContent = user.username;
        
        const emailDisplay = document.getElementById('display-email');
        if (emailDisplay) emailDisplay.textContent = user.email;

        const phoneDisplay = document.getElementById('display-phone');
        if (phoneDisplay) phoneDisplay.textContent = user.phone || 'Not set';

        // 2. Edit Form
        const nameInput = document.getElementById('edit-username');
        if (nameInput) nameInput.value = user.username;

        const emailInput = document.getElementById('edit-email');
        if (emailInput) emailInput.value = user.email;

        const phoneInput = document.getElementById('edit-phone');
        if (phoneInput) phoneInput.value = user.phone || '';

        // 3. Avatar
        const avatarImg = document.getElementById('current-avatar');
        if (avatarImg && user.avatar_id && user.avatar_id !== 'default') {
            avatarImg.src = user.avatar_id;
        }

        // 4. Favorite Episode
        const favDisplay = document.getElementById('display-fav-ep');
        const removeBtn = document.getElementById('remove-fav-btn');
        
        if (user.favorite_episode) {
            if (favDisplay) favDisplay.textContent = user.favorite_episode;
            if (removeBtn) removeBtn.style.display = 'inline-block';
        } else {
            if (favDisplay) favDisplay.textContent = "No favorite episode set";
            if (removeBtn) removeBtn.style.display = 'none';
        }
    }

    // === 2. PROFILE EDIT===
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = editForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = "Saving...";
            btn.disabled = true;

            const username = document.getElementById('edit-username').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            
            try {
                const res = await fetch('/auth/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        username, 
                        email, 
                        phone,
                       
                        favorite_episode: currentUserData.favorite_episode,
                        avatar_id: currentUserData.avatar_id
                    })
                });

                if (res.ok) {
                    showToast("Profile Updated Successfully!", "success");
                    
                    currentUserData.username = username;
                    currentUserData.email = email;
                    currentUserData.phone = phone;
                    updateUI(currentUserData);
                } else {
                    const errData = await res.json();
                    showToast(errData.message || "Update failed.", "error");
                }
            } catch (err) {
                console.error(err);
                showToast("Server error.", "error");
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // === 3. REMOVE FAVORITE  ===
    const removeFavBtn = document.getElementById('remove-fav-btn');
    if (removeFavBtn) {
        removeFavBtn.addEventListener('click', async (e) => {
            e.preventDefault(); 
            if(!confirm("Remove this from your favorites?")) return;

            try {
                const res = await fetch('/auth/set-favorite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ favoriteString: null }) 
                });

                if (res.ok) {
                    showToast("Favorite removed.", "success");
                    currentUserData.favorite_episode = null;
                    updateUI(currentUserData);
                }
            } catch (err) {
                showToast("Failed to remove favorite.", "error");
            }
        });
    }

    // === 4. LOGOUT BUTTON ===
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
                window.location.href = 'auth.html';
            } catch (err) {
                console.error("Logout failed", err);
            }
        });
    }
});


function openAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'flex';
}

function closeAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'none';
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
        alert("File too big! Please keep it under 500KB.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        selectAvatar(e.target.result); 
    };
    reader.readAsDataURL(file);
}

async function selectAvatar(url) {
    document.getElementById('current-avatar').src = url;
    closeAvatarModal();

    try {
        const meRes = await fetch('/auth/me');
        const meData = await meRes.json();
        const user = meData.user;

        await fetch('/auth/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                phone: user.phone,
                favorite_episode: user.favorite_episode,
                avatar_id: url 
            })
        });
        
    } catch (err) {
        console.error("Failed to save avatar", err);
    }
}