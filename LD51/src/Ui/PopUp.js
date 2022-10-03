import { consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main";
import Button from "./Button";

export default class PopUp
{
    constructor(componentsList, variables)
    {
        this.renderLayer = "MENU_UI";
        this.components = [];

        this.basePos = { x: 0, y: 0 };
        this.baseDims = { w: TILE_WIDTH, h: TILE_HEIGHT };

        this.buttons = [];

        EM.RegisterEntity(this);

        this.LoadComponents(componentsList, variables);
    }

    LoadComponents(componentsList, variables)
    {
        for(let i = 0; i < componentsList.length; i ++)
        {
            let comp = componentsList[i];
            let pos = { x: 0, y: 0 };
            let dims = { w: 1, h: 1 }; 

            if(comp.variable)
            {
                comp.text = variables[comp.variable];
            }

            if(comp.isBaseDims)
            {
                this.baseDims = { w: comp.w, h: comp.h };
                dims.w = this.baseDims.w;
                dims.h = this.baseDims.h;

                let x = comp.pos.x;
                let y = comp.pos.y;
                if(x === "centre")
                {
                    x = (TILE_WIDTH - dims.w) * 0.5;
                }
                if(y === "centre")
                {
                    y = (TILE_HEIGHT - dims.h) * 0.5;
                }

                this.basePos.x = x;
                this.basePos.y = y;
            }
            else
            {
                if(comp.dims)
                {
                    dims.w = comp.dims.w;
                    dims.h = comp.dims.h;
                }

                if(comp.text)
                {
                    dims.w = this.CalculateTextWidth(comp.text);
                    dims.h = 1
                }

                let x = comp.pos.x;
                let y = comp.pos.y;
                if(x === "centre")
                {
                    x = (this.baseDims.w - dims.w) * 0.5;
                }
                if(y === "centre")
                {
                    y = (this.baseDims.h - dims.h) * 0.5;
                }

                pos.x = x;
                pos.y = y;
            }

            if(comp.type !== "Button")
            {
                let tComp = {
                    type: comp.type,
                    pos: pos,
                    dims: dims,
                    colour: comp.colour,
                    border: comp.border,
                    text: comp.text,
                }
    
                this.components.push(tComp);
            }
            else
            {
                let btnPos  ={ x:pos.x + this.basePos.x, y: pos.y + this.basePos.y };

                let newButton = new Button(btnPos, dims, comp.buttonData);

                if(comp.evt)
                {
                    let click = variables[comp.evt];

                    if(click)
                    {
                        newButton.ClickCallback = click;
                    }
                }

                this.buttons.push(newButton);
            }
            
        }
    }

    Close()
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            EM.RemoveEntity(this.buttons[i]);
        }

        EM.RemoveEntity(this);
    }

    CalculateTextWidth(text)
    {
        return text.length * 0.5 + (2/PIXEL_SCALE);
    }

    Draw()
    {
        for(let i = 0; i < this.components.length; i ++)
        {
            let c = this.components[i];

            let pos = {
                x: (this.basePos.x + c.pos.x) * PIXEL_SCALE,
                y: (this.basePos.y + c.pos.y) * PIXEL_SCALE                
            };

            let dims = {
                w: c.dims.w * PIXEL_SCALE,
                h: c.dims.h * PIXEL_SCALE
            }

            if(c.type === "Rect")
            {
                paper(c.colour);
                rectf(pos.x, pos.y, dims.w, dims.h);

                if(c.border)
                {
                    pen(c.border);
                    rect(pos.x, pos.y, dims.w, dims.h);
                }
            }

            if(c.type === "Text")
            {
                pen(c.colour);
                print(c.text, pos.x, pos.y);
            }
        }
    }
}