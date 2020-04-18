class Enemy
{
    constructor(pos, maxHealth, willToFight)
    {
        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.willToFight = willToFight;
        this.pos = pos;
        this.statsOffset = { x: -15, y: -50 };
        this.addToLists();
    }

    addToLists()
    {
        drawablesList.push(this);   
    }

    setCharacterDrawMode()
    {  
        fill(255);
        noStroke();
        rectMode(CENTER);
    }

    setStatsDrawMode()
    {
        noStroke();
        textAlign(LEFT);
        fill(255);
    }

    addToHealth(diff)
    {
        var newHealth = this.health + diff;

        if(newHealth > this.maxHealth)
        {
            newHealth = this.maxHealth;
        }
        else if(newHealth < 0)
        {   
            newHealth = 0;
        }

        this.health = newHealth;
    }

    draw()
    {
        this.setCharacterDrawMode();
        rect(this.pos.x, this.pos.y, 30, 60);

        this.setStatsDrawMode()
        text(this.health + " / " + this.maxHealth, this.pos.x + this.statsOffset.x, this.pos.y + this.statsOffset.y);
    }


}