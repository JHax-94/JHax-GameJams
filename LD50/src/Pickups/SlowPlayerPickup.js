import Pickup from "../Pickup";

export default class SlowPlayerPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        player.AddStatus("SlowPlayer", 5);
    }
}