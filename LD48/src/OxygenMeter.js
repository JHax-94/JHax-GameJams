import { consoleLog, em } from "./main";

export default class OxygenMeter 
{
    constructor(screenRect)
    {
        this.screenRect = screenRect;
        this.filledRect = screenRect;

        this.filledColour = 7;
        this.emptyColour = 4;

        em.AddRender(this);
    }

    SetFilled(current, max)
    {
        var fill = current / max;
        /*consoleLog("Calculate fill");
        consoleLog(current + " / " + max + " = " + fill);*/
        this.UpdateRects(fill);
    }

    UpdateRects(filledAmount)
    {
        
        this.filledRect = {
            x: this.screenRect.x,
            w: this.screenRect.w,
        };

        this.filledRect.h = this.screenRect.h * filledAmount;
        this.filledRect.y = this.screenRect.y + (this.screenRect.h - this.filledRect.h);
    }


    Draw()
    {
        paper(this.emptyColour);
        rectf(this.screenRect.x, this.screenRect.y, this.screenRect.w, this.screenRect.h);
        
        paper(this.filledColour);
        rectf(this.filledRect.x, this.filledRect.y, this.filledRect.w, this.filledRect.h);

    }

}