class BattleGenerator
{
    constructor() { }

    getEnemyCount(difficulty)
    {   
        return 1;
    }

    generateEnemy(difficulty, noOfEnemies)
    {
        return {
            health: 100,
            willToFight: 60,
            damage: 50
        }
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
            enemies: []
        }

        if(buildFromData != 0)
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