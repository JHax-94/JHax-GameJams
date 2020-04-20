class GameMaster
{
    constructor()
    {
        this.JUDGE_IN = 1;
        this.JUDGE_HOLD = 2;
        this.JUDGE_OUT = 3;

        this.PLAYER = 1;
        this.ENEMY = 2;

        this.WIND_UP = 1;
        this.RELEASE = 2;
        this.DECAY = 3;

        this.round = 0;
        this.turn = 0;
        
        this.money = 5000;
        
        this.players = [];
        this.enemies = [];
        this.emperor = {};

        this.leftActivePoint = { x: width/2 - 60, y: height/2 + 40 };
        this.rightActivePoint = { x: width/2 + 60, y: height/2 + 40 };

        this.activePlayer = 0;
        this.activeEnemy = 0;

        this.moveDirection = 1;
        this.moveDuration = 2.0;
        this.moveTime = 0;

        this.windUpDuration = 0.4;
        this.windUpTime = 0.0;

        this.windUpTarget = { x: 0, y: 0 };
        this.releaseTarget = { x: 0, y: 0 };
        this.decayTarget = { x: 0, y: 0 };

        this.releaseDuration = 0.2;
        this.releaseTime = 0;

        this.decayDuration = 0.3;
        this.decayTime = 0;

        this.attacker;
        this.defender;
        
        this.prizeMoney = 0;

        this.moveOn = false;

        var battleEndDims = { w: width / 2, h: height / 2 };
        var battleEndPos = { x: width / 2, y: height / 2 };
        
        this.battleEnd = new BattleEndPopup(battleEndPos, battleEndDims);

        this.fightState = 0;

        this.judgementState = 0;

        this.judgementInDuration = 1.5;
        this.judgementHoldDuration = 0.75;
        this.judgementOutDuration = 0.5;

        this.judgementPoint = { x: width / 2, y: height / 2 };
        this.judgementScale = 2;
        this.judgementTime = 0;

        this.speechLineDuration = 1.5;
        this.speechTime = 0;

        this.lastChangeWeaponTurn = -1;

        this.waitForSpeech = false;

        this.addToLists();
    }

    playerHealth()
    {
        return this.players[0].health;
    }

    playerMaxHealth()
    {
        return this.players[0].maxHealth;
    }
    
    getEnemyPositions()
    {
        var enemyPositions = [];
        for(var i = 0; i < this.enemies.length; i ++)
        {
            enemyPositions.push({ index: i, x: this.enemies[i].pos.x, y: this.enemies[i].pos.y });
        }

        enemyPositions.sort(function(a, b){ return a.y - b.y }); 

        return enemyPositions;
    }

    clearEnemyList()
    {
        for(var i = 0; i < this.enemies.length; i ++)
        {
            this.enemies[i].removeFromLists();
        }
        this.enemies = [];
    }

    prepareEnemyList()
    {
        this.clearEnemyList();
        generateEnemyList();
        console.log("=== POPULATE ENEMY LIST WITH ===");
        console.log(NEXT_OPPONENT_LIST);
        this.emperor.setExcitement(NEXT_OPPONENT_LIST.startExc);
        
        this.emperor.setTutorial(NEXT_OPPONENT_LIST.tutorialText);

        this.prizeMoney = NEXT_OPPONENT_LIST.prizeMoney;
        this.emperor.prizeMoney = this.prizeMoney;

        for(var i = 0; i < NEXT_OPPONENT_LIST.enemies.length; i ++)
        {
            var enemyData = NEXT_OPPONENT_LIST.enemies[i];

            var newEnemy = new Enemy(
                {x: width + enemyData.x, y: height/2 + enemyData.y}, 
                NEXT_OPPONENT_LIST.enemies[i].health, 
                NEXT_OPPONENT_LIST.enemies[i].willToFight, 
                NEXT_OPPONENT_LIST.enemies[i].damage,
                NEXT_OPPONENT_LIST.enemies[i].compensation);
            var enemySprites = getCharacterAnims();
            newEnemy.setSprites(enemySprites);

            newEnemy.index = i;
            this.addEnemy(newEnemy);
        }

        console.log(this.enemies);
    }

    reset()
    {
        //this.prepareEnemyList();
        var hasActiveWeapon = false;
        var firstEquipped = "";

        for(var i = 0; i < PLAYER_LOADOUT.inventory.length; i ++)
        {
            if(firstEquipped.length === 0)
            {
                if(PLAYER_LOADOUT.inventory[i].equipped)
                {
                    firstEquipped = PLAYER_LOADOUT.inventory[i].name;
                }
            }

            if(PLAYER_LOADOUT.inventory[i].active === true)
            {
                hasActiveWeapon = true;
            }
        }

        if(hasActiveWeapon === false)
        {
            console.log("set active weapon to " + firstEquipped);
            setActiveWeapon(firstEquipped, this.players[0]);
        }

        for(var i = 0; i < this.players.length; i ++)
        {
            this.players[i].setForBattle(PLAYER_LOADOUT);
        }
        
        for(var i = 0; i < PLAYER_LOADOUT.techs.length; i ++)
        {
            PLAYER_LOADOUT.techs[i].reset();
        }

        //this.emperor.reset();
        this.battleEnd.isActive = false;
        this.turn = 0;
        this.nextTurn();
    }

    addToLists()
    {
        screens[BATTLE_SCREEN].updateableList.push(this);
    }

    addPlayer(player)
    {
        this.players.push(player);
    }

    addEnemy(enemy)
    {
        this.enemies.push(enemy);
    }

    setEmperor(emperor)
    {
        this.emperor = emperor;
    }

    nextTurn()
    {
        var continueBattle = this.isBattleOver();

        if(continueBattle)
        {
            console.log("Go to next turn " + this.turn);
            var playerTurn = (this.turn % 2 == 0);
            
            var enemyTurn = (this.turn/2) % this.enemies.length;
            console.log(enemyTurn);

            if(playerTurn)
            {
                this.enemies[enemyTurn].takeTurnAway();
                this.players[0].giveTurn();
            }
            else
            {
                enemyTurn = ((this.turn - 1) / 2) % this.enemies.length;

                var loops = 0;

                while(this.enemies[enemyTurn].canTakeTurns === false && loops < this.enemies.length * 2)
                {
                    enemyTurn = mod(enemyTurn + 1, this.enemies.length);
                    loops ++;
                }

                this.players[0].takeTurnAway();
                this.enemies[enemyTurn].giveTurn();
            }
        }
        else
        {
            /// --- BATTLE END CODE ---

            var compensation = this.calculateCompensation();

            var battleEnd = {
                winnings: this.prizeMoney,
                compensation: compensation
            };

            this.battleEnd.showBattleEnd(battleEnd);
        }
    }

    calculateCompensation()
    {
        var total = 0;
        for(var i = 0; i < this.enemies.length; i ++)
        {
            if(this.enemies[i].dead)
            {
                total += this.enemies[i].compensation;
            }
        }

        return total;
    }

    enemyTurnFinished()
    {
        var state = this.players[0].checkState();

        if(state === "dead")
        {
            END_STATE = {
                endStateTitle: "GAME OVER\nYou are dead!"
            }

            setActiveScreen(GAME_END);
        }

        this.turn ++;
        this.nextTurn();
    }

    playerTurn()
    {
        return mod(this.turn, 2) == 0;
    }

    update(dt)
    {
        if(this.moveOn)
        {
            this.moveCharactersToCentre(dt);
        }
        if(this.judgementState > 0)
        {
            this.animateJudgement(dt);
        }
        if(this.waitForSpeech)
        {
            this.processSpeech(dt);            
        }
        if(this.fightState > 0)
        {
            //console.log("Battle animation...");
            this.battleAnimation(dt);
        }
    }

    startTechnique(technique, target, source)
    {
        console.log("Processing technique: " + technique.name);
        console.log(source);
        source.takeTurnAway();

        if(technique.moveToCentre)
        {  
           this.activePlayer = source.index;
           this.activeEnemy = target; 
           this.activeTechnique = technique;
           this.moveOn = true;
           this.moveDuration = 1.0;
           this.moveDirection = 1;
           this.moveTime = 0;
        } 
        else if(technique.changeWeapon)
        {
           this.changeWeapon(technique);
        }
        else if(technique.hasSpeech)
        {
            this.waitForSpeech = true;
            this.speechTechnique = technique;
        }
        else
        {
            this.processTechnique(technique, target);
        }
    }

    addMoney(value)
    {
        this.money += value;
    }

    startEnemyTurn(enemy, player, enemyTurn)
    {
        if(enemyTurn.attacking)
        {
            //console.log("enemy attacking");
            console.log(enemyTurn);
        
            this.activePlayer = player;
            this.activeEnemy = enemy.index;
            this.enemyTurn = enemyTurn;
            this.moveOn = true;
            this.moveDuration = 1.2;
            this.moveDirection = 1;
            this.moveTime = 0;
        }
        else
        {
            //console.log("battle finished...");
            //console.log(enemyTurn);
            if(enemyTurn.surrendering === true || enemyTurn.dead === true)
            {
                if(this.emperor.isPleased() === false)
                {
                    enemyTurn.dead = true;
                }
            }
        }
    }
    
    isBattleOver()
    {
        var allDown = true; 

        for(var i = 0; i < this.enemies.length && allDown; i ++)
        {
            if(this.enemies[i].canTakeTurns)
            {
                allDown = false;
            }
        }

        return !allDown;
    }

    setPenalty(tech)
    {
        for(var i = 0; i < PLAYER_LOADOUT.techs.length; i ++)
        {
            if(PLAYER_LOADOUT.techs[i].name == tech.name)
            {
                //console.log("Set penalty for " + PLAYER_LOADOUT.techs[i].name);
                PLAYER_LOADOUT.techs[i].deductPenalty();                
            }
        }
    }

    changeWeapon(weaponChange)
    {
        if(this.lastChangeWeaponTurn >= 0)
        {
            console.log(this.lastChangeWeaponTurn);
            console.log(this.turn);
            var turnDiff = (this.turn - this.lastChangeWeaponTurn);
            console.log(turnDiff);

            if(turnDiff < 3)
            {
                this.emperor.addToExcitement(-100);
            }
        }

        this.lastChangeWeaponTurn = this.turn;
        setActiveWeapon(weaponChange.newWeapon, this.players[0]);

        this.endTechnique();
    }

    setToReturn()
    {
        this.moveDirection = -1;
        this.moveDuration = 1;
        this.moveTime = this.moveDuration;
        this.moveOn = true;
    }

    startFightAnimation(fightTeam)
    {
        this.windUpTime = 0.0;
        this.fightTeam = fightTeam;
        this.fightState = this.WIND_UP;

        var windUpDist = 20;

        if(this.fightTeam === this.PLAYER)
        {
            this.windUpTarget = { x: this.leftActivePoint.x - windUpDist, y: this.rightActivePoint.y };
            this.releaseTarget = { x: this.rightActivePoint.x, y: this.rightActivePoint.y };
            this.decayTarget = this.leftActivePoint;

            this.attacker = this.players[this.activePlayer];
            this.defender = this.enemies[this.activeEnemy];
        }
        else 
        {
            console.log("Setup anim for Enemy!");

            this.windUpTarget = { x: this.rightActivePoint.x + windUpDist, y: this.rightActivePoint.y };
            this.releaseTarget = { x: this.leftActivePoint.x, y: this.rightActivePoint.y };
            this.decayTarget = this.rightActivePoint;

            this.attacker = this.enemies[this.activeEnemy];
            this.defender = this.players[this.activePlayer];
        }
    }

    processTechnique(technique, target)
    {
        var targetEnemy = this.enemies[target];
        var damage = technique.damage(true);
        var excitement = technique.excitement(true);

        var weapon = getActiveWeapon();
        /*
        console.log("WEAPON: " + weapon);
        
        console.log("DAMAGE: " + damage);
        console.log("RATING: " + technique.generateVagueString(damage));
        console.log("EXCITE: " + excitement);
        console.log("RATING: " + technique.generateVagueString(excitement));
        */

        targetEnemy.addToHealth(-damage);

        this.emperor.addToExcitement(excitement);
        
        this.setPenalty(technique);

        if(technique.moveToCentre)
        {
            //this.startFightAnimation(this.PLAYER);
        }
        else
        {
            this.endTechnique(-1);
        }
    }

    processEnemyTurn(moveToCentre, turnData)
    {  
        console.log("PROCESS ENEMY TURN");
        console.log(turnData);

        if(moveToCentre)
        {
            this.enemies[this.activeEnemy].clearSpeech();
            /*
            this.moveDirection = -1;
            this.moveDuration = 1;
            this.moveTime = this.moveDuration;
            this.moveOn = true;
                */
            if(turnData.attacking)
            {
                this.players[0].addToHealth(-turnData.damage);
            }
        }
    }

    endTechnique(enemyIndex)
    {
        if(enemyIndex >= 0)
        {
            var enemyState = this.enemies[enemyIndex].checkState();

            if(enemyState === "surrendered")            
            {
                var judgement = this.emperor.isPleased();
                console.log(judgement);
                this.judgementState = this.JUDGE_IN;
                
                this.judgementDirection = judgement ? this.emperor.THUMBS_UP : this.emperor.THUMBS_DOWN;
            }
        }

        if(this.judgementState === 0)
        {
            this.turn ++;
            this.nextTurn();
        }
    }

    animateJudgement(dt)
    {
        this.judgementTime += dt;
        
        if(this.judgementState == this.JUDGE_IN)
        {
            var lerpVal = this.judgementTime / this.judgementInDuration;
            if(lerpVal > 1)
            {
                lerpVal = 1;
            }

            this.emperor.lerpThumb(this.judgementDirection, this.judgementPoint, this.judgementScale, lerpVal);

            if(lerpVal === 1)
            {
                this.judgementTime = 0;
                this.judgementState = this.JUDGE_HOLD;
            }
        }
        else if(this.judgementState === this.JUDGE_HOLD)
        {
            if(this.judgementDirection === this.emperor.THUMBS_DOWN)
            {
                this.enemies[this.activeEnemy].kill();
            }

            if(this.judgementHoldDuration <= this.judgementTime)
            {
                this.judgementTime = 0;
                this.judgementState = this.JUDGE_OUT
            }
        }
        else if(this.judgementState === this.JUDGE_OUT)
        {
            var lerpVal = 1 - (this.judgementTime / this.judgementOutDuration);
            if(lerpVal < 0)
            {
                lerpVal = 0;
            }

            this.emperor.lerpThumb(this.judgementDirection, this.judgementPoint, this.judgementScale, lerpVal);

            if(lerpVal === 0)
            {
                this.judgementTime = 0;
                this.judgementState = 0;

                this.turn ++;
                this.nextTurn();
            }
        }

    }

    processSpeech(dt)
    {
        this.speechTime += dt;

        if(this.speechTime >= this.speechLineDuration)
        {
            var isFinished = player.moveSpeechOn();   

            if(isFinished === false)
            {
                this.speechTime = 0;
            }
            else 
            {
                this.speechTime = 0;
                this.waitForSpeech = false;

                this.processTechnique(this.speechTechnique, this.activeEnemy);
            }
        }
    }

    battleAnimation(dt)
    {
        if(this.fightState === this.WIND_UP)
        {
            this.windUpTime += dt;
            console.log(this.windUpTime + "/"+  this.windUpDuration);
            
            var lerpVal = this.windUpTime / this.windUpDuration;
            console.log(lerpVal);
            if(lerpVal >= 1)
            {
                lerpVal = 1;
            }
            
            this.attacker.pos = {
                x: lerp(this.decayTarget.x, this.windUpTarget.x, lerpVal),
                y: lerp(this.decayTarget.y, this.windUpTarget.y, lerpVal)
            };

            if(lerpVal === 1)
            {
                console.log("wind up -> release");
                this.windUpTime = 0;
                this.fightState = this.RELEASE;
            }

        }
        else if(this.fightState === this.RELEASE)
        {
            this.releaseTime += dt;
            
            var lerpVal = this.releaseTime / this.releaseDuration;
            if(lerpVal >= 1)
            {
                lerpVal = 1;
            }

            this.attacker.pos = {
                x: lerp(this.windUpTarget.x, this.releaseTarget.x, lerpVal),
                y: lerp(this.windUpTarget.y, this.releaseTarget.y, lerpVal)
            };

            if(lerpVal === 1)
            {
                if(this.fightTeam === this.PLAYER)
                {
                    this.processTechnique(this.activeTechnique, this.activeEnemy);
                }
                else
                {
                    this.processEnemyTurn(true, this.enemyTurn);
                }
                console.log("release -> decay");
                this.releaseTime = 0;
                this.fightState = this.DECAY;
            }
        }
        else if(this.fightState === this.DECAY)
        {
           this.decayTime += dt;
           var lerpVal = this.decayTime / this.decayDuration;
            if(lerpVal >= 1)
            {
                lerpVal = 1;
            } 

            this.attacker.pos = {
                x: lerp(this.releaseTarget.x, this.decayTarget.x, lerpVal),
                y: lerp(this.releaseTarget.y, this.decayTarget.y, lerpVal)
            };

           if(lerpVal === 1)
           {
                this.setToReturn();
               this.decayTime = 0;
               this.fightState = 0;
           }
        }
    }

    moveCharactersToCentre(dt)
    {
        var movePlayer = this.players[this.activePlayer];
        var moveEnemy = this.enemies[this.activeEnemy];

        this.moveTime += this.moveDirection * dt;
        
        if(this.moveDirection > 0 && this.moveTime >= this.moveDuration)
        {
            this.moveTime = this.moveDuration;
            this.moveOn = false;
        }
        else if(this.moveDirection < 0 && this.moveTime <= 0)
        {
            this.moveTime = 0;
            this.moveOn = false;
        }
        
        var lerpVal = this.moveTime / this.moveDuration;

        var playerPos = { 
            x: lerp(movePlayer.originalPos.x, this.leftActivePoint.x, lerpVal), 
            y: lerp(movePlayer.originalPos.y, this.leftActivePoint.y, lerpVal)
        };

        var enemyPos = {
            x: lerp(moveEnemy.originalPos.x, this.rightActivePoint.x, lerpVal),
            y: lerp(moveEnemy.originalPos.y, this.rightActivePoint.y, lerpVal)
        };

        movePlayer.setPos(playerPos);
        moveEnemy.setPos(enemyPos);
        
        if(this.moveOn === false)
        {
            if(this.moveDirection > 0)
            {
                this.playerTurn() ? 
                    this.startFightAnimation(this.PLAYER) :
                    this.startFightAnimation(this.ENEMY);
            }
            else 
            {  
                this.playerTurn() ?
                    this.endTechnique(this.activeEnemy) :
                    this.enemyTurnFinished();
            }
        }
    }
}