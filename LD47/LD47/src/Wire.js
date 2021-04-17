import Component from "./Component";

export default class Wire extends Component
{
    constructor(tilePos, spriteData)
    {
        super(tilePos, spriteData);

        this.logName = "WIRE";
        this.logging = true;
    }

}