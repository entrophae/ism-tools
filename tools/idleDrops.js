function renderUI(container){
    const required = [
        { name: "Max Stage (General)", id: "general_stage" }
    ];
    
    if (!validateFor(container, required)) return;;

    html = "";
    html += UI.desc("Edit your player stats to get the best results for XP, Gold and Stages!");
    html += `<hr></hr>`;
    html += UI.header("Idle Drops in X Time");
    html += UI.desc("Enter how many hours/minutes/seconds you wanna be idle");

    let gridContent = '';
    let row = ``;
    row += UI.standardInputRow(`idle_hour`, `Hour:`);
    row += UI.standardInputRow(`idle_minute`, `Minute:`);
    row += UI.standardInputRow(`idle_second`, `Second:`);
    gridContent += UI.grid3(row);

    html += gridContent;

    html += UI.resultDisplay("calc-result-1");
    html += `<hr></hr>`;
    html += UI.header("Time for X Idle Drops");
    html += UI.desc("Enter how many resources you want to get");
    let newContent = '';
    let row1 = ``;
    row1 += UI.standardInputRow(`idle_stage`, `Stages:`);
    row1 += UI.standardInputRow(`idle_pickaxe`, `Pickaxes:`);
    newContent += UI.grid2(row1);
    let row2 = ``;
    row2 += UI.standardInputRow(`idle_gem`, `Gems:`);
    row2 += UI.standardInputRow(`idle_apple`, `Apple:`);
    row2 += UI.standardInputRow(`idle_ruby`, `Rubies:`);
    newContent += UI.grid3(row2);
    let row3 = ``;
    row3 += UI.standardInputRow(`idle_gold`, `Gold:`);
    row3 += UI.standardInputRow(`idle_xp`, `XP:`);
    newContent += UI.grid2(row3);

    html += newContent;
    html += UI.resultDisplay("calc-result-2");

    container.innerHTML = html;

    calculateDrops();
}

function calculateDrops(){
    let data = loadData();
    const hourInSeconds = Number(document.getElementById('idle_hour').value)*60*60 || 0;
    const minuteInSeconds = Number(document.getElementById('idle_minute').value)*60 || 0;
    const seconds = Number(document.getElementById('idle_second').value) || 0;
    const timeInSeconds = Number(hourInSeconds)+Number(minuteInSeconds)+Number(seconds);
    const stageInput = Number(document.getElementById('idle_stage').value) || 0;
    const pickaxeInput = Number(document.getElementById('idle_pickaxe').value) || 0;
    const gemInput = Number(document.getElementById('idle_gem').value) || 0;
    const appleInput = Number(document.getElementById('idle_apple').value) || 0;
    const rubyInput = Number(document.getElementById('idle_ruby').value) || 0;
    const goldInput = Number(document.getElementById('idle_gold').value) || 0;
    const xpInput = Number(document.getElementById('idle_xp').value) || 0;
    
    const premiumBoost = 1+Number(data.lucky.premium_pack||0);

    const activeShields = data.shield.slots.filter(slot => { return !slot.is_locked });
    const goldShields = activeShields.filter(slot => {return slot.stat_type === "gold"})
    const goldBoosts = [
        data.skill.gold, data.pet.gold, data.artifact.gold, data.spells.fortune, data.relicts.gold
    ]
    const xpShields = activeShields.filter(slot => {return slot.stat_type === "xp"})
    const xpBoosts = [
        data.skill.xp, data.pet.xp, data.artifact.xp, data.spells.Nature, data.relicts.xp
    ]


    const stageH = Math.round((timeInSeconds/10)*premiumBoost); // +1 every 10 seconds
    const pickaxeH = Math.round(timeInSeconds/(60*15)); // +1 every 15 minutes
    const gemH = Math.round((timeInSeconds/(60*10))); // +1 every 10 minutes
    const rubyH = Math.round((timeInSeconds/(60*3.33))); // +1 every 3.33 minutes
    const appleH = Math.round((timeInSeconds/(60*3.33))); // +1 every 3.33 minutes
    const goldH = "?";
    const xpH = "?";

    const xStageSeconds = stageInput/premiumBoost*10;
    const xPickaxeSeconds = pickaxeInput*(60*15);
    const xGemSeconds = gemInput*(60*10);
    const xRubySeconds = rubyInput*(60*3.33);
    const xAppleSeconds = appleInput*(60*3.33);
    const xGoldSeconds = goldInput*(1);
    const xXPSeconds = xpInput*(1);

    document.getElementById('calc-result-1').innerHTML=
        `<li>Stages: ${stageH}</li>\n`+
        `<li>Pickaxes: ${pickaxeH}</li>\n`+
        `<li>Gems: ${gemH}</li>\n`+
        `<li>Apples: ${appleH}</li>\n`+
        `<li>Rubies: ${rubyH}</li>\n`+
        `<li>Gold: ${goldH}</li>\n`+
        `<li>XP: ${xpH}</li>\n`

    document.getElementById('calc-result-2').innerHTML=
        `<li>Stages: ${secondsToFull(xStageSeconds)}</li>\n`+
        `<li>Pickaxes: ${secondsToFull(xPickaxeSeconds)}</li>\n`+
        `<li>Gems: ${secondsToFull(xGemSeconds)}</li>\n`+
        `<li>Apples: ${secondsToFull(xRubySeconds)}</li>\n`+
        `<li>Rubies: ${secondsToFull(xAppleSeconds)}</li>\n`+
        `<li>Gold: ${secondsToFull(xGoldSeconds)}</li>\n`+
        `<li>XP: ${secondsToFull(xXPSeconds)}</li>\n`
}

function secondsToFull(totalSeconds){
    const hours = Math.round(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

/*
Skills: Gold, XP
Pet: Gold, XP
Fairy: 3g, 4g, 7g, 8g, 11g, 12g, 14g, 15x, 18g, 19x, 22g
Artifact: Gold, XP
Elve: Fortune Gold, Nature XP
Library: Gold, XP
Shield: Slots -> Gold, XP
*/