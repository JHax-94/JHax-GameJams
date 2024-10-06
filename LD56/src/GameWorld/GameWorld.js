import EndHive from "../Structures/EndHive";
import HiveNode from "../Structures/HiveNode";
import StartHive from "../Structures/StartHive";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";
import LevelUpMenu from "../UI/LevelUpMenu";
import { consoleLog, PIXEL_SCALE, UTIL } from "../main";
import SwarmSpawner from "./SwarmSpawner";

export default class GameWorld
{
    constructor()
    {
        /// Entities
        this.startHive = null;
        this.endHive = null;
        this.player = null;
        this.structures = [];
        this.swarms = [];


        this.upgradeHistory = [];

        /// GAME CONFIGURATION
        this.maxDistance = 20;
        this.numberOfNodes = 10;

        /// GLOBAL STATS
        this.citizenSpeed = 1.5 * PIXEL_SCALE;


        /// GENERATOR DATA
        this.minRadius = 4;
        this.lastAngle = 2 * Math.PI * Math.random();

        /// SERVICES
        this.swarmSpawner = new SwarmSpawner(this);
    }

    BuildWorld()
    {
        let startHive = new StartHive({ x: 0, y: 0 });
        this.player = new PlayerSwarm({ x: 2, y: 0});
        
        let endHive = new EndHive(this.GetRandomPositionWithRadius(this.maxDistance));

        this.structures.push(startHive);
        this.GenerateNodes();
        this.structures.push(endHive);

        this.swarmSpawner.SpawnSwarm();
    }

    GetRandomPositionWithRadius(radius)
    {
        let angle = this.lastAngle + 0.5 * Math.PI + Math.random() * Math.PI;

        this.lastAngle = angle;

        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    }

    SwarmDestroyed(swarm)
    {
        this.swarmSpawner.SwarmDestroyed(swarm);
    }

    GenerateNodes()
    {
        let radiusDiff = (this.maxDistance - this.minRadius) / (this.numberOfNodes + 1);
        let radius = this.minRadius + radiusDiff;

        for(let i = 0; i < this.numberOfNodes; i ++)
        {

            consoleLog(`Spawn hive node at radius: ${radius}`);

            let pos = this.GetRandomPositionWithRadius(radius);

            consoleLog(`Pos: (${pos.x}, ${pos.y})`);

            radius += radiusDiff;

            let hiveNode = new HiveNode(pos);

            this.structures.push(hiveNode);
        }
    }

    HiveSupplied(hive)
    {
        let supplied = false;

        for(let i = 0; i < this.structures.length; i ++)
        {
            if(this.structures[i] !== hive && this.structures[i].IsActive())
            {
                for(let j = 0; j < this.structures[i].targetStructures.length; j ++)
                {
                    if(this.structures[i].targetStructures[j] === hive)
                    {
                        supplied = true;
                        break;
                    }
                }
            }
            if(supplied) break;
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