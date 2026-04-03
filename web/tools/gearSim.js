function renderGearSimUI(container) {
        let overlayHtml = ''; 
    overlayHtml += UI.credits(`@Cadaeib`);
    overlayHtml += UI.desc("Simulate summoning gears to find out your chances of getting what you want");

    let iframeContainer = UI.iframeApp(overlayHtml,"https://gear-sim-mwyxm3nezsycvmhqstnqi3.streamlit.app/");
    container.innerHTML = iframeContainer;

}
function calculateGearSim(){
    // No calculation needed
    // But needed for registry nonetheless    
}