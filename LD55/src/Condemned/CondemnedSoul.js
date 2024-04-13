import { COLLISION_GROUP, EM, consoleLog, getObjectConfig } from "../main";

export default class CondemnedSoul
{
    constructor(tile, data)
    {
        this.schedule = data.schedule;

        let config = getObjectConfig(data.type, true);

        if(config.spriteIndex >= 0)
        {
            this.spriteIndex = config.spriteIndex;
        }

        let physSettings = {
            tileTransform: { x: tile.x, y: tile.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: false,
            tag: "NPC",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.NPC,
            collisionMask: (COLLISION_GROUP.ELEVATOR | COLLISION_GROUP.FLOOR),
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings }); 
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        if(this.spriteIndex >= 0)
        {
            sprite(this.spriteIndex, screenPos.x, screenPos.y);
        }
    }
}