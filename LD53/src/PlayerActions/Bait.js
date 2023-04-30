import Shadow from "../Characters/Shadow";
import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";
import Aura from "./Aura";

export default class Bait
{
    constructor(pos, bait)
    {
        this.renderLayer = "CRITTERS";

        let physSettings = {
            tileTransform: {
                x: pos.x,
                y: pos.y,
                w: 1,
                h: 1
            },
            mass: 50,
            isSensor: true,
            isKinematic: false,
            tag: "BAIT",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.PLAYER,
            collisionMask: COLLISION_GROUP.PLAYER,
            linearDrag: 0.9
        };

        EM.RegisterEntity(this, {physSettings: physSettings});

        this.shadow = new Shadow(this, { x:0, y: 7 });
        this.aura = new Aura(this, 4 * PIXEL_SCALE, "BAIT");

        this.spriteIndex = bait.spriteIndex;

        this.baitType = bait.baitType;
        let baitObj = this;

        this.aura.AddBeastChecks = function(beast) {
            baitObj.AuraBeastCheck(beast);
        }

        this.elapsedTime = 0;
    }

    DeleteBeast()
    {
        this.deleted = true;
        EM.RemoveEntity(this.aura);
        EM.RemoveEntity(this.shadow);
        EM.RemoveEntity(this);
    }

    AuraBeastCheck(beast)
    {
        beast.ReactTo({
            stimType: "SMELL",
            dealtBy: this
        });
    }

    Update(deltaTime)
    {
        if(this.aura)
        {
            this.aura.phys.position = this.phys.position;
        }
        this.elapsedTime += deltaTime;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();
        sprite(this.spriteIndex, screenPos.x, screenPos.y);

        this.aura.DrawAura({ angle: this.elapsedTime });
    }
}