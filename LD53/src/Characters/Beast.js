import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog, p2 } from "../main";
import Shadow from "./Shadow";

export default class Beast
{
    constructor(startPos, type)
    {
        this.renderLayer = "CRITTERS";

        this.beastType = type;

        let physSettings = {
            tileTransform: {
                x: startPos.x,
                y: startPos.y,
                w: 0.7,
                h: 0.5
            },
            mass: 50,
            isSensor: false,
            isKinematic: false,
            tag: "BEAST",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER | COLLISION_GROUP.AURA,
            linearDrag: 0.9,
        };

        this.hungerTex = null;

        this.deleted = false;

        this.shadow = new Shadow(this, {x: 0, y: 5 });

        this.behaviours = [];

        EM.RegisterEntity(this, { physSettings: physSettings});
        
        this.walkAngle = 0;
        this.walkTime = 0;

        this.walkDamp = 1000;
        this.walkAngleMax = (Math.PI / 4);

        if(!EM.beastCount)
        {
            EM.beastCount = 0;
        }

        this.beastId = EM.beastCount;
        EM.beastCount ++;

        this.DefaultBehaviour();
    }

    DefaultBehaviour()
    {
        this.behaviours = [];
    }

    ReactTo(stimulus)
    {
        if(stimulus.stimType === "COLLISION")
        {
            if(stimulus.collisionWith.phys.tag === "OBSTACLE" && (this.HasBehaviour("FLEE") || this.HasBehaviour("GRAZE")))
            {
                this.DefaultBehaviour();
            }
        }
    }

    FollowTarget(depth)
    {
        let followTarget = null;
        
        if(!depth)
        {
            depth = 0;
        }

        let follow = this.GetBehaviour("FOLLOW");

        if(follow)
        {
            if(depth > 400)
            {
                console.error("WOAH NELLY");
                return;
            }

            followTarget = follow.target;
            //consoleLog(`${this.beastId} > Follow target: ${depth} (${followTarget.beastId})`);

            let recurse = followTarget.FollowTarget(depth+1);

            if(recurse)
            {
                followTarget = recurse;
            }
        }

        return followTarget;
    }

    GetBehaviour(behaviour)
    {
        let retBehaviour = null;

        for(let i = 0; i < this.behaviours.length; i ++ )
        {
            if(this.behaviours[i].behaviourType === behaviour)
            {
                retBehaviour = this.behaviours[i];
                break;
            }
        }

        return retBehaviour;
    }

    HasBehaviour(behaviour)
    {
        return !!this.GetBehaviour(behaviour);
    }

    GetSpeed(type)
    {
        let speed = this.moveSpeed[type];

        if(!speed)
        {
            speed = this.moveSpeed[this.default];
        }

        return speed;
    }

    BuildTexture()
    {
        let pTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        pTex.sprite(this.sprite, 0, 0);
        return pTex;
    }

    DeleteBeastInternal() {}

    DeleteBeast()
    {
        this.deleted = true;
        EM.RemoveEntity(this.shadow);
        EM.RemoveEntity(this);

        this.DeleteBeastInternal();
    }

    UpdateInternal(deltaTime) {}

    Update(deltaTime)
    {
        for(let i = 0; i < this.behaviours.length; i ++)
        {
            this.behaviours[i].Act(deltaTime);
        }

        let moveForce = p2.vec2.len(this.phys.force);

        let forceThresh = 500;

        if(moveForce > forceThresh || this.walkTime > 0)
        {
            this.walkTime += deltaTime;
            //consoleLog(`Move speed: ${moveForce}`);

            EM.hudLog.push(`Move Force: ${moveForce}`);

            let timer = moveForce > forceThresh ? moveForce : forceThresh;

            if(moveForce < forceThresh)
            {
                this.walkSign = Math.sign(this.walkAngle);
            }

            this.walkAngle = Math.sin((this.walkTime % (Math.PI * 2) * timer / this.walkDamp));
        }
        
        if(moveForce < forceThresh && Math.sign(this.walkAngle) !== this.walkSign)
        {
            this.walkTime = 0;
            this.walkAngle = 0;
        }

        this.UpdateInternal(deltaTime);
    }

    DrawHungerTimer(screenPos, percentage)
    {
        let radius = PIXEL_SCALE*0.5;
    
        let newTex = new Texture(radius * 2 + 4, radius * 2 + 4);

        let centre = { x: newTex.width *0.5, y: newTex.height * 0.5 };

        let segments = 8;

        let drawSegments = Math.ceil(segments * percentage);

        let segmentAngle = 2 * Math.PI / segments;

        for(let i = 0; i < drawSegments; i ++)
        {
            
            let offset = { x: Math.floor(radius * Math.sin(segmentAngle*i)), y: -Math.floor(radius * Math.cos(segmentAngle*i)) };
            let rectPos = { x: centre.x + offset.x - 1, y: centre.y + offset.y - 1 };
            
            newTex.paper(4);
            newTex.rectf(rectPos.x-1, rectPos.y-1, 4, 4);
            newTex.paper(1);
            newTex.rectf(rectPos.x, rectPos.y, 2, 2);
        }

        this.hungerTex = newTex;

        this.hungerTex._drawEnhanced(screenPos.x, screenPos.y - PIXEL_SCALE);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.texture)
        {
            this.texture._drawEnhanced(screenPos.x, screenPos.y, { angle: this.walkAngle * this.walkAngleMax });
        }

        if(this.fedTime && this.fedTimer > 0)
        {
            this.DrawHungerTimer(screenPos, (this.fedTimer / this.fedTime));
        }

        for(let i = 0; i < this.behaviours.length; i ++)
        {
            this.behaviours[i].DrawIndicators();
        }
    }
}