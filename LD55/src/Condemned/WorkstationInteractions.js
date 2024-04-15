import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import TimeStepper from "../TimeStepper";
import { consoleLog } from "../main";

export default class WorkstationInteractions
{
    constructor(npc)
    {
        this.npc = npc;
        this.workTimer = new TimeStepper(2, { onComplete: () => { this.WorkComplete(); } });

        this.workstations = [];
    }

    ProcessWorkstationCollision(workstation)
    {
        let targetWorkstation = this.npc.GetCurrentTargetWorkstation();

        /*consoleLog("Add Workstation to list:");
        consoleLog(workstation);*/

        if(this.workstations.findIndex(ws => ws === workstation) < 0)
        {
            this.workstations.push(workstation);
        }

        /*consoleLog("TARGET WORKSTATION: ");
        consoleLog(workstation);
        consoleLog(targetWorkstation);*/

        if(targetWorkstation === workstation)
        {
            consoleLog("NPC Working at workstation");
            this.WorkAtWorkstation(workstation);
        }
    }

    CheckWorkstations()
    {
        /*consoleLog("Check workstations list against target");
        consoleLog(this.workstations);*/
              
        let targetWorkstation = this.npc.GetCurrentTargetWorkstation();

        //consoleLog(targetWorkstation);  

        for(let i = 0; i < this.workstations.length; i ++)
        {
            if(this.workstations[i] === targetWorkstation)
            {
                this.WorkAtWorkstation(targetWorkstation);
                break;
            }
        }
    }

    WorkstationLeft(workstation)
    {
        let index = this.workstations.findIndex(ws => ws === workstation);

        if(index > 0)
        {
            this.workstations.splice(index, 1);
        }
    }

    Target()
    {
        return this.npc.GetCurrentTargetWorkstation();
    }

    WorkAtWorkstation(workstation)
    {
        this.npc.SetState(CONDEMNED_STATE.WORKING);
        this.workTimer.StartTimer();
    }

    UpdateWork(deltaTime)
    {
        this.workTimer.TickBy(deltaTime);
        this.workTimer.HudLog("WRK");
    }

    WorkComplete()
    {
        consoleLog(`${this.npc.name} NPC Finished working: ${this.npc.GetScreenPos().x}, ${this.npc.GetScreenPos().y}`);
        this.workTimer.Reset();
        this.npc.ScheduledItemCompleted();
    }
}