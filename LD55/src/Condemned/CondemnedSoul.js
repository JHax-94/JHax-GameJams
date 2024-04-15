import { vec2 } from "p2";
import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import { AUDIO, COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog, getObjectConfig } from "../main";
import WorkstationInteractions from "./WorkstationInteractions";
import TimeStepper from "../TimeStepper";
import CondemnedFollowUi from "./CondemnedFollowUi";
import { CONDEMNED_MARK } from "../Enums/CondemnedMark";
import ParticleSystem from "../ParticleSystem";

export default class CondemnedSoul
{
    constructor(tile, data, scheduler)
    {
        this.renderLayer = "CONDEMNED";
        this.hideCollider = true;
        this.schedule = data.schedule;
        
        this.mark = CONDEMNED_MARK.WORKING;

        this.name = data.name;
        this.scheduler = scheduler;

        let config = getObjectConfig(data.type, true);

        if(config.spriteIndex >= 0)
        {
            this.spriteIndex = config.spriteIndex;
        }

        this.lastDir = 1;

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

        this.followUi = new CondemnedFollowUi(this);

        this.Setup();
    }

    Setup()
    {
        this.workstation = new WorkstationInteractions(this);

        let timer = 50;

        this.obliterateTimer = new TimeStepper(timer, { onComplete: () => { this.DestroyBad(); } });
        this.obliterateTimer.StartTimer();

        this.reelDist = 10;

        this.state = CONDEMNED_STATE.IDLE;
        this.speed = 2 * PIXEL_SCALE;
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
            let summoner = this.scheduler.FindButtonForElevator(this.boardableElevator, this.GetCurrentFloor().floorNumber, true);
            summoner.RemoveFromQueue(this);
        }
    }

    StateIs(queryState)
    {
        return this.state === queryState;
    }

    StateIsAny(states)
    {
        let stateIs = false;

        for(let i = 0; i < states.length; i ++)
        {
            if(this.StateIs(states[i]))
            {
                stateIs = true;
                break;
            }
        }

        return stateIs;
    }

    SetState(targetState)
    {
        consoleLog(`Set NPC ${this.name} State to: ${CONDEMNED_STATE.ToString(targetState)} (${targetState})`);
        this.state = targetState;

        if(this.state === CONDEMNED_STATE.BOARDING)
        {
            this.CheckToBoard();
        }

        if(this.onBoardElevator && this.state !== CONDEMNED_STATE.ON_BOARD)
        {
            consoleLog(">>> NULLING ON BOARD ELEVATOR <<<");
            this.onBoardElevator = null;
        }
    }

    Neutralise(elevator)
    {
        this.SetState(CONDEMNED_STATE.ON_BOARD);
        this.onBoardElevator = elevator;
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
        //EM.hudLog.push(`${this.name[0]}: (${this.phys.position[0].toFixed(2), this.phys.position[0].toFixed(2)})`);
        if(!this.StateIs(CONDEMNED_STATE.ON_BOARD))
        {
            this.UpdateThink(deltaTime);
            //EM.hudLog.push(`S: ${this.state}, I: ${this.input}, F: ${this.GetCurrentFloor()}`);
            this.UpdateAct(deltaTime);
        }

        if(this.phys.velocity[0] > 0.1)
        {
            this.lastDir = 1;
        }
        else if(this.phys.velocity[0] < -0.1)
        {
            this.lastDir = -1;
        }

        this.obliterateTimer.TickBy(deltaTime);
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

        let floor = this.GetCurrentFloor();

        if(floor)
        {
            let currentFloor = floor.floorNumber;

            if(scheduleItem.floor === currentFloor)
            {
                let workstation = this.scheduler.GetTargetWorkstation(scheduleItem);

                this.DetermineMoveDirectionToTarget(workstation);
            }
            else if(!this.elevatorRoute)
            {
                consoleLog(`Look for route from Floor ${currentFloor} to floor ${scheduleItem.floor}`);
                this.elevatorRoute = this.scheduler.PlotRouteToFloor(this, currentFloor, scheduleItem.floor);
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

                if(targetButton)
                {
                    this.DetermineMoveDirectionToTarget(targetButton.QueueZone());
                }
            }
        }
    }

    GetCurrentTarget()
    {
        /*
        consoleLog(`---${this.name} target---`)
        consoleLog(`-elevator route (step: ${this.elevatorRouteStep}):`);
        consoleLog(this.elevatorRoute);
        */
        let targetObj = null;

        let nextStep = this.elevatorRouteStep + 1;

        let targetWorkstation = this.GetCurrentTargetWorkstation();

        if(this.elevatorRoute && nextStep < this.elevatorRoute.length)
        {
            //consoleLog("--- TARGET IS ELEVATOR");

            let elevatorRouteStep = this.elevatorRoute[nextStep];
            
            let nextStepSummoners = elevatorRouteStep.GetSummoners();
            
            let targetSummoners = [];

            let onLayer = this.scheduler.GetFloorLayerForPhysObject(this).number;

            if(this.StateIs(CONDEMNED_STATE.ON_BOARD) && this.onBoardElevator)
            {
                onLayer = this.onBoardElevator.GetCurrentFloorNumber();

                let availableSummoners = this.onBoardElevator.GetSummoners();

                consoleLog("Compare target list");
                for(let i = 0; i < nextStepSummoners.length; i ++)
                {
                    let floorNumber = nextStepSummoners[i].FloorNumber();

                    let available = availableSummoners.findIndex(avs => avs.FloorNumber() === floorNumber);

                    if(available >= 0)
                    {
                        targetSummoners.push(nextStepSummoners[i]);
                    }
                }
            }
            else
            {
                targetSummoners = nextStepSummoners;
            }
            /*
            consoleLog(`--- On Layer: ${onLayer} ---`);
            consoleLog("Target summoners:");
            consoleLog(targetSummoners);
            */
            let closestSummoner = targetSummoners[0];

            for(let i = 1; i < targetSummoners.length; i ++)
            {
                let ts = targetSummoners[i];

                let targetFloor = ts.FloorNumber();
                let closestFloor = closestSummoner.FloorNumber();
                /*
                consoleLog(`Check if summoner on ${targetFloor}`);
                consoleLog(ts);
                consoleLog(`is closer than the one on ${closestFloor}`);
                consoleLog(closestSummoner);
                */
                let targetLayer = this.scheduler.GetLayerForFloorNumber(targetFloor);
                let closestLayer = this.scheduler.GetLayerForFloorNumber(closestFloor);

                //consoleLog(`Compare layer: T${targetLayer.number}, C${closestLayer.number} against: ${onLayer}`);

                if(Math.abs(targetLayer.number - onLayer) < 
                    Math.abs(closestLayer.number - onLayer) )
                {
                    //consoleLog(`Summoner on: ${targetLayer.number} is closer than the one on ${closestLayer.number}`);
                    closestSummoner = ts;   

                }
            }

            /*consoleLog(`Closest summoner:`);
            consoleLog(closestSummoner);*/
            targetObj = closestSummoner;
        }
        else if(targetWorkstation)
        {
            //consoleLog("--- Target is workstation");
            targetObj = targetWorkstation;
            //consoleLog(targetWorkstation);
        }

        return targetObj;

    }

    CurrentTargetFloor()
    {
        let targetFloor = 0;

        let target = this.GetCurrentTarget();

        if(target)
        {
            targetFloor = this.scheduler.GetFloorForPhysObject(target);
        }

        return targetFloor;
    }

    CurrentTargetFloorLayer()
    {
        let targetFloor = this.CurrentTargetFloor();

        /*consoleLog(`${this.name} is on schedule item X looking for floor Y`);
        consoleLog(this.scheduleItem);
        consoleLog(targetFloor);*/

        let layer = this.scheduler.GetLayerForFloor(targetFloor);

        return layer.number;
    }

    GetDesiredDisembark(elevator)
    {
        //let desiresDisembark = false;

        let accessibleFloors = elevator.ElevatorAtFloors();
        let nextStep = this.elevatorRouteStep + 1;

        let targetOnFloor = null;

        let workstation = this.GetCurrentTargetWorkstation();

        let disembarkInfo = null;

        /*consoleLog("Check floors for disembark:");
        onsoleLog(accessibleFloors);
        consoleLog(`Next workstation:`);
        consoleLog(workstation);*/

        //consoleLog(`--- DOES ${this.name} WANT TO DISEMBARK? ---`)

        for(let i = 0; i < accessibleFloors.length; i ++)
        {
            let elevatorFloor = accessibleFloors[i].floorNumber;

            if(this.elevatorRoute && nextStep < this.elevatorRoute.length)
            {
                let next = this.elevatorRoute[nextStep];

                if(next.StopsAtFloor(elevatorFloor))
                {
                    targetOnFloor = this.scheduler.FindButtonForElevator(next, elevatorFloor);
                }
            }
            else if(workstation.FloorNumber() === elevatorFloor)
            {
                //consoleLog("Next step is a workstation...");
                targetOnFloor = workstation;
            }

            if(targetOnFloor)
            {
                /*consoleLog("Target is on this floor:");
                consoleLog(targetOnFloor);*/

                let dirToTarget = this.GetMoveDirectionToTarget(elevator, targetOnFloor, true);

                disembarkInfo = { dir: dirToTarget };

                break;
            }
        }

        return disembarkInfo;
    }

    IsDesiredDisembark(elevator, disembarkInfo)
    {
        let desiresDisembark = false;

        let desireInfo = this.GetDesiredDisembark(elevator);

        if(desireInfo)
        {
            if(elevator.rightDoorOpen && desireInfo.dir === CONDEMNED_INPUT.MOVE_RIGHT)
            {
                desiresDisembark = true;
            }

            if(elevator.leftDoorOpen && desireInfo.dir === CONDEMNED_INPUT.MOVE_LEFT)
            {
                desiresDisembark = true;
            }

            disembarkInfo.dir = desireInfo.dir;
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
            this.elevatorRoute = null;
            this.elevatorRouteStep = -1;
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
        this.scheduler.TaskCompleted(this.scheduleItem);
        this.scheduleItem = null;

        this.obliterateTimer.Reset();
        this.obliterateTimer.StartTimer();

        if(this.scheduleStep + 1 < this.schedule.length)
        {
            this.SetState(CONDEMNED_STATE.IDLE);
        }
        else
        {
            this.DestroyGood();
        }
    }

    GetCurrentFloorLayerNumber()
    {
        return this.scheduler.GetFloorLayerForPhysObject(this)?.number;
    }

    GetCurrentFloor()
    {
        return this.scheduler.GetFloorForPhysObject(this);
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

                if(!elevatorSummoner.IsInQueue(this))
                {
                    this.SetState(CONDEMNED_STATE.QUEUEING);
                    let summonerTilePos = elevatorSummoner.GetQueueTilePos();
                    //consoleLog(`Start queueing @ (${this.summonerTilePos.x}, ${this.summonerTilePos.y})`);
                    this.queuePosition = EM.TileToPhysPosition(summonerTilePos);
                    elevatorSummoner.AddToQueue(this);
                }
            }
        }
    }

    ShouldDraw()
    {
        return !this.StateIs(CONDEMNED_STATE.ON_BOARD);
    }

    Destroy(particles)
    {
        if(particles)
        {
            particles.PlayOnce();
        }

        EM.RemoveEntity(this.followUi);
        EM.RemoveEntity(this);
        this.scheduler.CheckForLevelEnd();
    }

    DestroyGood()
    {
        this.mark = CONDEMNED_MARK.CLOCKED_OFF;

        this.deathPos = this.FindDeathPos();

        AUDIO.PlayFx("ascend");

        let ascendParticles = new ParticleSystem({ 

            renderLayer: "IMP",
            max: 16,
            rect: { w: 0.25, h: 0.25, c: [ 3, 7, 11 ]  },
            rootPos: () => { 
                return this.DeathPos();
            },
            offset: {
                r: 0.25,
            },
            velocity: { r: 0.5* PIXEL_SCALE },
            //velocity: { x: 0, y: 40 },
            lifetime: 0.75,
            spawnTime: 0.01,
            preWarm: false
        });

        this.Destroy(ascendParticles);

        if(!this.scheduler.workFinished) AUDIO.PlayFx("Ascended");
    }

    DeathPos()
    {
        return {x: this.deathPos.x + 0.5 * PIXEL_SCALE, y: this.deathPos.y + 0.5 * PIXEL_SCALE };
    }

    FindDeathPos()
    {
        let deathPos = this.GetScreenPos();

        if(this.onBoardElevator)
        {
            let passengerPos = this.onBoardElevator.GetPassengerPosition(this);
            deathPos = passengerPos;
        }

        return deathPos;
    }

    DestroyBad()
    {
        consoleLog("XXXX OBLITERATE TIMER FINISHED XXXX");
        this.mark = CONDEMNED_MARK.OBLITERATED;

        AUDIO.PlayFx("oblit");

        this.deathPos =this.FindDeathPos();

        let obliterateParticles = new ParticleSystem({ 

            renderLayer: "IMP",
            max: 16,
            rect: { w: 0.25, h: 0.25, c: [ 9, 10, 11 ]  },
            rootPos: () => { 
                return this.DeathPos();
            },
            offset: {
                r: 0.25,
            },
            //velocity: { r: 2* PIXEL_SCALE },
            velocity: { x: 0, y: 40 },
            lifetime: 0.75,
            spawnTime: 0.02,
            preWarm: false
        });

        this.Destroy(obliterateParticles);

        if(!this.scheduler.workFinished) AUDIO.PlayFx("Obliterated");
    }

    Draw()
    {
        if(this.ShouldDraw())
        {
            let screenPos = this.GetScreenPos();

            if(this.queuePosition)
            {
                let queueRect = EM.PhysToScreenPos(this.queuePosition);

                paper(9);
                rectf(queueRect.x, queueRect.y, PIXEL_SCALE, PIXEL_SCALE);
            }

            if(this.spriteIndex >= 0)
            {
                //EM.hudLog.push(`${this.name}: FlipH:${this.lastDir > 0} (${this.phys.velocity[0]})`);
                sprite(this.spriteIndex, screenPos.x, screenPos.y, this.lastDir > 0);
            }
        }
    }
}