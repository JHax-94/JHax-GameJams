import Component from './Component.js';
import Electron from './Electron.js';
import { em, consoleLog, PIXEL_SCALE } from './main.js'

export default class Battery extends Component
{
    constructor(tilePos, spriteInfo, charges, pulseTime, pulseSpeed)
    {
        super(tilePos, spriteInfo, "BATTERY");

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
        var newElectron = new Electron({x: (this.tilePos.x + (this.spriteInfo.flipX ? 0 : 1.5)) *PIXEL_SCALE, y: (this.tilePos.y+0.5) * PIXEL_SCALE}, { chargedSprite: 18, unchargedSprite: 19 }, this.pulseSpeed);
        
        /*
        if(this.pulseCount === 0)
        {
            newElectron.logging = true;
        }
        */
        this.pulseCount ++;

        newElectron.SetVelocity({x: this.pulseSpeed * (this.spriteInfo.flipX ? -1 : 1), y: 0});
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
            this.pulseTimer += deltaTime;

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