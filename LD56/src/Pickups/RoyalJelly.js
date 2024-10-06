import { COLLISION_GROUP, EM } from "../main";

export default class RoyalJelly
{
    constructor(pos)
    {
        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "PICKUP",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PICKUP,
            collisionMask: (COLLISION_GROUP.PLAYER),
            linearDrag: 0.99
        };

        this.charges = 5;

        this.emptyFade = 2;
        this.fadeTimer = 0;

        this.sprites = [10, 26, 42, 58, 74, 90]

        EM.RegisterEntity(this, { physSettings: physSettings});
    }

    InteractWithBug(bug)
    {
        if(this.charges > 0 && !bug.IsJelliedUp())
        {
            bug.JellyUp(this);

            this.charges --;

            if(this.charges < 0)
            {
                this.charges === 0;
            }
        }
    }

    Destroy()
    {
        EM.RemoveEntity(this);
    }

    Update(deltaTime)
    {
        if(this.charges === 0)
        {
            this.fadeTimer += deltaTime;

            if(this.fadeTimer > this.emptyFade)
            {
                this.Destroy();
            }
        }
    }
    
    Draw()
    {
        let screenPos = this.GetScreenPos();

        sprite(this.sprites[this.charges], screenPos.x, screenPos.y);
    }
}