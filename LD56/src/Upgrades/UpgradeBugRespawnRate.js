import Upgrade from "./Upgrade";

export default class UpgradeBugRespawnRate extends Upgrade
{
    constructor(amount)
    {
        super(`Swarm Spawn Rate +${amount*100}%`);

        this.amount= amount;
    }

    ApplyUpgrade()
    {
        this.GameWorld().player.bugRespawnRate += this.amount;
    }
}