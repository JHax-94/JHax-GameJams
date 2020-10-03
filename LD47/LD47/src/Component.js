import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class Component
{
    constructor(tilePos, spriteData)
    {
        this.tilePos = tilePos;
        this.spriteInfo = spriteData;

        this.z = 10;

        em.AddRender(this);
    }

    Draw()
    {
        sprite(this.spriteInfo.index, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE, this.spriteInfo.flipX, this.spriteInfo.flipY, this.spriteInfo.flipR);
    }

}