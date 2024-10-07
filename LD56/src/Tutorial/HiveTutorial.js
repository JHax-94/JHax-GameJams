import TutorialItem from "./TutorialItem";

export default class HiveTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { w: 13, h:5 });

        this.hive = null;
        this.minTime = 1;
        this.timer = 0;
    }

    Activate()
    {
        let structures = this.control.gameWorld.structures;

        for(let i = 0; i < structures.length; i ++)
        {
            if(structures[i].IsValidTarget() && !structures[i].isConnected)
            {
                this.hive = structures[i];
                break;
            }
        }
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(this.hive)
        {
            this.timer += deltaTime;

            if(this.hive.isConnected)
            {
                if(this.timer < this.minTime)
                {
                    this.Activate();
                }
                else
                {
                    end = true;
                }
            }
        }
        
        return end;
    }

    DrawTutorial()
    {
        this.DrawWindow({ obj: this.hive, off: { y: (this.dims.h+1) * 0.5 } });

        pen(1);
        this.DrawCentredText("Fly to a hive", 0.5);
        this.DrawCentredText("to create a path", 1.5);
        this.DrawCentredText("from the last ", 2.5);
        this.DrawCentredText("hive visited", 3.5);
    }
}