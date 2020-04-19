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
        var opponentList = []

        var noOfEnemies = this.getEnemyCount();

        for(var i = 0; i < noOfEnemies; i ++)
        {
            var newEnemy = generateEnemy(difficulty, noOfEnemies);
            opponentList.push(newEnemy);
        }

        return opponentList;
    }

}