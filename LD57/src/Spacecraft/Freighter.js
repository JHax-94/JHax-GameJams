import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE } from "../main";
import { vec2 } from "p2";
import ParcelStore from "../GameWorld/ParcelStore";

export default class Freighter
{
    constructor(atStation, title)
    {
        this.title = title;
        this.currentStation = null;

        let offset = { x: 1, y: 1};

        this.thrustForce = 60000;

        this.brakeSpeed = 1;

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
            collisionMask: COLLISION_GROUP.STATIONS,
            linearDrag: this.baseDrag 
        };

        this.currentSpeed = 0;

        this.angle = 0;

        this.tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        this.tex.sprite(0, 0, 0);

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.target = null;
        this.parcelStore = new ParcelStore(this, 3);
    }

    SetTarget(target)
    {
        this.target = target;
    }

    ArrivedAtCelestial(celestial)
    {
        consoleLog(`${this.title} arrived at ${celestial.title}`);

        this.currentStation = celestial;

        if(celestial === this.target)
        {
            this.target = null;
        }
    } 

    LeftCelestial(celestial)
    {
        if(this.currentStation === celestial)
        {
            this.currentStation = null;
        }
    }

    Update(deltaTime)
    {
        this.currentSpeed = vec2.length(this.phys.velocity);

        if(this.target !== null)
        {
            if(this.currentSpeed < this.maxSpeed)
            {
                let vecToTarget = [0, 0];
                vec2.subtract(vecToTarget, this.target.phys.position, this.phys.position);
                vec2.normalize(vecToTarget, vecToTarget);
                vec2.scale(vecToTarget, vecToTarget, this.thrustForce * deltaTime);
                
                this.phys.applyForce(vecToTarget);
            }
            
        }
        else if(this.currentSpeed > 0)
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
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.tex._drawEnhanced(screenPos.x, screenPos.y,{ angle: this.angle} );

        if(this.target)
        {
            EM.hudLog.push(`${this.title} speed: ${this.currentSpeed.toFixed(3)}`);
        }
    }
}
