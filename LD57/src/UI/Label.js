import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, UTIL } from "../main";
import { POS_TYPE } from "../Enums/PositionType";
import UiComponent from "./UiComponent";

export default class Label extends UiComponent
{
    constructor(dims, text, settings, parent)
    {
        /*consoleLog("CONSTRUCTING LABEL WITH PARENT:");
        consoleLog(parent);
        consoleLog(settings);*/

        super(parent, settings);

        if(settings.renderLayer)
        {
            this.renderLayer = settings.renderLayer;
        }

        if(settings.DEBUG_NAME)
        {
            this.DEBUG_NAME = settings.DEBUG_NAME;
        }

        this.posType = POS_TYPE.TOP_LEFT;

        this.GetSetting("posType", (setPosType) =>
        {
            if(UTIL.IsString(setPosType))
            {
                this.posType = POS_TYPE.Parse(setPosType);
            }
            else
            {
                this.posType = setPosType;
            }
        });

        this.debugOn = false;
        
        if(settings.debugOn)
        {
            this.debugOn = true;
        }

        this.fixedDimsMode = false;

        this.text = "";

        this.font = null;

        this.GetSetting("font", (setFont) =>
        {
            this.font = getFont(setFont);
        });

        this.SetLabelDimensions(dims, settings);

        if(text)
        {
            this.SetText(text);
        }
        else
        {
            this.hide = true;
        }

        this.background = null;

        if(settings.background)
        {
            this.background = { colour: 0, margins: { x: 0, y: 0 } };
                
            if(settings.background.colour || settings.background.colour === 0)
            {
                this.background.colour = settings.background.colour;
            }
            else
            {
                this.background.colour = 0;
            }
            
            if(settings.background.margins)
            {
                this.background.margins.x = settings.background.margins.x;
                this.background.margins.y = settings.background.margins.y;
            }
        }

        this.colours = {
            font: 1,
        };

        if(settings.colours)
        {
            if(settings.colours.font || settings.colours.font === 0)
            {
                this.colours.font = settings.colours.font;
            }
        }

        EM.RegisterEntity(this);

        if(this.debugOn)
        {
            consoleLog("-- label constructed --");
            consoleLog(this);
        }
    }

    SetLabelDimensions(dims, settings)
    {
        if(dims)
        {
            this.pos = { x: dims.x, y: dims.y };
        }
        
        let parentDims = this.ParentDims();

        if(this.pos.x === 'c') this.pos.x = 0.5 * parentDims.w;
        if(this.pos.y === 'c') this.pos.y = 0.5 * parentDims.h;
        
        if(dims)
        {
            this.dims = { w: dims.w, h: dims.h };
        }

        this.textDims = { x: this.dims.x, y: this.dims.y, w: 0, h: 0 };

        if(settings.centred)
        {
            this.centred = settings.centred;
        }

        if(settings.fixedDims)
        {
            this.dims.w = settings.fixedDims.w;
            this.dims.h = settings.fixedDims.h;
            this.fixedDimsMode = true;
        }
    }

    GetTextWidth()
    {
        //return ((4 * this.text.length) - 1) / PIXEL_SCALE;
        return UTIL.GetTextWidth(this.text, this.font);
    }

    GetTextHeight()
    {
        return UTIL.GetTextHeight(this.text, this.font);
    }

    SetDimensions(dims)
    {
        let dimsChanged = false;

        if(dims.y)
        {
            this.dims.y = dims.y;
            dimsChanged = true;
        }

        if(dimsChanged)
        {
            this.RecalculateTextPosition();
        }
    }

    SetText(text)
    {
        if(text)
        {
            if(this.font && this.font.forceCaps)
            {
                this.text = text.toUpperCase();
            }
            else
            {
                this.text = text;
            }

            this.textDims.w = this.GetTextWidth();
            this.textDims.h = this.GetTextHeight();

            if(!this.fixedDimsMode)
            {
                this.dims.w = this.textDims.w;
                this.dims.h = this.textDims.h;
            }

            this.RecalculateTextPosition();

            this.hide = false;
        }
        else
        {
            this.hide = true;
        }
    }

    RecalculateTextPosition()
    {
        let rp = this.RootPos();

        this.textDims.x = rp.x + 0.5 * (this.dims.w - this.textDims.w);
        this.textDims.y = rp.y + 0.5 * (this.dims.h - this.textDims.h);
    }

    CalculateTextWithinDims(dims)
    {
        let textDims = {
            x: dims.x + 0.5 * (dims.w - this.textDims.w * PIXEL_SCALE),
            y: dims.y + 0.5 * (dims.h - this.textDims.h * PIXEL_SCALE),
            w: this.textDims.w * PIXEL_SCALE,
            h: this.textDims.h * PIXEL_SCALE
        };

        return textDims;
    }

    CentreAround(pos)
    {
        let newPos = {
            x: (pos.x - this.textDims.w * 0.5),
            y: (pos.y - this.textDims.h * 0.5)
        };
        /*
        this.pos.x = newPos.x;
        this.pos.y = newPos.y;
        */
        this.RecalculateTextPosition();
    }

    SetPosType(newPosType)
    {
        this.posType = newPosType;
    }

    GetBackgroundDims()
    {
        let margins = {
            x: 0,
            y: 0
        };

        let rp = this.RootPos();

        let backgroundDims = {};

        if(this.background && this.background.margins && !this.fixedDimsMode)
        {
            //consoleLog(`Position "${this.text}" without pos type...`);

            margins.x = this.background.margins.x;
            margins.y = this.background.margins.y;

            backgroundDims = {
                x: (rp.x - this.posType.wMod * this.dims.w) * PIXEL_SCALE - margins.x, 
                y: (rp.y - this.posType.hMod * this.dims.h) * PIXEL_SCALE - margins.y,
                w: this.textDims.w * PIXEL_SCALE + margins.x * 2,
                h: this.textDims.h * PIXEL_SCALE + margins.y * 2
            };
        }
        else
        {

            /*consoleLog(`Position "${this.text}" with pos type...`);
            consoleLog(this.posType);*/

            backgroundDims = {
                x: (rp.x - this.posType.wMod * this.dims.w) * PIXEL_SCALE,
                y: (rp.y - this.posType.hMod * this.dims.h) * PIXEL_SCALE,
                w: this.dims.w * PIXEL_SCALE,
                h: this.dims.h * PIXEL_SCALE
            };
        }
        
        /*consoleLog(`Label background dims: ${this.text}`);
        consoleLog(backgroundDims);*/
        
        return backgroundDims;
    }

    DrawBackground(dims)
    {
        if(this.background)
        {
            paper(this.background.colour);
            rectf(dims.x, dims.y, dims.w, dims.h);
        }
    }

    DrawText(dims)
    {
        let txtDims = this.CalculateTextWithinDims(dims);

        pen(this.colours.font);

        print(this.text, txtDims.x, txtDims.y);
    }

    DrawInternal()
    {   
        let dims = this.GetBackgroundDims();

        this.DrawBackground(dims);
        this.DrawText(dims);
    }

    debugDraw()
    {
        paper(18);
        EM.hudLog.push(`Label @ ${this.pos.x}, ${this.pos.y}`);
        rectf(this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
    }

    Draw()
    {
        if(this.visible)
        {
            if(this.debugOn)
            {
                this.debugDraw();
            }

            if(this.font && this.font.img)
            {
                setFont(this.font.img);
            }
            else
            {
                setFont(null);
            }

            if(!this.hide)
            {
                this.DrawInternal();
            }
        }
    }
}