import { EM } from "../main";
import Pickup from "../Pickup";

export default class SpawnBoulderPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);
    }

    ActivatePickup(player)
    {
        let mazeEntity = EM.GetEntity("Maze");

        mazeEntity.SpawnBoulder(player.GetScreenPos());
    }
}