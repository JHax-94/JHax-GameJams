class Player {
    constructor(pos, maxHealth)
    {
        this.originalPos = {};
        this.originalPos.x = pos.x;
        this.originalPos.y = pos.y;

        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.pos = pos;
        this.moveList = new MoveList(PLAYER_LOADOUT.techs);
        this.moveList.owner = this;
        this.moveList.pos = { x: pos.x + 50, y: pos.y };

        this.weapons = PLAYER_LOADOUT.inventory;

        console.log(this.weapons);
        console.log(this.moveList);

        this.hasSprite = false;
        this.hasTurnControl = false;

        this.sprites = [];

        this.index = 0;
        this.statsOffset = { x: -30, y: 75 };

        var barPos = this.barPosition();
        var barDims = { w: 50, h: 15 };

        this.healthBar = new Bar(barPos, barDims, { r: 255, g: 0, b: 0}, { r: 0, g: 255, b: 0 });

        this.healthBar.setFilled(this.health, this.maxHealth);

        this.isSpeaking = false;
        this.speech = {};
        this.speechLine = 0;

        this.speechOffset = {x: 15, y:-  30};

        this.addToLists();
    }

    reset()
    {
        this.health = this.maxHealth;
        this.moveList = new MoveList(PLAYER_LOADOUT.techs);
        this.moveList.owner = this;
        this.moveList.pos = { x: this.pos.x + 50, y: this.pos.y };

        this.weapons = PLAYER_LOADOUT.inventory;
        this.healthBar.setFilled(this.health, this.maxHealth);
    }

    setForBattle(loadout)
    {
        console.log(loadout)
        
        this.moveList.setEquippedTechs(loadout.techs);
        this.moveList.setEquippedWeapons(loadout.inventory);
    }

    barPosition()
    {
        return { x: this.pos.x + this.statsOffset.x, y: this.pos.y + this.statsOffset.y };
    }


    switchWeaponAnimation(animations)
    {
        for(var i = 0; i < this.sprites.length; i ++)
        {
            console.log("Check sprite: " + this.sprites[i].name);
            if(this.sprites[i].name.startsWith("weapon"))
            {
                this.sprites[i].setAnimation(animations);
            }
        }   
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

    setSprites(spriteList)
    {
        this.hasSprite = true;
        this.sprites = spriteList;
        console.log("PLAYER SPRITES SET");
        console.log(this.sprites);
    }

    giveTurn()
    {
        console.log("Player turn...");

        this.hasTurnControl = true;
        this.moveList.setActive(true);
    }

    takeTurnAway()
    {
        this.hasTurnControl = false;
        this.moveList.setActive(false);

        this.updateLoadoutState();
    }   

    setSpeech(speechObj)
    {
        console.log("-START SPEECH-");
        console.log(speechObj);
        this.speech = speechObj.lines;
        this.speechLine = 0;
        this.isSpeaking = true;
    }

    updateLoadoutState()
    {
        for(var i = 0; i < PLAYER_LOADOUT.techs.length; i ++)
        {
            if(PLAYER_LOADOUT.techs[i].equipped)
            {
                PLAYER_LOADOUT.techs[i].iterateCooldown();
            }
        }

        this.setForBattle(PLAYER_LOADOUT);
    }

    setPos(pos)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;

        this.healthBar.pos = this.barPosition();
    }
    
    checkState()
    {
        return this.health > 0 ? "" : "dead";
    }

    setSpeechMode()
    {
        fill(0);
        textAlign(LEFT, BOTTOM);
    }

    moveSpeechOn()
    {
        var finished = false;

        this.speechLine ++;
        if(this.speech.length <= this.speechLine)
        {
            finished = true;
            this.isSpeaking = false;
            this.speech = [];
            this.speechLine = 0;
        }

        return finished;
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
            for(var i = 0; i < this.sprites.length; i ++)
            {
                this.sprites[i].drawAt(this.pos, { w: 30, h: 60 });
            }
        }

        if(this.isSpeaking)
        {
            //console.log("SPEAK:" + this.speech[this.speechLine]);
            this.setSpeechMode();
            text(this.speech[this.speechLine], this.pos.x + this.speechOffset.x, this.pos.y + this.speechOffset.y);
        }

        this.healthBar.draw("Player health bar!");
    }
}