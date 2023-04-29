import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH, consoleLog } from "../main";

export default class Whistle
{
    constructor(src)
    {   
        this.src = src;

        this.radius = 2* PIXEL_SCALE;

        this.texture = this.BuildCircleTexture();

        this.activeTime = 0.8;
        this.activeTimer = 0;

        this.cooldown = 1;
        this.cooldownTimer = 0;

        this.beasts = [];

        let physSettings = {
            tileTransform: {
                x: TILE_WIDTH / 2,
                y: TILE_WIDTH / 2,
                w: this.radius * 2 / PIXEL_SCALE,
                h: this.radius * 2 / PIXEL_SCALE
            },
            collider: {
                shape: "circle",
                radius: this.radius
            },
            mass: 50,
            isSensor: true,
            isKinematic: false,
            tag: "WHISTLE",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        };

        this.stimType = "WHISTLE";

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    GetSource()
    {
        return this.src;
    }

    BeastsChanged()
    {
        /*consoleLog("New beast list:");
        consoleLog(this.beasts);*/
    }

    AddBeast(beast)
    {
        if(this.beasts.indexOf(beast) < 0 && beast !== this.src)
        {
            this.beasts.push(beast);

            if(this.IsActive())
            {
                beast.ReactTo(this);
            }

            this.BeastsChanged();
        }
    }

    RemoveBeast(beast)
    {
        let index = this.beasts.indexOf(beast) >= 0;
        if(index >= 0)
        {
            this.beasts.splice(index, 1);
            this.BeastsChanged();
        }
    }


    BuildCircleTexture()
    {
        let newTex = new Texture(this.radius * 2 + 2, this.radius * 2 + 2);

        let centre = { x: newTex.width *0.5, y: newTex.height * 0.5 };

        let segments = (this.radius / PIXEL_SCALE) * 6;

        let segmentAngle = 2 * Math.PI / segments;

        for(let i = 0; i < segments; i ++)
        {
            let offset = { x: this.radius * Math.cos(segmentAngle*i), y: this.radius * Math.sin(segmentAngle*i) };
            newTex.paper(1);
            let rectPos = { x: centre.x + offset.x - 1, y: centre.y + offset.y - 1 };
            newTex.rectf(rectPos.x, rectPos.y, 2, 2);
        }

        return newTex;

    }

    Activate()
    {
        this.activeTimer = this.activeTime;

        for(let i = 0; i < this.beasts.length; i ++)
        {
            this.beasts[i].ReactTo(this);
        }
    }

    CanActivate()
    {
        return this.IsActive() === false && this.OnCooldown() === false;
    }

    IsActive()
    {
        return this.activeTimer > 0;
    }

    OnCooldown()
    {
        return this.cooldownTimer > 0;
    }

    Act(deltaTime)
    {
        this.phys.position = this.src.phys.position;
        if(this.IsActive())
        {
            this.activeTimer -= deltaTime;

            if(this.activeTimer <= 0 )
            {
                this.activeTimer = 0;
                this.cooldownTimer = this.cooldown;
            }
        }
        else if(this.OnCooldown())
        {
            this.cooldownTimer -= deltaTime;

            if(this.cooldownTimer <= 0)
            {
                this.cooldownTimer = 0;
            }
        }
    }

    Draw()
    {
        if(this.IsActive())
        {
            let screenPos = this.src.GetScreenPos();
            this.texture._drawEnhanced(
                screenPos.x + (this.src.width - this.texture.width) * 0.5, 
                screenPos.y - (this.texture.height - this.src.height) * 0.5, 
                { angle: -this.activeTimer });
        }
    }
}