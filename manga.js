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

    const chaptersGrid = document.getElementById("chaptersGrid");
    if (!chaptersGrid) return;

    loadChapters();

    async function loadChapters() {
        try {
            const response = await fetch('/manga'); 
            
            if (response.status === 401) {
                window.location.href = 'auth.html';
                return;
            }
            if (!response.ok) throw new Error('Failed to connect to server');

            const chapters = await response.json();
            chaptersGrid.innerHTML = '';

            if (chapters.length === 0) {
                chaptersGrid.innerHTML = '<p style="color:white; padding:10px;">No chapters found.</p>';
                return;
            }

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
            console.error("Error loading manga:", error);
            chaptersGrid.innerHTML = '<p style="color:#ff4b2b; padding:10px;">Server error.</p>';
        }
    }
});