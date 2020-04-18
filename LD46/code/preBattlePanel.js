class PreBattlePanel
{
    constructor(pos, dims, menuObj)
    {
        this.pos = pos;
        this.dims = dims;
        this.selected = false;

        if(typeof(menuObj.menu) !== 'undefined')
        {
            this.subMenu = menuObj.menu;
        }
        else
        {
            this.subMenu = [];
        }

        if(this.subMenu.length > 0)
        {
            this.subMenuSelected = 0;
        }
        else
        {
            this.subMenuSelected = -1;
        }

        this.title = menuObj.title;
    }

    setMenuTextMode()
    {
        fill(255);
        textSize(18);
        noStroke();
        textAlign(CENTER, CENTER);
    }

    setSelectedItemMode()
    {
        noFill();
        stroke(255);
        rectMode(CENTER);
    }

    selectedItem()
    {
        if(this.subMenuSelected >= 0 && this.subMenuSelected < this.subMenu.length)
        {
            return this.subMenu[this.subMenuSelected];
        }
        else
        {
            return 0;
        }
    }

    draw()
    {
        fill(255)
        textAlign(CENTER);
        text(this.title, this.pos.x, this.pos.y - this.dims.h / 2 + 30);

        if(this.selected)
        {
            noFill();
            stroke(255);
            rectMode(CENTER);
            rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);
            noStroke();
        }

        if(this.subMenu.length > 0)
        {
            this.setMenuTextMode();
            for(var i = 0; i < this.subMenu.length; i ++)
            {
                if(i === this.subMenuSelected && this.selected === true)
                {
                    this.setSelectedItemMode();
                    rect(this.pos.x, this.pos.y, this.dims.w - 60, 25);
                    this.setMenuTextMode();
                }
                
                text(this.subMenu[i].label, this.pos.x, this.pos.y + 20 * i);
            }
        }
    }
}