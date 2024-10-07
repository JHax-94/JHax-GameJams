import Upgrade from "./Upgrade";

export default class UpgradeDroneExp extends Upgrade
{
    constructor(amount)
    {
        super(`Drone exp +${amount}`);

        this.amount = amount;
    }

    ApplyUpgrade()
    {
        this.GameWorld().droneExp += this.amount;
    }
}