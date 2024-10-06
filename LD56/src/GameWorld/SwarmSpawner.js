import DIR from "../Directions";
import { consoleLog, EM, TILE_HEIGHT, TILE_WIDTH } from "../main";
import EnemySwarm from "../TinyCreatures/EnemySwarm";
import Spawner from "./Spawner";

export default class SwarmSpawner extends Spawner
{
    constructor(gameWorld) 
    {
        super(gameWorld);

        this.swarms = [];

        this.elapsedTime = 0;
        this.timeSinceSpawn = 0;
        
        this.spawnTime = 30;
        this.minSpawnTime = 1;

        this.spawnTimeDecay = 0.1;
    }

    GetSwarmLevelStats(level)
    {
        let baseStats = {
            size: 1,
            maxSize: 1,
            spawnTime: 10,
            lerpRate: 0.01,
            convertChance: 0.1
        };

        baseStats.maxSize += Math.floor(1.1 * (level - 1));
        baseStats.size += (level - 1);
        baseStats.spawnTime -= (level-1) * 0.1;
        baseStats.lerpRate += ((level-1) * 0.001);
        baseStats.convertChance += ((level-1) * 0.02);

        if(baseStats.convertChance > 1)
        {
            baseStats.convertChance = 1;
        }

        return baseStats;
    }

    GetSwarmLevel()
    {
        return 1 + Math.floor(this.elapsedTime / 60);
    }

    SpawnSwarm()
    {
        consoleLog("Spawn Swarm");

        let spawnPos = this.GetOffscreenPosition();

        let swarmLevel = this.GetSwarmLevel();

        let levelStats = this.GetSwarmLevelStats(swarmLevel);

        let newSwarm = new EnemySwarm(spawnPos, levelStats.size, levelStats.maxSize, levelStats.spawnTime, levelStats.lerpRate, levelStats.convertChance);

        this.swarms.push(newSwarm);
    }

    SwarmDestroyed(swarm)
    {
        for(let i = 0; i < this.swarms.length; i ++ )
        {
            if(this.swarms[i] === swarm)
            {
                this.swarms.splice(i, 1);
                break;
            }
            
        }
    }

    Update(deltaTime)
    {
        this.elapsedTime += deltaTime;
        
        this.timeSinceSpawn += deltaTime;

        if(this.timeSinceSpawn > this.spawnTime)
        {
            this.timeSinceSpawn -= this.spawnTime;

            if(this.spawnTime > this.minSpawnTime)
            {
                this.spawnTime -= this.spawnTimeDecay;
            }

            this.SpawnSwarm();
        }
    }

}