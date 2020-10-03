import { consoleLog, em, PIXEL_SCALE, UP, DOWN, RIGHT, LEFT } from "./main";

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
        }
        
        /*
        if(this.logging)
        {
            consoleLog("CONTACT SET!");
            consoleLog(this);
            consoleLog(contact);
        }
        */
    }

    SetVelocity(vel)
    {
        this.velocity = vel;
    }

    SnapToContact(contact, dir)
    {
        /*
        if(!this.contact.z)
        {
            consoleLog("SNAP TO");
            consoleLog(contact);
        }*/

        for(var i = 0; i < contact.phys.position.length; i ++)
        {
            /*
            if(this.logging)
            {
                consoleLog("SNAP: " + i + " = " + contact.phys.position[i]);
            }*/
            this.phys.position[i] = contact.phys.position[i];
        }

        var screenDims = { x: Math.floor(this.phys.position[0] - 0.5*PIXEL_SCALE), y: Math.floor(-this.phys.position[1] - 0.5*PIXEL_SCALE) };
        /*
        consoleLog("POS");
        consoleLog(this.phys.position);
        consoleLog("SCREEN");
        consoleLog(screenDims);
        consoleLog("POS AGAIN");
        consoleLog(this.phys.position);
        consoleLog("PHYS");
        consoleLog(this.phys);*/
    }

    Charge()
    {
        if(!this.isCharged) this.isCharged = true;
    }

    ChargeComponent(component)
    {
        if(this.isCharged)
        {
            component.AddCharge();
            this.isCharged = false;
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
                /*
                if(!this.contact.z)
                {
                    consoleLog("NEW DIR SET BY:");
                    consoleLog(this.contact, newDir);
                }*/
                
                this.phys.setZeroForce();
                this.SetVelocity({x: newDir[0] * this.speed, y: newDir[1] * this.speed});
                this.SnapToContact(this.contact, newDir);
                this.SnapToContact(this.contact, newDir);
                this.contact = null;
            }
        }
    }

    Draw()
    {
        //consoleLog("DRAW SPRITE");

        var screenDims = { x: this.phys.position[0] - 0.5*PIXEL_SCALE, y: -this.phys.position[1] - 0.5*PIXEL_SCALE };

        //consoleLog(this.phys.position);

        sprite(this.isCharged ? this.chargedSprite : this.unchargedSprite, screenDims.x, screenDims.y);
    }
}