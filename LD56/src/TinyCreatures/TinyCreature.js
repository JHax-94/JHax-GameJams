import { consoleLog, EM, PIXEL_SCALE } from "../main";

export default class TinyCreature
{
    constructor(pos, physConfig, colours)
    {
        this.renderLayer = "WORLD_SUPER";
        this.colours = [ 9, 10 ];
        if(colours)
        {
            this.colours = colours;
        }
        this.physConfig = physConfig;

        this.gameWorld = null;

        this.speed = 2 * PIXEL_SCALE;

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: 0.25, h: 0.25 },
            mass: 100,
            isSensor: false,
            freeRotate: false,
            isKinematic: false,
            tag: physConfig.tag,
            material: "playerMaterial",
            collisionGroup: physConfig.collisionGroup,
            collisionMask: physConfig.collisionMask,
            linearDrag: 0.99
        };

        /*
        consoleLog("Register tiny creature with phys settings:");
        consoleLog(physSettings);*/

        EM.RegisterEntity(this, { physSettings: physSettings });
    }

    Refresh()
    {

    }

    Damage()
    {
        this.Despawn();
    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAMEWORLD");
        }

        return this.gameWorld;
    }

    ProcessHitWith(bug)
    {

    }

    StructureTouched(structure)
    {

    }

    Despawn()
    {
        EM.RemoveEntity(this);   
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(this.colours[0]);
        rectf(screenPos.x, screenPos.y, 1, 1);
        paper(this.colours[1]);
        rectf(screenPos.x, screenPos.y + 1, 1, 1);
    }
}