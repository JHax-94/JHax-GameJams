import { em } from './main.js';

export default class Selector
{
    constructor(spriteIndex)
    {
        this.spriteIndex = spriteIndex;

        this.position = { x: 0, y: 0 };

        this.isActive = false;
        this.z = 100;

        em.AddRender(this);
    }

    Draw()
    {
        if(this.isActive) sprite(this.spriteIndex, this.position.x, this.position.y);
    }
}