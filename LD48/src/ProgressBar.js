import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class ProgressBar
{
    constructor(tileRect, barColours)
    {
        this.unfilledBar = tileRect;
        this.barColours = barColours;

        this.filledBar = { x: this.unfilledBar.x, y: this.unfilledBar.y, w: this.unfilledBar.w, h: this.unfilledBar.h };

        em.AddRender(this);
    }

    SetFill(val, max)
    {
        var portion = val / max;
        
        this.filledBar.w = portion * this.unfilledBar.w;
    }

    AddToEntityManager()
    {
        em.AddRender(this);
    }

    Draw()
    {
        paper(this.barColours.unfilled);
        rectf(this.unfilledBar.x * PIXEL_SCALE, this.unfilledBar.y * PIXEL_SCALE, this.unfilledBar.w * PIXEL_SCALE, this.unfilledBar.h * PIXEL_SCALE );

        paper(this.barColours.filled);
        rectf(this.filledBar.x * PIXEL_SCALE, this.filledBar.y * PIXEL_SCALE, this.filledBar.w * PIXEL_SCALE, this.filledBar.h * PIXEL_SCALE);
    }
}