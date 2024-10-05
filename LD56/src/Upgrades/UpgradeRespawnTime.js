import { extend } from "p2/src/utils/Utils";
import Upgrade from "./Upgrade";

export default class UpgradeRespawnTime extends Upgrade
{
    constructor(amount)
    {
        super(`Respawn time -${amount*100}%`);

        this.amount = amount;
    }

    ApplyUpgrade()
    {
        let player = this.GameWorld().player;

        player.DecreaseRespawnTime(this.amount);
        this.UpgradeFinished();
    }
}