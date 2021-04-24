import Container from "./Container";

export default class TreasureChest extends Container
{
    constructor(position, spriteIndex)
    {
        super(position, spriteIndex);
    }

    Interact()
    {
        this.spriteIndex = 2;
    }
}