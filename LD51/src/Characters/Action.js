import { consoleLog } from "../main";

export default class Action
{
    constructor(name)
    {
        this.name = name;

        this.actionTime = 1;
        this.actionTimer = 0;
        this.actionComplete = false;
        this.targetPlayer = null;
    }

    ExecuteAction(player)
    {
        consoleLog("ABSTRACT! Perform action on:");
        consoleLog(player);
    }

    ProgressAction(deltaTime)
    {
        if(!this.actionComplete)
        {
            this.actionTimer += deltaTime;
            if(this.actionTimer >= this.actionTime)
            {
                this.actionTimer = this.actionTime;

                this.ActionComplete();
            }
        }
    }

    GetProgress()
    {
        return this.actionTimer / this.actionTime; 
    }

    ActionComplete()
    {
        this.actionComplete = true;
        if(this.targetPlayer)
        {
            this.targetPlayer.ActionCompleted(this);
        }
    }
}