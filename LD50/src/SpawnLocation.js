import { consoleLog } from "./main";
import Pickup from "./Pickup";
import DecoyPickup from "./Pickups/DecoyPickup";
import GhostModePickup from "./Pickups/GhostModePickup";
import MissilePushBackPickup from "./Pickups/MissilePushBackPickup";
import MissileSlowDownPickup from "./Pickups/MissileSlowDownPickup";
import PlayerSpeedUpPickup from "./Pickups/PlayerSpeedUpPickup";

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
        else if(objectToSpawn.name === "MissileSpeedDown")
        {
            this.lastSpawnedObject = new MissileSlowDownPickup(this.pos, objectToSpawn, this);
        }
        else if(objectToSpawn.name === "MissilePushback")
        {
            this.lastSpawnedObject = new MissilePushBackPickup(this.pos, objectToSpawn, this);
        }
        else if(objectToSpawn.name === "PlayerSpeedUp") 
        {
            this.lastSpawnedObject = new PlayerSpeedUpPickup(this.pos, objectToSpawn, this);
        }
        else if(objectToSpawn.name === "Decoy")
        {
            this.lastSpawnedObject = new DecoyPickup(this.pos, objectToSpawn, this);
        }
    }
}