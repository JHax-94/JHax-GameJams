import Explosion from "./Explosion";
import { EM, SFX } from "./main";

export default class Boulder
{
    constructor(position, spawnPointRef)
    {
        this.spriteIndex = 33;

        this.spawnRef = spawnPointRef;

        EM.RegisterEntity(this, {
            physSettings: {
                    tileTransform: {
                        x: position.x,
                        y: position.y,
                        w: 1,
                        h: 1
                    },
                    mass: 350,
                    isSensor: false,
                    isKinematic: false,
                    tag: "BOULDER",
                    material: "wallMaterial",
                    linearDrag: 0.9,
                    angularDrag: 0.9
                }
            });

    }

    Destroy()
    {
        this.spawnRef.rock = null;

        EM.RemoveEntity(this);

        sfx(SFX.rockBreak);

        let explosion = new Explosion(this.GetScreenPos());
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
}