import { EM, PIXEL_SCALE } from "../main";

export default class Explosion
{
    constructor(tilePos, anim)
    {
        this.renderLayer = "WORLD";

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

    Draw()
    {
        EM.hudLog.push(`Explosion: ${this.animIndex} (${this.tilePos.x}, ${this.tilePos.y})`);
        sprite(this.anim[this.animIndex].sprite, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE);
    }
}