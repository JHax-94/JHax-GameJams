class MoveList
{
    constructor(techniques)
    {
        this.techniques = techniques;
        this.pos = { x: 50, y: height/2+60 };

        this.selectedItem = 0;

        this.addToLists();
    }

    addToLists()
    {
        drawablesList.push(this);
        menuKeyReactors.push(this);
    }

    setToTextDrawMode()
    {
        fill(255);
        noStroke();
        textAlign(LEFT);
    }

    setToContainerDrawMode()
    {
        rectMode(CORNER);
        fill(0);
        stroke(255);
    }

    setToSelectedItemBox()
    {
        rectMode(CORNER);
        fill(0);
        stroke(255);
    }

    menuUp()
    {
        this.selectedItem = mod(this.selectedItem - 1, this.techniques.length);
        console.log("new selected item: " + this.selectedItem);
    }

    menuDown()
    {
        this.selectedItem = mod(this.selectedItem + 1, this.techniques.length);
        console.log("new selected item: " + this.selectedItem);
    }

    menuSubmit()
    {
        var selectedTech = this.techniques[this.selectedItem];
        var target = 0;

        console.log(gameMaster);
        gameMaster.processTechnique(selectedTech, target);
    }

    draw()
    {
        this.setToContainerDrawMode();
        rect(this.pos.x, this.pos.y, 200, 100, 20);


        this.setToTextDrawMode();
        for(var i = 0; i < this.techniques.length; i ++)
        {
            if(this.selectedItem == i)
            {
                this.setToContainerDrawMode();
                rect(this.pos.x + 10, this.pos.y + 10 + i * 20, 180, 15);
                this.setToTextDrawMode();
            }
            
            text(this.techniques[i].name, this.pos.x + 15, this.pos.y + 20 + i * 20);
        }
        
    }

}