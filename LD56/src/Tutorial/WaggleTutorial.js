
import TutorialItem from "./TutorialItem";

export default class WaggleTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: 4, h: 6, w: 15 });

        this.waitForUp = false;
        this.waitForWaggleEnd = false;

    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(!this.waitForUp && this.control.player.waitForWaggleUp)
        {
            this.waitForUp = true;
        }
        else if(this.waitForUp && this.control.player.waggleTimer > 0)
        {
            this.waitForWaggleEnd = true;
        }
        
        if(this.waitForWaggleEnd && this.control.player.waggleTimer <= 0)
        {
            end = true;
        }

        return end;
    }

    DrawTutorial()
    {
        this.DrawWindow();
        pen(1);
        this.DrawCentredText("Perform a waggle", 0.5);
        this.DrawCentredText("dance by pressing C", 1.5);
        this.DrawCentredSprite(237, 2.75 );
        pen(1);
        this.DrawCentredText("To clear the last", 3.75);
        this.DrawCentredText("visited hive", 4.75);       
    }

}