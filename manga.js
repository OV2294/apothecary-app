document.addEventListener("DOMContentLoaded", async () => {

    // === 🔒 GATEKEEPER ===
    try {
        const authRes = await fetch('/auth/me', { credentials: 'include' });
        const authData = await authRes.json();

        if (!authData.loggedIn) {
            const mangaCard = document.querySelector('.manga-chapters-section');
            if (mangaCard) {
                mangaCard.innerHTML = `
                    <div class="login-lock-msg">
                        <h3>🔒 Manga Library Locked</h3>
                        <p>Please log in to access the chapter list.</p>
                        <a href="auth.html" class="login-lock-btn">Login to Read</a>
                    </div>
                `;
            }
            return;
        }
    } catch (err) { console.error(err); }
    // ====================

    const chaptersGrid = document.getElementById("chaptersGrid");
    if (!chaptersGrid) return;
    loadChapters();

    async function loadChapters() {
        try {
            const response = await fetch('/manga');
            const chapters = await response.json();
            chaptersGrid.innerHTML = '';
            chapters.forEach(chapter => {
                const tile = document.createElement("div");
                tile.className = "chapter-tile";
                tile.innerHTML = `<span>Chapter ${chapter.chapter_number}</span>`;
                tile.addEventListener("click", () => {
                    if (chapter.drive_link) {
                        window.location.href = `read.html?chapter=${chapter.chapter_number}`;
                    } else {
                        alert("Link not available yet.");
                    }
                });
                chaptersGrid.appendChild(tile);
            });
        } catch (error) {
            chaptersGrid.innerHTML = '<p style="color:#ff4b2b; padding:10px;">Server error.</p>';
        }
    }
});