import { consoleLog } from "./main";

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
}