import Explosion from "./Explosion";
import { EM, PIXEL_SCALE } from "./main";

export default class Decoy
{
    constructor(position, createdBy, spriteIndex)
    {
        this.spriteIndex = spriteIndex;

        this.createdBy = createdBy;

        this.isDecoy = true;

        this.staticTimer = 0;

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

    Update(deltaTime)
    {
        this.staticTimer += deltaTime;
    }

    Destroy()
    {
        this.createdBy.DecoyDestroyed();
        EM.RemoveEntity(this);

        let explosion = new Explosion(this.GetScreenPos());
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