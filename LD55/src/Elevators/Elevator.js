import Texture from "pixelbox/Texture";
import { AUDIO, COLLISION_GROUP, EM, PIXEL_SCALE, TILE_UTILS, consoleLog } from "../main";
import TriggerZone from "../PhysObjects/TriggerZone";
import { Particle, vec2 } from "p2";
import TimeStepper from "../TimeStepper";
import PassengerFollowUi from "./PassengerFollowUi";
import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import ParticleSystem from "../ParticleSystem";
import { CONDEMNED_MARK } from "../Enums/CondemnedMark";

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

        this.doorSpeed = 4;

        this.rightDoorOpenAmnt = 0;
        this.leftDoorOpenAmnt = 0;

        this.triggerZone = new TriggerZone({
            x: this.dims.x - 1,
            y: this.dims.y,
            w: this.dims.w + 1,
            h: this.dims.h
        },
        this,
        { hideCollider: false, lockToParent: true });


        this.impParticles = new ParticleSystem({ 

            renderLayer: "IMP",
            max: 30,
            rect: { w: 0.325, h: 0.325, c: [ 13, 14, 15 ]  },
            rootPos: () => { 
                let sp = this.GetScreenPos();
                return { x: sp.x + PIXEL_SCALE * this.dims.w * 0.5, y: sp.y };
            },
            offset: {
                r: 0.25,
            },
            //velocity: { r: 5 },
            velocity: { x: 0, y: 40 },
            lifetime: 0.5,
            spawnTime: 0.01,
            preWarm: false
        });

        this.Setup();
    }

    ImpOnBoard(imp)
    {
        this.imp = imp;
        if(this.imp)
        {
            this.impParticles.Play();
        }
        else
        {
            this.impParticles.Off();
        }
    }

    EmptySlots()
    {
        return this.Capacity() - this.passengers.length;
    }

    Capacity()
    {
        return this.srcTiles.length;
    }

    GetPassengerPosition(npc)
    {
        return this.passengerUi.GetPassengerPosition(npc);
    }

    Update(deltaTime)
    {
        this.disembarkTimer.TickBy(deltaTime);

        if(this.leftDoorOpen && this.leftDoorOpenAmnt < 1)
        {
            this.leftDoorOpenAmnt += this.doorSpeed * deltaTime;
            if(this.leftDoorOpenAmnt > 1)
            {
                this.leftDoorOpenAmnt = 1;
            }
        }

        if(this.rightDoorOpen && this.rightDoorOpenAmnt < 1)
        {
            this.rightDoorOpenAmnt += this.doorSpeed * deltaTime;
            if(this.rightDoorOpenAmnt > 1)
            {
                this.rightDoorOpenAmnt = 1;
            }
        }
        
        if(!this.leftDoorOpen && this.leftDoorOpenAmnt > 0)
        {
            this.leftDoorOpenAmnt -= this.doorSpeed * deltaTime;
            if(this.leftDoorOpenAmnt < 0)
            {
                this.leftDoorOpenAmnt = 0;
            }
        }

        if(!this.rightDoorOpen&& this.rightDoorOpenAmnt > 0)
        {
            this.rightDoorOpenAmnt -= this.doorSpeed * deltaTime;

            if(this.rightDoorOpenAmnt < 0)
            {
                this.rightDoorOpenAmnt = 0;
            }
        }

        for(let i = 0; i < this.passengers.length; i ++)
        {
            if(this.passengers[i].mark === CONDEMNED_MARK.OBLITERATED)
            {
                this.passengers.splice(i, 1);
            }
        }

        this.LockToBounds();
    }

    LockToBounds()
    {
        let tolerance = 0.1;
        let minY = this.elevatorBounds.MinY() - tolerance;
        let maxY = this.elevatorBounds.MaxY() + tolerance;

        let topY = this.phys.aabb.upperBound[1];
        let bottomY = this.phys.aabb.lowerBound[1];

        let inBoundTop = maxY > topY;
        let inBoundBottom = minY < bottomY;

        //consoleLog(`Check elevator (${bottomY} > ${topY}) within bounds: (${minY} > ${maxY}): ${inBoundBottom} | ${inBoundTop}`);

        let elevatorHeight = (this.dims.h * PIXEL_SCALE);

        if(!inBoundTop)
        {
            /*
            consoleLog("Out of bounds: (top)");
            consoleLog(this.phys);*/

            let safeY = maxY - tolerance - elevatorHeight * 0.5;
            this.phys.position = [ this.phys.position[0], safeY ];
        }
        else if(!inBoundBottom)
        {
            /*consoleLog("Out of bounds (bottom)");
            consoleLog(this.phys);*/

            let safeY  = minY + tolerance + elevatorHeight *0.5;

            //consoleLog(`Lock Y to: ${safeY}`);

            this.phys.position = [this.phys.position[0], safeY];
        }
    }

    Setup()
    {
        this.imp = null;

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

    StopsAtFloors()
    {
        let connectedFloors = this.elevatorBounds.ListConnectedFloors();

        return connectedFloors;
    }

    StopsAtFloor(floorNumber)
    {
        let stops = !!this.GetSummonerOnFloor(floorNumber);

        //consoleLog(`Does stop at floor? ${floorNumber}: ${stops}`);

        return stops;
    }

    GetSummoners()
    {
        return this.elevatorBounds.summoners;
    }

    GetSummonerOnFloor(floorNumber, log)
    {
        let summoner = null;

        if(this.elevatorBounds)
        {
            let summoners = this.elevatorBounds.summoners;

            if(log)
            {
                consoleLog(`Check list of summoners for floor${floorNumber}`);
                consoleLog(summoners);
            }

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
        /*consoleLog("Disembark info:");
        consoleLog(info);*/

        let dirMulti = 1;
        if(info.dir === CONDEMNED_INPUT.MOVE_LEFT)
        {
            dirMulti = -1;
        }

        if(this.dims.x === 0)
        {
            dirMulti = 1;
        }
        else if(this.dims.x === 15)
        {
            dirMulti = -1;
        }

        //consoleLog(`Disembark direction: ${dirMulti}`);

        let disembarkPos = [ this.phys.position[0] + (dirMulti * PIXEL_SCALE), this.phys.position[1] ];
        //consoleLog(`DISEMBARK POS: (x: ${disembarkPos[0].toFixed(3)}, y: ${disembarkPos[1].toFixed(3)})`);

        return disembarkPos;
    }

    ToggleRightDoor()
    {
        this.rightDoorOpen = !this.rightDoorOpen;

        if(this.rightDoorOpen)
        {
            this.DoorOpened();
        } 
        else
        {
            AUDIO.PlayFx("door_closed");
        }
    }

    ToggleLeftDoor()
    {
        this.leftDoorOpen = !this.leftDoorOpen;

        if(this.leftDoorOpen) 
        {
            this.DoorOpened();
        }
        else
        {
            AUDIO.PlayFx("door_closed");
        }
    }

    DisembarkPassenger()
    {
        if(this.CanDisembark())
        {
            for(let i = 0; i < this.passengers.length; i ++)
            {
                //consoleLog(`Check if passenger ${i}: (${this.passengers[i].name}) wants to disembark?`);

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
        AUDIO.PlayFx("door_open");
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

        AUDIO.PlayFx("door_closed");
    }

    ObjectEntered(newObject, fromZone)
    {
        if(newObject.tag === "PLAYER")
        {
            consoleLog("PLAYER ENTERED ELEVATOR");

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
            npc.Neutralise(this);

            this.disembarkTimer.Reset();
            this.disembarkTimer.StartTimer();
        }
    }

    ObjectExited(oldObject, fromZone)
    {
        if(oldObject.tag === "PLAYER")
        {
            consoleLog("PLAYER LEFT ELEVATOR");

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

    StopsAtCurrentLayer()
    {
        let layer = this.Scheduler().GetFloorLayerForPhysObject(this);

        let stops = false;

        if(layer)
        {
            for(let i = 0; i < layer.floors.length; i ++)
            {
                if(this.StopsAtFloor(layer.floors[i].floorNumber))
                {
                    stops = true;
                    break;
                }
            }
        }

        return stops;
    }

    CanDisembark()
    {
        return this.GetDistanceToFloorLayer() < 12 && this.StopsAtCurrentLayer();
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


    GetDoorDims()
    {
        let doorRect = { x: 0, y: 0, w: 0, h: 0 };

        if(this.dims.w === 1)
        {
            doorRect.x = 0;
            doorRect.y = 0;
            doorRect.w = 6;
            doorRect.h = 2 *PIXEL_SCALE - 8;
        }
        else if(this.dims.w === 2)
        {
            doorRect.x = 0,
            doorRect.y = 0,
            doorRect.w = 12,
            doorRect.h = 2 * PIXEL_SCALE - 6
        }

        return doorRect;
    }

    GetRightDoorRect()
    {
        let doorRect = { x: 0, y: 0, w: 0, h: 0 };

        let doorDims = this.GetDoorDims();

        doorRect.w = doorDims.w * this.rightDoorOpenAmnt;
        doorRect.h = doorDims.h;

        if(this.dims.w === 1)
        {
            doorRect.x = PIXEL_SCALE*0.5;
            doorRect.y = 4;
        }
        else if(this.dims.w === 2)
        {
            doorRect.x = PIXEL_SCALE;
            doorRect.y = 3;
        }

        return doorRect;
    }

    GetLeftDoorRect()
    {
        let doorRect = { x: 0, y: 0, w: 0, h :0 };
        let doorDims = this.GetDoorDims();

        doorRect.w = doorDims.w * this.leftDoorOpenAmnt;
        doorRect.h = doorDims.h;

        if(this.dims.w === 1)
        {
            doorRect.x = 2 + (doorDims.w - doorRect.w);
            doorRect.y = 4;
        }
        else if(this.dims.w === 2)
        {
            doorRect.x = 4 + (doorDims.w - doorRect.w);
            doorRect.y = 3;
        }

        return doorRect;
    }

    DrawDoorRect(screenPos, doorRect)
    {
        paper(0);
        rectf(screenPos.x + doorRect.x, screenPos.y + doorRect.y, doorRect.w, doorRect.h);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        this.texture._drawEnhanced(screenPos.x, screenPos.y);        

        if(this.rightDoorOpenAmnt > 0)
        {
            let doorRect = this.GetRightDoorRect()
            this.DrawDoorRect(screenPos, doorRect);
        }

        if(this.leftDoorOpenAmnt > 0)
        {
            let doorRect = this.GetLeftDoorRect();
            this.DrawDoorRect(screenPos, doorRect);
        }

    }
}