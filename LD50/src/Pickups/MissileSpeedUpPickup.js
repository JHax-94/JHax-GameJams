import { consoleLog } from "../main";
import Pickup from "../Pickup";

export default class MissileSpeedUpPickup extends Pickup
{
    constructor(position, pickupData, spawner, powerUpName)
    {
        consoleLog("Constructing Missile speed up power up...");
        consoleLog(position);
        consoleLog(pickupData);
        consoleLog(spawner);
        consoleLog(powerUpName);

        super(position, pickupData.spriteIndex, spawner, powerUpName);
    }

    ActivatePickup(player)
    {
        player.AddStatus("MissileSpeedUp", 4);
    }
}