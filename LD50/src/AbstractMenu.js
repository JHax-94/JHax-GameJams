import Button from "./Button";
import { consoleLog, EM, getObjectConfig, PIXEL_SCALE } from "./main";

export default class AbstractMenu 
{
    constructor(configName)
    {
        this.y = 0;

        this.renderLayer = "MENU_UI";

        this.config = getObjectConfig(configName);

        this.root = this.config.root;

        this.components = [];

        this.inputWaits = {
            up: false,
            down: false
        }

        this.buttons = [];

        this.buttonMethods = {};

        this.focusedButton = 0;

        EM.RegisterEntity(this);
    }

    BuildComponents()
    {
        let menuRef = this;

        for(let i = 0; i < this.config.components.length; i ++)
        {
            let comp = this.config.components[i];

            consoleLog("==== CREATE COMPONENT ON MENU ====");
            consoleLog(comp);

            if(comp.type === "Button")
            {
                let newButton = new Button(
                    { x: (this.root.x + comp.x), y: (this.root.y + comp.y) },
                    { w: comp.w, h: comp.h }, 
                    { display: comp.text, renderLayer: "MENU_UI", offset: comp.offset });
                
                if(comp.trigger)
                {
                    if(this.buttonMethods[comp.trigger])
                    {
                        newButton.ClickCallback = this.buttonMethods[comp.trigger];
                    }
                }

                newButton.HoverCallback = function() {
                    menuRef.ButtonHovered(newButton);
                }

                newButton.y = 10;

                this.buttons.push(newButton);
            }
            else
            {
                this.components.push(comp);
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

    ButtonHovered(button)
    {
        consoleLog("BUTTON HOVERED");

        if(button.hoverOn && this.focusedButton >= 0)
        {
            this.focusedButton = -1;
            this.SetFocus(this.focusedButton);
        }
        
    }

    SetFocus(focusOn)
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            this.buttons[i].SetFocus(i === focusOn);
        }
    }

    ChangeButton(amount)
    {
        this.focusedButton = (this.focusedButton + amount + this.buttons.length) % this.buttons.length;

        //consoleLog(`change button to ${this.focusedButton}`);

        this.SetFocus(this.focusedButton);
    }


    Input(input)
    {
        if(input.up && this.inputWaits.up === false)
        {
            if(this.focusedButton < 0)
            {
                this.focusedButton = 1;
            }

            this.ChangeButton(-1);
            this.inputWaits.up = true;
        }
        else if(input.up === false && this.inputWaits.up)
        {
            this.inputWaits.up = false;
        }

        if(input.down && this.inputWaits.down === false)
        {
            this.ChangeButton(1);
            this.inputWaits.down = true;
        }
        else if(input.down === false && this.inputWaits.down)
        {
            this.inputWaits.down = false;
        }

        if(input.submit)
        {
            if(this.focusedButton >= 0)
            {
                this.buttons[this.focusedButton].Click();
            }
        }
    }

    Draw()
    {
        for(let i = 0; i < this.components.length; i ++)
        {
            let component = this.components[i];

            if(component.type === "Rect")
            {
                paper(component.colour);
                rectf((this.root.x + component.x) * PIXEL_SCALE, (this.root.y + component.y) * PIXEL_SCALE, component.w * PIXEL_SCALE, component.h * PIXEL_SCALE);
            }

            if(component.type === "Text")
            {
                pen(component.colour);
                print(component.text, (this.root.x + component.x) * PIXEL_SCALE, (this.root.y + component.y) * PIXEL_SCALE);
            }
        }
    }
    
}