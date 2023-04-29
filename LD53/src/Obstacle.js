import { COLLISION_GROUP, EM } from "./main";

export default class Obstacle
{
    constructor(pos, type)
    {
        let physSettings = {
            tileTransform: {
                x: pos.x,
                y: pos.y,
                w: 1,
                h: 1
            },
            mass: 50,
            isSensor: false,
            isKinematic: true,
            tag: "OBSTACLE",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        };

        this.obstacleType = type;

        EM.RegisterEntity(this, {physSettings: physSettings});
    }
}