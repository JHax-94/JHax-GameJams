import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class GridOverlay
{
    constructor(screenPos, spriteIndex)
    {
        this.screenPos = screenPos;
        this.spriteIndex = spriteIndex;

        em.AddRender(this);

        consoleLog("OVERLAY CREATED!");
        consoleLog(this);
    }

    Draw()
    {
        sprite(this.spriteIndex, this.screenPos.x, this.screenPos.y);
    }
}    
