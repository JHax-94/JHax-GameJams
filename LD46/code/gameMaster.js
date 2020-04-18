class GameMaster
{
    constructor()
    {
        this.round = 0;
        this.turn = 0;

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

        this.addToLists();
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

            if(this.moveDirection < 0)
            {
                console.log("moving backwards..." + lerpVal);
                console.log(playerPos);
            } 

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
                    var playerTurn = this.playerTurn();

                    console.log("Is player turn? " + playerTurn);

                    this.playerTurn() ? 
                        this.processTechnique(this.activeTechnique, this.activeEnemy, movePlayer) :
                        this.processEnemyTurn(true);
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
        console.log("Processing technique: " + technique.name);
        console.log(technique);
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
        else 
        {
            this.processTechnique(technique, target, source);
        }
    }

    startEnemyTurn(enemy, player, moveToCentre)
    {
        if(moveToCentre)
        {
            this.activePlayer = player;
            this.activeEnemy = enemy.index;

            this.moveOn = true;
            this.moveDuration = 2.0;
            this.moveDirection = 1;
            this.moveTime = 0;
        }
        else
        {
            this.processEnemyTurn(moveToCentre);
        }
    }

    processTechnique(technique, target, source)
    {
        var targetEnemy = this.enemies[target];
        targetEnemy.addToHealth(-technique.damage());

        this.emperor.addToExcitement(technique.excitement());
        
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

    processEnemyTurn(moveToCentre)
    {
        if(moveToCentre)
        {
            this.enemies[this.activeEnemy].clearSpeech();

            this.moveDirection = -1;
            this.moveDuration = 1;
            this.moveTime = this.moveDuration;
            this.moveOn = true;
        }
    }

    endTechnique()
    {
        this.turn ++;
        this.nextTurn();
    }
}