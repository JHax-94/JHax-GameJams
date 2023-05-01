import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE, consoleLog } from "../main";
import ButtonList from "./ButtonList";
import Button from "./Button";

export default class Menu
{
    constructor(menuConfig)
    {
        this.renderLayer = "MENU_UI";
        this.base = {x: 0, y: 0, w: 1, h: 1};

        if(menuConfig.base)
        {
            this.base.x = menuConfig.base.x;
            this.base.y = menuConfig.base.y;
            this.base.w = menuConfig.base.w;
            this.base.h = menuConfig.base.h;
        }

        this.menuTex = null;
        this.components = [];
        this.texComponents = [];
        this.BuildComponents(menuConfig.components);

        EM.RegisterEntity(this);

        if(this.texComponents.length > 0)
        {
            this.menuTex = this.BuildMenuTexture();
        }
    }

    Close()
    {
        for(let i = 0; i < this.components.length; i ++)
        {
            EM.RemoveEntity(this.components[i]);
        }
        EM.RemoveEntity(this);
    }

    BuildComponents(components)
    {
        for(let i = 0; i < components.length; i ++)
        {
            let c = components[i];

            if(c.type === "ButtonList")
            {
                this.components.push(new ButtonList(c));
            }
            else if(c.type === "Button")
            {

                let dims = {
                    x: this.base.x + c.dims.x,
                    y: this.base.y + c.dims.y,
                    w: c.dims.w,
                    h: c.dims.h
                };

                let button = new Button(dims, {
                    text: c.text,
                    style: "StandardButton",
                    
                },
                "BUTTONS_UI");

                consoleLog(`Bind button to: ${c.click}`);

                consoleLog(this);

                consoleLog(this[c.click]);
                if(this[c.click])
                {   
                    consoleLog("-- bind button event --");
                    let menu = this;

                    button.ClickEvent = () => { menu[c.click](); };
                }

                this.components.push(button);
            }
            else if(["Rect", "Text"].indexOf(c.type) >= 0)
            {
                this.texComponents.push(c);
            }
        }
    }

    BuildMenuTexture()
    {
        let texture = new Texture(this.base.w * PIXEL_SCALE, this.base.h * PIXEL_SCALE);

        for(let i = 0; i < this.texComponents.length; i ++)
        {
            let c = this.texComponents[i];
            if(c.type === "Rect")
            {
                texture.paper(c.background);
                texture.rectf(c.dims.x * PIXEL_SCALE, c.dims.y * PIXEL_SCALE, c.dims.w * PIXEL_SCALE, c.dims.h * PIXEL_SCALE);
            }
            else if(c.type === "Text")
            {
                texture.pen(1);

                for(let l = 0; l < c.lines.length; l ++)
                {
                    texture.print(c.lines[l], c.dims.x * PIXEL_SCALE, (c.dims.y + i * c.spacing) * PIXEL_SCALE);
                } 
            }
        }

        return texture;

    }

    Update(deltaTime) {}

    Draw()
    {
        if(this.menuTex)
        {   
            this.menuTex._drawEnhanced(this.base.x * PIXEL_SCALE, this.base.y * PIXEL_SCALE, {scale: 2});
        }
    }
}