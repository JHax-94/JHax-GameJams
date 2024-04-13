import Texture from "pixelbox/Texture";
import { PIXEL_SCALE, consoleLog } from "./main";

export default class TileUtils
{
    constructor() {}

    GetBlockDimensions(tileList)
    {
        consoleLog("Get Block Dimensions of tile List:");
        consoleLog(tileList);

        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = 0;
        let maxY = 0;

        for(let i = 0; i < tileList.length; i ++)
        {
            let tile = tileList[i];

            if(tile.x < minX)
            {
                minX = tile.x;
            }
            
            if(tile.x > maxX)
            {
                maxX = tile.x;
            }

            if(tile.y < minY)
            {
                minY = tile.y;
            }

            if(tile.y > maxY)
            {
                maxY = tile.y;
            }
        }

        let dims =  {
            x: minX,
            y: minY,
            w: 1 + maxX - minX,
            h: 1 + maxY - minY
        };

        consoleLog("DIMS:");
        consoleLog(dims);

        return dims;
    }

    BuildTextureFromTiles(tiles, dims)
    {
        let texture = new Texture(dims.w * PIXEL_SCALE, dims.h * PIXEL_SCALE);
        
        for(let i = 0; i < tiles.length; i ++)
        {
            let tile = tiles[i];

            let tSprite = {
                i: tile.sprite,
                x: tile.x - dims.x,
                y: tile.y - dims.y,
                flipH: tile.flipH,
                flipV: tile.flipV,
                flipR: tile.flipR
            };

            texture.sprite(tSprite.i, tSprite.x * PIXEL_SCALE, tSprite.y * PIXEL_SCALE, tSprite.flipH, tSprite.flipV, tSprite.flipR);
        }
        /*
        paper(9)
        texture.rectf(0, 0, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
*/
        return texture;
    }
}