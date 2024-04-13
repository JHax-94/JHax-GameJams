import { CONDEMNED_INPUT } from "../Enums/CondemnedInputs";
import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import { COLLISION_GROUP, EM, consoleLog, getObjectConfig } from "../main";
import WorkstationInteractions from "./WorkstationInteractions";

export default class CondemnedSoul
{
    constructor(tile, data, scheduler)
    {
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

        this.state = CONDEMNED_STATE.IDLE;
        this.speed = 10;
        this.scheduleItem = null;
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
        EM.hudLog.push(`S: ${this.state}, I: ${this.input}`);
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

        if(scheduleItem.floor === this.GetCurrentFloor())
        {
            let workstation = this.scheduler.GetTargetWorkstation(scheduleItem);

            if(workstation.phys.position[0] < this.phys.position[0])
            {
                this.input = CONDEMNED_INPUT.MOVE_LEFT;
            }
            else if(workstation.phys.position[0] > this.phys.position[0])
            {
                this.input = CONDEMNED_INPUT.MOVE_RIGHT;
            }
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

    GetCurrentFloor()
    {
        return 0;
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