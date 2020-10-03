import Component from "./Component";
import { consoleLog, em } from "./main";

export default class Bulb extends Component
{
    constructor(tilePos, spriteData, bulb)
    {
        super(tilePos, spriteData, "POWERED");

        this.isOn = false;

        this.chargesRequired = bulb.chargesRequired;
        this.chargedSprite = bulb.chargedSprite;
    }
    
    Charged()
    {
        this.spriteInfo.index = this.chargedSprite;
    }
}