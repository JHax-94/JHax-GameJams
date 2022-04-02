import { consoleLog } from "./main";
import Pickup from "./Pickup";
import GhostModePickup from "./Pickups/GhostModePickup";

export default class SpawnLocation
{
    constructor(tilePos)
    {
        this.pos = tilePos;

        this.lastSpawnedObject = null;
    }

    CanSpawn()
    {
        let canSpawn = false;

        if(!this.lastSpawnedObject)
        {
            canSpawn = true;
        }

        return canSpawn;
    }

    PickupCollected()
    {
        this.lastSpawnedObject = null;
    }

    SpawnObject(objectToSpawn)
    {
        consoleLog("SPAWN OBJECT!");
        consoleLog(objectToSpawn);

        if(objectToSpawn.name === "Ghost")
        {
            this.lastSpawnedObject = new GhostModePickup(this.pos, objectToSpawn, this);
        }
    }
}