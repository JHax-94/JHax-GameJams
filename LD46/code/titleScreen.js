class TitleScreen 
{
    constructor(titlePos, titleImage)
    {
        this.START_GAME = 0;
        this.TUTORIAL_TOGGLE = 1;

        this.pos = titlePos;
        this.titleImage = titleImage;

        this.titleMenu = [
            "Start Game",
            "Tutorial: On"
        ]

        this.selectedItem = 0;

        this.addToLists();
    }

    addToLists()
    {
        screens[TITLE_SCREEN].drawablesList.push(this);
        screens[TITLE_SCREEN].menuKeyReactors.push(this);
    }

    menuUp()
    {
        this.selectedItem = mod(this.selectedItem + 1, this.titleMenu.length);
    }

    menuDown()
    {
        this.selectedItem = mod(this.selectedItem - 1, this.titleMenu.length);
    }

    menuRight()
    {

    }

    menuLeft()
    {
        
    }

    menuSubmit()
    {
        if(this.selectedItem === this.START_GAME)
        {
            console.log("Begin!");
            setActiveScreen(PRE_BATTLE_SCREEN);
        }
        else if(this.selectedItem === this.TUTORIAL_TOGGLE)
        {
            TUTORIAL_ON = !TUTORIAL_ON;
            this.titleMenu[this.TUTORIAL_TOGGLE] = "Tutorial: " + (TUTORIAL_ON ? "On" : "Off");
        }
    }
    
    menuBack()
    {
        
    }

    setMenuMode()
    {
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
    }

    setSelectedItemMode()
    {
        noFill();
        stroke(0);
        rectMode(CENTER);
    }

    draw()
    {
        imageMode(CENTER);
        image(this.titleImage, this.pos.x, this.pos.y);

        fill(0);
        textAlign(CENTER);
        //text("Press enter to begin...", this.pos.x, this.pos.y + 200);

        for(var i = 0; i < this.titleMenu.length; i ++)
        {
            if(i == this.selectedItem)
            {
                this.setSelectedItemMode();
                rect(this.pos.x, this.pos.y + 150 + 35 * i, 300, 40);
            }

            this.setMenuMode();
            text(this.titleMenu[i], this.pos.x, this.pos.y + 150 + 35 * i);
        }
    }
}