import { consoleLog, DIRECTIONS, EM, PIXEL_SCALE } from "../main";

export default class Player
{
    constructor(spriteData, tilePos, playerNumber)
    {
        this.renderLayer = "WORLD";

        this.tilePos = tilePos;

        this.spriteIndex = spriteData.spriteIndex;
        this.playerNumber = playerNumber;

        this.direction = DIRECTIONS.DOWN;

        EM.RegisterEntity(this);
    }   

    Draw()
    {
        let drawPos = { x: this.tilePos.x * PIXEL_SCALE, y: this.tilePos.y * PIXEL_SCALE };

        sprite(this.spriteIndex, drawPos.x, drawPos.y)
    }
}