import { consoleLog } from "../main";
import Pickup from "../Pickup";

export default class MissilePushBackPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        player.AddPowerUp("MissilePushback");
    }
}   