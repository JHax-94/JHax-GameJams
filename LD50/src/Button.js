import { RECTANGLE } from "p2/src/shapes/Shape";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class Button
{
    constructor(position, dims, data)
    {
        consoleLog("Adding button...");
        consoleLog(data);

        this.buttonData = data;

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
        this.hoverOn = setHover;
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

    Draw()
    {
        paper(14);
        rectf(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        pen(0)
        print(this.buttonData.display, this.pos.x * PIXEL_SCALE + 5, this.pos.y * PIXEL_SCALE + 5);

        if(this.hoverOn)
        {
            pen(13);
            rect(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        }
    }
}