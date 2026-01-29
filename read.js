document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const chapterNum = params.get('chapter');
    
    const titleEl = document.getElementById('chapter-title');
    const iframeEl = document.getElementById('manga-frame');
    const backBtn = document.querySelector('.back-btn');

    if (!chapterNum) {
        if (titleEl) titleEl.textContent = "Select a Chapter";
        return;
    }

    if (titleEl) titleEl.textContent = `Chapter ${chapterNum}`;

    try {
        const response = await fetch('/manga'); 
        
        if (!response.ok) {
            throw new Error('Could not connect to server');
        }

        const chapters = await response.json();

        const currentChapter = chapters.find(c => c.chapter_number.toString() === chapterNum);

        if (currentChapter && currentChapter.drive_link) {
            const previewLink = currentChapter.drive_link.replace(/\/view.*/, '/preview');
            
            if (iframeEl) {
                iframeEl.src = previewLink;
            }
        } else {
            if (titleEl) titleEl.textContent = "Chapter Link Not Found";
            if (iframeEl) iframeEl.style.display = 'none';
        }

    } catch (error) {
        console.error("Error loading chapter:", error);
        if (titleEl) titleEl.textContent = "Error loading content";
    }
});