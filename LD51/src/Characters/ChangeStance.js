import { consoleLog, UTIL } from "../main";
import Action from "./Action";

export default class ChangeStance extends Action
{
    constructor(changeStance)
    {
        super(`Stance ${changeStance > 0 ? "Anti-Clockwise" : "Clockwise"}`, "Stance");
        
        this.changeDir = changeStance;

        this.changeAnim = null;
        this.animPhase = 0;
    }

    ExecuteAction(player)
    {
        this.targetPlayer = player;

        let targetStance = this.targetPlayer.GetStanceInDir(this.changeDir);

        let animList = this.targetPlayer.stance.anims;

        let targetAnim = null;

        for(let i = 0; i < animList.length; i ++)
        {
            if(animList[i].name === `to${targetStance.name}`)
            {
                targetAnim = animList[i];
                break;
            }
        }
        
        this.changeAnim = targetAnim;

        sfx("stance");
    }

    GetAnimState()
    {
        let startPhase = this.changeAnim.phases[this.animPhase];
        let nextPhase = null;

        if(this.animPhase+1 < this.changeAnim.phases.length)
        {
            nextPhase = this.changeAnim.phases[this.animPhase+1];
        }
        else
        {
            nextPhase = startPhase;
        }

        let sprites = [];

        for(let i = 0; i < startPhase.sprites.length; i ++)
        {
            let a = startPhase.sprites[i];
            let b = nextPhase.sprites[i];
            /*
            consoleLog("Interpolate:");
            consoleLog(a);
            consoleLog(b);
            */
            sprites.push({
                x: UTIL.Lerp(a.x, b.x, this.GetProgress()),
                y: UTIL.Lerp(a.y, b.y, this.GetProgress()),
                i: a.i
            });
        }

        return sprites;
    }

    ProgressAction(deltaTime)
    {
        super.ProgressAction(deltaTime);

        if(this.animPhase+1 < this.changeAnim.phases.length)
        {
            if(this.actionTimer > this.changeAnim.phases[this.animPhase+1].time)
            {
                this.animPhase += 1;
            }
        }
    }

    ActionComplete()
    {
        this.targetPlayer.ChangeStance(this.changeDir);
        super.ActionComplete();
    }
}