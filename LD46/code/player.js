class Player {
    constructor(pos, moveList)
    {
        this.originalPos = {};
        this.originalPos.x = pos.x;
        this.originalPos.y = pos.y;

        this.pos = pos;
        this.moveList = moveList;
        this.moveList.owner = this;
        this.moveList.pos = { x: pos.x-50, y: pos.y + 70 };

        this.hasSprite = false;
        this.hasTurnControl = false;

        this.index = 0;

        this.addToLists();
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);
    }

    setSprite(sprite)
    {
        this.hasSprite = true;
        this.sprite = sprite;
    }

    giveTurn()
    {
        console.log("Player turn...");

        this.hasTurnControl = true;
        this.moveList.setActive(true);
    }

    takeTurn()
    {
        this.hasTurnControl = false;
        this.moveList.setActive(false);
    }

    setPos(pos)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
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