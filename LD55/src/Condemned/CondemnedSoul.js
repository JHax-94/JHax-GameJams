import { vec2 } from "p2";
import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import { COLLISION_GROUP, EM, consoleLog, getObjectConfig } from "../main";
import WorkstationInteractions from "./WorkstationInteractions";

export default class CondemnedSoul
{
    constructor(tile, data, scheduler)
    {
        this.renderLayer = "CONDEMNED";
        this.hideCollider = true;
        this.schedule = data.schedule;

        this.name = data.name;
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

    StartBoarding(elevator)
    {
        consoleLog(`${this.name}: Start boarding...`);

        if(!this.StateIs(CONDEMNED_STATE.BOARDING) && !this.StateIs(CONDEMNED_STATE.ON_BOARD))
        {
            this.SetState(CONDEMNED_STATE.BOARDING);
        }
    }

    StopBoarding()
    {
        consoleLog(`${this.name}: Abort boarding procedure!`);

        if(this.StateIs(CONDEMNED_STATE.BOARDING))
        {
            this.SetState(CONDEMNED_STATE.QUEUEING);
        }
    }

    BoardElevator(elevator)
    {
        this.boardableElevator = elevator;

        this.CheckToBoard();
    }

    CheckToBoard()
    {
        if(this.boardableElevator && this.StateIs(CONDEMNED_STATE.BOARDING))
        {
            consoleLog(`${this.name}: Boarding elevator`);
            this.boardableElevator.OnBoard(this);
            let summoner = this.scheduler.FindButtonForElevator(this.boardableElevator, this.GetCurrentFloor(), true);
            summoner.RemoveFromQueue(this);
        }
    }

    StateIs(queryState)
    {
        return this.state === queryState;
    }

    SetState(targetState)
    {
        consoleLog(`Set NPC ${this.name} State to: ${CONDEMNED_STATE.ToString(targetState)} (${targetState})`);
        this.state = targetState;

        if(this.state === CONDEMNED_STATE.BOARDING)
        {
            this.CheckToBoard();
        }
    }

    Neutralise()
    {
        this.SetState(CONDEMNED_STATE.ON_BOARD);
        this.phys.gravityScale = 0;
        this.phys.velocity = [ 0, 0];
    }



    Disembark(atPosition)
    {
        if(this.elevatorRoute)
        {
            if(this.elevatorRouteStep + 1 < this.elevatorRoute.length)
            {
                this.elevatorRouteStep ++;
            }
            else 
            {
                this.elevatorRoute = null;
                this.elevatorRouteStep = -1;
            }
        }

        this.phys.position = [ atPosition[0], atPosition[1]];
        this.SetState(CONDEMNED_STATE.IDLE);
        this.phys.gravityScale = 1;
    }

    Update(deltaTime)
    {
        EM.hudLog.push(`${this.name[0]}: (${this.phys.position[0].toFixed(2), this.phys.position[0].toFixed(2)})`);
        if(!this.StateIs(CONDEMNED_STATE.ON_BOARD))
        {
            this.UpdateThink(deltaTime);
            //EM.hudLog.push(`S: ${this.state}, I: ${this.input}, F: ${this.GetCurrentFloor()}`);
            this.UpdateAct(deltaTime);
        }
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
            //EM.hudLog.push(`F:${this.scheduleItem.floor}, W: ${this.scheduleItem.workstation}`);
            //// If I know what's next on the schedule, I should move towards my next schedule Item
            this.AttemptMoveToTarget(this.scheduleItem);
        }
    }

    ReelTo(target, deltaTime)
    {
        let targetPosDiff = target[0] - this.phys.position[0];
        if(Math.abs(targetPosDiff) > 0.01)
        {
            let newX = this.phys.position[0] + Math.sign(targetPosDiff) * this.reelDist * deltaTime;

            if(targetPosDiff < 0 && newX < target[0])
            {
                newX = target[0];
            }
            else if(targetPosDiff > 0 && newX > target[0])
            {
                newX = target[0];
            }
            
            this.phys.position = [ newX, this.phys.position[1] ];
        }
    }

    UpdateAct(deltaTime)
    {
        if(this.StateIs(CONDEMNED_STATE.WORKING))
        {
            this.ReelTo(this.workstation.Target().phys.position, deltaTime);
            this.workstation.UpdateWork(deltaTime);
        }
        else if(this.StateIs(CONDEMNED_STATE.QUEUEING))
        {
            this.ReelTo(this.queuePosition, deltaTime);
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
        else if(this.StateIs(CONDEMNED_STATE.BOARDING))
        {
            this.targetElevator = this.elevatorRoute[this.elevatorRouteStep];
            this.DetermineMoveDirectionToTarget(this.targetElevator);
        }
        else
        {
            this.targetElevator = this.elevatorRoute[this.elevatorRouteStep];
            let targetButton = this.scheduler.FindButtonForElevator(this.targetElevator, currentFloor)

            this.DetermineMoveDirectionToTarget(targetButton.QueueZone());
        }
    }

    IsDesiredDisembark(elevator)
    {
        let desiresDisembark = false;

        let elevatorFloor = elevator.GetCurrentFloorNumber();
        let nextStep = this.elevatorRouteStep + 1;

        let targetOnFloor = null;

        let workstation = this.GetCurrentTargetWorkstation();

        consoleLog(`Next workstation:`);
        consoleLog(workstation);

        if(nextStep < this.elevatorRoute.length)
        {
            consoleLog("Next step is another elevator...");

            let next = this.elevatorRoute[nextStep];

            if(next.StopsAtFloor(elevatorFloor))
            {
                targetOnFloor = this.scheduler.FindButtonForElevator(next, elevatorFloor);
            }
        }
        else if(workstation.FloorNumber() === elevatorFloor)
        {
            consoleLog("Next step is a workstation...");
            targetOnFloor = workstation;
        }

        if(targetOnFloor)
        {
            consoleLog("Target is on this floor:");
            consoleLog(targetOnFloor);

            let dirToTarget = this.GetMoveDirectionToTarget(elevator, targetOnFloor, true);

            if(dirToTarget === CONDEMNED_INPUT.MOVE_LEFT)
            {
                consoleLog(`check left door: ${elevator.leftDoorOpen}`);
                desiresDisembark = true;
            }
            else if(dirToTarget === CONDEMNED_INPUT.MOVE_RIGHT)
            {
                consoleLog(`check right door: ${elevator.rightDoorOpen}`);
                desiresDisembark = true;
            }
        }

        consoleLog(`Desires to disembark? ${desiresDisembark}`);

        return desiresDisembark;
    }

    GetMoveDirectionToTarget(source, target, log)
    {
        if(log)
        {
            consoleLog(`Source.x = ${source.phys.position[0]}, target X = ${target.phys.position[0]}`);
        }

        let direction = null;
        if(target.phys.position[0] < source.phys.position[0])
        {
            direction = CONDEMNED_INPUT.MOVE_LEFT;
        }
        else if(target.phys.position[0] > source.phys.position[0])
        {
            direction = CONDEMNED_INPUT.MOVE_RIGHT;
        }

        return direction;
    }

    DetermineMoveDirectionToTarget(target)
    {
        /*consoleLog(`Determine move to target:`);
        consoleLog(target);*/
        this.input = this.GetMoveDirectionToTarget(this, target);
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

    UpdateQueuePosition(tilePosition)
    {
        this.queuePosition = EM.TileToPhysPosition(tilePosition);
    }

    QueueForElevator(elevatorSummoner)    
    {
        if(this.elevatorRoute && !this.StateIs(CONDEMNED_STATE.ON_BOARD) && !this.StateIs(CONDEMNED_STATE.BOARDING))
        {
            let targetElevator = this.elevatorRoute[this.elevatorRouteStep];

            if(elevatorSummoner.Elevator() === targetElevator)
            {
                consoleLog(`${this.name}: start queueing for elevator`);

                this.SetState(CONDEMNED_STATE.QUEUEING);
                let summonerTilePos = elevatorSummoner.GetQueueTilePos();
                //consoleLog(`Start queueing @ (${this.summonerTilePos.x}, ${this.summonerTilePos.y})`);
                this.queuePosition = EM.TileToPhysPosition(summonerTilePos);
                elevatorSummoner.AddToQueue(this);
            }
        }
    }

    Draw()
    {
        if(!this.StateIs(CONDEMNED_STATE.ON_BOARD))
        {
            let screenPos = this.GetScreenPos();

            if(this.spriteIndex >= 0)
            {
                sprite(this.spriteIndex, screenPos.x, screenPos.y);
            }
        }
    }
}