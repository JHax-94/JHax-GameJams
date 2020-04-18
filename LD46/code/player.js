class Player {
    constructor(pos, moveList)
    {
        this.pos = pos;
        this.moveList = moveList;

        this.addToLists();
    }

    addToLists()
    {
        drawablesList.push(this);
    }

    draw()
    {
        fill(255);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, 30, 60);
    }
}