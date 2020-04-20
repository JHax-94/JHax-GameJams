class GameEndScreen
{
    constructor(pos, dims)
    {
        this.pos = pos;
        this.dims = dims;

        this.endStateTitle = "";

        this.promptText = "Press Enter to return to title...";

        this.addToLists();
    }   

    setEndState(endState)
    {
        this.endStateTitle = endState.endStateTitle;
    }

    menuUp()
    {

    }

    menuDown()
    {
        
    }

    menuLeft()
    {
        
    }

    menuRight()
    {
        
    }

    menuSubmit()
    {
        setActiveScreen(TITLE_SCREEN);
    }

    addToLists()
    {
        screens[GAME_END].drawablesList.push(this);
        screens[GAME_END].menuKeyReactors.push(this);
    }

    windowMode()
    {
        fill(color(51, 51, 51, 200));

        rectMode(CENTER);
    }

    titleMode()
    {
        textSize(24);
        fill(255);
        textAlign(CENTER);
    }

    promptMode()
    {
        textSize(18);
        fill(255);
        textAlign(CENTER);
    }


    draw()
    {
        this.windowMode();
        rect(this.pos.x, this.pos.y, this.dims.w, this.dims.h);

        this.titleMode();
        text(this.endStateTitle, this.pos.x, this.pos.y - 100);

        this.promptMode();
        text(this.promptText, this.pos.x, this.pos.y + this.dims.h/2 - 60);

    }
}