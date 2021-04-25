import BedTile from "./BedTile";
import TreasureChest from './TreasureChest';
import Clam from './Clam';
import { CHEST_TILES, CLAM_TILES, consoleLog, em, PIXEL_SCALE, SEABED_COLLISION_TILES } from "./main";

export default class SeaBed
{
    constructor(mapName)
    {
        this.mapName = mapName;
        this.map = getMap(mapName);
        tilesheet(assets.tilesheet_dive);

        this.mapPosition = { x: 0, y: 0 };

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

            this.chests.push(new TreasureChest({x: this.mapPosition.x + tile.x, y: this.mapPosition.y + tile.y }, tile.index, { type: "OXYGEN" }));
        }

        for(var i = 0; i < this.clamMapData.length; i++)
        {
            var tile = this.clamMapData[i];

            this.clams.push(new Clam({ x: tile.x + this.mapPosition.x, y: tile.y + this.mapPosition.y }, tile.index));
        }
    }

    Draw()
    {
        draw(this.map, this.mapPosition.x * PIXEL_SCALE, this.mapPosition.y * PIXEL_SCALE);
    }
}
