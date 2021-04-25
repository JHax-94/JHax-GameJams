import { consoleLog, em, PIXEL_SCALE } from './main.js'

export default class DiveShip 
{
    constructor(tilePos, spriteList, sensorLoc)
    {
        this.spriteList = spriteList;

        this.tilePos = tilePos;

        var physParams = {
            tileTransform: {
                x: sensorLoc.x,
                y: sensorLoc.y,
                w: sensorLoc.w,
                h: sensorLoc.h
            },
            isSensor: true,
            isKinematic: true,
            tag: "SHIP",
        };

        em.AddRender(this);
        em.AddPhys(this, physParams);
    }

    Interact()
    {
        em.EndLevel(true);
    }

    CanInteract()
    {
        return true;
    }

    Draw()
    {
        //consoleLog(this.spriteList);
        for(var i = 0; i < this.spriteList.length; i ++)
        {
            sprite(this.spriteList[i].index, (this.tilePos.x + this.spriteList[i].offset.x)* PIXEL_SCALE , (this.tilePos.y + this.spriteList[i].offset.y) * PIXEL_SCALE, this.spriteList[i].flipX);
        }
    }
}