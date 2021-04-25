import BedTile from "./BedTile";
import TreasureChest from './TreasureChest';
import Clam from './Clam';
import { CHEST_TILES, CLAM_TILES, consoleLog, DATA_STORE, em, PIXEL_SCALE, SEABED_COLLISION_TILES } from "./main";

export default class SeaBed
{
    constructor(chartEntry)
    {
        //this.halfScreen = PIXEL_SCALE * 16;

        consoleLog("Load chart entry...");
        consoleLog(chartEntry);

        this.chartEntry = chartEntry;
        this.mapName = chartEntry.seaBedMap;
        this.map = getMap(this.chartEntry.seaBedMap);
        tilesheet(assets.tilesheet_dive);

        var depth = this.chartEntry.depth;

        this.maxCameraDepth = 0;
        this.minCameraDepth = -(depth-30) * PIXEL_SCALE;

        this.stateData = DATA_STORE.GetChartDiscovery(chartEntry.location);

        if(!this.stateData)
        {
            this.stateData = {};
        }

        // If depth is 30, we want y to be zero

        this.mapPosition = { x: 0, y: depth - 30 };

        //this.seaBedPos = { x: 0 , y: 30 };
        
        this.chestMapData = [];
        this.clamMapData = [];
        this.bedMapData = [];

        this.chests = [];
        this.clams = [];
        this.bedTiles = [];

        em.AddRender(this);

        this.LoadMapData();

        this.LogMapData();
        this.ProcessMapData();

    }

    LogMapData()
    {
        var chestLog = [];
        var clamLog = [];

        for(var i = 0; i < this.chestMapData.length; i ++)
        {
            var chestTile = this.chestMapData[i];

            consoleLog(chestTile);

            var chestInfo = {
                type: "CHEST",
                contents: "",
                mapLoc: { x: chestTile.x, y: chestTile.y }
            };

            chestLog.push(chestInfo);
        }

        for(var i = 0; i < this.clamMapData.length; i ++)
        {
            var clamTile = this.clamMapData[i];

            consoleLog(clamTile);

            var clamInfo = {
                type: "CLAM",
                pearlId: -1,
                mapLoc: { x: clamTile.x, y: clamTile.y }
            };

            clamLog.push(clamInfo);
        }

        consoleLog("===== CHART DATA FOR MAP: " + this.mapName + " =====");
        consoleLog("==== CHESTS ====");
        consoleLog(JSON.stringify(chestLog));
        consoleLog("==== CLAMS ====");
        consoleLog(JSON.stringify(clamLog));
    }

    GetSavedComponent(mapLoc, saveList)
    {
        var savedComp = null;

        if(saveList)
        {
            for(var i = 0; i < saveList.length; i ++)
            {
                if(saveList[i].coords.x === mapLoc.x && saveList[i].coords.y === mapLoc.y)
                {
                    savedComp = saveList[i];
                    break;
                }
            }
        }        

        return savedComp;
    }

    LoadMapData()
    {
        for(var i = 0; i < SEABED_COLLISION_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(SEABED_COLLISION_TILES[i]);

            for(var j = 0; j < mappedTiles.length; j ++)
            {
                this.bedMapData.push(mappedTiles[j]);
            }
        }

        for(var i = 0; i < CHEST_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(CHEST_TILES[i]);

            for(var j = 0; j < mappedTiles.length; j++)
            {
                this.chestMapData.push(mappedTiles[j]);
            }
        }

        for(var i = 0; i < CLAM_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(CLAM_TILES[i]);
            
            for(var j = 0; j < mappedTiles.length; j++)
            {
                this.clamMapData.push(mappedTiles[j]);
            }
        }
    }

    ProcessMapData()
    {
        for(var i = 0; i < this.bedMapData.length; i ++)
        {
            var tile = this.bedMapData[i];

            var phys = {
                tileTransform: { 
                    x: this.mapPosition.x + tile.x, 
                    y: this.mapPosition.y + tile.y,
                    w: 1,
                    h: 1
                },
                isKinematic: true,
                isSensor: false,
                tag: "SEABED",
            };

            this.bedTiles.push(new BedTile(phys));
        }

        for(var i = 0; i < this.chestMapData.length; i ++)
        {
            var tile = this.chestMapData[i];

            var newChest = new TreasureChest({x: this.mapPosition.x + tile.x, y: this.mapPosition.y + tile.y }, tile.index, { type: "OXYGEN" });

            var savedChest = this.GetSavedComponent(tile, this.stateData.chests);

            if(savedChest)
            {
                newChest.SetState(savedChest.state);
            }
            
            this.chests.push(newChest);
        }

        for(var i = 0; i < this.clamMapData.length; i++)
        {
            var tile = this.clamMapData[i];

            var newClam = new Clam({ x: tile.x + this.mapPosition.x, y: tile.y + this.mapPosition.y }, tile.index);

            var savedClam = this.GetSavedComponent(tile, this.stateData.clams);

            if(savedClam)
            {
                newClam.SetState(savedClam.state);
            }
            
            this.clams.push(newClam);
        }
    }

    Draw()
    {
        draw(this.map, this.mapPosition.x * PIXEL_SCALE, this.mapPosition.y * PIXEL_SCALE + em.cameraDepth);
    }
}
