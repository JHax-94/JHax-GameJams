import { consoleLog, em } from "./main";

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
        this.pos = position;

        this.z = 5;

        /*
        consoleLog("Electron constructed!");
        consoleLog(this);
        */
        em.AddRender(this);
    }

    Draw()
    {
        sprite(this.isCharged ? this.chargedSprite : this.unchargedSprite, this.pos.x, this.pos.y);
    }
}