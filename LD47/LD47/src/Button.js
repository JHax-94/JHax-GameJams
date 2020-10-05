import Label from "./Label";
import { consoleLog, em, PIXEL_SCALE, LoadLevel, ToggleGameSize, ToggleGameSpeed, getGameSize, getGameSpeed } from "./main";

export default class Button
{
    constructor(tileRect, text, options, colours)
    {
        this.tileRect = tileRect;
        
        if(options.type === "SIZE_TOGGLE")
        {
            var size = getGameSize();
            text = size.name;
        }
        else if(options.type === "SPEED_TOGGLE")
        {
            var speed = getGameSpeed();
            text = speed.name;
        }

        this.label = new Label(this.GetLabelPos(), text, 4);
        this.options = options;
        this.colours = colours;
        this.z = 190;

        this.hover = false;

        /*
        consoleLog("BUTTON CONSTRUCTED");
        consoleLog(this);*/

        em.AddHover(this);
        em.AddClickable(this);
        
        em.AddRender(this);
    }

    GetLabelPos()
    {
        return { tileX: this.tileRect.x + 0.25, tileY: this.tileRect.y +0.25 };
    }

    SetTileRect(tileRect)    
    {
        this.tileRect = tileRect;

        this.label.pos = this.GetLabelPos();
    }       

    Bounds()
    {
        return { x: this.tileRect.x * PIXEL_SCALE, y: this.tileRect.y * PIXEL_SCALE, w: this.tileRect.w * PIXEL_SCALE, h: this.tileRect.h * PIXEL_SCALE };
    }

    Hover(onOff)
    {
        if(this.GetIsVisible())
        {
            if(onOff !== this.hover)
            {
                this.hover = onOff;
            }
        }
    }

    GetIsVisible()
    {
        return !this.hide;
    }

    Click(button)
    {
        if(this.GetIsVisible())
        {
            /*
            consoleLog("CLICKED BUTTON");
            consoleLog(this);*/
            if(button === 0)
            {
                if(this.options.type === "LVL")
                {
                    consoleLog("Load Level: " + this.options.value);

                    this.hover = false;
                    LoadLevel(this.options.value);
                }
                else if(this.options.type === "SFX_TOGGLE")
                {
                    em.soundControl.Toggle();
                }
                else if(this.options.type === "SPEED_TOGGLE")
                {
                    ToggleGameSpeed();   
                }
                else if(this.options.type === "SIZE_TOGGLE")
                {
                    ToggleGameSize();
                }
                else if(this.options.type === "MENU_PREV")
                {
                    this.options.menu.PrevPage();
                }
                else if(this.options.type === "MENU_NEXT")
                {
                    this.options.menu.NextPage();
                }
            }
        }
    }

    SetIsVisible(isVisible)
    {
        this.hide = !isVisible;
        this.label.hide = !isVisible;
    }

    Draw()
    {
        paper(this.colours.shadow);
        rectf(this.tileRect.x * PIXEL_SCALE - 2, this.tileRect.y * PIXEL_SCALE + 4, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);
        
        paper(this.hover ? this.colours.hover : this.colours.top );
        rectf(this.tileRect.x * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE, this.tileRect.w * PIXEL_SCALE, this.tileRect.h * PIXEL_SCALE);
    }
}