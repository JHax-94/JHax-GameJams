class PreBattlePanel
{
    constructor(pos, dims, menuObj, defaultIndex)
    {
        this.pos = pos;
        this.dims = dims;
        this.selected = false;

        this.flavourTextPos = { x: this.pos.x, y: this.pos.y - this.dims.h };

        this.default = 0;
        if(defaultIndex)
        {
            this.default = defaultIndex;
        }
        console.log("==== BATTLE PANEL ====");
        console.log(menuObj);

        this.itemsCentered = false;

        this.topLeft = { x: this.pos.x - this.dims.w/2, y: this.pos.y - this.dims.h/2}

        if(typeof(menuObj.menu) !== 'undefined')
        {
            this.subMenu = menuObj.menu;
            this.itemsCentered = menuObj.isCentered;
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

        
        console.log(this.itemsCentered);
    }

    setMenuTextMode()
    {
        fill(255);
        textSize(18);
        noStroke();
        if(this.itemsCentered)
        {
            textAlign(CENTER, CENTER);
        }
        else
        {
            textAlign(LEFT, CENTER);
        }
        
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

    setOwned()
    {
        this.subMenu[this.subMenuSelected].owned = true;
    }

    menuUp()
    {
        this.subMenuSelected = mod(this.subMenuSelected - 1, this.subMenu.length);
    }

    menuDown()
    {
        this.subMenuSelected = mod(this.subMenuSelected + 1, this.subMenu.length);
    }

    resetSelection()
    {
        this.subMenuSelected = this.default;
    }

    setFlavourWindowMode()
    {
        fill(color(51, 51, 51, 200));
        noStroke();
        rectMode(CENTER);
    }

    setFlavourTextMode()
    {
        fill(255);
        noStroke();
        textAlign(CENTER);
    }


    draw()
    {
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
            for(var i = 0; i < this.subMenu.length; i ++)
            {
                var drawX = this.itemsCentered ? this.pos.x : this.topLeft.x;

                var spacing = 25;
                var width = this.dims.w - 30

                if(i === this.subMenuSelected && this.selected === true)
                {
                    this.setSelectedItemMode();
                    rect(this.pos.x, this.topLeft.y + spacing * i  + 20, width, 25);
                    this.setMenuTextMode();

                    var flavourText = this.subMenu[i].flavourText;

                    if(flavourText)
                    {
                        this.setFlavourWindowMode();
                        rect(this.flavourTextPos.x, this.flavourTextPos.y, this.dims.w, this.dims.h);

                        this.setFlavourTextMode();
                        text(flavourText, this.flavourTextPos.x, this.flavourTextPos.y);
                    }
                }
                var labelMod = 0;

                if(!this.itemsCentered)
                {
                    labelMod = 20;
                } 

                /*if(this.subMenu[i].hasPrice)
                {
                    labelMod = -56;
                }*/

                this.setMenuTextMode();
                text(this.subMenu[i].label, drawX + labelMod, this.topLeft.y + 20 + spacing * i);

                if(this.subMenu[i].hasPrice)
                {
                    var priceX = drawX + width / 2 + 60;

                    if(this.subMenu[i].owned)
                    {
                        text("\u2713", priceX, this.topLeft.y + spacing * i + 20);
                    }
                    else
                    {
                        text(this.subMenu[i].price, priceX, this.topLeft.y + spacing * i + 20);
                    }
                    
                }
            }
        }
    }
}