import { EM, getObjectConfig, PIXEL_SCALE } from "./main";

export default class MenuMissile
{
    constructor(topLeft)
    {
        this.pos = topLeft;

        let conf = getObjectConfig("MenuMissile");

        this.frameThresh = conf.boosterFrameTime;

        this.maxFrame = conf.maxFrame;

        this.anims = conf.anims;

        this.wave = conf.wave;

        this.currentFrame = 0;
        this.frameTime = 0;

        EM.RegisterEntity(this);

        this.elapsedTime = 0;
    }

    Update(deltaTime)
    {

        this.elapsedTime += deltaTime;

        this.frameTime += deltaTime;

        if(this.frameTime >= this.frameThresh)
        {
            this.currentFrame = (this.currentFrame + 1) % this.maxFrame;
            this.frameTime -= this.frameThresh;
        }
    }

    Draw()
    {
        let yOffset = Math.sin(this.elapsedTime * this.wave.frequency) * this.wave.amplitude;

        for(let i = 0; i < this.anims.length; i ++)
        {
            let anim = this.anims[i];
            let off = anim.off;
            let frame = anim.frames[this.currentFrame % anim.frames.length];

            sprite(frame, (this.pos.x + off.x) * PIXEL_SCALE, (this.pos.y + off.y) * PIXEL_SCALE + yOffset);
        }
    }
} 