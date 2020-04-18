class GameMaster
{
    constructor()
    {
        this.players = [];
        this.enemies = [];
        this.emperor = {};

        this.blah = 402042;
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

    processTechnique(technique, target)
    {
        console.log("Processing technique: " + technique.name);

        this.enemies[target].addToHealth(-technique.baseDamage);

        this.emperor.addToExcitement(technique.baseExcitement);
    }
}