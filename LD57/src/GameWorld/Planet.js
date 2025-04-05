import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";

export default class Planet
{
    constructor(pos)
    {
        this.w = 1;
        this.h = 1;
        

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: this.w, h: this.h },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "PLANET",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STATIONS,
            collisionMask: 1,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(14);
        rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE,  this.h * PIXEL_SCALE);
    }
}