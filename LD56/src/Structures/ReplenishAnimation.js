import { EM, getFont, PIXEL_SCALE, setFont } from "../main";

export default class ReplenishAnimation
{
    constructor(startPos)
    {
        this.renderLayer = "UI";

        this.lifeTime = 2;

        this.baseSpeed = PIXEL_SCALE;
        this.speed = this.baseSpeed;

        this.font = getFont("Default");

        let physSettings = {
            tileTransform: { x: startPos.x, y: startPos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: "UI",
            material: "playerMaterial",
            collisionGroup: 0,
            collisionMask: 0,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings} )
    }

    Update(deltaTime)
    {
        this.phys.velocity = [ 0, this.speed ];

        if(this.speed > 0)
        {
            this.speed -= deltaTime * this.baseSpeed;
        }

        this.lifeTime -= deltaTime;

        if(this.lifeTime <= 0)
        {
            EM.RemoveEntity(this);
        }
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        setFont(this.font);
        paper(0);
        pen(1);

        rectf(screenPos.x, screenPos.y, PIXEL_SCALE + 1, PIXEL_SCALE - 1);
        print(`+1`, screenPos.x +1, screenPos.y + 1);
    }
}