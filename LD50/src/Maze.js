import Boulder from "./Boulder";
import Character from "./Character";
import { consoleLog, EM, PIXEL_SCALE } from "./main";
import PickupSpawner from "./PickupSpawner";
import SpawnLocation from "./SpawnLocation";
import Wall from "./Wall";

export default class Maze
{
    constructor(levelData)
    {
        this.bg = levelData.backgroundColour;

        this.mazeData = levelData;
        let levelMap = getMap(levelData.map);

        consoleLog("--- LEVEL MAP ---");
        consoleLog(levelMap);

        this.mazeMap = levelMap.copy(0, 0, levelMap.width, levelMap.height);

        this.rockSpawnLocations = [];

        EM.RegisterEntity(this);

        this.BuildRockSpawns();

        this.ProcessMapObjects();
    }

    BuildRockSpawns()
    {
        for(let i = 0; i < this.mazeData.rockZones.length; i ++)
        {
            let rockZone = this.mazeData.rockZones[i];

            for(let x = rockZone.x; x < rockZone.x + rockZone.w; x ++)
            {
                for(let y = rockZone.y; y < rockZone.y + rockZone.h; y ++)
                {
                    let tileData = this.mazeMap.get(x, y);

                    if(!tileData)
                    {
                        this.rockSpawnLocations.push({
                            rock: null,
                            x: x,
                            y: y
                        });
                    }
                }
            }
        }
    }

    SpawnBoulder(playerPos)
    {
        let emptySpawns = this.rockSpawnLocations.filter((rsl) => {
            let canSpawn = false;

            if(!rsl.rock)
            {
                canSpawn = true;
            }

            if(canSpawn)
            {
                if(Math.abs(rsl.x * PIXEL_SCALE - playerPos.x) < 2 && Math.abs(rsl.y * PIXEL_SCALE - playerPos.y) < 2)
                {
                    canSpawn = false;
                }
            }

            return canSpawn;
        });

        if(emptySpawns.length === 0 )
        {
            emptySpawns = this.rockSpawnLocations.filter((rsl) => {
                let canSpawn = false;

                if(!rsl.rock)
                {
                    canSpawn = true;
                }

                return canSpawn;
            });
        }
        

        if(emptySpawns.length > 0)
        {
            let spawn = emptySpawns[random(emptySpawns.length)];

            consoleLog("Creating Boulder at spawn point: ");
            consoleLog(spawn);

            spawn.rock = new Boulder({ x: spawn.x, y: spawn.y}, spawn);
        }
    }

    ProcessMapObjects()
    {
        let objectMap = assets.objectConfig.objectMap;

        for(let i = 0; i < objectMap.length; i ++)
        {
            let obj = objectMap[i];

            consoleLog("Find objects in map...");
            consoleLog(obj);

            if(obj.searchMap)
            {
                let objTiles = this.mazeMap.find(obj.index);

                for(let j = 0; j < objTiles.length; j ++)
                {
                    let tile = objTiles[j];

                    if(obj.name === 'Player')
                    {
                        consoleLog("Player found on Tile:");
                        consoleLog(tile);

                        EM.AddEntity("Player", new Character({ x: tile.x, y: tile.y }, obj));
                    }
                    else if(obj.name === "Wall")
                    {
                        EM.AddEntity("Wall", new Wall({ x: tile.x, y: tile.y}, obj));
                    }
                    else if(obj.name === "SpawnLocation")
                    {
                        let spawner = EM.GetEntity("PickupSpawner");

                        if(!spawner)
                        {
                            spawner = new PickupSpawner();
                            EM.AddEntity("PickupSpawner", spawner);
                        }

                        spawner.AddLocation(new SpawnLocation({ x: tile.x, y: tile.y }));
                    }

                    if(obj.replaceTile)
                    {
                        this.mazeMap.remove(tile.x, tile.y);
                    }
                }
            }
        }
    }

    Draw()
    {
        paper(this.bg);
        cls();
        this.mazeMap.draw(0, 0);
    }
    
}