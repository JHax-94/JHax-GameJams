import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import TriggerZone from "../PhysObjects/TriggerZone";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog } from "../main";

export default class ElevatorSummoner
{
    constructor(tile, objDef)
    {
        this.hideCollider= true;

        this.srcTile = tile;

        this.isFlipped = this.srcTile.flipH;

        this.spriteIndex = objDef.index;
        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "ELEVATOR_SUMMONER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.NPC_INTERACTABLE,
            collisionMask: 0,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, {physSettings: physSettings});

        this.Setup();
        
        this.queueDims = { w: 1, h: 2 };

        let queuePos = this.GetQueueTilePos();

        consoleLog(`QUEUE START POSITION:`);
        consoleLog(queuePos);

        this.queueTriggerZone = new TriggerZone({ x: queuePos.x, y: queuePos.y, w: queuePos.w, h: queuePos.h }, this, {
            tag: "ELEVATOR_QUEUE",
            collisionGroup: COLLISION_GROUP.NPC_INTERACTABLE,
            collisionMask: COLLISION_GROUP.NPC
        });
    }

    Setup()
    {
        this.bounds = null;
        this.queue = [];
        this.isBoarding = false;
    }

    AddToQueue(queuer)
    {
        let index = this.queue.indexOf(queuer);
        
        if(index < 0)
        {
            this.queue.push(queuer);

            this.QueueChanged();
        }
    }

    RemoveFromQueue(queuer)
    {
        let index = this.queue.indexOf(queuer);

        if(index >= 0)
        {
            this.queue.splice(index, 1);

            this.QueueChanged()
        }
    }

    GetQueueTilePos(forLength = null)
    {
        if(forLength === null)
        {
            forLength = this.queue.length;
        }

        //consoleLog(`Get queuetile pos for summoner on tile: (${this.srcTile.x}, ${this.srcTile.y}) | Queue length: ${forLength}`);

        let tilePos = {
            x: this.srcTile.x + (0.5 + forLength * 1.125) * (this.isFlipped ? -1 : 1),
            y: this.srcTile.y - 1,
            w: this.queueDims.w,
            h: this.queueDims.h
        };

        return tilePos;
    }

    QueueZone()
    {
        return this.queueTriggerZone;
    }

    Elevator()
    {
        let elevator = null;
        if(this.bounds)
        {
            elevator = this.bounds.elevator;
        }

        return elevator;
    }

    QueueChanged()
    {
        this.queueTriggerZone.MoveToTilePos(this.GetQueueTilePos());

        consoleLog("QUEUE CHANGED");
        consoleLog(this.queue);

        for(let i = 0; i < this.queue.length; i ++)
        {
            let newQueuePos = this.GetQueueTilePos(i);

            //consoleLog(`Give queuer ${i} the queue position: (${newQueuePos.x}, ${newQueuePos.y})`);

            this.queue[i].UpdateQueuePosition(newQueuePos);
        }
    }

    FloorNumber()
    {
        let floorNumber = NaN;

        if(this.floor)
        {
            floorNumber = this.floor.floorNumber;
        }

        return floorNumber;
    }

    CanBoardElevator(elevator)
    {
        let relevantDoorOpen = (elevator.rightDoorOpen && elevator.phys.position[0] < this.phys.position[0]) 
            || (elevator.leftDoorOpen && elevator.phys.position[0] > this.phys.position[0]);

        let elevatorHasRoom = elevator.EmptySlots() > 0;

        return relevantDoorOpen && elevatorHasRoom && elevator.IsAtFloor(this.FloorNumber());
    }

    Update(deltaTime)
    {
        if(this.queue.length > 0)
        {
            let elevator = this.Elevator();
            
            if(this.queue[0].StateIs(CONDEMNED_STATE.BOARDING) === false && this.CanBoardElevator(elevator))
            {
                this.isBoarding = true;
                this.queue[0].StartBoarding();
            }
            else if(this.isBoarding && this.CanBoardElevator(elevator) === false)
            {
                if(this.queue[0].StateIs(CONDEMNED_STATE.BOARDING))
                {
                    this.queue[0].StopBoarding();
                }

                this.isBoarding = false;
            }
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.queue.length > 0)
        {
            EM.hudLog.push(`S${this.FloorNumber()}: ${this.CanBoardElevator(this.Elevator())}`);
        }

        sprite(this.spriteIndex, screenPos.x, screenPos.y, this.isFlipped);
    }
}