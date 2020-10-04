import ProgressBar from "./ProgressBar";
import { consoleLog, em, PIXEL_SCALE, UP, RIGHT, DOWN, LEFT, GetDirectionFromString } from "./main";

export default class Component
{
    constructor(tilePos, spriteData, physTag)
    {
        this.tilePos = tilePos;
        this.spriteInfo = spriteData;

        this.z = 10;

        this.progressBars = [];

        this.chargeBarDir = UP;
        this.decayBarDir = UP;

        this.chargeProgress = null;
        this.decayProgress = null;

        this.chargesRequired = 0;
        this.currentCharges = 0;
        this.chargeDecayTime = 0.0;
        this.chargeDecayTimer = 0.0;

        this.resetOnFullyCharged = false;

        this.decayWhenFull = false;
        this.decayToZero = false;

        this.chargeResetsDecay = true;

        this.overcharge = false;

        if(physTag)
        {
            em.AddPhys(this, { 
                mass: 1,
                position: [ (this.tilePos.x+0.5)*PIXEL_SCALE, -(this.tilePos.y + 0.5)*PIXEL_SCALE ],
                isSensor: true,
                tag: physTag,
                isKinematic: true,
                colliderRect: { width: PIXEL_SCALE, height: PIXEL_SCALE }
            });
        }

        em.AddRender(this);
    }

    SetupDecay(decay)
    {
        if(decay.chargeDecayTime)
        {
            this.chargeDecayTime = decay.chargeDecayTime;
        }

        if(decay.decayWhenFull)
        {
            this.decayWhenFull = decay.decayWhenFull;
        }

        if(decay.decayToZero)
        {
            this.decayToZero = decay.decayToZero;
        }

        consoleLog("RESET DECAY?");
        consoleLog(decay.chargeResetsDecay);

        if(decay.chargeResetsDecay != null)
        {
            this.chargeResetsDecay = decay.chargeResetsDecay;
        }

        if(decay.overrideDecayColour)
        {
            this.decayProgress.colours.foreground = decay.overrideDecayColour;
        }
    }

    SetBarDirections(barDirs)
    {
        if(barDirs.chargeBarDir)
        {
            this.chargeBarDir = GetDirectionFromString(barDirs.chargeBarDir);
        }
        
        if(barDirs.decayBarDir)
        {
            this.decayBarDir = GetDirectionFromString(barDirs.decayBarDir);
        }
    }

    AddProgressBar(direction, colours)
    {
        var barsInThisDirection = 0; 

        consoleLog("PROG COLOURS");

        consoleLog(colours);

        for(var i = 0; i < this.progressBars.length; i ++)
        {
            if(this.progressBars[i].direction === direction) barsInThisDirection ++;
        }

        var newBar = null;
        
        if(direction === UP || direction === DOWN)
        {
            newBar = new ProgressBar(
                { 
                    x: this.tilePos.x * PIXEL_SCALE, 
                    y: (this.tilePos.y + (direction === UP ? (- 0.25 - 3/16 * barsInThisDirection) : (1.125 + 3/16 * barsInThisDirection) )) * PIXEL_SCALE, 
                    w: PIXEL_SCALE, 
                    h: 3
                }, 
                { background: colours.bg, foreground: colours.fg }
            );
        }
        else if(direction === LEFT || direction === RIGHT)
        {
            newBar = new ProgressBar(
                {
                    x: (this.tilePos.x + (direction === LEFT ? (- 0.25 - 3/16 * barsInThisDirection) : (1.125 + 3/16 * barsInThisDirection))) * PIXEL_SCALE,
                    y: this.tilePos.y * PIXEL_SCALE,
                    w: 3,
                    h: PIXEL_SCALE,
                    flip: true
                },
                { background: colours.bg, foreground: colours.fg }
            );
        }

        this.progressBars.push({ direction: direction, bar: newBar });

        consoleLog("RETURN PROG BAR");
        consoleLog(newBar);

        return newBar;
    }


    ShouldDecay()
    {
        return (this.chargeDecayTime > 0) &&
            ((this.decayWhenFull && this.currentCharges >= this.chargesRequired) || (this.decayWhenFull === false && this.currentCharges > 0));
    }

    SetCharge(value)
    {
        this.currentCharges = value;

        if(this.chargeProgress !== null)
        {
            this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
        }
    }

    Decay()
    {
        if(this.decayToZero)
        {
            this.SetCharge(0);
        }
        else 
        {
            this.SetCharge(this.currentCharges - 1);
        }
    }

    ChargeDecay(deltaTime)
    {
        if(this.chargeDecayTime > 0.0 && this.ShouldDecay())
        {
            this.chargeDecayTimer += deltaTime;

            if(this.decayProgress !== null)
            {
                this.decayProgress.CalculateValue(this.chargeDecayTime - this.chargeDecayTimer, this.chargeDecayTime);
            }

            if(this.chargeDecayTimer >= this.chargeDecayTime)
            {
                this.Decay();
                this.chargeDecayTimer = 0;
            }
        }
    }

    ResetProgressBars()
    {
        if(this.chargeProgress !== null) this.chargeProgress.CalculateValue(this.currentCharges, this.chargesRequired);
        if(this.decayProgress !== null) this.decayProgress.CalculateValue(this.chargeDecayTime - this.chargeDecayTimer, this.chargeDecayTime);
    }

    Charged() {}
    
    AddCharge()
    {
        if(this.logging) consoleLog("TRY TO ADD CHARGE TO: " + this.logName);
        var charged = false;
        if(this.chargesRequired > 0)
        {
            if(this.overcharge || (this.currentCharges < this.chargesRequired))
            {
                if(this.logging) 
                {
                    consoleLog("overcharge: " + this.overcharge);
                    consoleLog("charges below required: " + (this.currentCharges < this.chargesRequired));
                    consoleLog("USED CHARGE TO POWER UP!");
                }

                this.SetCharge(this.currentCharges + 1);    
                charged = true;
            }
            
            if(this.chargeDecayTime > 0 && this.chargeResetsDecay)
            {
                if(this.logging) consoleLog("USED CHARGE TO RESET DECAY");

                this.chargeDecayTimer = 0;
                charged = true;
            }

            //consoleLog("Charges: " + this.currentCharges + "/" + this.chargesRequired);
            if(charged && this.currentCharges >= this.chargesRequired)
            {
                if(this.logging) consoleLog("Call charge!");
                this.Charged();
                if(this.resetOnFullyCharged)
                {
                    this.SetCharge(0);
                }
            }
        }

        if(this.logging) consoleLog("Return charged: " + charged);

        return charged;
    }

    Draw()
    {
        sprite(this.spriteInfo.index, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE, this.spriteInfo.flipX, this.spriteInfo.flipY, this.spriteInfo.flipR);

        if(this.chargeProgress !== null) this.chargeProgress.Draw();
        if(this.decayProgress !== null && this.ShouldDecay()) this.decayProgress.Draw();
    }
}