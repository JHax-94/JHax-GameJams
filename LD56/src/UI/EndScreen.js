import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main"
import Button from "./Button";

export default class EndScreen
{
    constructor(title)
    {
        this.renderLayer = "UI";
        this.title = title;

        this.dims = {
            w: 20,
            h: 12,
            x: 0,
            y: 0
        };

        this.font = getFont("LargeNarr");

        this.buttons = [];

        this.dims.x = (TILE_WIDTH - this.dims.w) * 0.5;
        this.dims.y = (TILE_HEIGHT - this.dims.h) * 0.5;

        EM.RegisterEntity(this);
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
            let buttonDims = { x: 0, y: this.dims.h - (options.length + i) * (height + space) , w: 16, h: 1.5 };

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
                "UI", 
                this);

            button.ClickEvent = () => { consoleLog(`Click[${i}]!`); options[i].callback(); };

            this.buttons.push(button);            
        }
    }

    DrawCentredText(text, y)
    {
        let textW = UTIL.GetTextWidth(text, this.font);
        print(text, this.dims.x * PIXEL_SCALE + 0.5 * (this.dims.w - textW) * PIXEL_SCALE, (this.dims.y + y) * PIXEL_SCALE);
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