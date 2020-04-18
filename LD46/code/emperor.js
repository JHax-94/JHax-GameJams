class Emperor
{
    constructor(startExcitement, maxExcitement)
    {
        this.excitement = startExcitement;
        this.maxExcitement = maxExcitement;
        
        var barCentre = { x: width/2, y: 40 };
        var barDims = { w: width / 2, h: 25 };
        var barPos = { x: barCentre.x - (barDims.w/2), y: barCentre.y - (barDims.h/2) };
        
        this.barRender = new Bar(barPos, barDims, {r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0});
        this.barRender.setFilled(this.excitement, this.maxExcitement);

        this.addToLists();
    }

    isPleased()
    {
        return this.excitement > this.maxExcitement / 2;
    }

    addToLists()
    {   
        screens[BATTLE_SCREEN].drawablesList.push(this);
    }

    addToExcitement(diff)
    {
        var newExcite = this.excitement + diff;

        if(newExcite > this.maxExcitement)
        {
            newExcite = this.maxExcitement;
        }
        else if(newExcite < 0)
        {
            newExcite = this.maxExcitement;
        }

        this.excitement = newExcite;
        this.barRender.setFilled(this.excitement, this.maxExcitement);
    }

    reset()
    {
        this.excitement = 400;
        this.barRender.setFilled(this.excitement, this.maxExcitement);
    }

    draw()
    {
        this.barRender.draw();

        fill(255)
        textAlign(CENTER);
        noStroke();
        text(this.excitement + ' / ' + this.maxExcitement, width/2, 50);

        imageMode(CENTER);
        image(thumbsDown, this.barRender.pos.x - 25, this.barRender.pos.y + 10, 30, 30);

        image(thumbsUp, this.barRender.pos.x + this.barRender.dims.w + 25, this.barRender.pos.y+ 10, 30, 30);
    }
}