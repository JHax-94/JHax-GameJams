import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";

export default class ElevatorSummoner
{
    constructor(tile, objDef)
    {
        this.srcTile = tile;

        this.spriteIndex = objDef.index;
        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "ELEVATOR_SUMMONER",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.NPC_INTERACTABLE,
            collisionMask: 0,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, {physSettings: physSettings});
    }

    FloorNumber()
    {
        let floorNumber = NaN;

        if(this.floor)
        {
            floorNumber = this.floor.floorNumber;
        }

        return floorNumber;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
}