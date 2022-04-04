import { EM, getObjectConfig } from "./main";

export default class Explosion
{
    constructor(position)
    {
        this.pos = position;

        EM.RegisterEntity(this);

        let config = getObjectConfig("Explosion");

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameTime = config.frameTime;
        this.frames = config.frames;
    }

    Update(deltaTime)
    {
        this.frameTimer += deltaTime;

        if(this.frameTimer >= this.frameTime)
        {
            this.frameTimer -= this.frameTime;
            this.currentFrame ++;

            if(this.currentFrame >= this.frames.length)
            {
                EM.RemoveEntity(this);
            }
        }
    }

    Draw()
    {
        sprite(this.frames[this.currentFrame].index, this.pos.x, this.pos.y);
    }
}