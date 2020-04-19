class Player {
    constructor(pos, maxHealth, moveList, weapons)
    {
        this.originalPos = {};
        this.originalPos.x = pos.x;
        this.originalPos.y = pos.y;

        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.pos = pos;
        this.moveList = moveList;
        this.moveList.owner = this;
        this.moveList.pos = { x: pos.x + 50, y: pos.y };

        this.weapons = weapons;

        console.log(this.weapons);
        console.log(this.moveList);

        this.hasSprite = false;
        this.hasTurnControl = false;

        this.index = 0;
        this.statsOffset = { x: -30, y: 75 };

        var barPos = this.barPosition();
        var barDims = { w: 50, h: 15 };

        this.healthBar = new Bar(barPos, barDims, { r: 255, g: 0, b: 0}, { r: 0, g: 255, b: 0 });

        this.healthBar.setFilled(this.health, this.maxHealth);

        this.addToLists();
    }

    setForBattle(loadout)
    {
        console.log(loadout)
        
        this.moveList.setEquippedTechs(loadout.techs);
    }

    barPosition()
    {
        return { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
    }


    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);
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

        this.healthBar.pos = this.barPosition();
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
            this.sprite.drawAt(this.pos, { w: 30, h: 60 });
        }

        this.healthBar.draw("PLayer health bar!");
    }
}