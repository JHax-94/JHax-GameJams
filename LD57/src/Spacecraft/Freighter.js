import Texture from "pixelbox/Texture";
import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";

export default class Freighter
{
    constructor(atStation, title)
    {
        this.title = title;
        this.currentStation = null;

        let offset = { x: 1, y: 1};

        this.pos = { x: atStation.tilePos.x + offset.x, y: atStation.tilePos.y + offset.y };
        this.w = 1;
        this.h = 1;

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
            linearDrag: 0.99
        };

        this.angle = 0;

        this.tex = new Texture(PIXEL_SCALE, PIXEL_SCALE);
        this.tex.sprite(0, 0, 0);

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    ArrivedAtCelestial(celestial)
    {
        this.currentStation = celestial;
    } 

    LeftCelestial(celestial)
    {
        if(this.currentStation === celestial)
        {
            this.currentStation = null;
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.tex._drawEnhanced(screenPos.x, screenPos.y,{ angle: this.angle} );
    }
}
