# Idle Sword Master Tools

## What is this?

This is a web-port for all the Calculators and Tools created by the [ISM Discord Community](https://discord.com/invite/5axFucyPmY).  
Since most tools were created via google docs sheets, it limited version of those tools to the recently copied version from the original made by the creator.  
To avoid the need of a google docs account and an version deprecations, this site should help the community to be onpar with the current state.  

## How to contribute?

It would be cool to have this as a collaborative experience, keeping the dashboard updated with the newest and most accurate tools created by YOU.

If you want to contribute a new calculator or tool, please do so by submitting a Pull Request using the following structure.

### 1. Create Tool File

Write your code in `/tools` as a single JavaScript file.  
Name it something understandable like `xpOptimizer.js`.  

You can structure the internal logic of your tool however you like, but your file **must contain two specific functions** so the main app can load it:

1. A **Render function** that generates the UI on the right-hand side of the screen.
2. An **Update function** that runs your math and updates the results.

### 2. Add your Tool to the Registry

The `registry.js` file helps the app load your tool automatically without anyone having to manually edit the index.html file.

Add your new tool as an object to the `toolRegistry` array. It should look like this:  

```js
    {
        id: 'uniqueToolID', // A unique string ID for your tool
        name: 'Tool Name', // The text that'll appear on the navigation button
        file: 'yourTool.js', // The exact filename inside the /tools folder
        // render: The function that builds the UI in the right-hand panel.
        // Pass the "container" argument directly into your render function
        render: (container) => typeof renderYourToolUI === 'function' ? renderYourToolUI(container) : null,
        // update: The function that recalculates your math when the user changes a number
        update: () => typeof updateYourCalculation === 'function' ? updateYourCalculation() : null
    }
```

*** (Note: Different tools need to have their functions named differently, or else the first positioned tool with that function will take its place)



### 3. How to create UI

Please avoid writing raw HTML strings if possible. There is a built-in UI builder in the `utility.js` file which provides clean, standardized components  

```js
// Example of building a simple UI
function renderYourToolUI(toolContainer){
  let html = UI.credits("@YourName");
  html += UI.header("My Awesome Calculator");
  html += UI.desc("Enter your values below to calculate X.");

  // IMPORTANT: Include the ismDataUpdated event dispatcher so the app knows when the user types!
  html += UI.standardInputRow('my_input_1', 'Target Level', '0', "window.dispatchEvent(new Event('ismDataUpdated'))");

  html += UI.resultDisplay("calc-result");

  toolContainer.innerHTML = html;

  // Run your math once on load
  updateYourCalculation();
}
```

### 4. How to Access Player Data

The left side of the page automatically saves and parses the user's game stats into a clean JSON object. You can grab the current state of the user's stats at any time by calling:  

```js
let data = gatherAllData();
```

The full data looks like this (example is my current stats):

```json
{
  "general": {
    "stage": 15724,
    "level": 9403,
    "max_ssl": 522,
    "skill_points": 7306,
    "swords_bought": 410490,
    "sword_cost": 9.35e+40,
    "total_damage": 7.5e+45,
    "total_power": 9.23e+87,
    "movement_speed": 1800,
    "attack_speed": 788,
    "attack_range": 187
  },
  "skill": {
    "damage": 0,
    "gold": 200,
    "xp": 200,
    "ssl": 111,
    "ancient_bars": 200,
    "attack_range": 90,
    "attack_speed": 0,
    "movement_speed": 100,
    "spent": 15046
  },
  "pet": {
    "damage": 18000000000000000,
    "gold": 6880,
    "xp": 4780,
    "attack_speed": 100,
    "movement_speed": 100,
    "attack_range": 100,
    "sword_cost": 95,
    "ssl": 78
  },
  "fairy": {
    "levels": {
      "fairy_1": 369,
      "fairy_2": 381,
      "fairy_3": 390,
      "fairy_4": 378,
    }
  },
  "artifact": {
    "damage": 261,
    "gold": 252,
    "xp": 252,
    "ssl": 127,
    "ancient_bars": 260,
    "attack_range": 64
  },
  "lucky": {
    "golden_clover": 12,
    "fortune_cat": 10,
    "lucky_penny": 3,
    "premium_pack": 1
  },
  "spells": {
    "fire": 309,
    "fortune": 160,
    "nature": 120,
    "frostbound": 150
  },
  "relicts": {
    "damage": 39609,
    "gold": 5198,
    "xp": 5280,
    "ancient_bars": 528,
    "ssl": 70
  },
  "shield": {
    "ssl": 8,
    "slots": [
      {
        "is_locked": false,
        "slot_number": 1,
        "stat_type": "gold",
        "level": 10
      },
      {
        "is_locked": false,
        "slot_number": 2,
        "stat_type": "gold",
        "level": 6
      }
    ]
  },
  "skins": {
    "ats": {
      "tier1_1": true,
      "tier1_2": true,
      "tier2_1": false,
      "tier2_2": false,
      "tier3_1": false,
      "tier3_2": false
    },
    "dmg": {
      "tier1_1": true,
      "tier1_2": true,
      "tier1_3": true,
      "tier1_4": true
    },
    "gold": {},
    "mvs": {},
    "xp": {},

  }
}
```

*** (Note: I trimmed the skins, fairies and shield slots in the JSON example to save space in the README)

## TODO

- [ ] Calculate boosts from Skill Lvls, Artifact Lvls, Fairy Lvls, Shield Slot Lvls, Spell Lvls
- [ ] Incorporate existing Calculators

## Credits

### Already inside

- **Gold Calc** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1XBX2tjyLHOk7QRVarTKp4xutWqmJ_WH6ulQ_YTS6WkE
- **DPS Calc** by _@Carlo_! Original: https://carlone-beep.github.io/dps-optimizer
- **SP Invested** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1GWTo6tLFP54SGaCGgLAbxfp4shKS4rTNjCx1PMkWVaM
- **Equipment Sim** by _@Cadaeib_! Original: https://gear-sim-mwyxm3nezsycvmhqstnqi3.streamlit.app/

### Not yet inside

- **Ancient Calc** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1TgT6U9551YEzAsDiZKdtYOPu7Vnj0osWlm0F292EgaA
- **Elve Tree Calc** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1X7AryHrK5e_-WSjEdkr8Ss0X2prFrLVfkbCk_VswSU4
- **Shield Calc** by _@Bach_! Original: https://docs.google.com/spreadsheets/d/1CKnD7bI97tuJFSWwiKP-ynu2JBkpN7dxEmEKyth5qEA/edit?gid=320158459#gid=320158459
- **Shield Stacking** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1Ry2xeqwwYexYWRDR7l7RMvr7sb1VjXXNsv2LtjmOZVQ
- **Rank Change** by _@Cadaeib_! Original: https://script.google.com/macros/s/AKfycbwEpGCpBcTzHm62AZP-V_1lLZlLmwTYCrWbJKx9Hf4o5NlSb-aNlH5Q80UigEmTxmQ8wA/exec
- **End Game Pack Value** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1nM6wsjMeWEMCd7EV60CMxxTsUybIN-dhc36WlMPy6Ao/edit?usp=sharing
