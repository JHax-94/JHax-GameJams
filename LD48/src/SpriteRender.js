import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class SpriteRender
{
    constructor(tilePos, sprite)
    {
        this.tilePos = tilePos;
        this.spriteIndex = sprite;

        em.AddRender(this);        
    }

    Delete()
    {
        em.RemoveRender(this);
    }

    Draw()
    {
        /*
        consoleLog("RENDER SPRITE");
        consoleLog(this);*/
        sprite(this.spriteIndex, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE);
    }
}