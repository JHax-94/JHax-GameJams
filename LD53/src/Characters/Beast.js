import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, consoleLog } from "../main";
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

        this.deleted = false;

        this.shadow = new Shadow(this, {x: 0, y: 5 });

        this.behaviours = [];

        EM.RegisterEntity(this, { physSettings: physSettings});
        
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

        this.UpdateInternal(deltaTime);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.texture)
        {
            this.texture._drawEnhanced(screenPos.x, screenPos.y);
        }

        for(let i = 0; i < this.behaviours.length; i ++)
        {
            this.behaviours[i].DrawIndicators();
        }
    }
}