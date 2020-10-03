import Component from "./Component";
import { consoleLog, em, PIXEL_SCALE } from "./main";
import ProgressBar from "./ProgressBar";

export default class Bulb extends Component
{
    constructor(tilePos, spriteData, bulb)
    {
        super(tilePos, spriteData, "POWERED");

        this.isOn = false;

        this.chargesRequired = bulb.chargesRequired;
        this.chargedSprite = bulb.chargedSprite;

        this.chargeProgress = new ProgressBar(
            { x: tilePos.x * PIXEL_SCALE, y: (tilePos.y - 0.5) * PIXEL_SCALE, w:PIXEL_SCALE, h: 4}, 
            { background: 4, foreground: 15 });
        
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);

        em.AddBulb(this);
    }
    
    IsLit()
    {
        return this.isOn;
    }

    Charged()
    {
        this.spriteInfo.index = this.chargedSprite;
        this.isOn = true;
        em.CheckEndGame();
    }

    AddCharge()
    {
        super.AddCharge();
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
    }

    Draw()
    {
        super.Draw();
        this.chargeProgress.Draw();
    }
}