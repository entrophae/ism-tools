function renderDPSUI(container) {
        let overlayHtml = ''; 
    overlayHtml += UI.credits(`@Carlone`);
    overlayHtml += UI.desc("Maximize your DPS by optimally allocating your available Skillpoints after the daily reset, to reach your highest stage")
    overlayHtml += UI.note(`Edit filled ${UI.referTo("skill_damage","Skills (Skill Levels)")} or ${UI.referTo("general_skill_points","reset Skill Points (General)")}, `);
    overlayHtml += UI.note(`and ATS Boosts on ${UI.referTo("pet_attack_speed","Pet")} and ${UI.referTo("skins_ats_tier1_1","Skins")} for easier view of your current ATS and available Skillpoints .`);
    overlayHtml += UI.row(`Skillpoints: ${UI.label("?","id_sp")}`);
    overlayHtml += UI.row(`Attackspeed: ${UI.label(`?(Pet) + ?(Skins) + Equipment Bonus`,"id_ats")}`);
    
    let iframeContainer = UI.iframeApp(overlayHtml,"https://carlone-beep.github.io/dps-optimizer/");
    container.innerHTML = iframeContainer;

    calculate()
}
function calculate(){
    const data = loadData();
    const skillpoints = data.general.skill_points;
    const skillpointsSpent = data.skill.spent;
    const usableSkillpoints = Math.max(
        skillpointsSpent - getSkillpoints(data.skill.ssl, "skill_ssl"),
        skillpoints
    );
    const atsPet = data.pet.attack_speed;
    const atsSkins = Object.values(data.skins.ats).filter(Boolean).length * 10;
    
    document.getElementsByClassName('id_sp')[0].innerHTML= 
        `${usableSkillpoints}+X usable`;
    document.getElementsByClassName('id_ats')[0].innerHTML=
        `${atsPet}(Pet) + ${atsSkins}(Skins) + (Equipment Bonus 25 with Viking set)`;
    
}