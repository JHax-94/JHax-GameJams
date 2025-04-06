import TutorialItem from "./TutorialItem";

export default class GameOverTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { x: 0, y: 2, h: 6, w: 22 });

        this.timer = 30;
        
        this.startWeek = null;
        this.hidden = true;
    }

    ShouldDrawTut()
    {
        return !this.hidden;
    }

    DrawTutorial()
    {
        if(this.ShouldDrawTut())
        {
            this.DrawWindow();

            pen(1);
            this.DrawCentredText("Each space week you must pay upkeep on your spacecraft", 0.5);
            this.DrawCentredText("and space stations", 1.25);
            this.DrawCentredText("If your funds are zero or below when the upkeep payment", 2.75);
            this.DrawCentredText("is due, the game is over!", 3.5);

            this.DrawCentredText("Fun fact: Weeks were decimalised after humanity expanded", 4.5);
            this.DrawCentredText("beyond the Solar System!", 5.25);
        }
    }

    Activate()
    {
        this.startWeek = this.control.gameWorld.starWeek;
    }    

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(this.hidden && this.startWeek !== null)
        {
            if(this.control.gameWorld.starWeek !== this.startWeek)
            {
                this.hidden = false;
            }
        }
        else if(!this.hidden)
        {
            this.timer -= deltaTime;

            if(this.timer < 0)
            {
                end = true;
            }
        }

        return end;
    }
}