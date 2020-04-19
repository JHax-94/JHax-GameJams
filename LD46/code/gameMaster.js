class GameMaster
{
    constructor()
    {
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
        
        this.moveOn = false;

        var battleEndDims = { w: width / 2, h: height / 2 };
        var battleEndPos = { x: width /2, y: height / 2 };

        this.battleEnd = new BattleEndPopup(battleEndPos, battleEndDims);

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

    reset()
    {
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

        for(var i = 0; i < this.enemies.length; i ++)
        {
            var setEnemy = { 
                maxHealth: 100,
                willToFight: 60,
                damage: 50
            };  

            this.enemies[i].set(setEnemy);
        }

        for(var i = 0; i < this.players.length; i ++)
        {
            this.players[i].setForBattle(PLAYER_LOADOUT);
        }

        
        for(var i = 0; i < PLAYER_LOADOUT.techs.length; i ++)
        {
            PLAYER_LOADOUT.techs[i].reset();
        }

        this.emperor.reset();
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
        if(this.turn % 2 == 0)
        {
            this.enemies[0].takeTurn();
            this.players[0].giveTurn();
        }
        else
        {
            this.players[0].takeTurn();
            this.enemies[0].giveTurn();
        }
    }

    enemyTurnFinished()
    {
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
                        this.processTechnique(this.activeTechnique, this.activeEnemy, movePlayer) :
                        this.processEnemyTurn(true, this.enemyTurn);
                }
                else 
                {  
                    this.playerTurn() ?
                        this.endTechnique() :
                        this.enemyTurnFinished();
                }
            }
        }
    }

    startTechnique(technique, target, source)
    {
        //console.log("Processing technique: " + technique.name);
        //console.log(technique);
        source.takeTurn();

        if(technique.moveToCentre)
        {  
           this.activePlayer = source.index;
           this.activeEnemy = target; 
           this.activeTechnique = technique;
           this.moveOn = true;
           this.moveDuration = 2.0;
           this.moveDirection = 1;
           this.moveTime = 0;
        } 
        else if(technique.changeWeapon)
        {
           this.changeWeapon(technique);
        }
        else
        {
            this.processTechnique(technique, target, source);
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

                var battleEnd = {
                    winnings: 500,
                    compensation: (enemyTurn.dead ? 1000 : 0)
                };

                this.battleEnd.showBattleEnd(battleEnd);
            }
        }
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
        console.log(weaponChange);

        setActiveWeapon(weaponChange.newWeapon, this.players[0]);

        this.endTechnique();
    }

    processTechnique(technique, target, source)
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
            console.log("move back to start points...");
            this.activeTechnique = source.index;
            this.activeEnemy = target;
            this.moveDirection = -1;
            this.moveDuration = 1;
            this.moveTime = this.moveDuration;
            this.moveOn = true;
        }
        else
        {
            this.endTechnique();
        }
    }

    processEnemyTurn(moveToCentre, turnData)
    {  
        console.log("PROCESS ENEMY TURN");
        console.log(turnData);

        if(moveToCentre)
        {
            this.enemies[this.activeEnemy].clearSpeech();

            this.moveDirection = -1;
            this.moveDuration = 1;
            this.moveTime = this.moveDuration;
            this.moveOn = true;

            if(turnData.attacking)
            {
                this.players[0].addToHealth(-turnData.damage);
            }
        }
    }

    endTechnique()
    {
        this.turn ++;
        this.nextTurn();
    }
}