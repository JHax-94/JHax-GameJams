import Upgrade from "./Upgrade";

export default class UpgradePlayerSpeed extends Upgrade
{
    constructor(amount)
    {
        super(`Speed +${amount}`);

        this.amount = amount;
    }

    ApplyUpgrade()
    {
        this.GameWorld().player.IncreaseSpeed(this.amount);
    }
}