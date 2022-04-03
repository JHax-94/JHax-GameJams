import { EM, SFX } from "../main";
import Pickup from "../Pickup";

export default class SpawnBoulderPickup extends Pickup
{
    constructor(position, pickupData, spawner)
    {
        super(position, pickupData.spriteIndex, spawner);

        this.collectSfx = SFX.useRockSpawn;
    }

    ActivatePickup(player)
    {
        let mazeEntity = EM.GetEntity("Maze");

        mazeEntity.SpawnBoulder(player.GetScreenPos());
    }
}