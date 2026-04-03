const toolRegistry = [
    {
        id: 'goldCalc',                 
        name: 'Gold Calc',              
        file: 'goldCalc.js',          
        render: (container) => typeof renderGoldCalcUI === 'function' ? renderGoldCalcUI(container) : null,
        update: () => typeof calculateGoldCalc === 'function' ? calculateGoldCalc() : null
    },
    {
        id: 'dpsCalc',                 
        name: 'DPS Calc',              
        file: 'dpsCalc.js',          
        render: (container) => typeof renderDpsCalcUI === 'function' ? renderDpsCalcUI(container) : null,
        update: () => typeof calculateDpsCalc === 'function' ? calculateDpsCalc() : null
    }
    // Add the next tool here...
    // id: A unique ID for the tool
    // name: The text that appears on the button
    // file: The filename inside the /tools folder
    // render: The function that builds the UI in the right hand side of the page
    // update: The function that runs the math when numbers change
];