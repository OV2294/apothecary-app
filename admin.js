document.addEventListener("DOMContentLoaded", async () => {
    await loadDashboardTables();

    await loadProfileSettings();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
});

//DASHBOARD
async function loadDashboardTables() {
    try {
        const res = await fetch('/admin/data', { credentials: 'include' });

        if (res.status === 403 || res.status === 401) {
            alert("Access Denied: Admins Only.");
            window.location.href = 'Anime.html';
            return;
        }

        const data = await res.json();

        const initials = data.adminName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const adminInitialsEl = document.getElementById('admin-initials');
        if (adminInitialsEl) adminInitialsEl.textContent = initials;
        
        document.getElementById('admin-name').textContent = data.adminName;
        document.getElementById('total-users').textContent = data.totalUsers;

        // Users Table
        const userTableBody = document.getElementById('users-table-body');
        if (userTableBody) {
            userTableBody.innerHTML = '';
            data.users.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(u => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>${u.phone || '-'}</td>
                    <td><span class="role-badge ${u.role}">${u.role}</span></td>
                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                `;
                userTableBody.appendChild(row);
            });
        }

        // Feedback Table
        const fbTableBody = document.getElementById('feedback-table-body');
        if (fbTableBody) {
            fbTableBody.innerHTML = data.feedback.length === 0 
                ? '<tr><td colspan="4" style="text-align:center;">No feedback found</td></tr>' 
                : '';
            data.feedback.forEach(f => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(f.created_at).toLocaleDateString()}</td>
                    <td>${f.name || 'Anon'}</td>
                    <td>${f.email || '-'}</td>
                    <td style="max-width: 300px; white-space: normal;">${f.message}</td>
                `;
                fbTableBody.appendChild(row);
            });
        }

        // Comments Table
        const commentsTableBody = document.getElementById('comments-table-body');
        if (commentsTableBody) {
            commentsTableBody.innerHTML = data.comments.length === 0 
                ? '<tr><td colspan="4" style="text-align:center;">No comments found</td></tr>' 
                : '';
            data.comments.forEach(c => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(c.created_at).toLocaleDateString()}</td>
                    <td>${c.username}</td>
                    <td>S${c.season} E${c.episode}</td>
                    <td style="max-width: 300px; white-space: normal;">${c.comment_text}</td>
                `;
                commentsTableBody.appendChild(row);
            });
        }
    } catch (err) {
        console.error("Admin tables load error:", err);
    }
}

//PROFILE
async function loadProfileSettings() {
    try {
        const res = await fetch('/auth/me?t=' + Date.now(), { credentials: 'include' });
        const data = await res.json();
        
        if (data.loggedIn && data.user) {
            const user = data.user;
            const userInp = document.getElementById('admin-username-input');
            const emailInp = document.getElementById('admin-email-input');
            const phoneInp = document.getElementById('admin-phone-input');
            
            if (userInp) userInp.value = user.username;
            if (emailInp) emailInp.value = user.email;
            if (phoneInp) phoneInp.value = user.phone || "";
            updateAdminAvatarUI(user.avatar_id, user.username);
        }
    } catch (err) {
        console.error("Admin profile settings load error:", err);
    }
}
function updateAdminAvatarUI(avatarId, username) {
    const settingsImg = document.getElementById('admin-settings-avatar');
    const headerCircle = document.getElementById('admin-initials');

    let finalSrc;
    let isImage = false;

    if (avatarId && avatarId !== 'default') {
        finalSrc = avatarId;
        isImage = true;
    } else {
        finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=ffb26b&color=000&bold=true`;
    }

    if (settingsImg) settingsImg.src = finalSrc;

    if (headerCircle) {
        if (isImage) {
            headerCircle.innerHTML = `<img src="${finalSrc}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            headerCircle.style.background = "transparent";
            headerCircle.style.border = "none";
        } else {
            const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            headerCircle.textContent = initials;
            headerCircle.style.background = "";
            headerCircle.style.border = ""; 
        }
    }
}

//AVATAR 

function openAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    if (modal) modal.style.display = "block";
}

function closeAvatarModal() {
    const modal = document.getElementById('avatar-modal');
    if (modal) modal.style.display = "none";
}

function handleAdminAvatarUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (e.total > 50 * 1024 * 1024) { 
                alert("File too large! Keep it under 50MB.");
                return;
            }
            saveAdminAvatar(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

//SAVE

async function saveAdminAvatar(avatarData) {
    const username = document.getElementById('admin-username-input').value || "Admin";
    updateAdminAvatarUI(avatarData, username);

    closeAvatarModal();
    
    await updateAdminProfile(avatarData);
}

async function updateAdminProfile(newAvatar = null) {
    const username = document.getElementById('admin-username-input').value;
    const email = document.getElementById('admin-email-input').value;
    const phone = document.getElementById('admin-phone-input').value;
    let avatarToSend = newAvatar;
    if (!avatarToSend) {
        const currentSrc = document.getElementById('admin-settings-avatar').src;
        if (currentSrc && currentSrc.startsWith('data:image')) {
            avatarToSend = currentSrc;
        } else {
            avatarToSend = "default";
        }
    }

    try {
        const res = await fetch('/auth/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                phone: phone,
                favorite_episode: null, 
                avatar_id: avatarToSend
            })
        });

        const result = await res.json();

        if (res.ok) {
            const navImages = document.querySelectorAll('.user-icon img, img.user-icon, #logoacc img');
            let finalSrc;

            if (avatarToSend && avatarToSend !== 'default') {
                finalSrc = avatarToSend;
            } else {
                finalSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=ffb26b&color=000&bold=true`;
            }

            navImages.forEach(img => {
                img.src = finalSrc;
            });


            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: "Profile Updated Successfully!",
                    duration: 3000,
                    style: { background: "#28a745" }
                }).showToast();
            } else {
                alert("Profile Updated Successfully!");
            }
            
            setTimeout(() => location.reload(), 1000); 

        } else {
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: "Update Failed: " + (result.message || "Unknown error"),
                    duration: 3000,
                    style: { background: "#dc3545" }
                }).showToast();
            } else {
                alert("Update failed");
            }
        }
    } catch (err) {
        console.error("Update error:", err);
    }
}