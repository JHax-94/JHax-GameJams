import { consoleLog, EM, getFont, getObjectConfig, PIXEL_SCALE, setFont } from "../main";

export default class Button
{
    constructor(buttonDims, buttonSettings, renderLayer)
    {
        consoleLog("Button Settings:");
        consoleLog(buttonSettings);

        if(renderLayer)
        {
            this.renderLayer = renderLayer;
        }

        this.dims = buttonDims;

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

        /*
        if(this.settings.font)
        {
            this.font = getFont(this.settings.font);
        }
        else
        {
            this.font = getFont();
        }*/
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
        return { x: this.dims.x * PIXEL_SCALE, y: this.dims.y * PIXEL_SCALE, w: this.dims.w * PIXEL_SCALE, h: this.dims.h * PIXEL_SCALE };
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
        let btnMidX = (this.dims.x + 0.5 * this.dims.w) * PIXEL_SCALE;
        let btnMidY = (this.dims.y + 0.5 * this.dims.h) * PIXEL_SCALE;

        let printX = btnMidX /*- 0.5 * (this.font.charWidth) *  txt.length*/;
        let printY = btnMidY /*- Math.round(0.5 * this.font.charHeight)*/;

        return [ printX, printY ];
    }

    Draw()
    {
        consoleLog("Draw button with settings:");
        consoleLog(this.settings);
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
            rectf(this.dims.x  * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

            pen(this.settings.rect.textColour);
            
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
                //setFont(null);
            }
        
            consoleLog(`Print Text: ${txt}`);
            print(txt, printPos[0], printPos[1]);

            if(this.state.hovered || this.state.focused)
            {
                paper(this.settings.rect.borderColour);
                rect(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
            }
        }
    }
}