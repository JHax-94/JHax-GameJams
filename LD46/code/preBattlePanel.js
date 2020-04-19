class PreBattlePanel
{
    constructor(pos, dims, menuObj)
    {
        this.pos = pos;
        this.dims = dims;
        this.selected = false;

        console.log(menuObj);

        if(typeof(menuObj.menu) !== 'undefined')
        {
            this.subMenu = menuObj.menu;
            this.menuTextAlign = menuObj.menuAlign;
        }
        else
        {
            this.subMenu = [];
            this.menuTextAlign = CENTER;
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
        textAlign(this.menuTextAlign, CENTER);
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

    menuUp()
    {
        this.subMenuSelected = mod(this.subMenuSelected - 1, this.subMenu.length);
    }

    menuDown()
    {
        this.subMenuSelected = mod(this.subMenuSelected + 1, this.subMenu.length);
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
                    rect(this.pos.x, this.pos.y + 20 * i - 5, this.dims.w - 30, 25);
                    this.setMenuTextMode();
                }
                var labelMod = 0;
                if(this.subMenu[i].hasPrice)
                {
                    labelMod = -56;
                }

                text(this.subMenu[i].label, this.pos.x + labelMod, this.pos.y + 20 * i);

                if(this.subMenu[i].hasPrice)
                {
                    text(this.subMenu[i].price, this.pos.x + 80, this.pos.y + 20 * i);
                }
            }
        }
    }
}