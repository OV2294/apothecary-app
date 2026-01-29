document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch('/admin/data', { 
            credentials: 'include'
        });

        if (res.status === 403 || res.status === 401) {
            alert("Access Denied: Admins Only.");
            window.location.href = 'Anime.html';
            return;
        }

        const data = await res.json();

        // 1. Stats
        const initials = data.adminName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        document.getElementById('admin-initials').textContent = initials;
        document.getElementById('admin-name').textContent = data.adminName;
        document.getElementById('total-users').textContent = data.totalUsers;

        // 2. Users Table
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

        // 3. Feedback Table
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

        // 4. Comments Table
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
        console.error("Admin load error:", err);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => logout());
});