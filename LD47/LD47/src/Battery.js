import Component from './Component.js';
import Electron from './Electron.js';
import { em, consoleLog, PIXEL_SCALE, getGameSpeed } from './main.js'

export default class Battery extends Component
{
    constructor(tilePos, spriteInfo, charges, pulseTime, pulseSpeed, maxLostElectrons)
    {
        super(tilePos, spriteInfo, "BATTERY");

        if(maxLostElectrons)
        {
            this.maxLostElectrons = maxLostElectrons;
        }
        else
        {
            this.maxLostElectrons = 0;
        }

        this.speedMultiplier = 1;

        var speed = getGameSpeed();

        this.lostElectrons = 0;

        this.speedMultiplier = speed.speed;

        this.tilePos = tilePos;

        this.pulseTime = pulseTime;

        this.pulseSpeed = pulseSpeed;

        this.charges = charges;

        this.pulseCount = 0;

        this.pulseTimer = this.pulseTime;
        /*
        consoleLog("BATTERY CONSTRUCTED");
        consoleLog(this);
        */
        em.AddUpdate(this);
        em.AddBattery(this);
        //em.AddRender(this);
    }
    
    HasChargesLeft()
    {
        return this.pulseCount < this.charges;
    }

    Pulse()
    {
        var speed = getGameSpeed();

        var newElectron = new Electron({x: (this.tilePos.x + (this.spriteInfo.flipX ? 0 : 1.5)) *PIXEL_SCALE, y: (this.tilePos.y+0.5) * PIXEL_SCALE}, { index: 18, unchargedSprite: 19, flipX: false, flipY: false, flipR: false }, this.pulseSpeed * speed.speed);
        
        newElectron.parentBattery = this;

        this.pulseCount ++;

        newElectron.SetVelocity({x: speed.speed * this.pulseSpeed * (this.spriteInfo.flipX ? -1 : 1), y: 0});
    }

    ElectronLost()
    {
        this.lostElectrons ++;
    }

    BatteryDepleted()
    {
        consoleLog("Check battery depletion");
        consoleLog("Max Lost electrons: " + this.maxLostElectrons + ", Lost Electrons: " + this.lostElectrons);

        return this.maxLostElectrons > 0 && this.lostElectrons >= this.maxLostElectrons;
    }

    /*
    Draw()
    {
        sprite(this.sprite, this.pos.x, this.pos.y);
    }*/

    Update(deltaTime)
    {
        if(this.pulseCount < this.charges)
        {
            //consoleLog("Can pulse...");
            this.pulseTimer += (deltaTime * this.speedMultiplier);

            if(this.pulseTimer >= this.pulseTime)
            {
                //consoleLog("PULSE!");
                this.Pulse();
                this.pulseTimer -= this.pulseTime;
                this.sprite ++;
            }
        }
    }
}