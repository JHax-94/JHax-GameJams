import { consoleLog, EM } from "../main";
import TutorialItem from "./TutorialItem";

export default class EnemyTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { w: 14, h: 4});

        this.lookForSwarm = false;

        this.swarm = null;
    }

    Activate()
    {
        this.lookForSwarm = true;
        this.control.player.highlight = true;
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(this.lookForSwarm)
        {
            EM.hudLog.push(`Looking for swarm`);
            let swarmList = this.control.gameWorld.swarmSpawner.swarms;

            if(swarmList.length > 0)
            {
                this.swarm = swarmList[0];

                this.swarm.highlight = true;
            }
        }

        if(this.swarm)
        {
            EM.hudLog.push(`Wait for swarm eradiaction`);

            if(this.swarm.bugs.length === 0)
            {
                let killedByPlayer = false;

                consoleLog("Check damage log");
                consoleLog(this.swarm.damageLog);
                for(let i = 0; i < this.swarm.damageLog.length; i++)
                {
                    let log = this.swarm.damageLog[i];
                    consoleLog("Check log item");
                    consoleLog(log);
                    if(log.parentSwarm && log.parentSwarm.isPlayer)
                    {
                        killedByPlayer = true;
                        break;
                    }
                }


                if(killedByPlayer)
                {
                    end = true;
                }
                else
                {
                    this.swarm = null;
                    this.lookForSwarm = true;
                }
            }
        }

        if(end)
        {
            this.control.player.highlight = false;
        }

        return end;
    }

    DrawTutorial()
    {
        if(this.swarm)
        {
            this.DrawWindow({ obj: this.swarm, off: { y: this.dims.h*0.5 } });

            pen(1);
            this.DrawCentredText("Hunter bugs attack", 0.5);            
            this.DrawCentredText("friendly bugs", 1.5);
            this.DrawCentredText("and hives", 2.5);
       }

        this.DrawWindow({ obj: this.control.player, off: { y: (this.dims.h + 1.125) * 0.5 }});

        pen(1);
        this.DrawCentredText("Fight hunter bugs", 0.5);
        this.DrawCentredText("with your swarm of", 1.5);
        this.DrawCentredText("scout bugs", 2.5);
    }

}