import ElevatorImp from "../Player/ElevatorImp";
import { EM, consoleLog } from "../main";

export default class Level
{
    constructor(levelData)
    {
        this.data = levelData;

        this.drawMaps = [];

        this.processMap = [
            { name: "ElevatorImp", method: this.BuildElevatorImp }
        ];

        this.ProcessMapObjects();

        EM.RegisterEntity(this);
    }   

    ProcessMapObjects()
    {
        let scanMaps = this.data.maps;

        consoleLog("Process objects for maps: ");
        consoleLog(scanMaps);

        for(let i = 0; i < scanMaps.length; i++)
        {
            let map = scanMaps[i];

            let tileMap  = getMap(map.name);

            if(!tileMap) console.error(`No Map Found with name: ${map.name}`);

            this.ProcessTileMap(tileMap);

            this.drawMaps.push(tileMap);
        }
    
    }

    BuildElevatorImp(tile, objDef)
    {
        consoleLog("Build Elevator Imp @");
        consoleLog(tile);
        consoleLog("With Definition:");
        consoleLog(objDef);

        let imp = new ElevatorImp(tile, objDef);        
    }

    ProcessTileMap(map)
    {
        let objectMap = assets.objectConfig.objectMap;

        for(let i = 0; i < objectMap.length; i ++)
        {
            let objDef = objectMap[i];

            if(objDef.searchMap)
            {
                let objTiles = map.find(objDef.index);

                for(let t = 0; t < objTiles.length; t ++)
                {
                    let tile = objTiles[t];
                    
                    let procMap = this.processMap.find(pm => pm.name === objDef.name);
                    
                    if(procMap)
                    {
                        procMap.method(tile, objDef);
                    }
                    else
                    {
                        console.error(`No Process map found for name: ${objDef.name}`);
                    }

                    if(objDef.replaceTile)
                    {
                        map.remove(tile.x, tile.y);
                    }
                }
            }
        }
    }

    Draw()
    {
        for(let i = 0; i < this.drawMaps.length; i ++)
        {
            this.drawMaps[i].draw();
        }
    }
}