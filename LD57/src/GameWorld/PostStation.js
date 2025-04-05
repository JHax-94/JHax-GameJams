
import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main"

export default class PostStation
{
    constructor(pos)
    {
        this.width = 1;
        this.height = 1;

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: this.width, h: this.height },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "STATION",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STATIONS,
            collisionMask: 1,
            linearDrag: 0.99
        };


        EM.RegisterEntity(this, { physSettings: physSettings  })
    }

    FocusCamera()
    {
        EM.camera.MoveTo(this.phys.position[0] - 0.5 * TILE_WIDTH * PIXEL_SCALE, this.phys.position[1] + 0.5 * TILE_HEIGHT * PIXEL_SCALE);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(1);

        rectf(screenPos.x, screenPos.y, PIXEL_SCALE, PIXEL_SCALE);
    }
}