import Upgrade from "./Upgrade";

export default class UpgradeHivePop extends Upgrade 
{
    constructor(amount)
    {
        super(`Hive Population +${amount}`);
        this.amount = amount;
    }

    ApplyUpgrade()
    {
        let structures = this.GameWorld().structures;

        for(let i = 0; i < structures.length; i ++)
        {
            if(!structures[i].isEndHive && !structures[i].dead)
            {
                structures[i].maxPopulation += this.amount;
            }
        }
    }
    
}