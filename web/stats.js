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
        prefix: "Fairy",
        boostName: [
            "Dmg", "Dmg", "Gold", "Gold",
            "Dmg", "Dmg", "Gold", "Gold",
            "Dmg", "Dmg", "Gold", "Gold",
            "Dmg", "Gold", "XP", "Bar",
            "Dmg", "Gold", "XP", "Bar",
            "Dmg", "Gold", "Speeds*", "SSL"
        ],
        boostInc: [
            5, 5, 5, 5,
            10, 10, 10, 10,
            25, 25, 25, 25,
            50, 50, 10, 10,
            100, 100, 50, 50,
            200, 200, 10, 1
        ],
        calculate: "80stage",
        calculateCredit: ""
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
    },
    {
        title: "Skins",
        id: "skins_",
        type: "boolean_rows",
        count: 48,
        tiers: 3,
        prefix: "Skin",
        boostName: [ "Dmg", "Gold", "XP", "MVS", "ATS"],
        boostInc: [[2, 50, 50, 10],[3, 100, 100, 10],[5, 200, 200, 10]]
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
                content.innerHTML += UI.standardInputRow(`${group.id}${group.fieldIds[index]}`, `${field}:`);
            });
        } 
        
        else if (group.type === 'grid') {
            const tiers = ["bg-common", "bg-uncommon", "bg-rare", "bg-epic", "bg-legendary", "bg-mythic"];
            let gridContent = '';
            for (let i = 1; i <= group.count; i++) {
                let tierClass = tiers[Math.ceil(i / 4) - 1];
                gridContent += UI.gridInputCol(`${group.id}${i}`,
                    `${group.prefix} ${i}\n
                    <i class="credit">${group.boostName[i-1]}+${group.boostInc[i-1]}%</i>`, tierClass);
            }
            content.innerHTML += UI.grid4(gridContent);
            content.innerHTML += 
                UI.note("* Only until 80% of Max Stage: ") +
                UI.note("", "fairy-stage");
        }
        
        else if (group.type === 'forge') {
            group.baseFields.forEach((field, index) => {
                content.innerHTML += UI.standardInputRow(`${group.id}${group.fieldIds[index]}`, `${field}:`);
            });
            let forgeContent = '';
            for (let i = 1; i <= group.slotCount; i++) {
                forgeContent += UI.forgeSlot(group.id, i);
            }
            content.innerHTML += UI.grid2(forgeContent);
        }

        else if (group.type === 'boolean_rows') {
            let allTiersContent = '';

            for (let tier = 0; tier < group.tiers; tier++) {
                let tierNum = tier + 1;
                
                let valDmg = group.boostInc[tier][0];
                let valGold = group.boostInc[tier][1];
                let valXP = group.boostInc[tier][2];
                let valSpeed = group.boostInc[tier][3]; 

                const makeButtons = (count, name) => {
                    let buttons = '';
                    for (let i = 0; i < count; i++) {
                        let skinId = name.toLowerCase() + "_tier"+ tierNum + "_"+(i+1);
                        let isFirstDmgSkin = (tierNum === 1 && name === group.boostName[0] && i === 0);
                        let btnClasses = isFirstDmgSkin ? "btn-sq bool-btn active" : "btn-sq bool-btn";
                        let btnAttrs = isFirstDmgSkin ? "disabled" : 'onclick="toggleSkin(this)"';

                        buttons += UI.button(
                            `${group.id}${skinId}`, 
                            `X`, 
                            btnClasses, 
                            btnAttrs
                        ) + ' ';
                    }
                    return buttons;
                };

                let dmgRow = UI.row(
                    UI.label(group.boostName[0])+
                    makeButtons(4, group.boostName[0])+
                    UI.note(`(x${valDmg})`)
                );
                let goldRow = UI.row(
                    UI.label(group.boostName[1])+
                    makeButtons(4, group.boostName[1])+
                    UI.note(`(+${valGold}%)`)
                );
                let xpRow = UI.row(
                    UI.label(group.boostName[2])+
                    makeButtons(4, group.boostName[2])+
                    UI.note(`(+${valXP}%)`)
                );
                let mvsRow = UI.row(
                    UI.label(group.boostName[3])+
                    makeButtons(2, group.boostName[3])+
                    UI.note(`(+${valSpeed}%)`)
                );
                let atsRow = UI.row(
                    UI.label(group.boostName[4])+
                    makeButtons(2, group.boostName[4])+
                    UI.note(`(+${valSpeed}%)`)
                );
    

                let title = `Tier ${tierNum}`;
                let tierHtml = `
                    ${UI.header(title)}
                    ${dmgRow}
                    ${goldRow}
                    ${xpRow}
                    ${mvsRow}
                    ${atsRow}`; 

                allTiersContent += tierHtml;
            }
            content.innerHTML += allTiersContent;
        }

        details.appendChild(content);
        container.appendChild(details);
    });
}
function toggleSkin(btn) {
    btn.classList.toggle('active');

    if (!window.isRestoringData) {
        saveToLocalStorage();
        updateAllUI();
    }
}
function toggleSlotLock(lockEl) {
    const isLocked = lockEl.textContent === '🔒';
    lockEl.textContent = isLocked ? '🔓' : '🔒';

    const container = lockEl.closest('.slot-container');
    if (isLocked) {
        container.classList.remove('locked');
    } else {
        container.classList.add('locked');
    }

    const elements = container.querySelectorAll('input, button:not(.slot-lock)');
    elements.forEach( el => el.disabled = !isLocked );

    if (!window.isRestoringData) {
        saveToLocalStorage();
    }
}

function selectForge(btn) {
    if (btn.disabled) return; 
    const parent = btn.parentElement;
    parent.querySelectorAll('.btn-sq').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (!window.isRestoringData) {
        saveToLocalStorage();
    }
}

function updateFairyStage() {
    const stageInput = document.getElementById('general_stage');
    const fairyStageEl = document.getElementById('fairy-stage'); 
    
    if (stageInput && fairyStageEl) {
        const maxStage = Number(stageInput.value);
        if (maxStage > 0) {
            fairyStageEl.innerHTML = Math.floor(maxStage * 0.8);
        } else {
            fairyStageEl.innerHTML = UI.referTo("general_stage", "Edit General Stage");
        }
    }
}

function updateAllUI() {
    updateFairyStage();

    saveToLocalStorage();
}

function gatherAllData() {
    let saveData = {};

    statsConfig.forEach(group => {
        let groupKey = group.id.replace('_', ''); 
        saveData[groupKey] = {};

        if (group.type === 'standard') {
            group.fields.forEach((_, index) => {
                let specificId = group.fieldIds[index];
                let inputElement = document.getElementById(`${group.id}${specificId}`);
                if (inputElement) {
                    saveData[groupKey][specificId] = inputElement.value === "" ? "" : Number(inputElement.value);
                }
            });
        } 
        
        else if (group.type === 'grid') {
            saveData[groupKey].levels = {}; 
            for (let i = 1; i <= group.count; i++) {
                let inputElement = document.getElementById(`${group.id}${i}`);
                if (inputElement) {
                    saveData[groupKey].levels[`${group.prefix.toLowerCase()}_${i}`] = inputElement.value === "" ? "" : Number(inputElement.value);
                }
            }
        }
        
        else if (group.type === 'forge') {
            group.baseFields.forEach((_, index) => {
                let specificId = group.fieldIds[index];
                let inputElement = document.getElementById(`${group.id}${specificId}`);
                if (inputElement) {
                    saveData[groupKey][specificId] = inputElement.value === "" ? "" : Number(inputElement.value);
                }
            });

            saveData[groupKey].slots = [];
            for (let i = 1; i <= group.slotCount; i++) {
                let container = document.getElementById(`${group.id}slot_${i}_container`);
                if (!container) continue;
                
                let levelInput = document.getElementById(`${group.id}slot_${i}_lv`);
                let levelVal = levelInput.value === "" ? "" : Number(levelInput.value);

                let lockIcon = container.querySelector('.slot-lock');
                let isLocked = lockIcon && lockIcon.textContent === '🔒';

                let activeBtn = container.querySelector('.btn-sq.active');
                let statType = activeBtn ? activeBtn.getAttribute('data-type') : "none";

                if (isLocked || levelVal === 0) {
                    levelVal = 0;
                    statType = "none";
                }

                saveData[groupKey].slots.push({
                    slot_number: i,
                    stat_type: statType,
                    level: levelVal,
                    is_locked: isLocked
                });
            }
        }

        else if (group.type === 'boolean_rows') {
            group.boostName.forEach(name => {
                saveData[groupKey][name.toLowerCase()] = {};
            });

            const statCounts = { "Dmg": 4, "Gold": 4, "XP": 4, "MVS": 2, "ATS": 2 };

            for (let tier = 0; tier < group.tiers; tier++) {
                let tierNum = tier + 1;
                
                group.boostName.forEach(name => {
                    let statKey = name.toLowerCase();
                    let count = statCounts[name];
                    
                    for (let i = 0; i < count; i++) {
                        let skinId = `${statKey}_tier${tierNum}_${i+1}`;
                        let btn = document.getElementById(`${group.id}${skinId}`);
                        
                        if (btn) {
                            saveData[groupKey][statKey][`tier${tierNum}_${i+1}`] = btn.classList.contains('active');
                        }
                    }
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

function loadData(){
    const savedString = localStorage.getItem('ismToolsData');
    if (!savedString) return null;
    try {
        return JSON.parse(savedString);
    } catch (error) {
        console.error("Failed to parse ismToolsData from localStorage:", error);
        return null;
    }
}

function loadFromLocalStorage() {
    const data = loadData()
    if (!data) return;
    window.isRestoringData = true;

    statsConfig.forEach(group => {
        let groupKey = group.id.replace('_', '');
        if (!data[groupKey]) return;

        if (group.type === 'standard' || group.type === 'forge') {
            (group.fields || group.baseFields).forEach((_, index) => {
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
                if (lvEl && slot.level !== "") lvEl.value = slot.level;

                let container = document.getElementById(`${group.id}slot_${slot.slot_number}_container`);
                if (container) {
                    if (slot.stat_type && slot.stat_type !== 'none') {
                        container.querySelectorAll('.btn-sq').forEach(b => b.classList.remove('active'));
                        let activeBtn = container.querySelector(`.btn-sq[data-type="${slot.stat_type}"]`);
                        if (activeBtn) activeBtn.classList.add('active');
                    }
                    
                    let lockIcon = container.querySelector('.slot-lock');
                    if (lockIcon) {
                        if (slot.is_locked && lockIcon.textContent === '🔓') {
                            toggleSlotLock(lockIcon); 
                        } else if (!slot.is_locked && lockIcon.textContent === '🔒') {
                            toggleSlotLock(lockIcon); 
                        }
                    }
                }
            });
        }
        if (group.type === 'boolean_rows' && data[groupKey]) {
            const statCounts = { "Dmg": 4, "Gold": 4, "XP": 4, "MVS": 2, "ATS": 2 };

            for (let tier = 0; tier < group.tiers; tier++) {
                let tierNum = tier + 1;
                
                group.boostName.forEach(name => {
                    let statKey = name.toLowerCase();
                    let count = statCounts[name];
                    
                    for (let i = 0; i < count; i++) {
                        let detailKey = `tier${tierNum}_${i+1}`;
                        let skinId = `${statKey}_${detailKey}`;
                        let btn = document.getElementById(`${group.id}${skinId}`);
                        
                        if (btn && data[groupKey][statKey] && data[groupKey][statKey][detailKey] !== undefined) {
                            if (data[groupKey][statKey][detailKey] === true) {
                                btn.classList.add('active');
                            } else {
                                let isFirstDmgSkin = (tierNum === 1 && name === group.boostName[0] && i === 0);
                                if (!isFirstDmgSkin) {
                                    btn.classList.remove('active');
                                }
                            }
                        }
                    }
                });
            }
        }
    });

    window.isRestoringData = false;
updateAllUI();
}

document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    loadFromLocalStorage();

    document.addEventListener('input', (e) => {
        if (!window.isRestoringData) {
            if (e.target.tagName === 'INPUT') {
            saveToLocalStorage();
            }

            updateAllUI(); 
        }
    });
});