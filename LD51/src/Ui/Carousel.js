import { consoleLog, EM, PIXEL_SCALE, UTIL } from "../main";
import Button from "./Button";

export default class Carousel 
{
    constructor(dims, optionList, title)
    {
        this.dims = dims;

        this.title = title;

        this.plusButton = new Button(
            { x: dims.x + dims.w, y: dims.y }, 
            { w: 1, h: 1 }, 
            { display: ">", renderLayer: "MENU_UI", offset: {x:2, y:2} });
        
            this.minusButton = new Button(
                { x: dims.x, y: dims.y }, 
                { w: 1, h: 1 },
                { display: "<", renderLayer: "MENU_UI", offset: { x: 2, y: 2 } });

        this.options = optionList;

        
        let caller = this;

        this.plusButton.ClickCallback = () => { caller.IndexUp() };
        this.minusButton.ClickCallback = () => { caller.IndexDown() };

        EM.RegisterEntity(this);
        
        this.selectedIndex = 0;
    }

    GetButtonPos(btn)
    {
        return { x: (this.dims.x + btn.x), y: (this.dims.y + btn.y) }; 
    }

    DrawButton(btn)
    {
        let pos = this.GetButtonPos(btn);

        sprite(btn.sprite, pos.x * PIXEL_SCALE , pos.y * PIXEL_SCALE, btn.flipH, btn.flipV, btn.flipR);
    }

    GetSelectedValue()
    {
        return this.options[this.selectedIndex].value;
    }

    SetIndex(val)
    {
        this.selectedIndex = val % this.options.length;
    }

    IndexUp()
    {
        this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    }

    IndexDown()
    {
        this.selectedIndex = (this.selectedIndex + this.options.length - 1) % this.options.length;
    }

    Delete()
    {
        EM.RemoveEntity(this.plusButton);
        EM.RemoveEntity(this.minusButton);
    }

    Draw()
    {
        pen(1);
        if(this.title)
        {
            print(this.title, (this.dims.x - UTIL.CalculateTextWidth(this.title)) * PIXEL_SCALE, this.dims.y * PIXEL_SCALE + 2)
        }
        print(this.options[this.selectedIndex].display, (this.dims.x + 1.25) * PIXEL_SCALE, this.dims.y * PIXEL_SCALE + 2);
    }
}