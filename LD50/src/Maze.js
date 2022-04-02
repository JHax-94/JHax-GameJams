import Character from "./Character";
import { consoleLog, EM } from "./main";
import PickupSpawner from "./PickupSpawner";
import SpawnLocation from "./SpawnLocation";
import Wall from "./Wall";

export default class Maze
{
    constructor(levelData)
    {
        this.bg = levelData.backgroundColour;

        let levelMap = getMap(levelData.map);

        consoleLog("--- LEVEL MAP ---");
        consoleLog(levelMap);

        this.mazeMap = levelMap.copy(0, 0, levelMap.width, levelMap.height);

        EM.RegisterEntity(this);

        this.ProcessMapObjects();
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