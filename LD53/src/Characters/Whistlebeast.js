import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog } from "../main";
import Shadow from "./Shadow";
import GrazeBehaviour from "./GrazeBehaviour";
import BeastBehaviour from "./BeastBehaviour";

let BEAST_BEHAVIOUR = {
    GRAZE: 0,
    WANDER: 1
};

export default class WhistleBeast
{

    constructor(startPos)
    {
        this.renderLayer = "CRITTERS";

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
            linearDrag: 0.9
        };

        this.sprite = 18;

        this.shadow = new Shadow(this, {x: 0, y: 6 });

        this.texture = this.BuildTexture();

        EM.RegisterEntity(this, { physSettings: physSettings});

        this.moveSpeed = 1000 * this.phys.mass;

        this.behaviours =  [ new GrazeBehaviour(this) ];
    }

    GetSpeed()
    {
        return this.moveSpeed;
    }

    Update(deltaTime)
    {
        for(let i = 0; i < this.behaviours.length; i ++)
        {
            this.behaviours[i].Act(deltaTime);
        }
        
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