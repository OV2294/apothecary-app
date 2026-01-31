document.addEventListener("DOMContentLoaded", async () => {

    // === 🔒 GATEKEEPER ===
    try {
        const authRes = await fetch('/auth/me', { credentials: 'include' });
        const authData = await authRes.json();
        
        if (!authData.loggedIn) {
            const readerPage = document.querySelector('.reader-page');
            if (readerPage) {
                readerPage.innerHTML = `
                    <div class="login-lock-msg" style="margin-top: 100px;">
                        <h3>🔒 Chapter Locked</h3>
                        <p>You must be logged in to read this chapter.</p>
                        <a href="auth.html" class="login-lock-btn">Login to Continue</a>
                    </div>
                `;
            }
            return;
        }
    } catch (err) { console.error(err); }
    // ====================

    const params = new URLSearchParams(window.location.search);
    const chapterNum = params.get('chapter');
    const titleEl = document.getElementById('chapter-title');
    const iframeEl = document.getElementById('manga-frame');

    if (!chapterNum) { if (titleEl) titleEl.textContent = "Select a Chapter"; return; }
    if (titleEl) titleEl.textContent = `Chapter ${chapterNum}`;

    try {
        const response = await fetch('/manga');
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
        if (titleEl) titleEl.textContent = "Error loading content";
    }
});