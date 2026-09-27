/* =========================================
   SERVER SETTINGS
========================================= */

const serverIP = "162.55.100.208:58388";


/* =========================================
   ITEM DATABASE
========================================= */

const wikiItems = {

    "chestplate-of-rose-thorns": {
        name: "Chestplate of Rose Thorns",
        icon: "textures/rosechestplatetexture.png",
        type: "Armor",
        rarity: "Unknown",
        category: "Chestplate",
        owner: ".Lettyk2306",

        shortDescription:
            "A legendary chestplate covered in enchanted rose thorns.",

        description:
            "The Chestplate of Rose Thorns is a powerful piece of armor " +
            "infused with the magic of enchanted roses. Its thorns punish " +
            "enemies that attack the wearer, while its unbreakable nature " +
            "makes it a permanent piece of equipment.",

        uses: [
            "Protect the wearer from damage",
            "Reflect damage back to attackers",
            "Useful against melee enemies",
            "Cannot be broken"
        ],

        stats: {
            "Thorns": "V",
            "Durability": "Unbreakable",
            "Armor Type": "Chestplate"
        },

        recipe: [
            "", "", "",
            "", "", "",
            "", "", ""
        ]
    }

};


/* =========================================
   ENTITY DATABASE
========================================= */

const entities = [
];


/* =========================================
   GET ITEM FROM URL
========================================= */

function getItemFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("item");
}


/* =========================================
   CREATE HOMEPAGE ITEM CARDS
========================================= */

function createItemCards() {

    const container = document.getElementById("itemsGrid");

    if (!container) return;

    container.innerHTML = "";

    Object.entries(wikiItems).forEach(([id, item]) => {

        const card = document.createElement("a");

        card.className = "entry-card";
        card.href = `itemtemplate.html?item=${encodeURIComponent(id)}`;

        let iconHTML;

        if (item.icon.includes(".")) {
            iconHTML = `<img src="${item.icon}" alt="${item.name}">`;
        } else {
            iconHTML = item.icon;
        }

        card.innerHTML = `
            <div class="entry-icon">
                ${iconHTML}
            </div>

            <h3>${item.name}</h3>

            <p>${item.shortDescription}</p>
        `;

        card.style.textDecoration = "none";
        card.style.color = "inherit";

        container.appendChild(card);
    });
}


/* =========================================
   CREATE ENTITY CARDS
========================================= */

function createEntityCards() {

    const container = document.getElementById("entitiesGrid");

    if (!container) return;

    container.innerHTML = "";

    entities.forEach(entity => {

        const card = document.createElement("article");

        card.className = "entry-card";

        card.innerHTML = `
            <div class="entry-icon">
                ${entity.icon}
            </div>

            <h3>${entity.name}</h3>

            <p>${entity.description}</p>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   COPY SERVER IP
========================================= */

function setupCopyButton() {

    const button = document.getElementById("copyIp");

    if (!button) return;

    button.addEventListener("click", async () => {

        try {
            await navigator.clipboard.writeText(serverIP);

            button.textContent = "Copied!";

            setTimeout(() => {
                button.textContent = "Copy IP";
            }, 1500);

        } catch {
            button.textContent = "Copy failed";

            setTimeout(() => {
                button.textContent = "Copy IP";
            }, 1500);
        }
    });
}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    /* Build the results dropdown once */

    const resultsBox = document.createElement("div");
    resultsBox.className = "search-results";
    searchInput.parentElement.appendChild(resultsBox);

    function getMatches(query) {

        const q = query.toLowerCase();

        const itemMatches = Object.entries(wikiItems)
            .filter(([id, item]) =>
                item.name.toLowerCase().includes(q) ||
                item.shortDescription.toLowerCase().includes(q)
            )
            .map(([id, item]) => ({
                type: "Item",
                name: item.name,
                icon: item.icon,
                href: `itemtemplate.html?item=${encodeURIComponent(id)}`
            }));

        const entityMatches = entities
            .filter(entity =>
                entity.name.toLowerCase().includes(q) ||
                (entity.description || "").toLowerCase().includes(q)
            )
            .map(entity => ({
                type: "Entity",
                name: entity.name,
                icon: entity.icon,
                href: "index.html#entities"
            }));

        return [...itemMatches, ...entityMatches];
    }

    function renderResults(query) {

        resultsBox.innerHTML = "";

        if (!query) {
            resultsBox.classList.remove("active");
            return;
        }

        const matches = getMatches(query);

        if (matches.length === 0) {
            resultsBox.innerHTML =
                `<div class="search-empty">No results for "${query}"</div>`;
            resultsBox.classList.add("active");
            return;
        }

        matches.slice(0, 8).forEach(result => {

            const link = document.createElement("a");
            link.className = "search-result";
            link.href = result.href;

            const iconHTML =
                result.icon && result.icon.includes(".")
                    ? `<img src="${result.icon}" alt="${result.name}">`
                    : `<span>${result.icon || "?"}</span>`;

            link.innerHTML = `
                <div class="search-result-icon">${iconHTML}</div>
                <div class="search-result-info">
                    <strong>${result.name}</strong>
                    <span>${result.type}</span>
                </div>
            `;

            resultsBox.appendChild(link);
        });

        resultsBox.classList.add("active");
    }

    /* Live dropdown + inline card filtering on the homepage grids */

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.trim();

        renderResults(query);

        const search = query.toLowerCase();

        const cards = document.querySelectorAll(".entry-card");

        cards.forEach(card => {

            const text = card.textContent.toLowerCase();

            card.classList.toggle(
                "hidden",
                !text.includes(search)
            );

        });
    });

    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim()) {
            resultsBox.classList.add("active");
        }
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.parentElement.contains(event.target)) {
            resultsBox.classList.remove("active");
        }
    });
}


/* =========================================
   LOAD ITEM PAGE
========================================= */

function loadItemPage() {

    const itemID = getItemFromURL();

    if (!itemID) return;

    const item = wikiItems[itemID];

    if (!item) {

        document.title = "Item Not Found | Server Wiki";

        const name = document.getElementById("itemName");

        if (name) {
            name.textContent = "Item Not Found";
        }

        const description =
            document.getElementById("itemShortDescription");

        if (description) {
            description.textContent =
                "The item you are looking for does not exist.";
        }

        return;
    }

    document.title = `${item.name} | Server Wiki`;

    document.getElementById("itemTexture").src = item.icon;
    document.getElementById("itemTexture").alt = item.name;

    document.getElementById("itemName").textContent =
        item.name;

    document.getElementById("itemType").textContent =
        item.type;

    document.getElementById("itemShortDescription").textContent =
        item.shortDescription;

    document.getElementById("itemDescription").textContent =
        item.description;

    document.getElementById("itemRarity").textContent =
        item.rarity;

    document.getElementById("itemCategory").textContent =
        item.category;

    document.getElementById("itemOwner").textContent =
        item.owner;


    /* Uses */

    const usesContainer =
        document.getElementById("itemUses");

    usesContainer.innerHTML = "";

    item.uses.forEach(use => {

        const li = document.createElement("li");

        li.textContent = use;

        usesContainer.appendChild(li);
    });


    /* Stats */

    const statsContainer =
        document.getElementById("itemStats");

    statsContainer.innerHTML = "";

    Object.entries(item.stats).forEach(([name, value]) => {

        const stat = document.createElement("div");

        stat.innerHTML = `
            <span>${name}</span>
            <strong>${value}</strong>
        `;

        statsContainer.appendChild(stat);
    });


    /* Recipe */

    const recipeContainer =
        document.getElementById("recipe");

    recipeContainer.innerHTML = "";

    item.recipe.forEach(material => {

        const slot = document.createElement("div");
        slot.className = "recipe-slot";

        if (material && material.includes(".")) {
            slot.innerHTML = `<img src="${material}" alt="${item.name}">`;
        } else if (material) {
            slot.textContent = material;
        }

        recipeContainer.appendChild(slot);
    });
}


/* =========================================
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const serverIPElement =
        document.getElementById("serverIp");

    if (serverIPElement) {
        serverIPElement.textContent = serverIP;
    }

    createItemCards();
    createEntityCards();
    setupCopyButton();
    setupSearch();
    loadItemPage();

});
