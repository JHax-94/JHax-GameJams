import { consoleLog } from "./main";
import Pickup from "./Pickup";
import ControlFlipPickup from "./Pickups/ControlFlipPickup";
import DecoyPickup from "./Pickups/DecoyPickup";
import ExtraMissilePickup from "./Pickups/ExtraMissilePickup";
import GhostModePickup from "./Pickups/GhostModePickup";
import MissilePushBackPickup from "./Pickups/MissilePushBackPickup";
import MissileSlowDownPickup from "./Pickups/MissileSlowDownPickup";
import MissileSpeedUpPickup from "./Pickups/MissileSpeedUpPickup";
import PlayerSpeedUpPickup from "./Pickups/PlayerSpeedUpPickup";
import SlowPlayerPickup from "./Pickups/SlowPlayerPickup";
import SpawnBoulderPickup from "./Pickups/SpawnBoulderPickup";

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

        if(objectToSpawn.name === "N/A")
        {
            this.lastSpawnedObject = new GhostModePickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "MissileSpeedUp")
        {
            this.lastSpawnedObject = new MissileSpeedUpPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "ExtraMissile")
        {
            this.lastSpawnedObject = new ExtraMissilePickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "SlowPlayer")
        {
            this.lastSpawnedObject = new SlowPlayerPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "ControlFlip")
        {
            this.lastSpawnedObject = new ControlFlipPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "SpawnBoulder")
        {
            this.lastSpawnedObject = new SpawnBoulderPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        /*else if(objectToSpawn.name === "MissileSpeedDown")
        {
            this.lastSpawnedObject = new MissileSlowDownPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "MissilePushback")
        {
            this.lastSpawnedObject = new MissilePushBackPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "PlayerSpeedUp") 
        {
            this.lastSpawnedObject = new PlayerSpeedUpPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }
        else if(objectToSpawn.name === "Decoy")
        {
            this.lastSpawnedObject = new DecoyPickup(this.pos, objectToSpawn, this, objectToSpawn.name);
        }*/
        else
        {
            consoleLog("USE GENERIC PICKUP CLASS");
            this.lastSpawnedObject = new Pickup(this.pos, objectToSpawn.spriteIndex, this, objectToSpawn.name);
        }
    }
}