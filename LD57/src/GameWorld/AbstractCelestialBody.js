import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main";
import MOUSE_BUTTON from "../MouseButtons";

export default class AbstractCelestialBody
{
    constructor(pos, dims, title, tag, gameWorld)
    {
        this.gameWorld = gameWorld;
        this.title = title;
        this.w = dims.w;
        this.h = dims.h;
        this.subTag = tag;

        this.tilePos = {x: pos.x, y: pos.y};

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: this.w * 3, h: this.h * 3 },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "CELESTIAL",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STATIONS,
            collisionMask: COLLISION_GROUP.SPACECRAFT,
            linearDrag: 0.99
        };


        EM.RegisterEntity(this, { physSettings: physSettings  })

        this.spacecraftRoster = [];
    }

    AddSpacecraft(spacecraft)
    {
        if(this.spacecraftRoster.indexOf(spacecraft) < 0)
        {
            this.spacecraftRoster.push(spacecraft);

            spacecraft.ArrivedAtCelestial(this);
        }
    }

    RemoveSpacecraft(spacecraft)
    {
        let index = this.spacecraftRoster.indexOf(spacecraft);

        if(index >= 0)
        {
            this.spacecraftRoster.splice(index, 1);

            spacecraft.LeftCelestial(this);
        }
    }

    Click(click)
    {
        consoleLog(`${this.subTag} ${this.title} clicked!`);
        consoleLog(click);

        if(click === MOUSE_BUTTON.LEFT_MOUSE)
        {
            this.gameWorld.Select(this);
        }
    }

    Hover(setHover)
    {
        this.hovered = setHover;
    }   

    Bounds()
    {
        let screenPos = this.GetScreenPos();

        let bounds = { 
            x: screenPos.x,
            y: screenPos.y,
            w: this.w * PIXEL_SCALE,
            h: this.h * PIXEL_SCALE
        };

        return bounds;
    }

    Select()
    {

    }

    FocusCamera()
    {
        EM.camera.MoveTo(this.phys.position[0] - 0.5 * TILE_WIDTH * PIXEL_SCALE, this.phys.position[1] + 0.5 * TILE_HEIGHT * PIXEL_SCALE);
    }

    DrawFocus(screenPos)
    {
        if(this.hovered)
        {
            pen(1);
            rect(screenPos.x - 2, screenPos.y - 2, this.w * PIXEL_SCALE + 4, this.h * PIXEL_SCALE + 4);
        }
    }
}