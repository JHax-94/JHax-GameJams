import CondemnedScheduler from "../Condemned/CondemnedScheduler";
import Elevator from "../Elevators/Elevator";
import ElevatorBounds from "../Elevators/ElevatorBounds";
import ElevatorSummoner from "../Floors/ElevatorSummoner";
import Floor from "../Floors/Floor";
import ElevatorImp from "../Player/ElevatorImp";
import WorkStation from "../WorkStations/WorkStation";
import { EM, consoleLog } from "../main";
import LevelObjectList from "./LevelObjectList";

export default class Level
{
    constructor(levelData)
    {
        this.data = levelData;

        this.drawMaps = [];

        this.levelObjects = [];

        this.processMap = [
            { name: "ElevatorImp", method: this.BuildElevatorImp },
            { name: "Elevator", method: this.BuildElevator },
            { name: "Floor", method: this.BuildFloor },
            { name: "Workstation", method: this.BuildWorkStation },
            { name: "ElevatorSummoner", method: this.BuildElevatorSummoner },
            { name: "ElevatorBounds", method: this.BuildElevatorBounds }
        ];

        this.ProcessMapObjects();

        EM.RegisterEntity(this);

        let scheduler = new CondemnedScheduler(this);
    }   

    GetObjectList(type)
    {
        let returnArray = [];

        let list = this.levelObjects.find(lo => lo.type === type);

        if(list)
        {
            returnArray = list.objects;
        }

        return returnArray;
    }

    ProcessMapObjects()
    {
        let scanMaps = this.data.maps;

        for(let i = 0; i < scanMaps.length; i++)
        {
            let map = scanMaps[i];

            let tileMap  = getMap(map.name);

            if(!tileMap) console.error(`No Map Found with name: ${map.name}`);

            this.ProcessTileMap(tileMap);

            this.drawMaps.push(tileMap);
        }
    
    }

    BuildElevatorBounds(tiles, objDef)
    {
        let bounds = new ElevatorBounds(tiles, objDef);

        return bounds;
    }

    BuildElevatorSummoner(tile, objDef)
    {
        //consoleLog("BUILDING ELEVATOR SUMMONER");

        let summoner = new ElevatorSummoner(tile, objDef);

        return summoner;
    }

    BuildWorkStation(tile, objDef)
    {
        let workstation = new WorkStation(tile, objDef);

        return workstation;
    }

    BuildElevatorImp(tile, objDef)
    {
        /*consoleLog(`Build Elevator Imp @ (${tile.x}, ${tile.y})`);
        consoleLog(tile);
        consoleLog("With Definition:");
        consoleLog(objDef);*/

        let imp = new ElevatorImp(tile, objDef);

        return imp;
    }

    BuildElevator(tiles, objDef)
    {
        /*consoleLog("Build Elevator on Tiles:");
        consoleLog(tiles);
        consoleLog("With definition:");
        consoleLog(objDef);*/

        let elevator = new Elevator(tiles, objDef);
        return elevator;
    }

    BuildFloor(tiles, objDef)
    {
        /*
        consoleLog("Build Floor on Tiles:");
        consoleLog(tiles);*/

        let floor = new Floor(tiles, objDef);

        return floor;
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

                    if(objDef.scanAdjacent)
                    {
                        processTiles.push(...this.GetTileBlock(tile, objTiles));
                    }
                    else
                    {
                        processTiles.push(tile);
                    }

                    let procMap = this.processMap.find(pm => pm.name === objDef.name);
                    
                    if(procMap)
                    {
                        let newObject = null;

                        if(processTiles.length === 1)
                        {
                            newObject = procMap.method(tile, objDef);
                        }
                        else
                        {
                            newObject = procMap.method(processTiles, objDef)
                        }

                        let objectRecord = this.levelObjects.find(lo => lo.type === objDef.name);

                        if(!objectRecord)
                        {
                            objectRecord = new LevelObjectList(objDef.name);
                            this.levelObjects.push(objectRecord);
                        }

                        objectRecord.AddObject(newObject);
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

    GetTileBlock(tile, list)
    {
        let block = [ tile ];

        let targetTileIndex = 0;
        let targetTile = tile;

        while(targetTile != null)
        {
            let adjacentTiles = this.GetAdjacentTiles(targetTile, list);

            for(let i = 0; i < adjacentTiles.length; i ++)
            {
                
                let newTile = adjacentTiles[i];
                if(block.findIndex(bt => bt === newTile) < 0)
                {
                    block.push(newTile);
                }
            }

            targetTileIndex ++;

            if(targetTileIndex < block.length)
            {
                targetTile = block[targetTileIndex];
            }
            else
            {
                targetTile = null;
            }
        }

        return block;
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