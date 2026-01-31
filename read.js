document.addEventListener("DOMContentLoaded", async () => {

    // === 🔒 GATEKEEPER ===
    try {
        const authRes = await fetch('/auth/me', { credentials: 'include' });
        const authData = await authRes.json();
        if (!authData.loggedIn) {
            window.location.href = 'auth.html';
            return;
        }
    } catch (err) { console.error(err); }
    // ====================

    const params = new URLSearchParams(window.location.search);
    const chapterNum = params.get('chapter');
    
    const titleEl = document.getElementById('chapter-title');
    const iframeEl = document.getElementById('manga-frame');

    if (!chapterNum) {
        if (titleEl) titleEl.textContent = "Select a Chapter";
        return;
    }

    if (titleEl) titleEl.textContent = `Chapter ${chapterNum}`;

    try {
        const response = await fetch('/manga');
        
        if (response.status === 401) {
            window.location.href = 'auth.html';
            return;
        }

        const chapters = await response.json();
        const currentChapter = chapters.find(c => c.chapter_number.toString() === chapterNum);

        if (currentChapter && currentChapter.drive_link) {
            const previewLink = currentChapter.drive_link.replace(/\/view.*/, '/preview');
            if (iframeEl) iframeEl.src = previewLink;
        } else {
            if (titleEl) titleEl.textContent = "Chapter Link Not Found";
            if (iframeEl) iframeEl.style.display = 'none';
        }

    } catch (error) {
        console.error("Error loading chapter:", error);
        if (titleEl) titleEl.textContent = "Error loading content";
    }
});