import { COLLISION_GROUP, EM, TILE_UTILS } from "../main";

export default class Floor
{
    constructor(tiles, objectDef)
    {
        this.hideCollider = true;
        this.dims = TILE_UTILS.GetBlockDimensions(tiles);
        this.texture = TILE_UTILS.BuildTextureFromTiles(tiles, this.dims);

        let physSettings = {
            tileTransform: { x: this.dims.x, y: this.dims.y, w: this.dims.w, h: this.dims.h },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "FLOOR",
            collisionGroup: COLLISION_GROUP.FLOOR,
            collisionMask: (COLLISION_GROUP.PLAYER | COLLISION_GROUP.NPC),
            material: "playerMaterial",
        }; 

        EM.RegisterEntity(this, { physSettings: physSettings });

        this.Setup();
    }

    GetPlaceTile(placeNumber)
    {
        let tile = {
            x: this.dims.x + placeNumber,
            y: this.dims.y - 1
        };

        return tile;
    }

    Setup()
    {
        this.floorNumber = null;
        this.workstations = [];
        this.floorY = this.phys.position[1];
    }

    AddWorkstation(workstation)
    {
        this.workstations.push(workstation);
        workstation.floor = this;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        this.texture._drawEnhanced(screenPos.x, screenPos.y);
    }


}