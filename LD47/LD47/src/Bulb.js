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
        
        if(bulb.chargeDecayTime) 
        {
            this.chargeDecayTime = bulb.chargeDecayTime;

            this.decayProgress = new ProgressBar(
                {x: tilePos.x * PIXEL_SCALE, y: (tilePos.y - 0.75) * PIXEL_SCALE, w: PIXEL_SCALE, h: 4},
                {background: 4, foreground: 9});
        }

        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);

        em.AddBulb(this);
        if(bulb.chargeDecayTime)
        {
            em.AddUpdate(this);
        }
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

    SetCharge(value)
    {
        this.currentCharges = value;
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
    }

    AddCharge()
    {
        super.AddCharge();
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
    }

    Update(deltaTime)
    {
        super.ChargeDecay(deltaTime);

        if(this.ShouldDecay())
        {
            this.decayProgress.CalculateValue(this.chargeDecayTime - this.chargeDecayTimer, this.chargeDecayTime);
        }
    }

    Draw()
    {
        super.Draw();
        this.chargeProgress.Draw();

        if(this.ShouldDecay())
        {
            this.decayProgress.Draw();
        }
    }
}