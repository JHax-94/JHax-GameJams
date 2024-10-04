import { extend } from "p2/src/utils/Utils";
import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_WIDTH } from "../main";
import UiComponent from "./UiComponent";

export default class Button extends UiComponent
{
    constructor(buttonDims, buttonSettings, renderLayer, parent)
    {
        super(parent);
        
        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.dims = buttonDims;

        this.font = null;

        this.settings = buttonSettings;

        if(this.settings.font)
        {
            this.font = getFont(this.settings.font);
        }
        else
        {
            this.font = getFont();
        }
        /*
        consoleLog("Button loaded with font...");
        consoleLog(this.font);
        */
        this.state = {
            hovered: false,
            focused: false
        };

        EM.RegisterEntity(this);
    }

    UpdateDims(pos, dimensions)
    {
        if(pos)
        {
            this.dims.x = pos.x;
            this.dims.y = pos.y;
        }

        if(dimensions)
        {
            this.dims.w = dimensions.w;
            this.dims.h = dimensions.h;
        }
    }

    Click(button)
    {
        if(this.ClickEvent)
        {
            this.ClickEvent(button);
        }
    }

    Bounds()
    {
        let rp = this.RootPos();

        return { x: rp.x * PIXEL_SCALE, y: rp.y * PIXEL_SCALE, w: this.dims.w * PIXEL_SCALE, h: this.dims.h * PIXEL_SCALE };
    }

    Focus(focusOn)
    {
        this.state.focused = focusOn;
    }

    Hover(hoverOn)
    {
        this.state.hovered = hoverOn;
    }

    GetPrintPosition(rp, txt)
    {
        let btnMidX = (rp.x + 0.5 * this.dims.w) * PIXEL_SCALE;
        let btnMidY = (rp.y + 0.5 * this.dims.h) * PIXEL_SCALE;

        let printX = btnMidX - 0.5 * (this.font.charWidth) * txt.length;
        let printY = btnMidY - Math.round(0.5 * this.font.charHeight); 

        return [ printX, printY ];
    }

    Pos()
    {
        return { x: this.dims.x, y: this.dims.y };
    }

    Draw()
    {
        let rp = this.RootPos();

        if(this.state.hovered)
        {
            EM.hudLog.push(`Button bounds: (${this.dims.x}, ${this.dims.y}) [${this.dims.w}, ${this.dims.h}]`);
            EM.hudLog.push(`RP: (${rp.x}, ${rp.y}) [${rp.w}, ${rp.h}]`);
        }

        if(this.settings.sprite)
        {
            let spriteIndex = this.settings.sprite;

            if(this.state.hovered)
            {
                spriteIndex = this.settings.hoverSprite;
            }
    
            sprite(spriteIndex, this.dims.x, this.dims.y);
        }
        else if(this.settings.rect)
        {
            
            paper(this.settings.rect.colour);
            //rectf(this.dims.x  * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
            rectf(rp.x * PIXEL_SCALE, rp.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

            pen(this.settings.rect.textColour);
            
            let txt = this.settings.rect.text;

            let printPos = this.GetPrintPosition(rp, txt);

            if(this.font)
            {
                setFont(this.font.img);

                if(this.font.forceCaps)
                {
                    txt = txt.toUpperCase();
                }
            }
            else
            {
                setFont(null);
            }
        
            print(txt, printPos[0], printPos[1]);

            if(this.state.hovered || this.state.focused)
            {
                paper(this.settings.rect.borderColour);
                rect(rp.x * PIXEL_SCALE, rp.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
            }
        }
    }
}