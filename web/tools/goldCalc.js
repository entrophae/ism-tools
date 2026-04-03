const baseCatProcAmmount = 50;
const baseCatProcChance = 0.02;

function renderGoldCalcUI(container) {
    let data = gatherAllData();
    let maxSsl = data.general.max_ssl;

    // Validation Check
    const required = [
        { name: "Max Sword Lvl (General)", id: "general_max_ssl" },
        { name: "Swords Bought (General)", id: "general_swords_bought" },
        { name: "Sword Cost (Pet Boosts)", id: "pet_sword_cost" },
        { name: "Fortune Cat (Lucky Clovers)", id: "lucky_fortune_cat" },
        { name: "Premium Pack (Lucky Clovers)", id: "lucky_premium_pack" }
    ];

    if (!validateFor(container, required)) return;;

    let html = UI.credits("@Cadaeib");
    html += UI.header("Gold Until Max Sword");
    html += UI.desc("Enter how many swords you currently own for the levels below.");
    
    let gridContent = '';
    for (let i = 0; i < 12; i++) {
        let currentSwordLv = maxSsl - (i+1);
        if (currentSwordLv < 1) break; 

        // Uses our new UI components to assemble the inputs!
        gridContent += UI.row(
            UI.label(`Sword Lv ${currentSwordLv}`) + 
            UI.input(`lower_ssl_${i}`, 'input-sm', `oninput="window.dispatchEvent(new Event('ismDataUpdated'))"`)
        );
    }
    
    html += UI.grid2(gridContent);
    html += UI.resultDisplay("calc-result");

    container.innerHTML = html;
    calculateGoldCalc();
}

function calculateGoldCalc() {
    let data = gatherAllData();

    const swordsBought = data.general.swords_bought;
    const swordCostPet = data.pet.sword_cost;
    const luckyCatProcChance = baseCatProcChance * data.lucky.fortune_cat; 
    const luckyCatProcRemaining = baseCatProcAmmount * (data.lucky.premium_pack + 1);
    const baseSwordsNeeded = Math.pow(2, 12);

    let lowerSsl = [];
    for (let i = 0; i < 12; i++) {
        let inputEl = document.getElementById(`lower_ssl_${i}`);
        lowerSsl.push(inputEl ? Number(inputEl.value) : 0);
    }
    
    let ownedSwords = 0;
    lowerSsl.forEach((swordAmmount, index) => {
        ownedSwords += swordAmmount * Math.pow(2, 11 - index);
    });
    
    const ownedSwordsInPercent = ownedSwords / baseSwordsNeeded;
    const remainingSwordsInPercent = 1 - ownedSwordsInPercent;

    function calculateNeededGold(startCount, amountToBuy){
        let total = 0;
        let petMultiplier = (100 - swordCostPet) / 100;
        let cappedProcChance = Math.min(luckyCatProcChance, 100) / 100;
        const globalReduction = 1 + (cappedProcChance * (Math.min(amountToBuy, luckyCatProcRemaining) * 31 / amountToBuy));

        for (let i = 0; i < amountToBuy; i++) {
            let currentSwordIndex = startCount + i + 1;
            let baseCost = 10 * currentSwordIndex * Math.pow(1.0002, currentSwordIndex);
            
            let hasProc = (luckyCatProcRemaining - i + 1) > 0 ? (luckyCatProcRemaining - i + 1) : 1;
            let currentProcEffect = 1 + (31 * Math.min(1, hasProc) * cappedProcChance);

            let swordCost = (baseCost * petMultiplier) / globalReduction / currentProcEffect;
            total += Math.round(swordCost);
        }
        return total;
    }

    const fullCost = calculateNeededGold(swordsBought, baseSwordsNeeded);
    const partialCost = calculateNeededGold(swordsBought + ownedSwords, baseSwordsNeeded * remainingSwordsInPercent);
    
    document.getElementById('calc-result').innerText =
        `Since Start: ${fullCost.toExponential(2)}\n` +
        `Remaining to buy: ${partialCost.toExponential(2)}`;
}
