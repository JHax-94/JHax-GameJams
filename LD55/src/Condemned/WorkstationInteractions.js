import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import TimeStepper from "../TimeStepper";
import { consoleLog } from "../main";

export default class WorkstationInteractions
{
    constructor(npc)
    {
        this.npc = npc;
        this.workTimer = new TimeStepper(2, { onComplete: () => { this.WorkComplete(); } });
    }

    ProcessWorkstationCollision(workstation)
    {
        let targetWorkstation = this.npc.GetCurrentTargetWorkstation();

        if(targetWorkstation === workstation)
        {
            consoleLog("NPC Working at workstation");
            this.WorkAtWorkstation(workstation);
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
        consoleLog("NPC Finished working!");
        this.workTimer.Reset();
        this.npc.ScheduledItemCompleted();
    }
}