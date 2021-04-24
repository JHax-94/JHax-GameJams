import Label from "./Label";
import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class ChartSheet
{
    constructor(sheetBounds, sheetColours, components)
    {
        /*
        consoleLog("CONSTRUCTING CHART SHEET");
        consoleLog(sheetBounds);
        consoleLog(sheetColours);
        consoleLog(components);*/

        this.sheetBounds = sheetBounds;
        this.sheetColours = sheetColours;

        this.labels = [];

        em.AddRender(this);

        for(var i = 0; i < components.length; i ++)
        {
            /*
            consoleLog("LOADING COMPONENTS...");
            consoleLog(components);
            */
            if(components[i].type === "Label")
            {
                //consoleLog("CREATE LABEL");

                var newLabel = new Label(
                    {tileX: this.sheetBounds.x+components[i].pos.x, tileY: this.sheetBounds.y + components[i].pos.y },
                    components[i].text,
                    this.sheetColours.text);

                newLabel.id = components[i].id;
                /*
                consoleLog("Add sheet label");
                consoleLog(newLabel);
                */
                this.labels.push(newLabel);
            }
        }

        /*
        consoleLog("SHEET LABELS");
        consoleLog(this.labels);*/
    }

    SetLabelText(id, text)
    {
        for(var i = 0; i < this.labels.length; i ++)
        {
            if(this.labels[i].id === id)
            {
                this.labels[i].text = text;
                break;
            }
        }
    }

    Draw()
    {
        /*
        consoleLog("RENDER CHART SHEET!");
        consoleLog(this.sheetBounds);
        */  
        paper(this.sheetColours.foreground);
        rectf(this.sheetBounds.x * PIXEL_SCALE, this.sheetBounds.y * PIXEL_SCALE, this.sheetBounds.w * PIXEL_SCALE, this.sheetBounds.h * PIXEL_SCALE);
    }
}