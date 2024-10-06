import DIR from "../Directions";
import { EM, TILE_HEIGHT, TILE_WIDTH } from "../main";

export default class Spawner
{
    constructor(gameWorld)
    {
        this.gameWorld = gameWorld;

        this.lastAngle =  2 * Math.PI * Math.random();

        EM.RegisterEntity(this);
    }
    
    GetRandomPositionWithRadius(radius)
    {
        let angle = this.lastAngle + 0.5 * Math.PI + Math.random() * Math.PI;

        this.lastAngle = angle;

        return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    }

    GetOnscreenPosition()
    {
        let screenBounds = this.gameWorld.GetScreenBounds();

        let pos = {
            x: screenBounds.minX + (screenBounds.maxX - screenBounds.minX) * Math.random(),
            y: screenBounds.minY + (screenBounds.maxY - screenBounds.minY) * Math.random()
        };

        return pos;
    }

    GetOffscreenPosition()
    {
        let playerTilePos = this.gameWorld.player.GetTilePos();

        let minX = playerTilePos.x - TILE_WIDTH * 0.5;
        let maxX = playerTilePos.x + TILE_WIDTH * 0.5;

        let minY = playerTilePos.y - TILE_HEIGHT * 0.5;
        let maxY = playerTilePos.y + TILE_HEIGHT * 0.5;

        let side = DIR.random();

        let pos = { x: 0, y: 0 };

        if(side === DIR.UP || side === DIR.DOWN)
        {
            if(side === DIR.UP)
            {
                pos.y = minY - 1;
            }
            else if(side === DIR.DOWN)
            {
                pos.y = maxY + 1;
            }

            pos.x = minX + (maxX - minX) * Math.random();
        }
        else if(side == DIR.LEFT || side === DIR.RIGHT)
        {
            if(side === DIR.LEFT)
            {
                pos.x = minX - 1;
            }
            else if(side === DIR.RIGHT)
            {
                pos.x = maxX + 1;
            }

            pos.y = minY + (maxY - minY) * Math.random();
        }

        //let pos = { x: -6, y: -6 };

        return pos;
    }
}