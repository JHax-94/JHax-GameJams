import Upgrade from "./Upgrade";

export default class UpgradeCitizenSpeed extends Upgrade
{
    constructor(amount)
    {
        super(`Citizen Speed +${amount}`);
        this.amount = amount;
    }

    ApplyUpgrade()
    {
        this.GameWorld().UpgradeCitizenSpeed(this.amount);
        this.UpgradeFinished();
    }
}