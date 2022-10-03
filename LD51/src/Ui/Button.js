import { consoleLog, PIXEL_SCALE, EM } from "../main";

export default class Button
{
    constructor(position, dims, data)
    {
        if(data.renderLayer)
        {
            this.renderLayer = data.renderLayer;
        }

        this.buttonData = data;

        this.focused = false;

        this.offset = { x: 5, y: 5 };

        if(this.buttonData.offset)
        {
            this.offset = this.buttonData.offset;
        }
        
        this.pos = position;
        this.dims = dims;


        this.colours = {
            normal: {
                f: 0,
                b: 7,
                t: 7
            },
            hover: {
                f: 7,
                b: 7,
                t: 0
            }
        };

        if(data.colours)
        {
            this.colours = data.colours;
        }

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

    GetColours()
    {
        return (this.hoverOn || this.focused) ? this.colours.hover : this.colours.normal;
    }

    Draw()
    {
        if(this.buttonData.display)
        {
            let colours = this.GetColours();

            paper(colours.f);
            rectf(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

            
            pen(colours.b);
            rect(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
            

            pen(colours.t)
            print(this.buttonData.display, this.pos.x * PIXEL_SCALE + this.offset.x, this.pos.y * PIXEL_SCALE + this.offset.y);

            
        }
        else
        {
            if(this.hoverOn || this.focused)
            {
                sprite(this.buttonData.hoverIndex, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);
            }
            else
            {
                sprite(this.buttonData.index, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);
            }
        }
    }
}