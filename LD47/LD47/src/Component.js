import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class Component
{
    constructor(tilePos, spriteData, physTag)
    {
        this.tilePos = tilePos;
        this.spriteInfo = spriteData;

        this.z = 10;

        if(physTag)
        {
            em.AddPhys(this, { 
                mass: 1,
                position: [ (this.tilePos.x+0.5)*PIXEL_SCALE, -(this.tilePos.y + 0.5)*PIXEL_SCALE ],
                isSensor: true,
                tag: physTag,
                isKinematic: true,
                colliderRect: { width: PIXEL_SCALE, height: PIXEL_SCALE }
            });
        }

        em.AddRender(this);
    }

    Draw()
    {
        sprite(this.spriteInfo.index, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE, this.spriteInfo.flipX, this.spriteInfo.flipY, this.spriteInfo.flipR);
    }
}