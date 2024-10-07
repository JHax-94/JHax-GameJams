import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, SETUP, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main"
import AbstractUi from "./AbstractUi";
import Button from "./Button";

export default class EndScreen extends AbstractUi
{
    constructor(title, dims = null)
    {
        super();

        this.destroyed = false;

        this.renderLayer = "SUPER_UI";
        this.title = title;

        this.dims = {
            w: 20,
            h: 12,
            x: 0,
            y: 0
        };

        if(dims)
        {
            this.dims.w = dims.w;
            this.dims.h = dims.h;
        }

        this.font = getFont("LargeNarr");

        this.buttons = [];

        this.dims.x = (TILE_WIDTH - this.dims.w) * 0.5;
        this.dims.y = (TILE_HEIGHT - this.dims.h) * 0.5;

        EM.RegisterEntity(this);
    }

    Update(deltaTime)
    {
    }

    Restart()
    {
        consoleLog("Restart");

        SETUP();
    }

    Destroy()
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            EM.RemoveEntity(this.buttons[i]);
        }


        consoleLog("REMOVE ENTITY:");
        consoleLog(this);
        EM.RemoveEntity(this);

        this.destroyed = true;
    }

    Pos()
    {
        return this.dims;
    }

    BuildButtons(options)
    {
        let height = 1.5;
        let space = 0.5;

        for(let i = 0; i < options.length; i ++)
        {
            let buttonDims = { x: 0, y: this.dims.h - (options.length - i) * (height + space) , w: 16, h: 1.5 };

            buttonDims.x = (this.dims.w - buttonDims.w) * 0.5;

            let button = new Button(
                buttonDims, 
                { 
                    font: "LargeNarr",
                    rect: 
                    { 
                        colour: 5, textColour: 1, borderColor: 0,
                        text: options[i].text,
                    }
                }, 
                "SUPER_UI", 
                this);

            button.ClickEvent = () => { consoleLog(`Click[${i}]!`); options[i].callback(); };

            this.buttons.push(button);            
        }
    }

    

    Draw()
    {
        setFont(this.font);

        pen(12);
        paper(8);
        rectf(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        rect(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        pen(1);
        this.DrawCentredText(this.title.toUpperCase(), 1);
    }
}