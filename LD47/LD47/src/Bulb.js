import Component from "./Component";
import { consoleLog, em, PIXEL_SCALE, UP, RIGHT, DOWN, LEFT, COLOURS } from "./main";

export default class Bulb extends Component
{
    constructor(tilePos, spriteData, bulb)
    {
        super(tilePos, spriteData, "POWERED");

        this.isOn = false;

        this.chargesRequired = bulb.chargesRequired;
        this.chargedSprite = bulb.chargedSprite;
        this.unchargedSprite = spriteData.sprite;
        /*
        this.chargeProgress = new ProgressBar(
            { x: tilePos.x * PIXEL_SCALE, y: (tilePos.y - 0.5) * PIXEL_SCALE, w:PIXEL_SCALE, h: 4}, 
            { background: 4, foreground: 15 });
        this.decayProgress = new ProgressBar(
                {x: tilePos.x * PIXEL_SCALE, y: (tilePos.y - 0.75) * PIXEL_SCALE, w: PIXEL_SCALE, h: 4},
                {background: 4, foreground: 9});
        */

        this.SetBarDirections(bulb);

        this.chargeProgress = this.AddProgressBar(this.chargeBarDir, { bg: COLOURS.barBg, fg: COLOURS.chargeBarFg });
        
        if(bulb.chargeDecayTime > 0)
        {
            this.decayProgress = this.AddProgressBar(this.decayBarDir, {bg: COLOURS.barBg, fg: COLOURS.decayBarFg });
        }
        
        consoleLog("ASSIGN BULB PROG BARS");
        consoleLog(this.chargeProgress);
        consoleLog(this.decayProgress);

        this.SetupDecay(bulb);        
    
        //this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
        this.ResetProgressBars();

        em.AddBulb(this);
        if(bulb.chargeDecayTime)
        {
            em.AddUpdate(this);
        }

        consoleLog("==== BULB CONSTRUCTED ====");
        consoleLog(this);
    }
    
    Decay()
    {
        consoleLog("BULB DECAY");
        super.Decay();

        if(this.isOn)
        {
            this.isOn = false;
            this.spriteInfo.index = this.un
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

    /*
    SetCharge(value)
    {
        this.currentCharges = value;
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
    }*/

    /*
    AddCharge()
    {
        super.AddCharge();
        this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
    }*/

    Update(deltaTime)
    {
        super.ChargeDecay(deltaTime);
        /*
        if(this.ShouldDecay())
        {
            this.decayProgress.CalculateValue(this.chargeDecayTime - this.chargeDecayTimer, this.chargeDecayTime);
        }*/
    }
/*
    Draw()
    {
        super.Draw();
        this.chargeProgress.Draw();

        if(this.ShouldDecay())
        {
            this.decayProgress.Draw();
        }
    }*/
}