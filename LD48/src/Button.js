
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

        this.hideShadow = false;

        this.listener = listener;

        if(text.spriteIndex)
        {
            this.spriteIndex = text.spriteIndex;
            this.text = null;
        }
        else
        {
            this.spriteIndex = null;
            this.text = new Label(this.GetLabelPos(), text, colours.text);
            this.text.font = assets.charsets.large_font;
        }
    }

    Delete()
    {
        em.RemoveRender(this);
        em.RemoveHover(this);
        em.RemoveClickable(this);
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
        if(!this.hideShadow)
        {
            var shadowOffset = { x: 0.25, y: 0.25}
            paper(this.colours.shadow);
            rectf((this.tileRect.x + shadowOffset.x) * PIXEL_SCALE, (this.tileRect.y + shadowOffset.y) * PIXEL_SCALE, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);    
        }
        
        paper(this.hover ? this.colours.hover : this.colours.foreground );
        rectf(this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);
        
        if(this.spriteIndex)
        {
            sprite(this.spriteIndex, this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE);
        }
    }
}