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
        consoleLog("Check workstation");
        consoleLog(workstation);

        let targetWorkstation = this.npc.GetCurrentTargetWorkstation();

        consoleLog("Against target workstation:");
        consoleLog(targetWorkstation);

        if(targetWorkstation === workstation)
        {
            this.WorkAtWorkstation(workstation);
        }
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
    }
}