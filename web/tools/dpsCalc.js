function renderDpsCalc(container) {
    let topperHtml = ''; 
    topperHtml += UI.credits(`@Carlone`);
    topperHtml += UI.desc("Maximize your DPS by optimally allocating your available Skillpoints after the daily reset, to reach your highest stage")
    topperHtml += UI.note(`Edit filled ${UI.referTo("skill_damage","Skills (Skill Levels)")} or ${UI.referTo("general_skill_points","reset Skill Points (General)")}, `);
    topperHtml += UI.note(`and ATS Boosts on ${UI.referTo("pet_attack_speed","Pet")} and ${UI.referTo("skins_ats_tier1_1","Skins")} for easier view of your current ATS and available Skillpoints .`);
    topperHtml += UI.row(`Skillpoints: ${UI.label("?","id_sp")}`);
    topperHtml += UI.row(`Attackspeed: ${UI.label(`?(Pet) + ?(Skins) + Equipment Bonus`,"id_ats")}`);
    
    let iframeContainer = UI.iframeApp(topperHtml,"https://carlone-beep.github.io/dps-optimizer/");
    container.innerHTML = iframeContainer;

    calculateDpsCalc()
}
function calculateDpsCalc(){
    const data = loadData();
    const skillpoints = data.general.skill_points;
    const skillpointsSpent = data.skill.spent;
    const usableSkillpoints = Math.max(
        skillpointsSpent - getInvestedSkillpoints(data.skill.ssl, "skill_ssl"), //since points invested into ssl can't be reset
        skillpoints
    );
    const atsPet = data.pet.attack_speed;
    const atsSkins = Object.values(data.skins.ats).filter(Boolean).length * 10;
    
    document.getElementsByClassName('id_sp')[0].innerHTML= 
        `${usableSkillpoints}+X usable`;
    document.getElementsByClassName('id_ats')[0].innerHTML=
        `${atsPet}(Pet) + ${atsSkins}(Skins) + (Equipment Bonus 25 with Viking set)`;
    
}