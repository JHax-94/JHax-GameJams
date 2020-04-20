class Enemy
{
    constructor(pos, maxHealth, willToFight, damage, compensation)
    {  
        console.log("Enemy constructor called...");
        console.log("Will to fight: " + willToFight);
        this.id = getEnemyId();

        this.compensation = compensation;

        this.originalPos = {};
        this.originalPos.x = pos.x;
        this.originalPos.y = pos.y;

        this.health = maxHealth;
        this.maxHealth = maxHealth;

        this.willToFight = willToFight;
        this.damage = damage;

        this.pos = pos;
        this.statsOffset = { x: -15, y: 70 };
        this.addToLists();
        
        var barPos = { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
        var barDims = { w: 50, h: 15 };
        
        this.healthBar = new Bar(barPos, barDims, { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0});
        this.healthBar.setFilled(this.health, this.maxHealth);

        this.thinkingDuration = 0.5;
        this.thinkingTime = 0;        
        this.isThinking = false;

        this.canTakeTurns = true;

        this.hasSprite = false;

        this.index = 0;

        this.isSpeaking = false;
        this.speech = "";
        this.speechOffset = { x: -15, y: -45 };
    }



    set(setFrom)
    {   
        this.maxHealth = setFrom.maxHealth;
        this.health = setFrom.maxHealth;

        this.willToFight = setFrom.willToFight;

        this.healthBar.setFilled(this.health, this.maxHealth);
        this.clearSpeech();
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].drawablesList.push(this);   
        screens[BATTLE_SCREEN].updateableList.push(this);
    }

    removeFromLists()
    {
        screens[BATTLE_SCREEN].deleteFromDrawables(this.id);
        screens[BATTLE_SCREEN].deleteFromUpdatables(this.id);
        screens[BATTLE_SCREEN].deleteFromAnimations(this.id);
    }

    setSprites(spriteList)
    {
        this.hasSprite = true;
        this.sprites = spriteList;
        for(var i = 0; i < this.sprites.length; i ++)
        {
            this.sprites[i].id = this.id;
            this.sprites[i].flip = true;
        }
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

    kill()
    {
        if(this.health > 0)
        {
            this.health = 0;
            this.healthBar.setFilled(this.health, this.maxHealth);
        }

        this.setSpeech("Zounds, I am undone!");
        //enemyTurn.dead = true;
        this.dead = true;
        this.canTakeTurns = false;
    }

    checkState()
    {
        var state = "";
        console.log("check state..");
        console.log(" > HEALTH: " + this.health);
        console.log(" > SURRENDER AT: " + (this.maxHealth - this.willToFight));

        if(this.health == 0)
        {
            this.kill();
        }
        else if(this.health < (this.maxHealth - this.willToFight))
        {
            this.setSpeech("I surrender!");
            this.surrendered = true;
            this.canTakeTurns = false;
            state = "surrendered";
        }

        return state;
    }

    makeMove()
    {
        var enemyTurn = {
            attacking: false,
            surrendering: false,
            dead: false
        }

        this.setSpeech("Death or glory!");
        enemyTurn.attacking = true;
        enemyTurn.damage = this.damage;
        //console.log(enemyTurn.damage);

        gameMaster.startEnemyTurn(this, 0, enemyTurn);
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
        
        console.log("ENEMY HEALTH: " + this.health + "/" + this.maxHealth);
        this.healthBar.setFilled(this.health, this.maxHealth);
    }

    giveTurn()
    {
        this.isThinking = true;
    }

    takeTurnAway()
    {
        if(this.canTakeTurns)
        {
            this.clearSpeech();
        }
    }

    getCompensation()
    {
        return this.compensation + " d";
    }

    getToughRating()
    {
        var rating = "Immovable";

        if(this.maxHealth < 50)
        {
            rating = "Flimsy";
        }
        else if(this.maxHealth < 100)
        {
            rating = "Sturdy";
        }
        else if(this.maxHealth < 150)
        {
            rating = "Hardened";
        }
        else if(this.maxHealth < 250)
        {
            rating = "Stalwart";
        }


        return rating;
    }
    
    getWillRating()
    {
        var ratio = this.willToFight / this.maxHealth

        var rating = "Has a deathwish";

        if(ratio < 0.5)
        {
            rating = "Cowardly";
        }
        else if(ratio < 0.6)
        {
            rating = "Afraid";
        }
        else if(ratio < 0.7)
        {
            ratio = "Stoic";
        }
        else if(ratio < 0.8)
        {
            ratio = "Brave";
        }
        else if(ratio < 0.9)
        {
            rating = "Heroic";
        }

        return rating;
    }
    
    getDamageRating()
    {
        var rating = "Herculean";
        
        if(this.damage < 10)
        {
            rating = "Feeble";
        }
        else if(this.damage < 15)
        {
            rating = "Weak";
        }
        else if(this.damage < 25)
        {
            rating = "Strong";
        }
        else if(this.damage < 60)
        {
            rating = "Mighty";
        } 

        return rating;
    }

    setSpeechDrawMode()
    {
        fill(0);
        textAlign(RIGHT, BOTTOM);
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
            for(var i = 0; i < this.sprites.length; i ++)
            {
                this.sprites[i].drawAt(this.pos, { w: 30, h: 60});
            }
        }

        this.setStatsDrawMode()
        //text(this.health + " / " + this.maxHealth, this.pos.x + this.statsOffset.x, this.pos.y + this.statsOffset.y);
        this.healthBar.draw();

        if(this.isSpeaking)
        {
            this.setSpeechDrawMode();
            text(this.speech, this.pos.x + this.speechOffset.x, this.pos.y + this.speechOffset.y);
        }
    }


}