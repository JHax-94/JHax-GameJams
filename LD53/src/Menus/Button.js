import Texture from "pixelbox/Texture";
import { consoleLog, EM, getFont, getObjectConfig, PIXEL_SCALE, setFont } from "../main";

export default class Button
{
    constructor(buttonDims, buttonSettings, renderLayer)
    {
        /*consoleLog("Button Settings:");
        consoleLog(buttonSettings);*/

        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.drawDims = buttonDims;
        this.dims = { x: buttonDims.x, y: buttonDims.y, w: buttonDims.w *0.5, h: buttonDims.h * 0.5 };

        this.texture = new Texture(this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        this.font = null;

        this.settings = buttonSettings;

        if(this.settings.style)
        {
            let styleConfig = getObjectConfig(this.settings.style, true);

            this.settings.rect = {};

            Object.assign(this.settings.rect, styleConfig.rect);
        }

        this.btnObj = this.settings.btnObj;

        if(this.settings.text)
        {
            this.settings.rect.text = this.settings.text;
        }

        
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
        return { x: this.drawDims.x * PIXEL_SCALE, y: this.drawDims.y * PIXEL_SCALE, w: this.drawDims.w * PIXEL_SCALE, h: this.drawDims.h * PIXEL_SCALE };
    }

    Focus(focusOn)
    {
        this.state.focused = focusOn;
    }

    Hover(hoverOn)
    {
        this.state.hovered = hoverOn;
    }

    GetPrintPosition(txt)
    {
        let btnMidX = (0.5 * this.dims.w) * PIXEL_SCALE;
        let btnMidY = (0.5 * this.dims.h) * PIXEL_SCALE;

        let printX = btnMidX - (this.font.charWidth * 0.5) *  txt.length;
        let printY = btnMidY - Math.round(this.font.charHeight * 0.5);

        return [ printX, printY ];
    }

    Draw()
    {
        if(this.settings.sprite)
        {
            let spriteIndex = this.settings.sprite;

            if(this.state.hovered)
            {
                spriteIndex = this.settings.hoverSprite;
            }
    
            this.texture.sprite(spriteIndex, 0, 0);
        }
        else if(this.settings.rect)
        {
            
            this.texture.paper(this.settings.rect.colour);
            this.texture.rectf(0, 0, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

            this.texture.pen(this.settings.rect.textColour);
            
            let txt = this.settings.rect.text;

            let printPos = this.GetPrintPosition(txt);

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
        
            this.texture.print(txt, printPos[0], printPos[1]);

            if(this.state.hovered || this.state.focused)
            {
                this.texture.paper(this.settings.rect.borderColour);
                this.texture.rect(0, 0, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
            }
        }

        this.texture._drawEnhanced(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, { scale: 2 });
    }
}