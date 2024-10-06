import { extend } from "p2/src/utils/Utils";
import Spawner from "./Spawner";
import RoyalJelly from "../Pickups/RoyalJelly";

export default class RoyalJellySpawner extends Spawner
{
    constructor(gameWorld)
    {
        super(gameWorld);

        this.jellies = [];

        this.spawnTime = 180;
        this.spawnTimer = 0;
    }

    SpawnRoyalJelly()
    {
        let pos = this.GetOffscreenPosition();

        this.jellies.push(new RoyalJelly(pos));
    }

    SpawnRoyalJellyOnScreen()
    {
        let pos = this.GetOnscreenPosition();

        this.jellies.push(new RoyalJelly(pos));
    }

    Update(deltaTime)
    {
        this.spawnTimer += deltaTime;
        if(this.spawnTimer >= this.spawnTime)
        {
            this.spawnTimer -= this.spawnTime;
            this.SpawnRoyalJelly();
        }
    }
}