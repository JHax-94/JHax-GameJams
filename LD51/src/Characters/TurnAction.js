import { UTIL } from "../main";
import Action from "./Action";

export default class TurnAction extends Action
{
    constructor(clockDir)
    {
        super(`Turn ${clockDir > 0 ? "Clockwise" : "AntiClockwise"}`, "Turn");

        this.clockDir = clockDir;

        this.floatHeight = -0.25;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;
        this.targetDirect = (4 + this.targetPlayer.direction + this.clockDir) % 4;
        sfx("turn");
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);
        let v = this.GetProgress();

        if(v < 0.5)
        {
            if(!this.cancelled) this.targetPlayer.hover = UTIL.Clerp(0, this.floatHeight, v * 2);
        }
        else
        {
            if(this.targetPlayer.direction !== this.targetDirect)
            {
                this.targetPlayer.direction = this.targetDirect;
            }

            if(!this.cancelled) this.targetPlayer.hover = UTIL.Clerp(this.floatHeight, 0, (v - 0.5) * 2);
        }
    }

    ActionComplete()
    {
        this.targetPlayer.hover = 0;
        super.ActionComplete();
    }
}