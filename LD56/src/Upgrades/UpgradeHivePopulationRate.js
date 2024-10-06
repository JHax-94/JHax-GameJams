import Upgrade from "./Upgrade";

export default class UpgradeHivePopulationRate extends Upgrade
{
    constructor(amount)
    {
        super(`Hive Growth +${amount * 100}%`);      
        
        this.amount = amount;
    }

    ApplyUpgrade()
    {
        this.GameWorld().UpgradeHivePopulationRate(this.amount);
    }
}