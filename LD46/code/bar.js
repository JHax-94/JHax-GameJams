class Bar
{
    constructor(pos, dims, unfilledColour, filledColour)
    {
        this.pos = pos;
        this.dims = dims;
        this.unfilledColour = unfilledColour;
        this.filledColour = filledColour;

        this.filledWidth = 0;
        this.unfilledWidth = 0;

        this.filledPortion = 0.5;    
    }

    setFilled(current, max)
    {
        console.log("Setting bar fill " + current + "/ " + max);

        var proportion = current / max;
        
        this.filledPortion = proportion;
        console.log(this.filledPortion);

        this.filledWidth = this.dims.w * this.filledPortion;
        this.unfilledWidth = this.dims.w - this.filledWidth;

        console.log("Bar width:");
        console.log(this.dims.w);
        console.log("Filled: ");
        console.log(this.filledWidth);
        console.log("Unfilled: ");
        console.log(this.unfilledWidth);
    }

    setFilledRectMode()
    {
        rectMode(CORNER);
        fill(this.filledColour.r, this.filledColour.g, this.filledColour.b);
        noStroke();
    }

    setUnfilledRectMode()
    {
        rectMode(CORNER);
        fill(this.unfilledColour.r, this.unfilledColour.g, this.unfilledColour.b);
        noStroke();
    }

    draw()
    {
        
        this.setFilledRectMode();
        rect(this.pos.x, this.pos.y, this.filledWidth, this.dims.h);

        this.setUnfilledRectMode();
        rect(this.pos.x + this.filledWidth, this.pos.y, this.unfilledWidth, this.dims.h);
    }
}