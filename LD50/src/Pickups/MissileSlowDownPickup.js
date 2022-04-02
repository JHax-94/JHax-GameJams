import { consoleLog } from "../main";
import Pickup from "../Pickup";

export default class MissileSlowDownPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);

        consoleLog("MISSILE SPEED DOWN CONSTRUCTED");
        consoleLog(this);
    }

    ActivatePickup(player)
    {
        player.AddPowerUp("MissileSpeedDown");
    }
}   