const baseCatProcAmmount = 50;
const baseCatProcChance = 0.02;
const baseCloverLimit = 4;
const basePennyLimit = 1;

window.addEventListener('ismDataUpdated', () => {
    
    if (document.getElementById('calc-result')) {
        goldUntilMaxSword();
    }
    
});

function loadTool(toolName) {
    const container = document.getElementById('tool-container');
    
    // Quick visual update for the buttons (makes the clicked one blue, others grey)
    document.querySelectorAll('.tool-nav button').forEach(btn => {
        btn.className = 'btn-grey';
    });
    event.target.className = 'btn-blue active';

    // Route to the correct tool
    if (toolName === 'goldCalc') {
        renderGoldCalcUI(container);
    } else {
        container.innerHTML = `<div class="placeholder-text"><em>Tool coming soon...</em></div>`;
    }
}

function renderGoldCalcUI(container) {
    let data = gatherAllData();
    let maxSsl = data.general.max_ssl;

    let missingFields = [];

    let maxSslInput = document.getElementById('general_max_ssl');
    let swordsBoughtInput = document.getElementById('general_swords_bought');
    let swordCostPetInput = document.getElementById('pet_sword_cost');
    let fortuneCatInput = document.getElementById('lucky_fortune_cat');
    let premiumPackInput = document.getElementById('lucky_premium_pack');

    if (!maxSslInput || maxSslInput.value === "") missingFields.push({ name: "Max Sword Lvl (General)", id: "general_max_ssl" });
    if (!swordsBoughtInput || swordsBoughtInput.value === "") missingFields.push({ name: "Swords Bought (General)", id: "general_swords_bought" });
    if (!swordCostPetInput || swordCostPetInput.value === "") missingFields.push({ name: "Sword Cost (Pet Boosts)", id: "pet_sword_cost" });
    if (!fortuneCatInput || fortuneCatInput.value === "") missingFields.push({ name: "Fortune Cat (Lucky Clovers)", id: "lucky_fortune_cat" });
    if (!premiumPackInput || premiumPackInput.value === "") missingFields.push({ name: "Premium Pack (Lucky Clovers)", id: "lucky_premium_pack" });

    container.innerHTML = `<i class="credit">Credits: @Cadaeib</i>`;
    if (missingFields.length > 0) {
        let listHTML = missingFields.map(field => 
            `<li style="margin-bottom: 0.5rem;">
                • <span onclick="focusInput('${field.id}')" style="cursor: pointer; text-decoration: underline; color: #ff8b7e; font-weight: bold; transition: color 0.2s;">${field.name}</span>
            </li>`
        ).join('');
        
        container.innerHTML = `
            <div class="placeholder-text" style="color: #d14936; text-align: center;">
                <p style="margin-bottom: 10px;">Please enter the following values on the left side first:</p>
                <ul style="list-style: none; padding: 0; display: inline-block; text-align: left;">
                    ${listHTML}
                </ul>
            </div>`;
        return;
    }

    let html = `<h3 style="margin-bottom: 0.5rem; text-align: center;">Gold Until Max Sword</h3>`;
    html += `<p style="font-size: 0.8rem; text-align: center; margin-bottom: 1rem;">Enter how many swords you currently own for the levels below.</p>`;
    
    html += `<div class="grid-2col-mt">`;
    
    // Loop to create 12 inputs counting down from maxSsl
    for (let i = 0; i < 12; i++) {
        let currentSwordLv = maxSsl - (i+1);
        
        if (currentSwordLv < 1) break; 

        html += `
            <div class="list-row">
                <div class="row-info">Sword Lv ${currentSwordLv}</div>
                <input id="lower_ssl_${i}" type="number" value="0" class="stat-input input-small" oninput="window.dispatchEvent(new Event('ismDataUpdated'))">
            </div>
        `;
    }
    html += `</div>`;

    html += `
        <div id="calc-result" style="margin-top: 1rem; text-align: center; font-size: 1.2rem;color: #d14936;"></div>
    `;

    container.innerHTML += html;
    goldUntilMaxSword();
}

function goldUntilMaxSword() {
    let data = gatherAllData();
    
    let lowerSsl = [];
    for (let i = 0; i < 12; i++) {
        let inputEl = document.getElementById(`lower_ssl_${i}`);
        lowerSsl.push(inputEl ? Number(inputEl.value) : 0);
    }

    const swordsBought = data.general.swords_bought;
    const swordCostPet = data.pet.sword_cost;
    const luckyCat = data.lucky.fortune_cat;
    
    const swordsNeeded = 4096;
    const partialSwordValues = [2048,1024,512,256,128,64,32,16,8,4,2,1];
    
    let totalSwordValues = 0;
    lowerSsl.forEach((swordAmmount, index) => {
        totalSwordValues += swordAmmount * partialSwordValues[index];
        console.info(index, totalSwordValues);
    })
    const existingPercentOfSsl = totalSwordValues/swordsNeeded;

    let totalGold = 0;
    let procsRemaining = baseCatProcAmmount; 
    let procChance = baseCatProcChance; 

    for (let i = 0; i < swordsNeeded; i++) {
        let currentSword = swordsBought + i + 1;
        let baseCost = 10 * currentSword * Math.pow(1.0002, currentSword);
        let petMultiplier = (100 - swordCostPet) / 100;

        let currentProcEffect = 1;
        if (luckyCat > 0) {
            if (i < procsRemaining) {
                let procBonus = (procChance / 100) * 31; 
                currentProcEffect = 1 + procBonus;
            }
        }

        let swordCost = (baseCost * petMultiplier) / currentProcEffect;
        totalGold += swordCost;
    }

    const fullGoldInScience = Math.round(totalGold).toExponential(2);
    const partialGoldInScience = Math.round(totalGold*(1-existingPercentOfSsl)).toExponential(2);
    document.getElementById('calc-result').innerText = `Since Start: ${fullGoldInScience}
    With Existing: ${partialGoldInScience}`;
}

window.onload = () => {
    loadTool();
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
        setTimeout(() => {
            el.style.backgroundColor = originalBg || '#ffffff';
        }, 600);
    }
}