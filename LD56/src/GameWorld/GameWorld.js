import HiveNode from "../Structures/HiveNode";
import Structure from "../Structures/Structure";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";

export default class GameWorld
{
    constructor()
    {
    }

    BuildWorld()
    {
        let startHive = new Structure({ x: 0, y: 0 });
        let player = new PlayerSwarm({ x: 1, y: 0});

        let nodes = [];
        nodes.push(new HiveNode({ x: 2, y: 4}));
    }
}