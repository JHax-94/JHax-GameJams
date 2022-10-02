import { EM } from "../main";

export default class AbstractAi
{
    constructor()
    {
        this.player = null;
        this.thinkingTime = 0.4;
        this.thinkingTimer = 0.0;

        this.isThinking = false;
    }

    SetPlayer(player)
    {
        this.player = player;
    }

    UpdateAi(deltaTime)
    {
        if(this.isThinking)
        {
            this.thinkingTimer += deltaTime;
            if(this.thinkingTimer > this.thinkingTime)
            {
                this.thinkingTimer -= this.thinkingTime;

                this.AddAction();

                if(this.player.actionQueue.length === this.player.maxActions)
                {
                    this.isThinking = false;
                    this.thinkingTimer = 0.0;

                    this.player.FlowManager().ExecutePlayerActions();
                }
            }
        }
    }

    StartPlanningTurn()
    {   
        this.isThinking = true;
    }
}