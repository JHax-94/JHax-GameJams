import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";

export default class InfluenceZone
{
    constructor(aroundObject, dims, tag, collisionGroup, collisionMask)
    {
        this.parent = aroundObject;
        let pos = aroundObject.tilePos;

        let physSettings = {
            physTransform: { x: aroundObject.phys.position[0], y: aroundObject.phys.position[1], w: dims.w * PIXEL_SCALE, h: dims.h * PIXEL_SCALE },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: tag,
            material: "playerMaterial",
            collisionGroup: collisionGroup,
            collisionMask: collisionMask,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this,{ physSettings: physSettings });
    }

    AddSpacecraft(spacecraft)
    {
        this.parent.AddSpacecraft(spacecraft);
    }

    RemoveSpacecraft(spacecraft)
    {
        this.parent.RemoveSpacecraft(spacecraft);
    }

    // Needs a draw function for draw colliders
    Draw(){}
}