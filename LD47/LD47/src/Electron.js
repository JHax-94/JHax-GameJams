import { consoleLog, em, PIXEL_SCALE } from "./main";

//import { em, consoleLog, PIXEL_SCALE } from './main.js'

export default class Electron
{
    constructor(position, spriteInfo, speed)
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

        this.logging = false;

        this.speed = speed;

        this.contact = null;

        this.z = 5;

        this.velocity = {x: 0, y: 0};

        /*
        consoleLog("Electron constructed!");
        consoleLog(this);
        */
        em.AddRender(this);
        em.AddPhys(this, {
            mass: 1,
            position: [ position.x, -position.y],
            tag: "ELECTRON",
            colliderRect: { width: PIXEL_SCALE/2, height: PIXEL_SCALE/2 }
        })

        em.AddUpdate(this);
    }

    CompareCentre(electron, contact)
    {
        var centreMatch = false;

        var xDist = Math.abs(electron.phys.position[0] - contact.phys.position[0]);
        var yDist = Math.abs(electron.phys.position[1] - contact.phys.position[1]);

        if(this.logging)
        {
            console.log("Centre Dist: x=" + xDist + ", y=" + yDist + ", PIXEL_SCALE=" + PIXEL_SCALE);
        }

        if(xDist <= 1/PIXEL_SCALE
            && yDist <= 1/PIXEL_SCALE)
        {
            centreMatch = true;
        }

        return centreMatch;
    }

    SetContact(contact)
    {
        this.contact = contact;
        if(this.logging)
        {
            consoleLog("CONTACT SET!");
            consoleLog(this);
            consoleLog(contact);
        }
    }

    SetVelocity(vel)
    {
        this.velocity = vel;
    }

    Update(deltaTime)
    {
        this.phys.velocity = [ this.velocity.x, this.velocity.y ];

        if(this.contact) 
        {
            if(this.CompareCentre(this, this.contact))
            {
                var newDir = this.contact.GetFlippedDirection(this.phys.velocity);

                this.SetVelocity({x: newDir[0] * this.speed, y: newDir[1] * this.speed});
                this.contact = null;
            }
        }
    }

    Draw()
    {
        sprite(this.isCharged ? this.chargedSprite : this.unchargedSprite, this.phys.position[0] - 0.5*PIXEL_SCALE, - this.phys.position[1] - 0.5*PIXEL_SCALE);
    }
}