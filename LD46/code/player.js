class Player {
    constructor(pos, moveList)
    {
        this.pos = pos;
        this.moveList = moveList;
        this.hasSprite = false;

        this.addToLists();
    }

    addToLists()
    {
        drawablesList.push(this);
    }

    setSprite(sprite)
    {
        this.hasSprite = true;
        this.sprite = sprite;
    }

    draw()
    {
        if(this.hasSprite === false)
        {
            fill(255);
            rectMode(CENTER);
            rect(this.pos.x, this.pos.y, 30, 60);
        }
        else
        {
            this.sprite.drawAt(this.pos, { w: 30, h: 60});
        }
    }
}