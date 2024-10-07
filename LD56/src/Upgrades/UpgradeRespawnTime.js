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

    static UpgradeAmount()
    {
        let roll = random(10);

        let amount = 0.1;
        if(roll === 9)
        {
            amount = 0.25;
        }
        else if(roll >= 7)
        {
            amount = 0.2;
        }

        return amount;
    }
}