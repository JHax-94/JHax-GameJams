import Player from "tina/src/Player";
import Pickup from "../Pickup";

export default class GhostModePickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);

        this.pickupTime = 5;
    }

    ActivatePickup(player)
    {
        player.AddPowerUp("Ghost");
    }
}   