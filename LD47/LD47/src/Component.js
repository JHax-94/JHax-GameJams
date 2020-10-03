import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class Component
{
    constructor(tilePos, spriteData, physTag)
    {
        this.tilePos = tilePos;
        this.spriteInfo = spriteData;

        this.z = 10;

        this.chargesRequired = 0;
        this.currentCharges = 0;
        this.chargeDecayTime = 0.0;
        this.chargeDecayTimer = 0.0;

        this.resetOnFullyCharged = false;

        this.decayWhenFull = false;
        this.decayToZero = false;

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

    ShouldDecay()
    {
        return (this.chargeDecayTime > 0) &&
            ((this.decayWhenFull && this.currentCharges >= this.chargesRequired) || (this.currentCharges > 0));
    }

    SetCharge(value)
    {
        this.currentCharges = value;
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

            if(this.chargeDecayTimer >= this.chargeDecayTime)
            {
                this.Decay();
                this.chargeDecayTimer = 0;
            }
        }
    }



    Charged() {}
    
    AddCharge()
    {
        if(this.chargesRequired > 0)
        {
            this.currentCharges ++;
            
            if(this.chargeDecayTime > 0)
            {
                this.chargeDecayTimer = 0;
            }

            //consoleLog("Charges: " + this.currentCharges + "/" + this.chargesRequired);
            if(this.currentCharges >= this.chargesRequired)
            {
                //consoleLog("Call charge!");
                this.Charged();
                if(this.resetOnFullyCharged)
                {
                    this.SetCharge(0);
                }
            }
        }
    }

    Draw()
    {
        sprite(this.spriteInfo.index, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE, this.spriteInfo.flipX, this.spriteInfo.flipY, this.spriteInfo.flipR);
    }
}