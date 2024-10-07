import FlowerPatch from "../Pickups/FlowerPatch";
import RoyalJelly from "../Pickups/RoyalJelly";
import EndHive from "../Structures/EndHive";
import HiveNode from "../Structures/HiveNode";
import StartHive from "../Structures/StartHive";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import PlayerSwarm from "../TinyCreatures/PlayerSwarm";
import GameOverScreen from "../UI/GameOverScreen";
import LevelUpMenu from "../UI/LevelUpMenu";
import VictoryScreen from "../UI/VictoryScreen";
import UpgradeGenerator from "../Upgrades/UpgradeGenerator";
import { consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import Background from "./Background";
import FlowerSpawner from "./FlowerSpawner";
import RoyalJellySpawner from "./RoyalJellySpawner";
import SwarmSpawner from "./SwarmSpawner";
import WarningTracker from "./WarningTracker";

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
        this.numberOfNodes = this.maxDistance;
        
        /// GLOBAL STATS
        this.citizenSpeed = 1.5 * PIXEL_SCALE;
        

        /// GENERATOR DATA
        this.minRadius = 4;

        this.hiveRadius = 1;

        this.lastAngle = 2 * Math.PI * Math.random();

        this.minSqDist = this.SqDist({x: 0, y: 0}, { x: 1, y: 1 });

        /// SERVICES
        this.swarmSpawner = new SwarmSpawner(this);
        this.flowerSpawner = new FlowerSpawner(this);
        this.warningTracker = new WarningTracker(this);
        this.royalJellySpawner = new RoyalJellySpawner(this);
        this.upgradeGenerator = new UpgradeGenerator();
        this.tutorial = null; // Set elsewhere

        EM.RegisterEntity(this);
    }

    SqDist(pos_a, pos_b)
    {
        return Math.pow(pos_a.x - pos_b.x, 2) + Math.pow(pos_a.y - pos_b.y, 2);
    }

    GetScreenBounds()
    {
        let playerTilePos = this.player.GetTilePos();

        let bounds = {
            minX: playerTilePos.x - TILE_WIDTH * 0.5,
            maxX: playerTilePos.x + TILE_WIDTH * 0.5,
            minY: playerTilePos.y - TILE_HEIGHT * 0.5,
            maxY: playerTilePos.y + TILE_HEIGHT * 0.5
        };

        return bounds;
    }

    EndGamePause()
    {
        EM.Pause(false);
    }

    Victory()
    {
        this.EndGamePause();
        EM.pauseMenu = new VictoryScreen();
    }

    Defeat(reason)
    {
        this.EndGamePause();
        EM.pauseMenu = new GameOverScreen(reason);
    }

    BuildWorld()
    {
        let background = new Background();
        this.startHive = new StartHive({ x: 0, y: 0 });
        this.player = new PlayerSwarm({ x: 2, y: 0});
        
        this.endHive = new EndHive(this.GetRandomPositionWithRadius(this.maxDistance));

        EM.AddEntity("END_HIVE", this.endHive);

        this.structures.push(this.startHive);
        this.GenerateNodes();
        this.GenerateNodesFromTargetHive();
        this.structures.push(this.endHive);

        this.swarmSpawner.SpawnSwarm();
    }

    CheckStructureProximity(pos)
    {
        let suitable = true;

        for(let i = 0; i < this.structures.length; i ++)
        {
            let hive = this.structures[i];

            let sqDist = this.SqDist(hive.pos, pos);

            let min = this.minSqDist;

            if(hive === this.startHive || hive === this.endHive)
            {
                min = this.minRadius * this.minRadius;
            }

            if(sqDist < min)
            {
                consoleLog(`(${pos.x}, ${pos.y}) - (${hive.pos.x}, ${hive.pos.y})`);
                consoleLog(`Unsuitable Sq Dist: ${sqDist} / ${this.minSqDist}`);

                suitable = false;

                break;
            }
        }

        return suitable;
    }

    SpawnExtraHive()
    {
        let onScreen = this.swarmSpawner.GetOnscreenPosition();

        while(!this.CheckStructureProximity(onScreen))
        {
            onScreen = this.swarmSpawner.GetOnscreenPosition();
        }

        let newNode = new HiveNode(onScreen);

        this.structures.push(newNode);
    }

    ClearSupplyingStructures(clearStructure)
    {
        for(let i = 0; i < this.structures.length; i ++)
        {
            let hive = this.structures[i];

            hive.ClearFromTargets(clearStructure);
        }
    }

    TotalStructPopulation()
    {
        let total = 0;
        for(let i = 0; i < this.structures.length; i ++)
        {
            if(this.structures[i] !== this.endHive)
            {
                total += this.structures[i].population;
            }
        }
        return total;
    }

    TotalCitizens()
    {
        let total = 0;
        for(let i = 0; i < this.structures.length; i ++)
        {
            if(this.structures[i] !== this.endHive)
            {
                total += this.structures[i].bugLog.length;
            }
        }

        return total;
    }

    PolarToCartesian(radius, angle)
    {
        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
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
        let radiusDiff = (this.maxDistance * 2 - this.minRadius) / (this.numberOfNodes + 1);
        let radius = this.minRadius + radiusDiff;

        for(let i = 0; i < this.numberOfNodes; i ++)
        {

            consoleLog(`Spawn hive node at radius: ${radius}`);


            let pos = this.GetRandomPositionWithRadius(radius);

            

            while(!this.CheckStructureProximity(pos))
            {
                pos = this.GetRandomPositionWithRadius(radius);
            }

            consoleLog(`Pos: (${pos.x}, ${pos.y})`);

            radius += radiusDiff;

            let hiveNode = new HiveNode(pos);

            this.structures.push(hiveNode);
        }
    }

    GenerateNodesFromTargetHive()
    {
        let gravNodes = Math.floor(this.numberOfNodes / 2);

        let radiusDiff = (this.maxDistance - this.minRadius) / (gravNodes + 1);
        let radius = this.minRadius + radiusDiff;

        for(let i = 0; i < this.numberOfNodes; i ++)
        {

            consoleLog(`Spawn hive node at radius: ${radius}`);

            let pos = this.GetRandomPositionWithRadius(radius);

            while(!this.CheckStructureProximity(pos))
            {
                pos = this.GetRandomPositionWithRadius(radius);
            }

            consoleLog(`Pos: (${pos.x}, ${pos.y})`);

            radius += radiusDiff;

            let fromHive = { x: pos.x + this.endHive.pos.x, y: pos.y + this.endHive.pos.y };

            let hiveNode = new HiveNode(fromHive);

            this.structures.push(hiveNode);
        }

    }

    UpgradeHivePopulationRate(amount)
    {
        for(let i = 0; i < this.structures.length; i ++)
        {
            this.structures[i].replenishRate += amount;
        }
    }
    
    HiveSupplied(hive)
    {
        let supplied = false;

        consoleLog("- CHECK HIVE SUPPLIED -");
        consoleLog(hive);

        for(let i = 0; i < this.structures.length; i ++)
        {
            if(this.structures[i] !== hive && this.structures[i].IsActive())
            {
                for(let j = 0; j < this.structures[i].targetStructures.length; j ++)
                {
                    if(this.structures[i].targetStructures[j] === hive)
                    {
                        consoleLog("Hive Supplied by:");
                        consoleLog(this.structures[i]);
                        supplied = true;
                        break;
                    }
                }
            }
            if(supplied) break;
        }

        consoleLog(`Is supplied? ${supplied}`);

        return supplied;
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
    
    Update(deltaTime)
    {
        EM.hudLog.push(`H: ${this.TotalStructPopulation()} C: ${this.TotalCitizens()}`);
        EM.hudLog.push(`Swarms: ${this.swarmSpawner.swarms.length}`);
        EM.hudLog.push(`Structs: ${this.structures.length}`);
    }

    CheckEndGame()
    {


        if(this.TotalStructPopulation() + this.TotalCitizens() <= 0)
        {
            this.Defeat([ "The whole colony", "was killed!" ]);
        }
    }
}