import { COLLISION_GROUP, consoleLog, EM } from "../main";

export default class ScoutPerceptionZone
{
    constructor(scout)
    {
        this.zoneSize = 6;
        let pos = scout.GetTilePos();

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: this.zoneSize, h: this.zoneSize },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: false,
            tag: scout.physConfig.perceptionTag,
            material: "playerMaterial",
            collisionGroup: scout.physConfig.collisionGroup,
            collisionMask: scout.physConfig.perceptionMask,
            linearDrag: 0.99
        };

        this.scout = scout;

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Update(deltaTime)
    {
        this.phys.position = this.scout.phys.position;
    }

    Draw(){}
}