import Button from "./Button";
import Label from "./Label";
import { consoleLog, em, PIXEL_SCALE } from "./main";
import SpriteRender from "./SpriteRender";

export default class ChartSheet
{
    constructor(sheetBounds, sheetColours, components, closeButton, closedListener)
    {

        /*
        consoleLog("CONSTRUCTING CHART SHEET");
        consoleLog(sheetBounds);
        consoleLog(sheetColours);
        consoleLog(components);*/

        this.sheetBounds = sheetBounds;
        this.sheetColours = sheetColours;

        this.closeButton = null;
        this.labels = [];
        this.sprites = [];

        em.AddRender(this);

        this.closedListener = closedListener;

        if(closeButton)
        {
            this.closeButton = new Button({
                x: this.sheetBounds.x + this.sheetBounds.w - 1,
                y: this.sheetBounds.y,
                w: 1,
                h: 1
            },
            {
                spriteIndex: 11
            },
            this.sheetColours,
            "CLOSE",
            this);

            this.closeButton.hideShadow = true;
        }

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
                    this.sheetColours.text,
                    components[i].font);

                newLabel.id = components[i].id;
                /*
                consoleLog("Add sheet label");
                consoleLog(newLabel);
                */
                this.labels.push(newLabel);
            }
            else if( components[i].type === "Sprite")
            {
                var sprite = new SpriteRender(
                    { x: this.sheetBounds.x + components[i].pos.x, y: this.sheetBounds.y + components[i].pos.y },
                    components[i].sprite);

                this.sprites.push(sprite);
            }
        }

        /*
        consoleLog("SHEET LABELS");
        consoleLog(this.labels);*/
    }

    ButtonClicked(byButton)
    {
        if(this.closeButton && this.closeButton === byButton)
        {
            this.Delete();
            this.closeButton.Delete();
            for(var i = 0; i < this.labels.length; i ++)
            {
                this.labels[i].Delete();
            }

            if(this.closedListener)
            {
                this.closedListener.SheetClosed();
            }
        }
    }

    Delete()
    {
        em.RemoveRender(this);
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
        if(this.logging)
        {
            //consoleLog(this.sheetColours);
        }

        if(this.sheetColours.shadow || this.sheetColours.shadow === 0)
        {
            var shadowOffset = { x: 0.5, y: 0.5 };

            paper(this.sheetColours.shadow);
            rectf((this.sheetBounds.x + shadowOffset.x) * PIXEL_SCALE, 
                (this.sheetBounds.y + shadowOffset.y) * PIXEL_SCALE, 
                this.sheetBounds.w * PIXEL_SCALE, 
                this.sheetBounds.h * PIXEL_SCALE);
        }

        paper(this.sheetColours.foreground);
        rectf(this.sheetBounds.x * PIXEL_SCALE, this.sheetBounds.y * PIXEL_SCALE, this.sheetBounds.w * PIXEL_SCALE, this.sheetBounds.h * PIXEL_SCALE);

        
    }
}