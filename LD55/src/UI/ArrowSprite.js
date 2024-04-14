export default class ArrowSprite 
{
    constructor(spriteIndex)
    {
        this.spriteIndex = spriteIndex;

        this.up = { h: false, v: false, r: false };
        this.down = { h: false, v: true, r: false };
        this.right = { h: false, v: true, r: true };
        this.left = { h: true, v: true, r: true };
    }
}