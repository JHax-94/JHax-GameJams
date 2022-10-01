import { getObjectConfig } from "../main";

export default class TileChecker
{
    constructor()
    {
        this.config = getObjectConfig("TileChecker");
    }

    IsValidGroundTile(tile)    
    {
        let isValid = false;
        if(tile)
        {
            for(let i = 0; i < this.config.validGroundTiles.length; i ++)
            {
                if(this.config.validGroundTiles[i] === tile.sprite)
                {
                    isValid = true;
                    break;
                }
            }
        }

        return isValid;
    }

    IsWallTile(tile)
    {
        let isWall = false;
        if(tile)
        {
            for(let i = 0; i < this.config.wallTiles.length; i ++)
            {
                if(this.config.wallTiles[i] === tile.sprite)
                {
                    isWall = true;
                    break;
                }
            }
        }

        return isWall;
    }

}