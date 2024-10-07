import TutorialItem from "./TutorialItem";

export default class EndGameTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: 4, h: 6, w: 14 });

        this.timer = 5;
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        this.timer -= deltaTime;

        if(this.timer <= 0)
        {
            end = true;
        }

        return end;
    }

    DrawTutorial()
    {
        this.DrawWindow();

        pen(1);
        this.DrawCentredText("Get 100 drones to", 0.5);
        this.DrawCentredText("the new hive: ", 1.5);
        this.DrawCentredSprite(4, 2.75, 3);
        pen(1);
        this.DrawCentredText("To win the game!", 4);
    }
}