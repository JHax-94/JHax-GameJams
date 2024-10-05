import EndHive from "../Structures/EndHive";
import HiveNode from "../Structures/HiveNode";
import StartHive from "../Structures/StartHive";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";
import LevelUpMenu from "../UI/LevelUpMenu";
import { consoleLog, PIXEL_SCALE, UTIL } from "../main";

export default class GameWorld
{
    constructor()
    {
        /// Entities
        this.startHive = null;
        this.endHive = null;
        this.player = null;
        this.structures = [];

        this.upgradeHistory = [];

        /// GAME CONFIGURATION
        this.maxDistance = 20;
        this.numberOfNodes = 3;

        /// GLOBAL STATS
        this.citizenSpeed = 2 * PIXEL_SCALE;
    }

    BuildWorld()
    {
        let startHive = new StartHive({ x: 0, y: 0 });
        this.player = new PlayerSwarm({ x: 1, y: 0});
        
        let endHive = new EndHive(this.GetRandomPositionWithRadius(this.maxDistance));

        this.structures.push(startHive);
        this.GenerateNodes();
        this.structures.push(endHive);

        let enemySwarm = new EnemySwarm({ x: -6, y: -6});
    }

    GetRandomPositionWithRadius(radius)
    {
        let angle = 2 * Math.random() * Math.PI;

        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
    }

    GenerateNodes()
    {
        let radius = this.maxDistance / (this.numberOfNodes + 1);

        for(let i = 0; i < this.numberOfNodes; i ++)
        {
            let pos = this.GetRandomPositionWithRadius(radius);

            radius += radius;

            let hiveNode = new HiveNode(pos);

            this.structures.push(hiveNode);
        }
    }

    ActiveHives()
    {
        let activeHives = [];
        /*
        consoleLog("Checking for active hives:");
        consoleLog(this.structures);*/

        for(let i = 0; i < this.structures.length; i ++)
        {
            let hiveActive = this.structures[i].IsActive();
            /*
            consoleLog("Check hive is active:");
            consoleLog(hiveActive);*/
            
            if(hiveActive)
            {
                activeHives.push(this.structures[i]);
            }
        }

        return activeHives;
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