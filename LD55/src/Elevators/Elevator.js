import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_UTILS, consoleLog } from "../main";
import TriggerZone from "../PhysObjects/TriggerZone";
import { vec2 } from "p2";
import TimeStepper from "../TimeStepper";
import PassengerFollowUi from "./PassengerFollowUi";
import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";

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

    EmptySlots()
    {
        return this.srcTiles.length - this.passengers.length;
    }

    Update(deltaTime)
    {
        this.disembarkTimer.TickBy(deltaTime);
    }

    Setup()
    {
        this.elevatorBounds = null;
        this.speed = 3 * PIXEL_SCALE;

        this.leftDoorOpen = false;
        this.rightDoorOpen = false;

        this.disembarkTimer = new TimeStepper(0.5, { onComplete: () => { this.DisembarkCountdownComplete(); } });

        this.passengers = [];
        this.passengerUi = new PassengerFollowUi(this);
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

    GetDisembarkPosition(info)
    {
        consoleLog("Disembark info:");
        consoleLog(info);

        let dirMulti = 1;
        if(info.dir === CONDEMNED_INPUT.MOVE_LEFT)
        {
            dirMulti = -1;
        }

        consoleLog(`Disembark direction: ${dirMulti}`);

        let disembarkPos = [ this.phys.position[0] + (dirMulti * PIXEL_SCALE), this.phys.position[1] ];
        consoleLog(`DISEMBARK POS: (x: ${disembarkPos[0].toFixed(3)}, y: ${disembarkPos[1].toFixed(3)})`);

        return disembarkPos;
    }

    ToggleRightDoor()
    {
        this.rightDoorOpen = !this.rightDoorOpen;

        if(this.rightDoorOpen) this.DoorOpened();
    }

    ToggleLeftDoor()
    {
        this.leftDoorOpen = !this.leftDoorOpen;

        if(this.leftDoorOpen) this.DoorOpened();
    }

    DisembarkPassenger()
    {
        if(this.CanDisembark())
        {
            for(let i = 0; i < this.passengers.length; i ++)
            {
                consoleLog(`Check if passenger ${i}: (${this.passengers[i].name}) wants to disembark?`);

                let info = {};
                if(this.passengers[i].IsDesiredDisembark(this, info))
                {
                    let disembarkPosition = this.GetDisembarkPosition(info);

                    this.passengers[i].Disembark(disembarkPosition);
                    this.passengers.splice(i, 1);
                    this.disembarkTimer.StartTimer();
                    break;
                }
            }
        }
    }

    DisembarkCountdownComplete()
    {
        this.DisembarkPassenger();
    }

    DoorOpened()
    {
        consoleLog("<< Door Opened >>");
        this.DisembarkPassenger();
        this.Stop();
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
        if(this.passengers.findIndex(p => p === npc) < 0)
        {
            this.passengers.push(npc);
            npc.Neutralise();

            this.disembarkTimer.Reset();
            this.disembarkTimer.StartTimer();
        }
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

    ElevatorAtFloors()
    {
        return this.Scheduler()?.GetFloorLayerForPhysObject(this).floors;
    }

    IsAtFloor(floorNumber)
    {
        let isAtFloor = false;
        let atFloors = this.ElevatorAtFloors();

        for(let i = 0; i < atFloors.length; i ++)
        {
            if(atFloors[i].floorNumber === floorNumber)
            {
                isAtFloor = true;
                break;
            }
        }

        return isAtFloor;
    }

    CanDisembark()
    {
        return this.GetDistanceToFloorLayer() < 12;
    }

    GetDistanceToFloorLayer()
    {
        let layer = this.Scheduler().GetFloorLayerForPhysObject(this);
        
        let dist = NaN;

        if(layer)
        {
            
            dist = this.phys.aabb.lowerBound[1] - layer.y;
        }

        return dist;
    }

    GetCurrentFloorNumber()
    {
        let number = -1;

        let layer = this.Scheduler()?.GetFloorLayerForPhysObject(this);

        if(layer)
        {
            number = layer.number;
        }

        return this.Scheduler()?.GetFloorLayerForPhysObject(this)?.number;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        this.texture._drawEnhanced(screenPos.x, screenPos.y);        
    }
}