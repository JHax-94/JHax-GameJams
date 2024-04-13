import { vec2 } from "p2";
import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import { COLLISION_GROUP, EM, consoleLog, getObjectConfig } from "../main";
import WorkstationInteractions from "./WorkstationInteractions";

export default class CondemnedSoul
{
    constructor(tile, data, scheduler)
    {
        this.hideCollider = true;
        this.schedule = data.schedule;

        this.scheduler = scheduler;

        let config = getObjectConfig(data.type, true);

        if(config.spriteIndex >= 0)
        {
            this.spriteIndex = config.spriteIndex;
        }

        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: false,
            tag: "NPC",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.NPC,
            collisionMask: (COLLISION_GROUP.ELEVATOR | COLLISION_GROUP.FLOOR | COLLISION_GROUP.NPC_INTERACTABLE),
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings }); 

        this.Setup();
    }

    Setup()
    {
        this.workstation = new WorkstationInteractions(this);

        this.reelDist = 10;

        this.state = CONDEMNED_STATE.IDLE;
        this.speed = 10;
        this.scheduleItem = null;
        this.elvatorRoute = null;
        this.elevatorRouteStep = -1;
        this.scheduleStep = -1;

        this.input = null;
    }

    StateIs(queryState)
    {
        return this.state === queryState;
    }

    SetState(targetState)
    {
        consoleLog(`Set NPC State to: ${targetState}`);
        this.state = targetState;
    }

    Update(deltaTime)
    {
        this.UpdateThink(deltaTime);
        EM.hudLog.push(`S: ${this.state}, I: ${this.input}, F: ${this.GetCurrentFloor()}`);
        this.UpdateAct(deltaTime);
    }

    UpdateThink(deltaTime)
    {
        this.input = null;

        if(!this.scheduleItem)
        {
            //// If I don't know what's on the schedule, check it
            this.GetNextScheduledItem();
        }
        else
        {
            EM.hudLog.push(`F:${this.scheduleItem.floor}, W: ${this.scheduleItem.workstation}`);
            //// If I know what's next on the schedule, I should move towards my next schedule Item
            this.AttemptMoveToTarget(this.scheduleItem);
        }
    }

    UpdateAct(deltaTime)
    {
        if(this.StateIs(CONDEMNED_STATE.WORKING))
        {
            this.workstation.UpdateWork(deltaTime);
        }
        else if(this.StateIs(CONDEMNED_STATE.QUEUEING))
        {
            let queuePosDiff = this.queuePosition[0] - this.phys.position[0];

            if(Math.abs(queuePosDiff) > 0.01)
            {
                let newX = this.phys.position[0] + Math.sign(queuePosDiff) * this.reelDist * deltaTime;

                if(queuePosDiff < 0 && newX < this.queuePosition[0])
                {
                    newX = this.queuePosition[0];
                }
                else if(queuePosDiff > 0 && newX > this.queuePosition[0])
                {
                    newX = this.queuePosition[0]
                }

                this.phys.position = [ newX, this.phys.position[1] ];
            }
        }
        else
        {
            if(this.input === CONDEMNED_INPUT.MOVE_LEFT || this.input === CONDEMNED_INPUT.MOVE_RIGHT)
            {
                this.phys.velocity = [ this.speed * this.input, this.phys.velocity[1] ];
            }
        }
    }

    AttemptMoveToTarget(scheduleItem)
    {
        /// If I am on the right floor for my schedule item I should go to my work station

        let currentFloor = this.GetCurrentFloor();

        if(scheduleItem.floor === currentFloor)
        {
            let workstation = this.scheduler.GetTargetWorkstation(scheduleItem);

            this.DetermineMoveDirectionToTarget(workstation);
        }
        else if(!this.elevatorRoute)
        {
            consoleLog(`Look for route from Floor ${this.GetCurrentFloor()} to floor ${scheduleItem.floor}`);
            this.elevatorRoute = this.scheduler.PlotRouteToFloor(currentFloor, scheduleItem.floor, true);
            this.elevatorRouteStep = 0;
        }
        else
        {
            this.targetElevator = this.elevatorRoute[this.elevatorRouteStep];
            let targetButton = this.scheduler.FindButtonForElevator(this.targetElevator, currentFloor)

            this.DetermineMoveDirectionToTarget(targetButton.QueueZone());
        }
    }

    DetermineMoveDirectionToTarget(target)
    {
        if(target.phys.position[0] < this.phys.position[0])
        {
            this.input = CONDEMNED_INPUT.MOVE_LEFT;
        }
        else if(target.phys.position[0] > this.phys.position[0])
        {
            this.input = CONDEMNED_INPUT.MOVE_RIGHT;
        }
    }

    GetNextScheduledItem()
    {
        this.scheduleStep = this.scheduleStep + 1;
        if(this.scheduleStep < this.schedule.length)
        {
            let newScheduleStep = this.schedule[this.scheduleStep];
            this.SetScheduleItem(newScheduleStep);
        }
    }

    SetScheduleItem(scheduleStep)
    {
        consoleLog(`> Schedule Item Set:`);
        consoleLog(scheduleStep);

        this.scheduleItem = scheduleStep;
    }


    GetCurrentTargetWorkstation() 
    {
        let workstation = null;

        if(this.scheduleItem)
        {
            workstation = this.scheduler.GetTargetWorkstation(this.scheduleItem);
        }

        return workstation;
    }

    ProcessWorkstationCollision(workstation) { this.workstation.ProcessWorkstationCollision(workstation); }

    ScheduledItemCompleted()
    {
        this.scheduleItem = null;
        this.SetState(CONDEMNED_STATE.IDLE);
    }

    GetCurrentFloor()
    {
        return this.scheduler.GetFloorForPhysObject(this)?.floorNumber ?? 0;
    }

    QueueForElevator(elevatorSummoner)    
    {
        let targetElevator = this.elevatorRoute[this.elevatorRouteStep];

        if(elevatorSummoner.Elevator() === targetElevator)
        {
            this.SetState(CONDEMNED_STATE.QUEUEING);
            this.queuePosition = EM.TileToPhysPosition(elevatorSummoner.GetQueueTilePos());
            elevatorSummoner.AddToQueue(this);
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.spriteIndex >= 0)
        {
            sprite(this.spriteIndex, screenPos.x, screenPos.y);
        }
    }
}