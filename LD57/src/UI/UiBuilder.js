import Label from "./Label";
import { consoleLog } from "../main";
/*import Carousel from "./Carousel";
import RichText from "./RichText";
import PageGroup from "./PageGroup";*/

export default class UiBuilder 
{
    constructor()
    {
        
    }

    CalculateDims(comp, parent, newBase = null)
    {   
        let dims = null;

        if(comp.dims)
        {
            dims = { x: comp.dims.x, y: comp.dims.y, w: null, h: null };

            if(comp.dims.w || comp.dims.w === 0)
            {
                dims.w = comp.dims.w;
            }

            if(comp.dims.h || comp.dims.h === 0)
            {
                dims.h = comp.dims.h;
            }
        }
        
        if(dims)
        {
            //consoleLog("Adjust dims:");
            let temp = {
                x: dims.x,
                y: dims.y,
                w: dims.w,
                h: dims.h
            };
            //consoleLog(temp);

            if(dims.x === "centre" || dims.x === "c")
            {
                if(dims.w)
                {
                    dims.x = (parent.baseDims.w - dims.w) * 0.5;
                }
            }

            if(dims.y === "centre" && dims.h)
            {
                if(dims.y)
                {
                    dims.y = (parent.baseDims.h - dims.h) * 0.5;
                }
            }

            if(comp.isBaseDims && newBase)
            {
                consoleLog("Set new Base dims:");

                newBase.x = dims.x;
                newBase.y = dims.y;
                newBase.w = dims.w;
                newBase.h = dims.h;
                dims.x = 0;
                dims.y = 0;
            }
        }

        return dims;
    }

    BuildUiElements(uiElements, parent)
    {
        let elementList = [];

        for(let i = 0; i < uiElements.length; i ++)
        {   
            let comp = uiElements[i];

            let elem = this.BuildUiElement(comp, parent);

            if(elem !== null)
            {
                elementList.push(elem);
            }
        }

        return elementList;
    }


    BuildLabelSettings(comp, parent)
    {
        let labelSettings = {
            renderLayer: "MENU_UI"
        };

        if(comp.colours)
        {
            labelSettings.colours = comp.colours;
        }

        if(comp.background)
        {
            labelSettings.background = comp.background;
        }

        if(comp.posType)
        {
            labelSettings.posType = comp.posType;
        }

        if(comp.font)
        {
            labelSettings.font = comp.font;
        }

        if(comp.variable && parent && parent.variables)
        {
            comp.text = parent.variables[comp.variable];
        }

        if(comp.floatControl)
        {
            labelSettings.floatControl = comp.floatControl;
        }

        if(this.logging)
        {
            consoleLog("Construct Label");
            consoleLog(comp.text);
            consoleLog(labelSettings);
        }
        
        return labelSettings;
    }

    BuildCarouselSettings(comp, parent)
    {
        let carouselSettings = {};

        if(comp.upBtn)
        {
            carouselSettings.plusButton = {
                sprite: comp.upBtn.i,
                h: comp.upBtn.h,
                v: comp.upBtn.v,
                r: comp.upBtn.r,
                x: comp.upBtn.x,
                y: comp.upBtn.y
            }
        }

        if(comp.downBtn)
        {
            carouselSettings.minusButton = {
                sprite: comp.downBtn.i,
                h: comp.downBtn.h,
                v: comp.downBtn.v,
                r: comp.downBtn.r,
                x: comp.downBtn.x,
                y: comp.downBtn.y
            };
        }

        if(comp.name)
        {
            carouselSettings.name = comp.name;
        }

        if(comp.label)
        {
            carouselSettings.label = comp.label;
        }

        if(comp.drawVal)
        {
            carouselSettings.drawVal = comp.drawVal;
        }

        if(comp.range)
        {
            carouselSettings.range = comp.range;
        }

        if(comp.focusUp)
        {
            carouselSettings.focusUp = comp.focusUp;
        }

        if(comp.focusDown)
        {
            carouselSettings.focusDown = comp.focusDown;
        }

        if(comp.default)
        {
            carouselSettings.default = comp.default;
        }

        if(comp.source)
        {
            carouselSettings.source = parent.GetMenuParam(comp.source);

            if(!carouselSettings.source)
            {
                consoleLog("Tidy up undefined / null source");
                carouselSettings.source = null;
            }
        }

        if(comp.values)
        {
            carouselSettings.values = comp.values;
        }

        if(comp.addToSource)
        {
            carouselSettings.addToSource = comp.addToSource;
        }

        return carouselSettings;
    }

    BuildUiElement(comp, parent)
    {
        if(comp && comp.settings && comp.settings.debugOn)
        {
            consoleLog("BUILDING UI ELEMENT FOR:");
            consoleLog(comp);
        }

        let dims = this.CalculateDims(comp, parent);

        let newComp = null;

        if(comp.type === "Label")
        {
            let labelSettings = this.BuildLabelSettings(comp);

            let label = new Label(dims, comp.text, labelSettings, parent);

            newComp = label;
        }
        /*else if(comp.type === "Carousel")
        {
            let carouselSettings = this.BuildCarouselSettings(comp, parent);
            
            let carousel = new Carousel(dims, carouselSettings, 1, parent);

            newComp = carousel;
        }
        else if(comp.type === "Text")
        {
            let richText = new RichText(dims, comp, parent);

            newComp = richText;
        } 
        else if(comp.type === "Pages")
        {
            let pages = new PageGroup(dims, comp, parent);
            newComp = pages;
        }*/

        if(!newComp)
        {
            console.error("Failed to create UI Element for component data:");
            consoleLog(comp);
        }

        return newComp;
    }
}