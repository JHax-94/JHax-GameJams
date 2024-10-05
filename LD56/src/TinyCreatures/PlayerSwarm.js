import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main"

export default class PlayerSwarm
{
    constructor(pos)
    {
        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: false,
            tag: "PLAYER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STRUCTURE,
            collisionMask: (COLLISION_GROUP.STRUCTURE | COLLISION_GROUP.PLAYER | COLLISION_GROUP.ENEMY),
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        EM.hudLog.push(`PlayerPos: (${screenPos.x}, ${screenPos.y})`);

        paper(6);
        rectf(screenPos.x, screenPos.y, PIXEL_SCALE, PIXEL_SCALE);
    }
}