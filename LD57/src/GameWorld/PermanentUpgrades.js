import { consoleLog } from "../main";

export default class PermanentUpgrades
{
    constructor()
    {
        this.permanentUpgrades = [];
    }

    
    AddPermanentUpgrade(upgradeText)
    {
        let upgradeLogged = false;

        for(let i = 0; i < this.permanentUpgrades.length;  i ++)
        {
            if(this.permanentUpgrades[i].text === upgradeText)
            {
                this.permanentUpgrades[i].count ++;
                upgradeLogged = true;
            }
        }

        if(!upgradeLogged)
        {
            this.permanentUpgrades.push({ text: upgradeText, count: 1 });
        }
    }

    PermanentUpgradeLevel(upgradeText)
    {
        let upg_i = this.permanentUpgrades.findIndex((pup) => pup.text === upgradeText);
        let level = 0;

        if(upg_i >= 0)
        {
            let upg = this.permanentUpgrades[upg_i];

            level = upg.count;
        }

        return level;
    }

}