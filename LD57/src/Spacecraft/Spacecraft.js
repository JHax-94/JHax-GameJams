import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, setFont } from "../main";
import { Utils, vec2 } from "p2";
import MOUSE_BUTTON from "../MouseButtons";

export default class Spacecraft
{
    constructor(atStation, title, gameWorld, sprite)
    {
        this.title = title;
        this.currentStation = null;
        this.dockedStation = atStation;

        this.upkeep = 20;

        this.gameWorld = gameWorld;

        let offsetDist = 1.4;
        let offAngle = Math.random() * Math.PI * 2

        let offset = { x: offsetDist * Math.cos(offAngle), y: offsetDist * Math.sin(offAngle) };

        this.thrustForce = 60000;

        this.maxFuel = 100;
        this.fuel = 100;
        this.fuelRate = 10;

        this.turnSpeed = 0.1;

        this.hovered = false;

        this.brakeSpeed = 1;

        this.dockTimer = 0;
        this.dockElapsedTimer = 0;
        this.dockProcessTime = 0.6;

        this.maxSpeed = 20;

        this.pos = { x: atStation.tilePos.x + offset.x, y: atStation.tilePos.y + offset.y };
        this.w = 1;
        this.h = 1;

        this.baseDrag = 0.2;

        let physSettings = {
            tileTransform: { x: this.pos.x, y: this.pos.y, w: this.w, h: this.h },
            mass: 100,
            isSensor: false,
            freeRotate: true,
            isKinematic: false,
            tag: "SPACECRAFT",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.SPACECRAFT,
            collisionMask: COLLISION_GROUP.STATIONS | COLLISION_GROUP.SPACECRAFT_ZONE,
            linearDrag: this.baseDrag 
        };

        this.currentSpeed = 0;

        this.angle = 0;
        this.targetAngle = 0;

        this.tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        this.tex.sprite(sprite, 0, 0);

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.previousTarget = null;
        this.target = null;
    }

    UnsetTarget()
    {
        this.previousTarget = this.target;
        this.target = null;
    }

    ApplyDamping()
    {
        return this.currentSpeed > 0 && this.fuel > 0 && this.dockedStation !== null;
    }

    RefuelComplete() {}

    IsSpacecraftDocked(target)
    {
        consoleLog("SPACECRAFT DOCKED CHECK:");
        consoleLog(target);

        return this.dockedStation === target;
    }

    RemoveUpgrade()
    {

    }

    Update(deltaTime)
    {
        this.currentSpeed = vec2.length(this.phys.velocity);

        if(this.currentSpeed > 0)
        {
            let angle = 0;
            if(this.phys.velocity[0] > 0)
            {
                angle = Math.PI / 2;
            }
            else if(this.phys.velocity[0] < 0)
            {
                angle = 3 * Math.PI / 2;
            }

            if(Math.abs(this.phys.velocity[1]) > Math.abs(this.phys.velocity[0]))
            {
                if(this.phys.velocity[1] > 0)
                {
                    angle = 0;
                }
                else if(this.phys.velocity[1] < 0)
                {
                    angle = Math.PI;
                }                
            }            

            this.targetAngle = angle;
        }
        else 
        {
            this.targetAngle = 0;
        }
        
        
        /*
        if(this.angle < 0)
        {
            this.angle += 2 * Math.PI;
        }
        else if(this.angle > 2 * Math.PI)
        {
            this.angle -= 2 * Math.PI;
        }*/



        /*
        let angleP = this.angle /(2*Math.PI);
        let targetAngleP = this.targetAngle /(2*Math.PI);

        let clockwiseDistance = targetAngleP - angleP;
        let antiClockwiseDistance = (1+angleP) - targetAngleP;

        if(this.angle < 0)
        {
            this.angle += 2 * Math.PI;
        }
        else if(this.angle > 2 * Math.PI)
        {
            this.angle -= 2 * Math.PI;
        }

        let angleDiff = this.targetAngle - this.angle;
        EM.hudLog.push(`AngleDiff: ${angleDiff.toFixed(3)} / Math.PI: ${Math.PI}`);
        let turnAmount = deltaTime * this.turnSpeed;

        if(Math.abs(angleDiff) <= turnAmount)
        {
            consoleLog("LOCK ANGLE");
            this.angle = this.targetAngle;
        }
        else if(angleDiff < -turnAmount || angleDiff > Math.PI)
        {
            EM.hudLog.push(`Turn clock`);
            this.angle += turnAmount;
        }
        else if(angleDiff > turnAmount)
        {
            EM.hudLog.push(`Turn antiClock`);
            this.angle -= turnAmount
        }
        */

        this.angle = this.targetAngle;
        if(this.target !== null)
        {
            if(this.currentSpeed < this.maxSpeed && this.fuel > 0)
            {
                let vecToTarget = [0, 0];
                vec2.subtract(vecToTarget, this.target.phys.position, this.phys.position);
                vec2.normalize(vecToTarget, vecToTarget);
                vec2.scale(vecToTarget, vecToTarget, this.thrustForce * deltaTime);
             
                this.fuel -= deltaTime * this.fuelRate;

                if(this.fuel < 0)
                {
                    this.fuel = 0;
                }

                this.phys.applyForce(vecToTarget);
            }
            
        }
        else if(this.ApplyDamping())
        {
            this.phys.damping += deltaTime * this.brakeSpeed; 
            if(this.phys.damping > 1)
            {
                this.phys.damping = 1;
            }
        }
        else if(this.phys.damping > this.baseDrag)
        {
            this.phys.damping = this.baseDrag;
        }
        
        if(this.dockedStation && this.fuel < this.maxFuel)
        {
            this.fuel += this.dockedStation.refuelRate * deltaTime;
            if(this.fuel > this.maxFuel)
            {
                this.fuel = this.maxFuel;
            }
        }

        if(this.dockedStation)
        {
            this.dockElapsedTimer += deltaTime;
        }

        if(this.dockedStation && this.parcelStore && this.parcelStore.Count() > 0)
        {
            this.dockTimer += deltaTime;
            if(this.dockTimer >= this.dockProcessTime)
            {
                this.dockTimer -= this.dockProcessTime;

                this.parcelStore.CheckDeliveriesForDestination(this.dockedStation);

                this.InternalDeliveryCheck();
            }
        }

        this.InternalUpdate(deltaTime)
    }

    AddFuel(amount)
    {
        this.fuel += amount;

        if(this.fuel > this.maxFuel)
        {
            this.fuel = this.maxFuel;
        }
    }

    InternalDeliveryCheck()
    {

    }

    InternalUpdate(deltaTime)
    {

    }

    Undock()
    {
        this.dockedStation = null;
        this.dockTimer = 0;
        this.dockElapsedTimer = 0;
    }

    Hover(hover)
    {
        this.hovered = hover;
    }

    Bounds()
    {
        let screenPos = this.GetScreenPos();

        let bounds = { 
            x: screenPos.x - 4,
            y: screenPos.y - 4,
            w: this.w * PIXEL_SCALE + 8,
            h: this.h * PIXEL_SCALE + 8
        };

        return bounds;
    }

    Click(click)
    {
        if(click === MOUSE_BUTTON.LEFT_MOUSE)
        {
            this.gameWorld.Select(this);
        }
        else if(click === MOUSE_BUTTON.RIGHT_MOUSE)
        {
            this.gameWorld.PerformAction(this);
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.tex._drawEnhanced(screenPos.x, screenPos.y,{ angle: this.angle} );

        if(this.target)
        {
            EM.hudLog.push(`${this.title} speed: ${this.currentSpeed.toFixed(3)}`);
        }

        this.DrawFocus(screenPos);
        this.DrawFuel(screenPos);
        this.DrawCargo(screenPos);
    }

    DrawCargo(screenPos)
    {
        if(this.parcelStore && this.parcelStore.Count() > 0)
        {
            setFont("Default");
            pen(1);
            sprite(34, screenPos.x - 0.25 * PIXEL_SCALE - 4, screenPos.y + PIXEL_SCALE - 2);
            print(`x ${this.parcelStore.Count()}`, screenPos.x + 0.5 * PIXEL_SCALE - 1, screenPos.y + PIXEL_SCALE+2);
        }
    }

    GetBestSpacecraft()
    {
        return this;
    }

    DrawFuel(screenPos)
    {
        if(this.fuel < this.maxFuel)
        {
            let fuelProp = this.fuel / this.maxFuel;
            
            paper(4);
            rectf(screenPos.x, screenPos.y-2, PIXEL_SCALE, 2);
            paper(1);
            rectf(screenPos.x, screenPos.y-2, Math.floor(fuelProp * PIXEL_SCALE), 2);
        }
    }

    GetFuelString()
    {
        return `Fuel: ${Math.floor(this.fuel)}/${Math.round(this.maxFuel)}`;
    }

    Dock(station)
    {
        this.UnsetTarget();
        this.dockedStation = station;
    }

    SetTarget(target)
    {
        if(target !== this.dockedStation)
        {
            if(this.currentStation === target)
            {
                this.Dock(target);
            }
            else
            {
                this.target = target;
                this.Undock();
            }
            
        }
    }

    ArrivedAtCelestial(celestial)
    {
        consoleLog(`${this.title} arrived at ${celestial.title}`);

        this.currentStation = celestial;

        if(celestial === this.target)
        {
            this.Dock(celestial);
        }

        /*
        for(let i = 0; i < this.parcelStore.Count(); i ++)
        {
            let parcel = this.parcelStore.Parcel(i);

            if(parcel.Destination() === celestial)
            {
                parcel.Deliver(this);
            }
        }*/
    } 

    LeftCelestial(celestial)
    {
        if(this.currentStation === celestial)
        {
            this.currentStation = null;
        }
    }

    DrawFocus(screenPos)
    {
        if(this.hovered || this === this.gameWorld.selected)
        {
            pen(1);
            rect(screenPos.x - 2, screenPos.y - 2, this.w * PIXEL_SCALE + 4, this.h * PIXEL_SCALE + 4);
        }
    }
}