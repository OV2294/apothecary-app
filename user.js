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

    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        Toastify({ text: text, duration: 3000, style: { background: bg }, gravity: "top", position: "right" }).showToast();
    };

    // === 1. LOAD USER DATA ===
    try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        const data = await res.json();

        if (!data.loggedIn) {
            window.location.href = 'auth.html';
            return;
        }

        const user = data.user;

        document.getElementById('profile-name').textContent = user.username;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone || '';
        document.getElementById('fav-episode-display').textContent = user.favorite_episode || "No favorite episode saved yet.";

        if (user.avatar_id && user.avatar_id !== 'default') {
            document.getElementById('current-avatar').src = user.avatar_id;
        }

    } catch (err) {
        console.error("Error loading profile:", err);
    }

    // === 2. UPDATE PROFILE FORM ===
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = profileForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Saving...";
            btn.disabled = true;

            const username = document.getElementById('edit-username').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;
            const favText = document.getElementById('fav-episode-display').textContent;
            

            try {
                const res = await fetch('/auth/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        username, 
                        email, 
                        phone,
                        favorite_episode: (favText === "No favorite episode saved yet.") ? null : favText 
                    })
                });

                if (res.ok) {
                    showToast("Profile Updated Successfully!", "success");
                    document.getElementById('profile-name').textContent = username;
                    document.getElementById('profile-email').textContent = email;
                } else {
                    showToast("Update failed.", "error");
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
});

// === 3. AVATAR MODAL FUNCTIONS ===
function openAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'flex';
}

function closeAvatarModal() {
    document.getElementById('avatar-modal').style.display = 'none';
}

// === 4. HANDLE FILE UPLOAD (CUSTOM IMAGE) ===
function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
        alert("File too big! Please keep it under 500KB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        selectAvatar(base64Image); 
    };
    reader.readAsDataURL(file);
}

// === 5. SAVE AVATAR TO SERVER ===
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
        alert("Failed to save avatar. Please try again.");
    }
}

// === 6. LOGOUT FUNCTION ===
async function logout() {
    try {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = 'auth.html';
    } catch (err) {
        console.error("Logout failed", err);
    }
}