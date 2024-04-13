import { COLLISION_GROUP, EM, TILE_UTILS } from "../main";

export default class Floor
{
    constructor(tiles, objectDef)
    {
        this.dims = TILE_UTILS.GetBlockDimensions(tiles);
        this.texture = TILE_UTILS.BuildTextureFromTiles(tiles, this.dims);

        let physSettings = {
            tileTransform: { x: this.dims.x, y: this.dims.y, w: this.dims.w, h: this.dims.h },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "FLOOR",
            collisionGroup: COLLISION_GROUP.R,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        }; 

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.texture._drawEnhanced(screenPos.x, screenPos.y);
    }


}