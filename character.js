// All character info
const CHARACTER_DATA = {
    maomao: {
        name: "Maomao",
        role: "Apothecary / Palace Maid",
        description:
            "Maomao is a sharp-minded apothecary from the pleasure district who is dragged into palace life against her will, yet quickly proves indispensable by calmly analyzing poisons, illnesses, and human motives. She dislikes standing out, prefers bitter medicine and strange experiments to romance, and often mutters under her breath while quietly saving nobles and servants who underestimate the small, freckled girl in plain clothes."
    },
    jinshi: {
        name: "Jinshi",
        role: "High-ranked Official",
        description:
            "Jinshi is a dazzlingly beautiful and powerful court official whose polished smile hides an anxious mind and a dangerous secret about his true status. He oversees much of the rear palace, juggles politics with charm and calculation, and finds himself both frustrated and fascinated by Maomao’s indifference to his looks, gradually dropping his mask around her more than anyone else."
    },
    gyokuyou: {
        name: "Gyokuyou",
        role: "Imperial Consort",
        description:
            "Gyokuyou is an imperial consort known for her gentle grace and unwavering devotion to her child, but beneath her soft demeanor lies a perceptive woman who quietly reads the currents of court politics. She values loyalty over flattery, treats her attendants with warmth, and becomes one of the first high‑ranking figures to recognize Maomao’s talent and give her protection within the treacherous inner palace."
    },
    lihua: {
        name: "Lihua",
        role: "Young Consort",
        description:
            "Lihua is a delicate young consort whose poor health and shy, hesitant speech make her easy to overlook, yet her feelings and vulnerabilities strongly influence those around her. As Maomao investigates the causes of Lihua’s ailments and setbacks, the girl’s quiet courage and yearning for genuine affection slowly emerge from behind the sickbed and etiquette masks imposed on her by the court."
    },
    gaoshun: {
        name: "Gaoshun",
        role: "Captain of the Imperial Guards",
        description:
            "Gaoshun is the steadfast captain of the Imperial Guards, rarely seen far from Jinshi’s side, where he handles logistics, security, and the headaches created by his master’s schemes. With a calm, stoic presence and sharp awareness of palace undercurrents, he quietly cleans up political and physical messes alike, respecting Maomao’s skills while worrying about the chaos that tends to follow her and Jinshi together."
    }
};

function setActiveCharacter(id) {
    const data = CHARACTER_DATA[id];
    if (!data) return;

    document.querySelectorAll(".character-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.id === id);
    });

    const infoPanel = document.querySelector('.character-info-panel');

    if (infoPanel) {
        infoPanel.style.opacity = '0';
        infoPanel.style.transition = 'opacity 0.2s ease';
    }

    setTimeout(() => {
        const nameEl = document.getElementById("info-name");
        const roleEl = document.getElementById("info-role");
        const descEl = document.getElementById("info-description");

        if (nameEl) nameEl.textContent = data.name;
        if (roleEl) roleEl.textContent = data.role;
        if (descEl) descEl.textContent = data.description;

        if (infoPanel) {
            infoPanel.style.opacity = '1';
        }
    }, 200);
}

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".character-item");

    items.forEach((item) => {
        const id = item.dataset.id;

        item.addEventListener("mouseenter", () => setActiveCharacter(id));
        item.addEventListener("focus", () => setActiveCharacter(id));
        item.addEventListener("click", () => setActiveCharacter(id));
    });

    // Initialize with Maomao active
    setActiveCharacter("maomao");
});