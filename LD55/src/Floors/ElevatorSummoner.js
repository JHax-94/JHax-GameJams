import TriggerZone from "../PhysObjects/TriggerZone";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog } from "../main";

export default class ElevatorSummoner
{
    constructor(tile, objDef)
    {
        this.hideCollider= true;

        this.srcTile = tile;

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
    }

    AddToQueue(queuer)
    {
        this.queue.push(queuer);

        this.QueueChanged();
    }

    RemoveFromQueue(queuer)
    {
        let index = this.queue.indexOf(queuer);

        if(index >= 0)
        {
            this.queue.splice(index, 1);
        }

        this.QueueChanged()
    }

    GetQueueTilePos()
    {
        consoleLog(`Get queuetile pos for summoner on tile: (${this.srcTile.x}, ${this.srcTile.y}) | Queue length: ${this.queue.length}`);

        let tilePos = {
            x: this.srcTile.x + 0.5 + this.queue.length * 1.125,
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

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
}