
import Pickup from "../Pickup";

export default class DecoyPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        player.AddPowerUp("Decoy");
    }
}