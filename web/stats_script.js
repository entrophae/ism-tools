const statsConfig = [
    {
        title: "General",
        id: "general_",
        type: "standard",
        fields: ["Max Stage", "Max Level", "Max Sword Lvl", "Skill Points", "Swords bought", "Sword cost", "Total Damage", "Total Power", "Movement Speed", "Attack Speed", "Attack Range"],
        fieldIds: ["stage", "level", "max_ssl", "skill_points", "swords_bought", "sword_cost", "total_damage", "total_power", "movement_speed", "attack_speed", "attack_range"]
    },
    {
        title: "Skill Levels",
        id: "skill_",
        type: "standard",
        fields: ["Damage", "Gold", "XP", "Sword Spawn", "Ancient Bars", "Attack Range", "Attack Speed", "Movement Speed"],
        fieldIds: ["damage", "gold", "xp", "ssl", "ancient_bars", "attack_range", "attack_speed", "movement_speed"]
    },
    {
        title: "Pet Boosts",
        id: "pet_",
        type: "standard",
        fields: ["Damage", "Gold", "XP", "Attack Speed", "Movement Speed", "Attack Range", "Sword Cost", "Sword Spawn"],
        fieldIds: ["damage", "gold", "xp", "attack_speed", "movement_speed", "attack_range", "sword_cost", "ssl"]
    },
    {
        title: "Fairy Levels",
        id: "fairy_",
        type: "grid",
        count: 24,
        prefix: "Fairy"
    },
    {
        title: "Artifact Levels",
        id: "artifact_",
        type: "standard",
        fields: ["Damage", "Gold", "XP", "Sword Spawn", "Ancient Bars", "Attack Range"],
        fieldIds: ["damage", "gold", "xp", "ssl", "ancient_bars", "attack_range"]
    },
    {
        title: "Lucky Clovers",
        id: "lucky_",
        type: "standard",
        fields: ["Golden Clover", "Fortune Cat", "Lucky Penny", "Premium Pack"],
        fieldIds: ["golden_clover", "fortune_cat", "lucky_penny", "premium_pack"]
    },
    {
        title: "Elve Tree: Spell Levels",
        id: "spells_",
        type: "standard",
        fields: ["Fire (HP)", "Fortune (Gold)", "Nature (XP)", "Frostbound (Bars)"],
        fieldIds: ["fire", "fortune", "nature", "frostbound"]
    },
    {
        title: "Library: Relic Boosts",
        id: "relicts_",
        type: "standard",
        fields: ["Damage in %", "Gold in %", "XP in %", "Ancient Bars in %", "Sword Spawn +"],
        fieldIds: ["damage", "gold", "xp", "ancient_bars", "ssl"]
    },
    {
        title: "Forge: Shield",
        id: "shield_",
        type: "forge",
        baseFields: ["Sword Spawn"],
        fieldIds: ["ssl"],
        slotCount: 10
    }
];

function renderStats() {
    const container = document.getElementById('stats-container');
    if (!container) return;

    statsConfig.forEach(group => {
        const details = document.createElement('details');
        details.className = 'stat-group';

        const summary = document.createElement('summary');
        summary.className = 'group-header';
        summary.textContent = group.title;
        details.appendChild(summary);

        const content = document.createElement('div');
        content.className = 'group-content';

        if (group.type === 'standard') {
            group.fields.forEach((field, index) => {
                let specificId = group.fieldIds[index]; 
                content.innerHTML += `
                    <div class="list-row">
                        <div class="row-info"><label>${field}:</label></div>
                        <input id="${group.id}${specificId}" type="number" value="0" class="stat-input">
                    </div>`;
            });
        } 
        
        else if (group.type === 'grid') {
            const tiers = ["bg-common", "bg-uncommon", "bg-rare", "bg-epic", "bg-legendary", "bg-mythic"];
            let gridHTML = `<div class="grid-4col">`;
            for (let i = 1; i <= group.count; i++) {
                let tierIndex = Math.ceil(i / 4) - 1;
                let tierClass = tiers[tierIndex];
                gridHTML += `
                    <div class="list-row flex-col-stretch ${tierClass}">
                        <div class="row-info text-xs">${group.prefix} ${i}</div>
                        <input id="${group.id}${i}" type="number" value="0" class="stat-input input-full-center">
                    </div>`;
            }
            gridHTML += `</div>`;
            content.innerHTML += gridHTML;
        }
        
        else if (group.type === 'forge') {
            group.baseFields.forEach((field, index) => {
                let specificId = group.fieldIds[index];
                content.innerHTML += `
                    <div class="list-row">
                        <div class="row-info"><label>${field}:</label></div>
                        <input id="${group.id}${specificId}" type="number" value="0" class="stat-input">
                    </div>`;
            });
            let forgeGridHTML = `<div class="grid-2col-mt">`;

            for (let i = 1; i <= group.slotCount; i++) {
                forgeGridHTML += `
                    <div class="list-row slot-container slot-box" id="${group.id}slot_${i}_container">
                        <div class="forge-selection">
                            <span class="slot-lock lock-icon" onclick="toggleSlotLock(this)">🔓</span>
                            <button id="${group.id}slot_${i}_btn_hp" data-type="hp" class="btn-sq active" onclick="selectForge(this)">HP</button>
                            <button id="${group.id}slot_${i}_btn_xp" data-type="xp" class="btn-sq" onclick="selectForge(this)">XP</button>
                            <button id="${group.id}slot_${i}_btn_gld" data-type="gold" class="btn-sq" onclick="selectForge(this)">GLD</button>
                            <button id="${group.id}slot_${i}_btn_bar" data-type="bars" class="btn-sq" onclick="selectForge(this)">BAR</button>
                        </div>
                        <div>
                            <label>Slot ${i}:</label>
                            <input id="${group.id}slot_${i}_lv" type="number" value="0" class="stat-input">
                        </div>
                    </div>`;
            }
            forgeGridHTML += `</div>`;
            content.innerHTML += forgeGridHTML;
        }

        details.appendChild(content);
        container.appendChild(details);
    });
}

function toggleSlotLock(lockEl) {
    const isLocked = lockEl.textContent === '🔒';
    lockEl.textContent = isLocked ? '🔓' : '🔒';

    const container = lockEl.closest('.slot-container');
    const elements = container.querySelectorAll('input, button:not(.slot-lock)');
    
    elements.forEach(el => {
        el.disabled = !isLocked;
        container.style.opacity = !isLocked ? '0.6' : '1';
        container.style.pointerEvents = !isLocked ? 'none' : 'auto';
    });

    lockEl.parentElement.style.pointerEvents = 'auto';

    saveToLocalStorage();
}

function selectForge(btn) {
    if (btn.disabled) return; 
    const parent = btn.parentElement;
    parent.querySelectorAll('.btn-sq').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    saveToLocalStorage();
}

function gatherAllData() {
    let saveData = {};

    statsConfig.forEach(group => {
        let groupKey = group.id.replace('_', ''); 
        saveData[groupKey] = {};

        if (group.type === 'standard') {
            group.fields.forEach((field, index) => {
                let specificId = group.fieldIds[index];
                let inputElement = document.getElementById(`${group.id}${specificId}`);
                saveData[groupKey][specificId] = Number(inputElement.value) || 0;
            });
        } 
        
        else if (group.type === 'grid') {
            saveData[groupKey].levels = {}; 
            for (let i = 1; i <= group.count; i++) {
                let inputElement = document.getElementById(`${group.id}${i}`);
                saveData[groupKey].levels[`${group.prefix.toLowerCase()}_${i}`] = Number(inputElement.value) || 0;
            }
        }
        
        else if (group.type === 'forge') {
            group.baseFields.forEach((field, index) => {
                let specificId = group.fieldIds[index];
                let inputElement = document.getElementById(`${group.id}${specificId}`);
                saveData[groupKey][specificId] = Number(inputElement.value) || 0;
            });

            saveData[groupKey].slots = [];
            for (let i = 1; i <= group.slotCount; i++) {
                let container = document.getElementById(`${group.id}slot_${i}_container`);
                
                let levelInput = document.getElementById(`${group.id}slot_${i}_lv`);
                let levelVal = Number(levelInput.value) || 0;

                let lockIcon = container.querySelector('.slot-lock');
                let isLocked = lockIcon.textContent === '🔒';

                let activeBtn = container.querySelector('.btn-sq.active');
                let statType = activeBtn ? activeBtn.getAttribute('data-type') : "none";

                if (isLocked || levelVal === 0) {
                    levelVal = 0;
                    statType = "none";
                }

                saveData[groupKey].slots.push({
                    slot_number: i,
                    stat_type: statType,
                    level: levelVal
                });
            }
        }
    });

    return saveData;
}

function saveToLocalStorage() {
    let data = gatherAllData();
    localStorage.setItem('ismToolsData', JSON.stringify(data));
    
    window.dispatchEvent(new Event('ismDataUpdated'));
}

function loadFromLocalStorage() {
    const savedString = localStorage.getItem('ismToolsData');
    if (!savedString) return;
    
    const data = JSON.parse(savedString);

    statsConfig.forEach(group => {
        let groupKey = group.id.replace('_', '');
        if (!data[groupKey]) return;

        if (group.type === 'standard' || group.type === 'forge') {
            (group.fields || group.baseFields).forEach((field, index) => {
                let specificId = group.fieldIds[index];
                let el = document.getElementById(`${group.id}${specificId}`);
                if (el && data[groupKey][specificId] !== undefined) {
                    el.value = data[groupKey][specificId];
                }
            });
        } 
        
        if (group.type === 'grid' && data[groupKey].levels) {
            for (let i = 1; i <= group.count; i++) {
                let el = document.getElementById(`${group.id}${i}`);
                let key = `${group.prefix.toLowerCase()}_${i}`;
                if (el && data[groupKey].levels[key] !== undefined) {
                    el.value = data[groupKey].levels[key];
                }
            }
        }

        if (group.type === 'forge' && data[groupKey].slots) {
            data[groupKey].slots.forEach(slot => {
                let lvEl = document.getElementById(`${group.id}slot_${slot.slot_number}_lv`);
                if (lvEl) lvEl.value = slot.level;

                if (slot.stat_type && slot.stat_type !== 'none') {
                    let container = document.getElementById(`${group.id}slot_${slot.slot_number}_container`);
                    if (container) {
                        container.querySelectorAll('.btn-sq').forEach(b => b.classList.remove('active'));
                        let activeBtn = container.querySelector(`.btn-sq[data-type="${slot.stat_type}"]`);
                        if (activeBtn) activeBtn.classList.add('active');
                    }
                }
            });
        }
    });
}

document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
        saveToLocalStorage();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lock-toggle')) {
        const isLocked = e.target.textContent === '🔒';
        e.target.textContent = isLocked ? '🔓' : '🔒';
        
        const panel = e.target.closest('.stat-group');
        const inputs = panel.querySelectorAll('input, button:not(.lock-toggle), select');
        inputs.forEach(i => i.disabled = !isLocked);
    }
});

renderStats();
loadFromLocalStorage();
