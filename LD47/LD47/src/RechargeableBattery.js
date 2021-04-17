import Component from "./Component";
import Electron from './Electron.js';
import { consoleLog, COLOURS, GetDirectionFromString, em, getGameSpeed, PIXEL_SCALE } from "./main";

export default class RechargeableBattery extends Component
{
    constructor(tilePos, spriteInfo, rechargeBattery)
    {
        super(tilePos, spriteInfo, "RECHARGE_BATTERY");

        this.overcharge = true;
        
        this.chargesRequired = rechargeBattery.chargesRequired;
        this.pulseSpeed = rechargeBattery.pulseSpeed;

        this.chargedSprite = 49;
        this.unchargedSprite = 48;

        this.blinkTime = rechargeBattery.blinkTime;
        this.blinkTimer = 0;

        this.pulseCount = 0;
        this.maxPulses = rechargeBattery.maxPulses;

        this.SetupDecay(rechargeBattery);
        this.decayWhenFull = true;
        this.chargeResetsDecay = false;

        this.chargeProgress = this.AddProgressBar(GetDirectionFromString(rechargeBattery.chargeBarDir), { bg: COLOURS.barBg, fg: COLOURS.chargeBarFg });
        this.pulsesBar = this.AddProgressBar(GetDirectionFromString(rechargeBattery.pulseBarDir), {bg: COLOURS.barBg, fg: 7 });
        this.decayProgress = this.AddProgressBar(GetDirectionFromString(rechargeBattery.decayBarDir), { bg: COLOURS.barBg, fg: COLOURS.decayBarFg });
        

        this.ResetProgressBars();
        consoleLog("RECHARGE BATTERY CONSTRUCTED!");
        consoleLog(this);

        em.AddUpdate(this);
    }

    ResetProgressBars()
    {
        super.ResetProgressBars();
        this.pulsesBar.CalculateValue(this.pulseCount, this.maxPulses);
    }

    Charged()
    {
        consoleLog("BATTERY CHARGED!!!!!");
        this.spriteInfo.index = this.chargedSprite;
        this.pulseCount = this.pulseCount + 1;

        if(this.pulseCount > this.maxPulses)
        {
            this.pulseCount = this.maxPulses;
        }

        this.UpdatePulseBar();
    }

    UpdatePulseBar()
    {
        this.pulsesBar.CalculateValue(this.pulseCount, this.maxPulses);
    }

    Pulse()
    {
        var speed = getGameSpeed();

        var spawnPos = { x: (this.tilePos.x + (this.spriteInfo.flipX ? 0 : 1.5)) * PIXEL_SCALE, y: (this.tilePos.y+0.5) * PIXEL_SCALE };

        consoleLog("Spawn Electron at:");
        consoleLog(spawnPos);

        var newElectron = new Electron({x: spawnPos.x, y: spawnPos.y }, { index: 18, unchargedSprite: 19, flipX: false, flipY: false, flipR: false }, this.pulseSpeed * speed.speed);

        newElectron.SetVelocity({x: speed.speed * this.pulseSpeed * (this.spriteInfo.flipX ? -1 : 1), y: 0});
    }

    Update(deltaTime)
    {
        super.ChargeDecay(deltaTime);

        if(this.blinkTimer > 0)
        {
            this.blinkTimer -= deltaTime;

            if(this.blinkTimer <= 0 )
            {
                this.blinkTimer = 0;
                this.spriteInfo.index = this.chargedSprite;
            }
        }
    }

    HasPulses()
    {
        return this.pulseCount;
    }

    ShouldDecay()
    {
        return (this.chargeDecayTime > 0) && (this.pulseCount > 0);
    }

    Draw()
    {
        super.Draw();
        this.pulsesBar.Draw();
    }

    ChargeWithPulse(electron)
    {
        this.pulseCount = this.pulseCount - 1;
        if(this.pulseCount < 0)
        {
            this.pulseCount = 0;            
        }
        electron.Charge();

        this.blinkTimer = 0;

        if(this.pulseCount === 0)
        {
            this.currentCharges = 0;
            this.chargeDecayTimer = 0;
        }

        this.spriteInfo.index = this.unchargedSprite;

        if(this.pulseCount > 0)
        {
            this.blinkTimer = this.blinkTime;
        }

        this.ResetProgressBars();
    }

    Decay()
    {
        super.Decay();

        this.Pulse();
        this.pulseCount = this.pulseCount - 1;
        if(this.pulseCount < 0)
        {
            this.pulseCount = 0;
        }
        
        this.UpdatePulseBar();
        
        if(this.pulseCount > 0)
        {
            this.blinkTimer = this.blinkTime;
        }
        
        this.spriteInfo.index = this.unchargedSprite;
    }

}