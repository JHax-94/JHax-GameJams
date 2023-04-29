import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog } from "../main";
import Shadow from "./Shadow";
import GrazeBehaviour from "./GrazeBehaviour";
import BeastBehaviour from "./BeastBehaviour";
import FollowBehaviour from "./FollowBehaviour";
import Whistle from "../PlayerActions/Whistle";

let BEAST_BEHAVIOUR = {
    GRAZE: 0,
    WANDER: 1
};

export default class WhistleBeast
{

    constructor(startPos)
    {
        this.renderLayer = "CRITTERS";

        this.beastType = "WHISTLE";

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
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9,
            
        };

        this.sprite = 18;

        this.shadow = new Shadow(this, {x: 0, y: 5 });

        this.texture = this.BuildTexture();

        EM.RegisterEntity(this, { physSettings: physSettings});

        this.default = "graze";

        this.moveSpeed = {
            graze: 1000 * this.phys.mass,
            follow: 6000 * this.phys.mass
        };

        this.whistle = new Whistle(this);

        this.behaviours =  [ new GrazeBehaviour(this) ];
    }

    HasBehaviour(behaviour)
    {
        let hasBehaviour = false;

        consoleLog("Checking behaviours...");
        for(let i = 0; i < this.behaviours.length; i ++ )
        {
            if(this.behaviours[i].behaviourType === behaviour)
            {
                hasBehaviour = true;
                break;
            }
        }

        return hasBehaviour;
    }

    ReactTo(stimulus)
    {
        if(stimulus.stimType === "WHISTLE")
        {
            this.behaviours = [ new FollowBehaviour(this, stimulus.GetSource()) ]; 
        }
        else if(stimulus.stimType === "COLLISION")
        {
            if(stimulus.collisionWith.beastType === this.beastType)
            {
                if(stimulus.chosen && this.HasBehaviour("FOLLOW") === false)
                {
                    this.whistle.Activate();
                }
            }
        }
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

    DeleteBeast()
    {
        EM.RemoveEntity(this.whistle);
        EM.RemoveEntity(this.shadow);
        EM.RemoveEntity(this);
    }

    Update(deltaTime)
    {
        for(let i = 0; i < this.behaviours.length; i ++)
        {
            this.behaviours[i].Act(deltaTime);
        }

        this.whistle.Act(deltaTime);
    }

    BuildTexture()
    {
        let pTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        pTex.sprite(this.sprite, 0, 0);
        return pTex;
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