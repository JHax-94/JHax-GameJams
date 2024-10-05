import HiveNode from "../Structures/HiveNode";
import StartHive from "../Structures/StartHive";
import Structure from "../Structures/Structure";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";

export default class GameWorld
{
    constructor()
    {
    }

    BuildWorld()
    {
        let startHive = new StartHive({ x: 0, y: 0 });
        let player = new PlayerSwarm({ x: 1, y: 0});

        let enemySwarm = new EnemySwarm({ x: -6, y: -6});

        let nodes = [];
        nodes.push(new HiveNode({ x: 2, y: 4}));
    }
}