import { consoleLog, em, PIXEL_SCALE } from "./main";

//import { em, consoleLog, PIXEL_SCALE } from './main.js'

export default class Electron
{
    constructor(position, spriteInfo)
    {
        /*
        consoleLog("Construct electron");

        consoleLog(position);
        consoleLog(spriteInfo);
        */  
        this.chargedSprite = spriteInfo.chargedSprite;
        this.unchargedSprite = spriteInfo.unchargedSprite;
        this.isCharged = true;
        //this.pos = position;

        this.z = 5;

        /*
        consoleLog("Electron constructed!");
        consoleLog(this);
        */
        em.AddRender(this);
        em.AddPhys(this, {
            position: [ position.x, -position.y],
            tag: "ELECTRON",
            colliderRect: { width: PIXEL_SCALE, height: PIXEL_SCALE }
        })
    }

    SetVelocity(vel)
    {
        this.phys.velocity = [vel.x, -vel.y];
    }

    Draw()
    {
        sprite(this.isCharged ? this.chargedSprite : this.unchargedSprite, this.phys.position[0] - 0.5*PIXEL_SCALE, - this.phys.position[1] - 0.5*PIXEL_SCALE);
    }
}