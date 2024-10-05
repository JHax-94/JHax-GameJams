import { consoleLog, EM } from "../main";

export default class TinyCreature
{
    constructor(pos, parentSwarm, physConfig)
    {
        this.parentSwarm = parentSwarm;

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 1, h: 1 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: true,
            tag: physConfig.tag,
            material: "playerMaterial",
            collisionGroup: physConfig.collisionGroup,
            collisionMask: physConfig.collisionMask,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Update(deltaTime)
    {
        this.phys.velocity = [ this.parentSwarm.phys.velocity[0], this.parentSwarm.phys.velocity[1]];
    }

    Draw()
    {
        consoleLog("Tiny creature!");
        let screenPos = this.GetScreenPos();

        paper(9);
        rectf(screenPos.x, screenPos.y, 1, 1);
        paper(10);
        rectf(screenPos.x, screenPos.y + 1, 1, 1);

        EM.hudLog.push(`Tc: (${screenPos.x}, ${screenPos.y})`);
    }
}