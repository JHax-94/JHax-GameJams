class Enemy
{
    constructor(pos, maxHealth, willToFight)
    {
        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.willToFight = willToFight;
        this.pos = pos;
        this.statsOffset = { x: -15, y: -60 };
        this.addToLists();

        var barPos = { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
        var barDims = { w: 50, h: 15 };
        
        this.healthBar = new Bar(barPos, barDims, { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0});
        this.healthBar.setFilled(this.health, this.maxHealth);

        this.hasSprite = false;
    }

    setSprite(sprite)
    {
        this.hasSprite = true;
        this.sprite = sprite;
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
        this.healthBar.setFilled(this.health, this.maxHealth);
    }

    draw()
    {
        if(this.hasSprite === false)
        {
            this.setCharacterDrawMode();
            rect(this.pos.x, this.pos.y, 30, 60);
        }
        else
        {
            this.sprite.drawAt(this.pos, { w: 30, h: 60});
        }
        

        this.setStatsDrawMode()
        text(this.health + " / " + this.maxHealth, this.pos.x + this.statsOffset.x, this.pos.y + this.statsOffset.y);

        this.healthBar.draw();
    }


}