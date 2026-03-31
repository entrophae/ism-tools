const UI = {
    row: (content, extraClass = '') => `<div class="list-row ${extraClass}">${content}</div>`,
    col: (content, extraClass = '') => `<div class="list-row list-col ${extraClass}">${content}</div>`,
    grid2: (content) => `<div class="grid-2">${content}</div>`,
    grid4: (content) => `<div class="grid-4">${content}</div>`,

    label: (text, extraClass = '') => `<div class="row-info ${extraClass}"><label>${text}</label></div>`,
    input: (id, extraClass = '', attrs = '') => `<input id="${id}" type="number" value="" class="stat-input ${extraClass}" ${attrs}>`,
    button: (id, text, classes, attrs = '') => `<button id="${id}" class="${classes}" ${attrs}>${text}</button>`,

    standardInputRow: (id, labelText) => {
        return UI.row(UI.label(labelText) + UI.input(id));
    },
    
    gridInputCol: (id, labelText, tierClass) => {
        return UI.col(UI.label(labelText, 'text-xs') + UI.input(id, 'input-full'), tierClass);
    },

    forgeSlot: (idPrefix, slotNum) => {
        const lock = `<span class="slot-lock lock-icon" onclick="toggleSlotLock(this)">🔒</span>`;
        const btnHp = UI.button(`${idPrefix}slot_${slotNum}_btn_hp`, 'HP', 'btn-sq active', `data-type="hp" onclick="selectForge(this)" disabled`);
        const btnXp = UI.button(`${idPrefix}slot_${slotNum}_btn_xp`, 'XP', 'btn-sq', `data-type="xp" onclick="selectForge(this)" disabled`);
        const btnGld = UI.button(`${idPrefix}slot_${slotNum}_btn_gld`, 'GLD', 'btn-sq', `data-type="gold" onclick="selectForge(this)" disabled`);
        const btnBar = UI.button(`${idPrefix}slot_${slotNum}_btn_bar`, 'BAR', 'btn-sq', `data-type="bars" onclick="selectForge(this)" disabled`);
        
        const selection = `<div class="forge-selection">${lock}${btnHp}${btnXp}${btnGld}${btnBar}</div>`;
        const levelInput = `<div><label>Slot ${slotNum}:</label>` + UI.input(`${idPrefix}slot_${slotNum}_lv`, 'input-sm', 'disabled') + `</div>`;

        return `<div class="list-row list-col slot-container locked" id="${idPrefix}slot_${slotNum}_container">${selection}${levelInput}</div>`;
    },

    header: (text) => `<h3 class="tool-title">${text}</h3>`,
    desc: (text) => `<p class="tool-desc">${text}</p>`,
    resultDisplay: (id) => `<div id="${id}" class="calc-result"></div>`,
    credits: (name) => `<i class="credit">Credits: ${name}</i>`,
    
    errorBox: (missingFields) => {
        let listHTML = missingFields.map(field => 
            `<li class="error-item">• <span class="error-link" onclick="focusInput('${field.id}')">${field.name}</span></li>`
        ).join('');
        return `
            <div class="error-box">
                <p>Please enter the following values on the left side first:</p>
                <ul class="error-list">${listHTML}</ul>
            </div>`;
    }
};

function focusInput(inputId) {
    let el = document.getElementById(inputId);
    if (el) {
        let details = el.closest('details');
        if (details) details.open = true;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
        let originalBg = el.style.backgroundColor;
        el.style.backgroundColor = 'var(--btn-red)'; 
        setTimeout(() => el.style.backgroundColor = originalBg || '#ffffff', 600);
    }
}
window.currentActiveTool = null;

function loadTool(toolName) {
    const container = document.getElementById('tool-container');
    window.currentActiveTool = toolName;
    
    document.querySelectorAll('.tool-nav button').forEach(btn => {
        if (btn.getAttribute('onclick').includes(toolName)) {
            btn.className = 'btn-blue active';
        } else {
            btn.className = 'btn-grey';
        }
    });

    if (toolName === 'goldCalc') {
        if (typeof renderGoldCalcUI === 'function') renderGoldCalcUI(container);
    } else {
        container.innerHTML = `<div class="placeholder-text"><em>Tool coming soon...</em></div>`;
    }
}

window.addEventListener('ismDataUpdated', () => {
    if (window.currentActiveTool === 'goldCalc' && typeof goldUntilMaxSword === 'function') {
        goldUntilMaxSword();
    }
});