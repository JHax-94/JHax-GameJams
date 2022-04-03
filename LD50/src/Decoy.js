import { EM, PIXEL_SCALE } from "./main";

export default class Decoy
{
    constructor(position, createdBy)
    {
        this.spriteIndex = 62;

        this.createdBy = createdBy;

        EM.RegisterEntity(this, {
            physSettings:
            {
                tileTransform:
                {
                    x: position.x / PIXEL_SCALE,
                    y: position.y / PIXEL_SCALE,
                    w: 0.8,
                    h: 0.8
                },
                isSensor: false,
                isKinematic: true,
                tag: "DECOY"
            }
        });
    }

    Destroy()
    {
        this.createdBy.DecoyDestroyed();
        EM.RemoveEntity(this);
    }

    HasStatus(statusName)
    {
        return this.createdBy.HasStatus(statusName);
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.spriteIndex, screenPos.x, screenPos.y); 
        
    }
}