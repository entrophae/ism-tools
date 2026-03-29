# Idle Sword Master Tools

## What is this?

This is a web-port for all the Calculators and Tools created by the [ISM Discord Community](https://discord.com/invite/5axFucyPmY).  
Since most tools were created via google docs sheets, it limited version of those tools to the recently copied version from the original made by the creator.  
To avoid the need of a google docs account and an version deprecations, this site should help the community to be onpar with the current state.  

## How to cooperate?

It would be cool to have this as a collaborated experience, always updated to newest and most updated versions.  
If you want to add your calculations with Pull Requests then those can be "programmed" or imported inside `calculations.js`.  

### How to Access data in code

The left side of the Page creates a full object of the player stats which can be accessed via `let data = gatherAllData();`.  

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
    "movement_speed": 100
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
      "fairy_5": 252,
      "fairy_6": 246,
      "fairy_7": 233,
      "fairy_8": 243,
      "fairy_9": 122,
      "fairy_10": 114,
      "fairy_11": 125,
      "fairy_12": 114,
      "fairy_13": 49,
      "fairy_14": 59,
      "fairy_15": 42,
      "fairy_16": 36,
      "fairy_17": 35,
      "fairy_18": 34,
      "fairy_19": 27,
      "fairy_20": 34,
      "fairy_21": 15,
      "fairy_22": 23,
      "fairy_23": 13,
      "fairy_24": 19
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
        "slot_number": 1,
        "stat_type": "gold",
        "level": 10
      },
      {
        "slot_number": 2,
        "stat_type": "gold",
        "level": 6
      },
      {
        "slot_number": 3,
        "stat_type": "bars",
        "level": 4
      },
      {
        "slot_number": 4,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 5,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 6,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 7,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 8,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 9,
        "stat_type": "none",
        "level": 0
      },
      {
        "slot_number": 10,
        "stat_type": "none",
        "level": 0
      }
    ]
  }
}
```
## TODO
- [ ] Calculate boosts from Skill Lvls, Artifact Lvls, Fairy Lvls, Shield Slot Lvls, Spell Lvls
- [ ] Incorporate existing Calculators

## Credits

### Already inside

- **Gold Calc** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1XBX2tjyLHOk7QRVarTKp4xutWqmJ_WH6ulQ_YTS6WkE

### Not yet inside

- **DPS Calc** by _@Carlo_! Original: https://carlone-beep.github.io/dps-optimizer
- **Ancient Calc** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1TgT6U9551YEzAsDiZKdtYOPu7Vnj0osWlm0F292EgaA
- **Elve Tree Calc** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1X7AryHrK5e_-WSjEdkr8Ss0X2prFrLVfkbCk_VswSU4
- **SP Invested** by _@Fierywind_! Original: https://docs.google.com/spreadsheets/d/1GWTo6tLFP54SGaCGgLAbxfp4shKS4rTNjCx1PMkWVaM
- **Shield Calc** by _@Bach_! Original: https://docs.google.com/spreadsheets/d/1CKnD7bI97tuJFSWwiKP-ynu2JBkpN7dxEmEKyth5qEA/edit?gid=320158459#gid=320158459
- **Shield Stacking** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1Ry2xeqwwYexYWRDR7l7RMvr7sb1VjXXNsv2LtjmOZVQ
- **Rank Change** by _@Cadaeib_! Original: https://script.google.com/macros/s/AKfycbwEpGCpBcTzHm62AZP-V_1lLZlLmwTYCrWbJKx9Hf4o5NlSb-aNlH5Q80UigEmTxmQ8wA/exec
- **Equipment Sim** by _@Cadaeib_! Original: https://gear-sim-mwyxm3nezsycvmhqstnqi3.streamlit.app/
- **End Game Pack Value** by _@Cadaeib_! Original: https://docs.google.com/spreadsheets/d/1nM6wsjMeWEMCd7EV60CMxxTsUybIN-dhc36WlMPy6Ao/edit?usp=sharing
