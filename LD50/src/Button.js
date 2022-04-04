import { RECTANGLE } from "p2/src/shapes/Shape";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class Button
{
    constructor(position, dims, data)
    {
        if(data.renderLayer)
        {
            this.renderLayer = data.renderLayer;
        }

        consoleLog("Adding button...");
        consoleLog(position);
        consoleLog(dims);
        consoleLog(data);

        this.buttonData = data;

        this.focused = false;

        this.offset = { x: 5, y: 5 };

        if(this.buttonData.offset)
        {
            this.offset = this.buttonData.offset;
        }
        
        this.pos = position;
        this.dims = dims;

        this.hoverOn = false;

        EM.RegisterEntity(this);

    }

    Bounds()
    {
        return { x: this.pos.x * PIXEL_SCALE, y: this.pos.y * PIXEL_SCALE, w: this.dims.w * PIXEL_SCALE, h: this.dims.h * PIXEL_SCALE };
    }

    Hover(setHover)
    {
        if(this.hoverOn != setHover)
        {
            this.hoverOn = setHover;

            if(this.HoverCallback)
            {
                this.HoverCallback(this);
            }
        }
    }

    Click(button, pos)
    {
        if(this.ClickCallback)
        {
            this.ClickCallback(this.buttonData);
        }
        else
        {
            consoleLog("Button callback not defined!");
            consoleLog(this.buttonData);
        }
    }

    SetFocus(focusOn)
    {
        this.focused = focusOn;
    }

    Draw()
    {
        paper(14);
        rectf(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        pen(0)
        print(this.buttonData.display, this.pos.x * PIXEL_SCALE + this.offset.x, this.pos.y * PIXEL_SCALE + this.offset.y);

        if(this.hoverOn || this.focused)
        {
            pen(13);
            rect(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        }
    }
}