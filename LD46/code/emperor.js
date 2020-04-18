class Emperor
{
    constructor(startExcitement, maxExcitement)
    {
        this.excitement = startExcitement;
        this.maxExcitement = maxExcitement;

        this.addToLists();
    }

    addToLists()
    {   
        drawablesList.push(this);
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
    }

    draw()
    {
        fill(255)
        textAlign(CENTER);
        noStroke();
        text(this.excitement + ' / ' + this.maxExcitement, width/2, 50);
    }
}