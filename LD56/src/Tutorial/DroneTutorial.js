import TutorialItem from "./TutorialItem";

export default class DroneTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: 2, w: 18, h: 5 });

        this.startLevel = null;
    }

    DrawTutorial()
    {
        this.DrawWindow();


        pen(1);
        this.DrawCentredText("You gain experience", 0.5);
        this.DrawCentredText("when drones:", 1.5);
        this.DrawCentredSprite(136, 2.75, 3);
        pen(1);
        this.DrawCentredText("arrive at a new hive", 3.75);
    }

    Activate()
    {
        this.startLevel = this.control.player.level;
    }
    
    CheckTutorialEnd(deltaTime)
    {
        let end = false;
        if(this.startLevel !== null && this.control.player.level > this.startLevel)
        {
            end = true;
        }

        return end;
    }
}