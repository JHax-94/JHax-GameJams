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
        this.approach = null;

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

        var axis = 0;

        if(this.approach.axis === "X") axis = 0;
        else if(this.approach.axis === "Y") axis = 1;

        var dist =  contact.phys.position[axis] - electron.phys.position[axis];

        if(this.logging)
        {
            console.log("Centre Dist: x=" + xDist + ", y=" + yDist + ", PIXEL_SCALE=" + PIXEL_SCALE);
        }

        if(Math.sign(dist) !== this.approach.dir)
        {
            centreMatch = true;
        }

        return centreMatch;
    }

    GetXDiff(electron, contact)
    {
        return contact.phys.position[0] - electron.phys.position[0];
    }

    GetYDiff(electron, contact)
    {
        return contact.phys.position[1] - electron.phys.position[1];
    }

    SetContact(contact)
    {
        this.contact = contact;
        
        var xDiff = this.GetXDiff(this, contact);
        var yDiff = this.GetYDiff(this, contact);

        if(Math.abs(xDiff) > Math.abs(yDiff))
        {
            this.approach = { axis: "X",  dir: Math.sign(xDiff) }
        }
        else if(Math.abs(yDiff) > Math.abs(xDiff)) 
        {
            this.approach = { axis: "Y", dir: Math.sign(yDiff) }
        }
        else
        {
            consoleLog("Something has gone horribly wrong in Electron.SetContact");
            consoleLog(xDiff);
            consoleLog(yDiff);
        }
        


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

    SnapToContact(contact)
    {
        for(var i = 0; i < contact.phys.position.length; i ++)
        {
            this.phys.position[i] = contact.phys.position[i];
        }
    }

    Update(deltaTime)
    {
        this.phys.velocity = [ this.velocity.x, this.velocity.y ];

        if(this.contact) 
        {
            if(this.CompareCentre(this, this.contact))
            {
                var newDir = this.contact.GetFlippedDirection(this.phys.velocity);

                this.SnapToContact(this.contact);

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