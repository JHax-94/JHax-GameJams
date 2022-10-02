import { consoleLog, EM, PIXEL_SCALE } from "../main";

export default class Explosion
{
    constructor(tilePos, anim, createdBy)
    {
        this.renderLayer = "WORLD";

        this.createdBy = createdBy;
        this.tilePos = tilePos;
        this.anim = anim;
        this.animIndex = 0;

        EM.RegisterEntity(this);
    }

    SetProgress(progress)
    {
        for(let i = 0; i < this.anim.length; i ++)
        {
            progress -= this.anim[i].time;
            if(progress < 0)
            {
                this.animIndex = i;
                break;
            }
        }
    }

    Update(deltaTime)
    {
        this.y = this.tilePos.y;
    }

    Draw()
    {
        let a = this.anim[this,this.animIndex];
        sprite(a.sprite, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE, a.h, a.v, a.r);
    }
}