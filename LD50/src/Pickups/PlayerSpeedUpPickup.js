import Pickup from "../Pickup";

export default class PlayerSpeedUpPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        player.AddPowerUp("PlayerSpeedUp");
    }
}