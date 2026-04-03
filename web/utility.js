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
        const btnHp = UI.button(`${idPrefix}slot_${slotNum}_btn_hp`, 'HP', 'btn-sq bool-btn active', `data-type="hp" onclick="selectForge(this)" disabled`);
        const btnXp = UI.button(`${idPrefix}slot_${slotNum}_btn_xp`, 'XP', 'btn-sq bool-btn', `data-type="xp" onclick="selectForge(this)" disabled`);
        const btnGld = UI.button(`${idPrefix}slot_${slotNum}_btn_gld`, 'GLD', 'btn-sq bool-btn', `data-type="gold" onclick="selectForge(this)" disabled`);
        const btnBar = UI.button(`${idPrefix}slot_${slotNum}_btn_bar`, 'BAR', 'btn-sq bool-btn', `data-type="bars" onclick="selectForge(this)" disabled`);
        
        const selection = `<div class="forge-selection">${lock}${btnHp}${btnXp}${btnGld}${btnBar}</div>`;
        const levelInput = `<div><label>Slot ${slotNum}:</label>` + UI.input(`${idPrefix}slot_${slotNum}_lv`, 'input-sm', 'disabled') + `</div>`;

        return `<div class="list-row list-col slot-container locked" id="${idPrefix}slot_${slotNum}_container">${selection}${levelInput}</div>`;
    },

    header: (text) => `<h3 class="tool-title">${text}</h3>`,
    desc: (text) => `<p class="tool-desc">${text}</p>`,
    resultDisplay: (id) => `<div id="${id}" class="calc-result"></div>`,
    note: (name, optId="") => `<i class="credit" id="${optId}">${name}</i>`,
    credits: (name) => UI.note(`Credits: ${name}`),
    placeholder: (text) => `<div class="placeholder-text"><em>${text}</em></div>`,

    referTo: (id, name) => `<span class="error-link" onclick="focusInput('${id}')">${name}</span>`,
    errorBox: (missingFields) => {
        let listHTML = missingFields.map(field => `<li class="error-item">
            • ${UI.referTo(field.id, field.name)}</li>`).join('');
        return `
            <div class="error-box">
                <p>Please enter the following values on the left side first:</p>
                <ul class="error-list">${listHTML}</ul>
            </div>`;
    },

    iframeApp: (overlayContent, iframeSrc) => `
        <div class="tool-iframe-app">
            ${UI.iframeTopper(overlayContent)}
            ${UI.fullIframe(iframeSrc)}
    </div>`,
    iframeTopper: (content) => `
        <div class="tool-iframe-overlay">
            ${content}
        </div>`,
    fullIframe: (src) => {
        const parameterStart = src.includes("?") ? "&" : "?";
        const embedParameter = `${parameterStart}embed=true`;
        const finalSource = src + embedParameter;
        return `<iframe class="tool-iframe" src="${finalSource}"></iframe>`;
    },

};

function validateFor(container, requiredFields){
    let missingFields = [];

    requiredFields.forEach(field => {
        let el = document.getElementById(field.id);
    
        if (!el || el.value.trim() === "") {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        container.innerHTML = UI.errorBox(missingFields);
        return false;
    }
    return true;
}

function focusInput(inputId) {
    let el = document.getElementById(inputId);
    if (el) {
        let details = el.closest('details');
        if (details) details.open = true;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
        el.style.backgroundColor = 'var(--btn-red)'; 
        setTimeout(() => { el.style.backgroundColor = '' }, 600);
    }
}
window.currentActiveTool = null;
function initTools() {
    const navContainer = document.getElementById('dynamic-tool-nav');
    const toolContainer = document.getElementById('tool-container');

    toolContainer.innerHTML = UI.placeholder("Select a tool from above");

    let basePath = window.location.pathname;
    if (basePath.endsWith('.html')) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    } 
    else if (!basePath.endsWith('/')) {
        basePath += '/';
    }
    else if (!basePath.endsWith('/')) {
        basePath += '/';
    }

    toolRegistry.forEach(tool => {
        const scriptTag = document.createElement('script');
        scriptTag.src = `${basePath}tools/${tool.file}`;
        scriptTag.async = false;
        document.body.appendChild(scriptTag);

        const btn = document.createElement('button');
        btn.className = 'btn-grey';
        btn.textContent = tool.name;
        btn.onclick = () => loadTool(tool.id); 
        
        navContainer.appendChild(btn);
    });
}

function loadTool(toolId) {
    const container = document.getElementById('tool-container');
    window.currentActiveTool = toolId;
    
    const selectedTool = toolRegistry.find(tool => tool.id === toolId);
    
    const navContainer = document.getElementById('dynamic-tool-nav');
    navContainer.querySelectorAll('button').forEach(btn => {
        if (selectedTool && btn.textContent === selectedTool.name) {
            btn.className = 'btn-blue active';
        } else {
            btn.className = 'btn-grey';
        }
    });

    if (selectedTool && selectedTool.render) {
        selectedTool.render(container);
    } else {
        container.innerHTML = UI.placeholder("Tool coming soon");
    }
}

window.addEventListener('ismDataUpdated', () => {
    if (!window.currentActiveTool) return;

    const activeTool = toolRegistry.find(t => t.id === window.currentActiveTool);
    if (activeTool && activeTool.update) {
        activeTool.update();
    }
});

document.addEventListener('DOMContentLoaded', initTools);