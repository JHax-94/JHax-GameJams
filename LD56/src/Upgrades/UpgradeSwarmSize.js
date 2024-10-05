import Upgrade from "./Upgrade";

export default class UpgradeSwarmSize extends Upgrade
{
    constructor(upgradeBy)
    {
        super(`Swarm Size +${upgradeBy}`);

        this.upgradeAmount = upgradeBy;
    }

    ApplyUpgrade()
    {
        let player = this.GameWorld().player;

        player.IncreaseSwarmSize(this.upgradeAmount);
        
        this.UpgradeFinished();
    }
}