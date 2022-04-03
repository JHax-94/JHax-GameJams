import { EM } from "./main";

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
                    mass: 10,
                    isSensor: false,
                    isKinematic: false,
                    tag: "BOULDER",
                    material: "wallMaterial"
                }
            });

    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        sprite(this.spriteIndex, screenPos.x, screenPos.y);
    }
}