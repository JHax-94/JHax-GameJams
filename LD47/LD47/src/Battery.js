import { em, consoleLog } from './main.js'

export default class Battery
{
    constructor(position, pulseTime)
    {
        this.sprite = 0;

        this.z = 1;

        this.pos = position;

        this.pulseTime = pulseTime;

        this.pulseTimer = 0;

        em.AddUpdate(this);
        em.AddRender(this);
    }

    Draw()
    {
        sprite(this.sprite, this.pos.x, this.pos.y);
    }

    Update(deltaTime)
    {
        this.pulseTimer += deltaTime;

        if(this.pulseTimer >= this.pulseTime)
        {
            this.pulseTimer -= this.pulseTime;
            this.sprite ++;
        }
    }
}