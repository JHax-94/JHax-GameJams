class MoveList
{
    constructor(techniques)
    {
        this.isActive = false;
        this.techniques = techniques;
        this.pos = { x: 50, y: height/2+60 };

        this.selectedItem = 0;

        this.equippedTech = [];

        this.addToLists();
    }

    setEquippedTechs(playerTechs)
    {
        this.techniques = playerTechs;

        this.equippedTech = [];

        for(var i = 0; i < this.techniques.length; i ++)
        {
            if(this.techniques[i].equipped)
            {
                this.equippedTech.push(this.techniques[i]);
            }
        }

        console.log("Build equipped list...");
        console.log(this.equippedTech);
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);
        screens[BATTLE_SCREEN].menuKeyReactors.push(this);
    }

    setToTextDrawMode()
    {
        fill(255);
        noStroke();
        textAlign(LEFT, CENTER);
        textSize(16)                
    }

    setToContainerDrawMode()
    {
        rectMode(CORNER);
        fill(0);
        stroke(255);
    }

    menuRight()
    {

    }

    menuLeft()
    {
        
    }

    setToSelectedItemBox()
    {
        rectMode(CORNER);
        fill(0);
        stroke(255);
    }

    menuUp()
    {
        if(this.isActive)
        {
            this.selectedItem = mod(this.selectedItem - 1, this.equippedTech.length);
            console.log("new selected item: " + this.selectedItem);
        }
    }

    menuDown()
    {
        if(this.isActive)
        {
            this.selectedItem = mod(this.selectedItem + 1, this.equippedTech.length);
            console.log("new selected item: " + this.selectedItem);
        }
    }

    menuSubmit()
    {
        if(this.isActive)
        {
            var selectedTech = this.equippedTech[this.selectedItem];
            var target = 0;

            console.log(this.owner);
            gameMaster.startTechnique(selectedTech, target, this.owner);
        }
    }

    setActive(activeState)
    {
        this.isActive = activeState;
    }

    draw()
    {
        if(this.isActive)
        {
            this.setToContainerDrawMode();
            rect(this.pos.x, this.pos.y, 200, 100, 20);

            this.setToTextDrawMode();
            for(var i = 0; i < this.equippedTech.length; i ++)
            {
                if(this.selectedItem == i)
                {
                    this.setToContainerDrawMode();
                    rect(this.pos.x + 10, this.pos.y + 10 + i * 20, 180, 17);
                    this.setToTextDrawMode();
                }
                
                text(this.equippedTech[i].name, this.pos.x + 15, this.pos.y + 20 + i * 20);
            }
        }        
    }
}