import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";
import Scout from "./Scout";

export default class Swarm
{
    constructor(pos, physConf)
    {
        this.bugs = [];
        this.bugType = {
            colors: [9, 10]
        };

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: true,
            isKinematic: false,
            tag: physConf.tag,
            material: "playerMaterial",
            collisionGroup: physConf.collisionGroup,
            collisionMask: physConf.collisionMask,
            linearDrag: 0.99
        };

        this.speed = 2*PIXEL_SCALE;

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    SpawnBug()
    {
        let tilePos = this.GetTilePos();

        let newBug = new Scout(tilePos, this);

        this.bugs.push(newBug);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(6);
        rectf(screenPos.x, screenPos.y, PIXEL_SCALE, PIXEL_SCALE);
    }
}