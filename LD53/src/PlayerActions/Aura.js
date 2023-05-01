import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE, TILE_WIDTH } from "../main";

export default class Aura
{
    constructor(src, radius, tag)
    {
        this.src = src;
        
        this.radius = radius;

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
            tag: tag,
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.AURA,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        };

        this.texture = this.BuildCircleTexture();

        this.beasts = [];

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

            this.AddBeastChecks(beast);

            this.BeastsChanged();
        }
    }

    AddBeastChecks(beast)
    {
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

    DrawAura(opts)
    {
        let sp = this.GetScreenPos();

        this.texture._drawEnhanced(
            sp.x, sp.y, opts
        );
    }
}