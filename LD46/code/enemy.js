class Enemy
{
    constructor(pos, maxHealth, willToFight)
    {
        this.originalPos = {};
        this.originalPos.x = pos.x;
        this.originalPos.y = pos.y;

        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.willToFight = willToFight;
        this.pos = pos;
        this.statsOffset = { x: -15, y: 70 };
        this.addToLists();
        
        var barPos = { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
        var barDims = { w: 50, h: 15 };
        
        this.healthBar = new Bar(barPos, barDims, { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0});
        this.healthBar.setFilled(this.health, this.maxHealth);

        this.thinkingDuration = 1;
        this.thinkingTime = 0;
        this.isThinking = false;

        this.hasSprite = false;

        this.index = 0;

        this.isSpeaking = false;
        this.speech = "";
        this.speechOffset = { x: -30, y: -60 };
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);   
        screens[BATTLE_SCREEN].updateableList.push(this);
    }

    setSprite(sprite)
    {
        this.hasSprite = true;
        this.sprite = sprite;
    }

    setPos(pos)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;

        this.setHealthbarPos();
    }

    setHealthbarPos()
    {
        this.healthBar.pos = { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
    }

    setSpeech(speechString)
    {
        this.isSpeaking = true;
        this.speech = speechString;
    }

    clearSpeech()
    {
        this.isSpeaking = false;
        this.speech = "";
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

    update(dt)
    {
        if(this.isThinking)
        {
            this.thinkingTime += dt;

            if(this.thinkingTime >= this.thinkingDuration)
            {
                this.isThinking = false;
                this.thinkingTime = 0;
                this.makeMove();
            }
        }
    }

    makeMove()
    {
        var attacking = false;

        if(this.health == 0)
        {
            this.setSpeech("Zounds, I am undone!");
        }
        else if(this.health < (this.maxHealth - this.willToFight))
        {
            this.setSpeech("I surrender!");
        }
        else 
        {
            this.setSpeech("Death or glory!");
            attacking = true;
        }

        gameMaster.startEnemyTurn(this, 0, attacking);
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

    giveTurn()
    {
        this.isThinking = true;
    }

    takeTurn()
    {
        this.clearSpeech();
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

        if(this.isSpeaking)
        {
            this.setStatsDrawMode();
            fill(0);
            text(this.speech, this.pos.x + this.speechOffset.x, this.pos.y + this.speechOffset.y);
        }
    }


}