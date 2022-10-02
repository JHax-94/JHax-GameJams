import { circIn } from "tina/src/easing";
import { consoleLog, getObjectConfig } from "../main";

export default class MapDeteriorator
{
    constructor()
    {
        this.floorTileIndex =  getObjectConfig("FloorTile").index;
        this.damagedTileIndex = getObjectConfig("DamagedFloorTile").index;
    }

    IsFloorTile(tile)
    {
        return tile && tile.sprite == this.floorTileIndex;
    }

    RemoveDeterioratedTiles(map)
    {
        let damagedTiles = map.find(this.damagedTileIndex);

        for(let i = 0; i < damagedTiles.length; i ++)
        {
            map.remove(damagedTiles[i].x, damagedTiles[i].y);
        }
    }
}