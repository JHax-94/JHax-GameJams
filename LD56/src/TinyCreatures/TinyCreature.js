import { EM } from "../main";

export default class TinyCreature
{
    constructor(pos, physSettings)
    {
        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: physSettings.tag,
            material: "playerMaterial",
            collisionGroup: physSettings.collisionGroup,
            collisionMask: physSettings.collisionMask,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Draw()
    {

    }
}