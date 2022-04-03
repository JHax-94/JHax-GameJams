import Button from "./Button";
import { consoleLog, EM, getObjectConfig, PIXEL_SCALE } from "./main";
import PickupSpawner from "./PickupSpawner";

export default class AbstractMenu 
{
    constructor(configName)
    {
        this.y = 0;

        this.renderLayer = "MENU_UI";

        this.config = getObjectConfig(configName);

        this.root = this.config.root;

        this.components = [];

        this.buttons = [];

        this.buttonMethods = {};

        EM.RegisterEntity(this);
    }

    BuildComponents()
    {
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

                newButton.y = 10;

                this.buttons.push(newButton);

                consoleLog("NEW BUTTON: ");
                consoleLog(newButton);
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

    Draw()
    {
        consoleLog("DRAW MENU");

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