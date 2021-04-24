import BedTile from "./BedTile";
import TreasureChest from './TreasureChest';
import Clam from './Clam';
import { CHEST_TILES, CLAM_TILES, consoleLog, em, PIXEL_SCALE, SEABED_COLLISION_TILES } from "./main";

export default class SeaBed
{
    constructor(mapName)
    {
        this.map = getMap(mapName);
        tilesheet(assets.tilesheet_dive);

        this.mapPosition = { x: 0, y: 0 };

        //this.seaBedPos = { x: 0 , y: 30 };
        
        this.chests = [];
        this.clams = [];

        this.bedTiles = [];

        em.AddRender(this);

        for(var i = 0; i < SEABED_COLLISION_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(SEABED_COLLISION_TILES[i]);

            for(var j = 0; j < mappedTiles.length; j ++)
            {
                var tile = mappedTiles[j];
                /*
                consoleLog("ADD PHYS FOR TILE: ");
                consoleLog(tile);*/

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
        }

        for(var i = 0; i < CHEST_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(CHEST_TILES[i]);

            for(var j = 0; j < mappedTiles.length; j ++)
            {
                var tile = mappedTiles[j];

                this.chests.push(new TreasureChest({x: this.mapPosition.x + tile.x, y: this.mapPosition.y + tile.y }, CHEST_TILES[i], { type: "OXYGEN" }));
            }
        }

        for(var i = 0; i < CLAM_TILES.length; i ++)
        {
            var mappedTiles = this.map.find(CLAM_TILES[i]);
            
            for(var j = 0; j < mappedTiles.length; j++)
            {
                var tile = mappedTiles[j];

                this.clams.push(new Clam({ x: tile.x + this.mapPosition.x, y: tile.y + this.mapPosition.y }, CLAM_TILES[i]));
            }
        }
    }

    Draw()
    {
        draw(this.map, this.mapPosition.x * PIXEL_SCALE, this.mapPosition.y * PIXEL_SCALE);
    }
}
