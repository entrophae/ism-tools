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

    if (!maxSsl || maxSsl === 0) {
        container.innerHTML = `<div class="placeholder-text" style="color: #d14936;">Please enter a <strong>Max Sword Lvl</strong> on the left side first!</div>`;
        return;
    }

    let html = `<h3 style="margin-bottom: 0.5rem; text-align: center;">Gold Until Max Sword</h3>`;
    html += `<p style="font-size: 0.8rem; text-align: center; margin-bottom: 1rem;">Enter how many swords you currently own for the levels below.</p>`;
    
    html += `<div class="grid-2col">`;
    
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

    container.innerHTML = html;
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