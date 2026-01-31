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
        if (typeof Toastify !== 'undefined') {
            let bg = type === 'error' ? "linear-gradient(to right, #ff5f6d, #ffc371)" : "linear-gradient(to right, #00b09b, #96c93d)";
            Toastify({ text: text, duration: 3000, style: { background: bg }, gravity: "top", position: "right" }).showToast();
        }
    };

    let currentUserData = {};

    // 1. LOAD DATA
    try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (!data.loggedIn) { window.location.href = 'auth.html'; return; }

        currentUserData = data.user;
        updateUI(currentUserData);
    } catch (err) { console.error(err); }

    // === UI UPDATER  ===
    function updateUI(user) {
        if (document.getElementById('display-name')) document.getElementById('display-name').textContent = user.username;
        if (document.getElementById('display-email')) document.getElementById('display-email').textContent = user.email;
        if (document.getElementById('display-phone')) document.getElementById('display-phone').textContent = user.phone || '...';

        if (document.getElementById('edit-username')) document.getElementById('edit-username').value = user.username;
        if (document.getElementById('edit-email')) document.getElementById('edit-email').value = user.email;
        if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = user.phone || '';

        // === AVATAR ===
        const avatarImg = document.getElementById('current-avatar');
        if (avatarImg) {
            if (user.avatar_id && user.avatar_id !== 'default') {
                avatarImg.src = user.avatar_id;
            } else {
                const name = user.username || "User";
                avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffb26b&color=000&size=200&font-size=0.5&bold=true`;
            }
        }

        const favDisplay = document.getElementById('display-fav-ep');
        const removeBtn = document.getElementById('remove-fav-btn');
        if (user.favorite_episode) {
            if (favDisplay) favDisplay.textContent = user.favorite_episode;
            if (removeBtn) removeBtn.style.display = 'inline-block';
        } else {
            if (favDisplay) favDisplay.textContent = "None set";
            if (removeBtn) removeBtn.style.display = 'none';
        }
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
    if (file.size > 500 * 1024) { alert("File too big (Max 500KB)"); return; }

    const reader = new FileReader();
    reader.onload = function (e) {
        saveAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
}

function resetToInitials() {
    saveAvatar('default');
}

async function saveAvatar(avatarData) {
    const bigProfileImg = document.getElementById('current-avatar');
    if (bigProfileImg) {
        bigProfileImg.src = (avatarData === 'default') 
            ? "https://ui-avatars.com/api/?name=User&background=ffb26b&color=000"
            : avatarData;
    }

    const navImages = document.querySelectorAll('.user-icon img, img.user-icon');
    

    const newNavSrc = (avatarData === 'default') ? "image/accicon.png" : avatarData;

    navImages.forEach(img => {
        img.src = newNavSrc;
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.borderRadius = "50%";
        img.style.objectFit = "cover";
    });

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
                avatar_id: avatarData
            })
        });

        if (avatarData === 'default') location.reload(); 

    } catch (err) {
        console.error("Failed to save avatar", err);
    }
}