import HiveNode from "../Structures/HiveNode";
import StartHive from "../Structures/StartHive";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";
import LevelUpMenu from "../UI/LevelUpMenu";
import { PIXEL_SCALE } from "../main";

export default class GameWorld
{
    constructor()
    {
        this.player = null;
        this.structures = [];

        this.upgradeHistory = [];

        /// GLOBAL STATS
        this.citizenSpeed = 2 * PIXEL_SCALE;
    }

    BuildWorld()
    {
        let startHive = new StartHive({ x: 0, y: 0 });
        this.player = new PlayerSwarm({ x: 1, y: 0});
        
        let enemySwarm = new EnemySwarm({ x: -6, y: -6});

        let hiveNode = new HiveNode({ x: 2, y: 4});

        this.structures.push(startHive);
        this.structures.push(hiveNode);

        this.PlayerLevelled();
    }

    UpgradeApplied(upgrade)
    {
        this.upgradeHistory.push(upgrade);
    }

    UpgradeCitizenSpeed(amount)
    {
        this.citizenSpeed += amount;
    }

    AddExpToPlayer(amount)
    {
        this.player.AddExp(amount);
    }

    PlayerLevelled()
    {
        new LevelUpMenu(this.player);
    }
}