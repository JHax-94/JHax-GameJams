import { consoleLog, EM, PIXEL_SCALE } from "./main";
import Pickup from "./Pickup";
import ControlFlipPickup from "./Pickups/ControlFlipPickup";
import ExtraMissilePickup from "./Pickups/ExtraMissilePickup";
import GhostModePickup from "./Pickups/GhostModePickup";
import MissileSpeedUpPickup from "./Pickups/MissileSpeedUpPickup";
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
        let player = EM.GetEntity("Player");

        let playerPos = player.GetScreenPos();
        
        let playerTooClose = false;

        let xDiff = Math.abs(playerPos.x - this.pos.x * PIXEL_SCALE);
        let yDiff = Math.abs(playerPos.y - this.pos.y * PIXEL_SCALE); 
    
        consoleLog(`Spawner Dist: (${xDiff}, ${yDiff})`);

        if(xDiff <= 8  && yDiff <= 8)
        {
            playerTooClose = true;
        }

        if(!playerTooClose)
        {
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
            else
            {
                this.lastSpawnedObject = new Pickup(this.pos, objectToSpawn.spriteIndex, this, objectToSpawn.name);
            }
        }
    }
}