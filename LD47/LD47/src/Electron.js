import { consoleLog, em, PIXEL_SCALE, SFX, getAnimation } from "./main";

//import { em, consoleLog, PIXEL_SCALE } from './main.js'

export default class Electron
{
    constructor(position, spriteInfo, speed)
    {
        em.AddAnimateFunctions(this);
        /*
        consoleLog("Construct electron");

        consoleLog(position);
        consoleLog(spriteInfo);
        */  
        this.frameTimer = 0;
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.loopAnimation = false;

        this.chargedSprite = spriteInfo.chargedSprite;
        this.unchargedSprite = spriteInfo.unchargedSprite;

        this.spriteInfo = spriteInfo;
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
        this.SetAnimation("ELECTRON_TRAVEL", true);

        em.AddRender(this);
        em.AddPhys(this, {
            mass: 1,
            position: [ position.x, -position.y],
            tag: "ELECTRON",
            colliderRect: { width: PIXEL_SCALE/2, height: PIXEL_SCALE/2 }
        })

        em.AddUpdate(this);
        em.AddElectron(this);
    }

    AnimationFinished(animation)
    {
        consoleLog("Animation: " + animation.name + " Ended!");
        if(animation.name.includes("ELECTRON_DESTROY"))
        {
            consoleLog("Delete this!");
            this.Delete();
        }
    }

    UpdateFrame()
    {
        var frame = this.currentAnimation.frames[this.currentFrame];

        this.spriteInfo.index = frame.sprite;
        this.spriteInfo.flipX = frame.flipX;
        this.spriteInfo.flipY = frame.flipY;
        this.spriteInfo.flipR = frame.flipR;
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

    SnapToContact(contact)
    {
        this.reSnap = [];

        for(var i = 0; i < contact.phys.position.length; i ++)
        {
            this.phys.position[i] = contact.phys.position[i];

            this.reSnap[i] = contact.phys.position[i];
        }
    }

    Delete()
    {
        em.phys.removeBody(this.phys);
        em.RemoveUpdate(this);
        em.RemoveRender(this);
        em.RemoveElectron(this);
    }

    Destroy()
    {
        //consoleLog("ELECTRON DESTROY:");

        var dirString = Math.abs(this.phys.velocity[0]) > 0 ? "_H" : "_V";
        var baseAnim = this.isCharged ? "CHARGED_ELECTRON_DESTROY" : "UNCHARGED_ELECTRON_DESTROY";

        this.SetAnimation(baseAnim + dirString, false)
        consoleLog(this.phys);
        this.phys.shapes = [];

        this.isCharged = true;
        this.setDeleteSpeed = true;
        
    }

    Charge()
    {
        if(!this.isCharged)
        {   
            this.isCharged = true;
            em.QueueSound(SFX.electronCharged);
        } 
    }

    ChargeComponent(component)
    {
        if(this.isCharged)
        {
            var chargeAdded = component.AddCharge();
            consoleLog("CHARGE USED: " + chargeAdded);

            if(chargeAdded) 
            {
                consoleLog("Switch off electron!");
                this.RemoveCharge();
            }
        }
    }

    RemoveCharge()
    {
        this.isCharged = false;
        em.QueueSound(SFX.chargeSpent);
    }

    Update(deltaTime)
    {
        this.Animate(deltaTime);

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
                if(this.contact.phys.tag === "POWERED_ALT")
                {
                    this.ChargeComponent(this.contact);
                }
                
                this.contact = null;
            }
        }
        else if(this.reSnap)
        {
            this.phys.position = this.reSnap;
            this.reSnap = null;
        }
        else if(this.setDeleteSpeed)
        {
            this.phys.velocity[0] = this.phys.velocity[0] * 0.1;
            this.phys.velocity[1] = this.phys.velocity[1] * 0.1;
        }
    }

    Draw()
    {
        //consoleLog("DRAW SPRITE");

        var screenDims = { x: this.phys.position[0] - 0.5*PIXEL_SCALE, y: -this.phys.position[1] - 0.5*PIXEL_SCALE };

        //consoleLog(this.phys.position);

        sprite(this.isCharged ? this.spriteInfo.index : this.unchargedSprite, screenDims.x, screenDims.y, this.spriteInfo.flipX, this.spriteInfo.flipY, this.spriteInfo.flipR);
    }
}