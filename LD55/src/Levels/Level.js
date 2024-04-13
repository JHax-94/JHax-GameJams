import Elevator from "../Elevators/Elevator";
import ElevatorImp from "../Player/ElevatorImp";
import { EM, consoleLog } from "../main";

export default class Level
{
    constructor(levelData)
    {
        this.data = levelData;

        this.drawMaps = [];

        this.processMap = [
            { name: "ElevatorImp", method: this.BuildElevatorImp },
            { name: "Elevator", method: this.BuildElevator }
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
        consoleLog(`Build Elevator Imp @ (${tile.x}, ${tile.y})`);
        /*consoleLog(tile);
        consoleLog("With Definition:");
        consoleLog(objDef);*/

        let imp = new ElevatorImp(tile, objDef);
    }

    BuildElevator(tiles, objDef)
    {
        consoleLog("Build Elevator on Tiles:");
        consoleLog(tiles);
        consoleLog("With definition:");
        consoleLog(objDef);

        let elevator = new Elevator(tiles, objDef);
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
                    
                    let processTiles = [];

                    processTiles.push(tile);
                    
                    if(objDef.scanAdjacent)
                    {
                        processTiles.push(...this.GetAdjacentTiles(tile, objTiles));
                    }

                    let procMap = this.processMap.find(pm => pm.name === objDef.name);
                    
                    if(procMap)
                    {
                        if(processTiles.length === 1)
                        {
                            procMap.method(tile, objDef);
                        }
                        else
                        {
                            procMap.method(processTiles, objDef)
                        }
                        
                    }
                    else
                    {
                        console.error(`No Process map found for name: ${objDef.name}`);
                    }

                    if(objDef.replaceTile)
                    {
                        for(let pt = 0; pt < processTiles.length; pt ++)
                        {
                            let rTile = processTiles[pt];

                            map.remove(rTile.x, rTile.y);
                        }
                    }

                    if(processTiles.length > 1)
                    {
                        for(let pt = 1; pt < processTiles.length; pt ++)
                        {
                            let otIndex = objTiles.findIndex(ot => ot === processTiles[pt]);
                            objTiles.splice(otIndex, 1);
                        }
                    }
                }
            }
        }
    }

    GetAdjacentTiles(tile, list)
    {
        let tiles = [];

        let up = list.find(t => t.x === tile.x && t.y === tile.y - 1);
        let right = list.find(t => t.x === tile.x - 1 && t.y === tile.y);
        let down = list.find(t => t.x === tile.x && t.y === tile.y + 1);
        let left = list.find(t => t.x === tile.x + 1 && t.y === tile.y);

        if(up) tiles.push(up);
        if(right) tiles.push(right);
        if(left) tiles.push(left);
        if(down) tiles.push(down);

        return tiles;
    }
    
    Draw()
    {
        for(let i = 0; i < this.drawMaps.length; i ++)
        {
            this.drawMaps[i].draw();
        }
    }
}