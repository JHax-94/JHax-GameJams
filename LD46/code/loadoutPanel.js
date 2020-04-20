class LoadoutPanel
{
    constructor(pos, dims, panelObj)
    {
        console.log("PANEL: " + panelObj.title);

        this.pos = pos;
        this.dims = dims;

        this.title = panelObj.title;
        //this.slotList = panelObj.slots;
        this.inventory = panelObj.inventory;

        this.maxEquip = panelObj.maxEquipped;
        this.equipCount = 0;

        //console.log(this.slotList);
        //console.log(this.inventory);

        /*
        if(typeof(this.slotList) === 'undefined' )
        {
            this.slotList = [];
        }*/
        if(typeof(this.inventory) === 'undefined')
        {
            this.inventory = [];
        }

        this.selectedRow = 0;

        this.topLeft =  { x: this.pos.x - this.dims.w / 2, y: this.pos.y - this.dims.h / 2 };

        this.selected = false;
        this.focused = false;

        this.calculateSelected();

        this.slotRowBase = {x: this.pos.x /*- this.dims.w / 4*/, y: this.topLeft + 30 };
        this.inventoryRowBase = { x: this.pos.x /*+ this.dims.w / 4*/, y: this.topLeft + 30 };
    }

    valid()
    {
        return this.equipCount > 0 && this.equipCount <= this.maxEquip;
    }

    titleMode()
    {
        noStroke();
        fill(255);
        textSize(21);
        textAlign(LEFT);
    }

    rowMode()
    {
        noStroke();
        fill(255);
        textSize(16);
        textAlign(LEFT);
    }

    selectBoxMode()
    {
        stroke(255);
        noFill();
        rectMode(CENTER);
    }

    focus()
    {
        this.focused = true;
    }

    unfocus()
    {
        this.focused = false;
    }

    menuUp()
    {
        this.selectedRow = mod(this.selectedRow - 1, this.inventory.length);
    }

    menuDown()
    {
        this.selectedRow = mod(this.selectedRow + 1, this.inventory.length);
    }

    calculateSelected()
    {
        var total = 0;
        for(var i = 0; i < this.inventory.length; i ++)
        {
            if(this.inventory[i].equipped)
            {
                total = total + 1;
            }
        }

        this.equipCount = total;
    }

    menuSubmit()
    {
        this.inventory[this.selectedRow].equipped = !this.inventory[this.selectedRow].equipped;
        this.calculateSelected();
    }

    menuBack()
    {
        
    }

    draw()
    {   
        if(this.selected && !this.focused)
        {
            this.selectBoxMode();
            rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);
        }

        this.titleMode();
        text(this.title, this.topLeft.x + 5, this.topLeft.y + 15);
        
        textAlign(RIGHT)
        text(this.equipCount + "/" + this.maxEquip, this.topLeft.x + this.dims.w - 5, this.topLeft.y + 15);
        
        for(var i = 0; i < this.inventory.length; i ++)
        {
            if(i === this.selectedRow && this.focused)
            {
                this.selectBoxMode();
                rect(this.pos.x, this.topLeft.y + 50 + i * 20, this.dims.w - 5, 25);
            }

            this.rowMode();
            text(this.inventory[i].name, this.topLeft.x + 5, this.topLeft.y + 50 + i * 20);
            
            if(this.inventory[i].equipped)
            {
                text("\u2713", this.topLeft.x + this.dims.w - 30, this.topLeft.y + 50 + i * 20);
            }
        }
    }

}