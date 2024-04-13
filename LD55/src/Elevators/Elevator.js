import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_UTILS, consoleLog } from "../main";
import TriggerZone from "../PhysObjects/TriggerZone";
import { vec2 } from "p2";

export default class Elevator 
{
    constructor(tiles, objDef)
    {
        this.hideCollider = true;
        
        this.srcTiles = tiles;
        
        this.dims = TILE_UTILS.GetBlockDimensions(tiles);
        this.texture = TILE_UTILS.BuildTextureFromTiles(tiles, this.dims);
        
        let physSettings = {
            tileTransform: { x: this.dims.x, y: this.dims.y, w: this.dims.w, h: this.dims.h },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "ELEVATOR",
            collisionGroup: COLLISION_GROUP.ELEVATOR,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        };

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.triggerZone = new TriggerZone({
            x: this.dims.x - 1,
            y: this.dims.y,
            w: this.dims.w + 1,
            h: this.dims.h
        },
        this,
        { hideCollider: false, lockToParent: true });

        this.Setup();
    }

    Setup()
    {
        this.elevatorBounds = null;
        this.speed = 30;

        this.leftDoorOpen = false;
        this.rightDoorOpen = false;

        this.passengers = [];
    }

    Scheduler()
    {
        if(!this.scheduler)
        {
            this.scheduler = EM.GetEntity("SCHEDULER");
        }

        return this.scheduler;
    }

    

    StopsAtFloor(floorNumber)
    {
        return !!this.GetSummonerOnFloor(floorNumber);
    }

    GetSummonerOnFloor(floorNumber)
    {
        let summoner = null;

        if(this.elevatorBounds)
        {
            let summoners = this.elevatorBounds.summoners;

            for(let i = 0; i < summoners.length; i ++)
            {
                if(summoners[i].FloorNumber() === floorNumber)
                {
                    summoner = summoners[i];
                    break;
                }
            }
        }
        else
        {
            console.error(`Unable to check stops for elevator without bounds`);
            consoleLog(this);
        }

        return summoner;
    }

    AddBounds(bounds)
    {
        this.elevatorBounds = bounds;
        bounds.elevator = this;
    }

    IsMoving()
    {
        return vec2.sqrLen(this.phys.velocity) > 0;
    }

    MoveUp()
    {
        this.phys.velocity = [ this.phys.velocity[0], this.speed ];
    }

    MoveDown()
    {
        this.phys.velocity = [this.phys.velocity[0], -this.speed];
    }

    Stop()
    {
        this.phys.velocity = [0, 0];
    }

    GetDisembarkPosition()
    {
        return [ this.phys.position[0] + PIXEL_SCALE, this.phys.position[1] ];
    }

    ToggleRightDoor()
    {
        this.rightDoorOpen = !this.rightDoorOpen;
    }

    ToggleLeftDoor()
    {
        this.leftDoorOpen = !this.leftDoorOpen;
    }

    DoorsClosed()
    {
        return !this.rightDoorOpen && !this.leftDoorOpen;
    }

    CloseAllDoors()
    {
        this.rightDoorOpen = false;
        this.leftDoorOpen = false;
    }

    ObjectEntered(newObject, fromZone)
    {
        if(newObject.tag === "PLAYER")
        {
            let player = newObject.obj;

            player.SetElevator(this);
        }
        else if(newObject.tag === "NPC")
        {
            let npc = newObject.obj;

            npc.BoardElevator(this);
        }
    }

    OnBoard(npc)
    {
        this.passengers.push(npc);
        npc.Neutralise();
    }

    ObjectExited(oldObject, fromZone)
    {
        if(oldObject.tag === "PLAYER")
        {
            let player = oldObject.obj;

            player.RemoveElevator(this);
        }
        else if(oldObject.tag === "NPC")
        {
            let npc = oldObject.obj;

            npc.BoardElevator(null);
        }
    }

    GetCurrentFloorNumber()
    {
        return this.Scheduler()?.GetFloorForPhysObject(this)?.floorNumber ?? -1;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        this.texture._drawEnhanced(screenPos.x, screenPos.y);        
    }
}