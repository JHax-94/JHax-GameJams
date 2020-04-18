class TitleScreen 
{
    constructor(titlePos, titleImage)
    {
        this.pos = titlePos;
        this.titleImage = titleImage;

        this.addToLists();
    }

    addToLists()
    {
        screens[TITLE_SCREEN].drawablesList.push(this);
        screens[TITLE_SCREEN].menuKeyReactors.push(this);
    }

    menuUp()
    {

    }

    menuDown()
    {

    }

    menuSubmit()
    {
        console.log("Begin!");
        setActiveScreen(BATTLE_SCREEN);
    }

    draw()
    {
        imageMode(CENTER);
        image(this.titleImage, this.pos.x, this.pos.y);

        fill(0);
        textAlign(CENTER);
        text("Press enter to begin...", this.pos.x, this.pos.y + 200);
    }
}