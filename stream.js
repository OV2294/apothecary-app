document.addEventListener("DOMContentLoaded", async () => {

    // === 🔒 GATEKEEPER ===
    try {
        const authRes = await fetch('/auth/me', { credentials: 'include' });
        const authData = await authRes.json();
        
        if (!authData.loggedIn) {
            
            const mainSection = document.querySelector('.stream-page');
            if (mainSection) {
                mainSection.innerHTML = `
                    <div class="login-lock-msg">
                        <h3>⚠️ Login Required</h3>
                        <p>You need to be logged in to watch full episodes and comment.</p>
                        <a href="auth.html" class="login-lock-btn">Login to Watch</a>
                    </div>
                `;
            }
            return; 
        }
    } catch (err) {
        console.error("Auth check failed", err);
    }

    const showToast = (text, type = 'info') => {
        let bg = "#333";
        if (type === 'success') bg = "linear-gradient(to right, #00b09b, #96c93d)";
        if (type === 'error') bg = "linear-gradient(to right, #ff5f6d, #ffc371)";
        if (type === 'favorite') bg = "linear-gradient(to right, #ff9a3c, #ff4b2b)";
        Toastify({ text: text, duration: 3000, style: { background: bg }, gravity: "top", position: "right" }).showToast();
    };

    const seasonButtons = document.querySelectorAll(".season-btn");
    const episodesContainer = document.getElementById("episodes-container");
    const episodesTitle = document.getElementById("episodes-title");
    const iframe = document.getElementById("video-frame");
    const placeholder = document.getElementById("video-placeholder");
    const favBtn = document.getElementById("fav-btn");
    const favIcon = document.getElementById("fav-icon");
    const favText = document.querySelector(".fav-text");
    const commentForm = document.getElementById("commentForm");
    const commentsList = document.getElementById("commentsList");

    const params = new URLSearchParams(window.location.search);
    let currentSeason = parseInt(params.get("season") || "1", 10);
    let currentEpisode = parseInt(params.get("ep") || "1", 10);
    let userFavoriteString = null;

    fetchUserFavorite();
    setActiveSeasonButton();
    loadEpisodes(currentSeason);
    loadComments(currentSeason, currentEpisode);

    async function fetchUserFavorite() {
        try {
            const res = await fetch('/auth/me', { credentials: 'include' });
            const data = await res.json();
            if (data.loggedIn) userFavoriteString = data.user.favorite_episode;
            updateFavoriteUI();
        } catch (err) { console.error(err); }
    }

    function updateFavoriteUI() {
        if (!favBtn) return;
        const currentEpString = `Season ${currentSeason} Ep ${currentEpisode}`;
        if (userFavoriteString === currentEpString) {
            favBtn.classList.add("is-favorite");
            favIcon.textContent = "♥";
            if (favText) favText.textContent = "Saved as Favorite";
        } else {
            favBtn.classList.remove("is-favorite");
            favIcon.textContent = "♡";
            if (favText) favText.textContent = "Mark as Favorite";
        }
    }

    seasonButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentSeason = parseInt(btn.dataset.season, 10);
            currentEpisode = 1;
            setActiveSeasonButton();
            loadEpisodes(currentSeason);
            loadComments(currentSeason, currentEpisode);
        });
    });

    function setActiveSeasonButton() {
        seasonButtons.forEach((btn) => {
            btn.classList.toggle("active", parseInt(btn.dataset.season) === currentSeason);
        });
        if (episodesTitle) episodesTitle.textContent = `Season ${currentSeason} Episodes`;
    }

    async function loadEpisodes(season) {
        try {
            const res = await fetch(`/episodes?season=${season}`);
            const episodes = await res.json();
            episodesContainer.innerHTML = "";
            episodes.forEach((ep) => {
                const btn = document.createElement("button");
                btn.className = "episode-btn";
                btn.textContent = `EP ${ep.episode}`;
                if (ep.episode === currentEpisode) {
                    btn.classList.add("active");
                    playVideo(ep.drive_link);
                }
                btn.addEventListener("click", () => {
                    document.querySelectorAll(".episode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    currentEpisode = ep.episode;
                    playVideo(ep.drive_link);
                    loadComments(currentSeason, currentEpisode);
                    updateFavoriteUI();
                    saveProgress(currentSeason, currentEpisode);
                });
                episodesContainer.appendChild(btn);
            });
        } catch (err) { showToast("Could not load episodes", "error"); }
    }

    function playVideo(link) {
        if (!link) {
            iframe.style.display = "none";
            placeholder.style.display = "block";
            return;
        }
        const previewLink = link.replace(/\/view.*/, '/preview');
        iframe.src = previewLink;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }

    if (favBtn) {
        favBtn.addEventListener("click", async () => {
            const currentEpString = `Season ${currentSeason} Ep ${currentEpisode}`;
            const payload = (userFavoriteString === currentEpString) ? null : currentEpString;
            try {
                const res = await fetch('/auth/set-favorite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ favoriteString: payload })
                });
                const data = await res.json();
                if (res.ok) {
                    userFavoriteString = data.favorite;
                    updateFavoriteUI();
                    showToast(payload ? "Saved to favorites!" : "Removed from favorites", "favorite");
                }
            } catch (err) { showToast("Error updating favorite", "error"); }
        });
    }

    async function loadComments(season, episode) {
        try {
            const res = await fetch(`/comments?season=${season}&episode=${episode}`);
            const comments = await res.json();
            commentsList.innerHTML = "";
            comments.forEach(c => {
                const li = document.createElement("li");
                li.className = "comment-item";
                li.innerHTML = `<div class="comment-meta">${c.username} • ${new Date(c.created_at).toLocaleDateString()}</div><div>${c.comment_text}</div>`;
                commentsList.appendChild(li);
            });
        } catch (err) { console.error("Comments error", err); }
    }

    if (commentForm) {
        commentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("comment-name").value || "Anonymous";
            const text = document.getElementById("comment-text").value;
            if (!text) return;
            try {
                await fetch('/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: name, comment: text, season: currentSeason, episode: currentEpisode })
                });
                document.getElementById("comment-text").value = "";
                showToast("Comment posted!", "success");
                loadComments(currentSeason, currentEpisode);
            } catch (err) { showToast("Failed to post comment", "error"); }
        });
    }
});

async function saveProgress(season, episode) {
    try {
        await fetch('/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ season, episode })
        });
    } catch (err) { console.error("Failed to save progress", err); }
}