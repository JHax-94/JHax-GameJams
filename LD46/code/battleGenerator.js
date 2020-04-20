class BattleGenerator
{
    constructor() 
    { 
        this.EASY = 1,
        this.MEDIUM = 2,
        this.HARD = 3,
        this.REALLY_HARD = 4

        this.STRONG_ENEMY = 1,
        this.HEALTHY_ENEMY = 2,
        this.WEAK_ENEMY = 3,
        this.BRAVE_ENEMY = 4,
        this.EASY_ENEMY = 5
    }

    getDifficulty(fightNumber)
    {
        var difficulty = this.REALLY_HARD;

        if(fightNumber < 10)
        {
            difficulty = this.EASY;
        }
        else if(fightNumber < 15)
        {
            difficulty = this.MEDIUM
        }
        else if(fightNumber < 20)
        {
            difficulty = this.HARD
        }

        return difficulty;
    }

    getEnemyCount(difficulty)
    {   
        return 1;
    }

    generateHealthyEnemy()
    {
        var health = randomNum(200, 500);

        return { 
            health: health,
            compensation: randomNum(3000, 6000),
            willToFight: ((0.25 * Math.random()) + 0.5) * health,
            damage: random(10, 50)
        };
    }

    generateStrongEnemy()
    {
        var health = randomNum(80, 200);

        return { 
            health: health,
            compensation: randomNum(1000, 3000),
            willToFight: ((0.25 * Math.random()) + 0.5) * health,
            damage: random(50, 150)
        };
    }

    generateWeakEnemy()
    {   
        var health = randomNum(50, 80);

        return { 
            health: health,
            compensation: randomNum(500, 1500),
            willToFight: ((0.4 * Math.random()) + 0.2) * health,
            damage: random(5, 20)
        };
    }

    generateBraveEnemy()
    {
        var health = randomNum(100, 300);

        return { 
            health: health,
            compensation: randomNum(1200, 2500),
            willToFight: ((0.2 * Math.random()) + 0.7) * health,
            damage: random(10, 30)
        };
    }
    
    generateEasyEnemy()
    {
        var health = randomNum(100, 200);

        return {
            health: health,
            compensation: randomNum(1000, 2000),
            willToFight: ((0.25 * Math.random()) + 0.5) * health,
            damage: random(25, 60) 
        }

    }

    randomGenerateBattle(fightNumber)
    {
        /// start with an excitement level
        var enemyList = { enemies: [] }
        
        var baseMaxExcitement = 500;
        var baseMinExcitement = 400;
        var minDecrement = 10;
        var absoluteMin = 150;

        var baseThresholds = [ 0.25, 0.5, 0.75 ];

        var maxExcitement = baseMaxExcitement;
        var minExcitement = baseMinExcitement - minDecrement * fightNumber;
        
        if(minExcitement < absoluteMin)
        {
            minExcitement = absoluteMin;
        }
        var excitement = randomNum(minExcitement, maxExcitement);
        
        var fightDifficulty = this.getDifficulty(fightNumber);

        var prizeMoney = randomNum(1000, 2000 + 1000 * fightDifficulty);
        
        enemyList.excitement = excitement;
        enemyList.prizeMoney = prizeMoney;

        var excitementShift = (excitement / 1000) * fightDifficulty;

        /**  if Excitement high, small groups easier
         *   otherwise large groups are easier
         */

        var enemyCountPicker = Math.random();
        var enemyCount = 1;
        for(var i = 0; i < baseThresholds.length && enemyCount == 1; i ++)
        {
            if(enemyCountPicker < baseThresholds[i] + excitementShift)
            {
                enemyCount = 4 - i;
            }
        }

        var lastType = -1;

        var potentialsList = [];

        potentialsList.push(this.BRAVE_ENEMY);
        potentialsList.push(this.STRONG_ENEMY);            

        if(fightDifficulty === this.EASY)
        {
            potentialsList.push(this.EASY_ENEMY);            
        }
        else if(fightDifficulty === this.HARD)
        {
            potentialsList.push(this.WEAK_ENEMY);
        }
        else if(fightDifficulty === this.REALLY_HARD)
        {
            potentialsList.push(this.HEALTHY_ENEMY);
        }

        for(var i = 0; i < enemyCount; i ++)
        {
            /** enemies that are easy to fight:
                 - Enemies with lots of health and low will
                 - Enemies with low damage    
                 - small groups with high excitement

                hard:
                 - Low health combined with low start excitement
                 - small groups with low excitement
            */
            var nextEnemy = potentialsList[randomNum(0, potentialsList.length)];
            
            if(nextEnemy == lastType)
            {
                nextEnemy = potentialsList[randomNum(0, potentialsList.length)];
            }

            var newEn;

            if(nextEnemy === this.EASY_ENEMY)
            {
                newEn = this.generateEasyEnemy();
            }
            else if(nextEnemy === this.BRAVE_ENEMY)
            {
                newEn = this.generateBraveEnemy();
            }
            else if(nextEnemy === this.HEALTHY_ENEMY)
            {
                newEn = this.generateHealthyEnemy();
            }
            else if(nextEnemy === this.STRONG_ENEMY)
            {
                newEn = this.generateStrongEnemy();
            }
            else if(nextEnemy === this.WEAK_ENEMY)
            {
                newEn = this.generateWeakEnemy();
            }
            
            enemyList.enemies.push(newEn);
        }

        return enemyList;
    }

    generateBattle(difficulty)
    {
        console.log("CHECK LEVEL DATA for " + difficulty);

        console.log(LEVEL_DATA);

        var buildFromData = 0;

        if(difficulty < LEVEL_DATA.levels.length)
        {
            buildFromData = LEVEL_DATA.levels[difficulty];
        }

        var opponentList = {
            startExc: 400,
            enemies: [],
            tutorialText: ""
        }

        if(buildFromData != 0 && FORCE_RANDOM == false)
        {
            opponentList.startExc = buildFromData.emperorStart;
            opponentList.prizeMoney = buildFromData.prizeMoney;
            if(buildFromData.tutorialText)
            {
                opponentList.tutorialText = buildFromData.tutorialText;
            }
            else
            {
                opponentList.tutorialText = "";
            }

            for(var i = 0; i < buildFromData.enemies.length; i ++)
            {
                var enemyObj = buildFromData.enemies[i];

                var startPos = LEVEL_DATA.enemyOffsets.list[i];
                enemyObj.x = startPos.x;
                enemyObj.y = startPos.y;

                console.log("Push enemy obj");
                console.log(enemyObj);
                opponentList.enemies.push(enemyObj);
            }
        }
        else 
        {
            console.log("LOADING RANDOM LEVEL!");
            var generatedList = this.randomGenerateBattle(difficulty);

            console.log(generatedList);

            opponentList.startExc = generatedList.excitement;
            opponentList.prizeMoney = generatedList.prizeMoney;

            for(var i = 0; i < generatedList.enemies.length; i ++)
            {
                var enemyObj = generatedList.enemies[i];

                var startPos = LEVEL_DATA.enemyOffsets.list[i];
                enemyObj.x = startPos.x;
                enemyObj.y = startPos.y;

                console.log("Push enemy obj");
                console.log(enemyObj);
                opponentList.enemies.push(enemyObj);
            }
        }

        /*
        var noOfEnemies = this.getEnemyCount(difficulty);

        for(var i = 0; i < noOfEnemies; i ++)
        {
            var newEnemy = this.generateEnemy(difficulty, noOfEnemies);

            opponentList.push(newEnemy);
        }*/

        console.log("built enemy list");
        console.log(opponentList);

        return opponentList;
    }

}