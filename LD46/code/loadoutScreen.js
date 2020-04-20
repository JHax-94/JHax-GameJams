class LoadoutScreen
{
    constructor(pos, dims, playerLoadout)
    {   
        this.WEAPONS = 0;
        this.TECHS = 1;

        this.pos = pos;
        this.dims = dims;

        this.flavourPos = { x: this.pos.x + 0.9 * this.dims.w, y: this.pos.y };

        this.weaponsPos = { x: this.pos.x - this.dims.w / 4, y: this.pos.y };

        this.techniquesPos = { x: this.pos.x + this.dims.w /4, y: this.pos.y };

        //this.opponentsPos = { x: this.pos.x, y: topLeft.y + 20}

        this.confirmPos = { x: this.pos.x, y: this.pos.y + this.dims.h / 2 - 15};

        /*
        console.log("LOADING LOADOUT");
        console.log(playerLoadout);
        */
        this.reset(playerLoadout);

        this.addToLists();
    }

    reset(playerLoadout)
    {
        this.panels = [];
        /*
        console.log("RESETTING LOADOUT");
        console.log(playerLoadout);
        */  
        this.playerLoadout = playerLoadout

        var weaponsPanelObj = {
            title: "Weapons",
            maxEquipped: 2,
            inventory: []
        }

        var panelDims = { w: this.dims.w / 2 - 30, h: this.dims.h - 80 };

        for(var i = 0; i < this.playerLoadout.inventory.length; i ++)
        {
            if(this.playerLoadout.inventory[i].owned)
            {
                weaponsPanelObj.inventory.push(this.playerLoadout.inventory[i]);
            }
            
        }   

        var weaponPanel = new LoadoutPanel(this.weaponsPos, panelDims, weaponsPanelObj);

        var techPanelObj = {
            title: "Techniques",
            maxEquipped: 4,
            inventory: []
        };

        for(var i = 0; i < this.playerLoadout.techs.length; i ++)
        {
            if(this.playerLoadout.techs[i].owned)
            {
                techPanelObj.inventory.push(this.playerLoadout.techs[i]);    
            }
        }

        this.confirmSelected = false;
        this.panelFocused = false;

        var techPanel = new LoadoutPanel(this.techniquesPos, panelDims, techPanelObj);

        this.panels.push(weaponPanel);
        this.panels.push(techPanel);

        if(this.panels.length > 0)
        {
            this.select(0);
        }

        /*
        PLAYER_LOADOUT.inventory = this.panels[this.WEAPONS].inventory;
        PLAYER_LOADOUT.techs = this.panels[this.TECHS].inventory;*/
    }

    select(panelNo)
    {
        if(this.selectedPanel >= 0)
        {
            this.panels[this.selectedPanel].selected = false;   
        }

        this.panels[panelNo].selected = true;

        this.selectedPanel = panelNo;
    }

    addToLists()
    {
        screens[LOADOUT_SCREEN].drawablesList.push(this);
        screens[LOADOUT_SCREEN].menuKeyReactors.push(this);
    }

    menuUp()
    {
        if(!this.panelFocused)
        {
            this.changeMainSelection();
        }
        else
        {
            this.panels[this.selectedPanel].menuUp();
        }
    }

    menuDown()
    {
        if(!this.panelFocused)
        {
            this.changeMainSelection();
        }
        else
        {
            this.panels[this.selectedPanel].menuDown();
        }
    }

    changeMainSelection()
    {
        this.confirmSelected = !this.confirmSelected;
        this.panels[this.selectedPanel].selected = !this.confirmSelected;
    }

    menuRight()
    {
        if(this.panelFocused)
        {
            this.panels[this.selectedPanel].unfocus();
            this.panelFocused = false;
        }
        else if(this.confirmSelected)
        {

        }
        else
        {
            this.select(mod(this.selectedPanel + 1, this.panels.length));
        }
    }

    menuLeft()
    {
        if(this.panelFocused)
        {
            this.panels[this.selectedPanel].unfocus();
            this.panelFocused = false;
        }
        else if(this.confirmSelected)
        {

        }
        else
        {
            this.select(mod(this.selectedPanel - 1, this.panels.length));
        }
    }

    focusPanel(panelNo)
    {
        this.panels[panelNo].focus();
        this.panelFocused = true;
    }

    menuSubmit()
    {
        if(this.confirmSelected)
        {
            /*
            PLAYER_LOADOUT.inventory = this.panels[this.WEAPONS].inventory;
            PLAYER_LOADOUT.techs = this.panels[this.TECHS].inventory;
            */
            setActiveScreen(PRE_BATTLE_SCREEN);
        }
        else if(this.panelFocused)
        {
            this.panels[this.selectedPanel].menuSubmit();
        }
        else
        {
            this.focusPanel(this.selectedPanel);
        }

    }

    menuBack()
    {
        if(this.panelFocused)
        {
            this.panels[this.selectedPanel].unfocus();
            this.panelFocused = false;
        }
    }

    canConfirm()
    {
        var panelsValid = true;

        for(var i = 0; i < this.panels.length && panelsValid; i ++)
        {
            panelsValid = this.panels[i].valid();
        }

        return panelsValid;
    }

    confirmBoxMode()
    {
        noFill();
        stroke(255);
        rectMode(CENTER);
    }
    
    setConfirmTextMode()
    {
        fill(255);
        noStroke();
        textAlign(CENTER);
    }

    setWindowDrawMode()
    {
        noStroke();
        fill(color(51, 51, 51, 200));
        rectMode(CENTER);
    }

    setTextMode()
    {
        textAlign(CENTER, CENTER);
        textSize(18);
        fill(255);
        noStroke();
    }

    setFlavourTextMode()
    {
        textAlign(CENTER, CENTER);
        text(21);
        fill(255);
        noStroke();
    }

    draw()
    {
        this.setWindowDrawMode()
        rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);

        for(var i = 0; i < this.panels.length; i ++)
        {
            this.panels[i].draw();
        }

        this.setWindowDrawMode()
        rect(this.flavourPos.x, this.flavourPos.y, this.dims.w - 120, this.dims.h);
    
        if(this.panelFocused)
        {
            var item = this.panels[this.selectedPanel].selectedItem();

            if(item.flavourText)
            {
                this.setFlavourTextMode();
                text(item.flavourText, this.flavourPos.x, this.flavourPos.y);
            }
        }

        if(this.canConfirm())
        {
            if(this.confirmSelected)
            {
                this.confirmBoxMode();

                rect(this.confirmPos.x, this.confirmPos.y, 80, 25);
                
                this.setTextMode();
            }

            this.setConfirmTextMode();
            text("Confirm", this.confirmPos.x, this.confirmPos.y);
        }
    }
}