import Container from "./Container";

export default class Clam extends Container
{
    constructor(position, spriteIndex)
    {
        super(position, spriteIndex);
    }    

    Interact()
    {
        this.spriteIndex = 56;
    }
}