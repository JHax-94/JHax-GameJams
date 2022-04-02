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

        this.mazeMap = getMap(levelData.map);

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
                        consoleLog("Does spawner exist?")

                        let spawner = EM.GetEntity("PickupSpawner");

                        if(!spawner)
                        {
                            consoleLog("Create new spawner");
                            spawner = new PickupSpawner();

                            EM.AddEntity("PickupSpawner", spawner);
                        }

                        consoleLog("Add new spawn location");
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