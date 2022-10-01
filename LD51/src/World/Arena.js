import Player from "../Characters/Player";
import { consoleLog, EM, getObjectConfig } from "../main";

export default class Arena
{
    constructor(levelData)
    {
        this.renderLayer = "BACKGROUND";

        this.arenaMaps = [];
        this.arenaConfig = getObjectConfig("Arena");

        for(let i = 0; i < levelData.maps.length; i ++)
        {
            let levelMap= getMap(levelData.maps[i].name);

            let mapLayer = {
                type: levelData.maps[i].type,
                map: levelMap.copy(0, 0, levelMap.width, levelMap.height),
                draw: levelData.maps[i].draw
            };

            this.arenaMaps.push(mapLayer);
        }

        EM.RegisterEntity(this);

        this.ProcessMapObjects()
    }

    ProcessMapObjects()
    {
        let objectMap = assets.objectConfig.objectMap;

        let scannableMapTypes = this.arenaConfig.scannableMapTypes

        let scannableMaps = [];

        for(let i = 0; i < this.arenaMaps.length; i ++)
        {
            let map = this.arenaMaps[i];
            let scannableMapTypeMatch = scannableMapTypes.find(smt => smt === map.type);

            if(scannableMapTypeMatch)
            {
                scannableMaps.push(map);
            }
        }

        for(let map = 0; map < scannableMaps.length; map ++)
        {
            let mapLayer = scannableMaps[map].map;

            for(let i = 0; i < objectMap.length; i ++)
            {
                let obj = objectMap[i];
                
                /*
                consoleLog("PROCESS MAP OBJ...");
                consoleLog(obj);
                */
                if(obj.searchMap)
                {
                    let objTiles = mapLayer.find(obj.index);

                    for(let j = 0; j < objTiles.length; j ++)
                    {
                        let tile = objTiles[j];
                        
                        if(obj.type === "PLAYER")
                        {
                            let numString = obj.name.substr("Player".length)

                            /*
                            consoleLog("Build player:");
                            consoleLog(obj);
                            */
                            let number = parseInt(numString);
                            let player = new Player(
                                obj.spriteData, 
                                { x: tile.x, y: tile.y },
                                number);

                            consoleLog(`Adding entity with playerName: ${obj.name}`);

                            EM.AddEntity(obj.name, player);
                        }

                        if(obj.replaceTile)
                        {
                            mapLayer.remove(tile.x, tile.y);
                        }
                    }
                }
            }
        }
    }

    GetMaps(type)
    {
        let maps = [];

        for(let i = 0; i < this.arenaMaps.length; i ++)
        {
            if(this.arenaMaps[i].type === type)
            {
                maps.push(this.arenaMaps[i].map);
            }
        }

        return maps;
    }

    DeteriorateArena(deteriorator)
    {
        let worldMaps = this.GetMaps("world");

        for(let i = 0; i < worldMaps.length; i++)
        {
            deteriorator.RemoveDeterioratedTiles(worldMaps[i]);
            deteriorator.SetTilesToDeteriorate(worldMaps[i]);
        }
    }

    GetWorldTile(tilePos)
    {
        let worldMaps = this.GetMaps("world");

        let tile = null;

        for(let i = 0; i < worldMaps.length; i ++)
        {
            tile = worldMaps[worldMaps.length - 1 - i].get(tilePos.x, tilePos.y);
            break;
        }

        return tile;
    }

    Draw()
    {
        for(let i = 0; i < this.arenaMaps.length; i ++)
        {
            if(this.arenaMaps[i].draw)
            {
                this.arenaMaps[i].map.draw();
            }
        }
    }
}