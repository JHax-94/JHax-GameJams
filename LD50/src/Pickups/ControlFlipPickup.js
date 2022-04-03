import { SFX } from "../main";
import Pickup from "../Pickup";

export default class ControlFlipPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);

        this.collectSfx = SFX.useControlFlip;
    }

    ActivatePickup(player)
    {
        let randomNum = random(2);
        player.AddStatus(`ControlFlip_${randomNum}`, 5);
    }
}