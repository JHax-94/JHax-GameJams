
import Label from './Label.js';
import { consoleLog, em, PIXEL_SCALE } from './main.js';

export default class Button
{
    constructor(tileRect, text, colours, type, listener)
    {
        this.type = type;
        this.tileRect = tileRect;
        this.colours = colours;
        
        this.hover = false;

        em.AddRender(this);
        em.AddHover(this);
        em.AddClickable(this);

        this.listener = listener;

        this.text = new Label(this.GetLabelPos(), text, colours.text);
    }

    Hover(isHover)
    {
        this.hover = isHover;
    }

    Click(clickMessage)
    {
        consoleLog("CLICK!");
        consoleLog(clickMessage);

        if(this.listener)
        {
            this.listener.ButtonClicked(this);
        }
    }

    GetLabelPos()
    {
        return { tileX: this.tileRect.x + 0.25, tileY: this.tileRect.y +0.25 };
    }

    Bounds()
    {
        return { x: this.tileRect.x * PIXEL_SCALE, y: this.tileRect.y * PIXEL_SCALE, w: this.tileRect.w * PIXEL_SCALE, h: this.tileRect.h * PIXEL_SCALE };
    }

    Draw()
    {
        paper(this.colours.shadow);
        rectf(this.tileRect.x * PIXEL_SCALE - 2, this.tileRect.y * PIXEL_SCALE + 4, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);
        
        paper(this.hover ? this.colours.hover : this.colours.foreground );
        rectf(this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);
    }
}