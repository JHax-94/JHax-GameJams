import { COLLISION_GROUP, consoleLog, EM, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH } from "../main";
import MOUSE_BUTTON from "../MouseButtons";
import InfluenceZone from "./InfluenceZone";
import ParcelStore from "./ParcelStore";

export default class AbstractCelestialBody
{
    constructor(pos, dims, title, tag, gameWorld, symbolTex = null)
    {
        this.gameWorld = gameWorld;
        this.title = title;
        this.w = dims.w;
        this.h = dims.h;
        this.subTag = tag;

        this.tilePos = {x: pos.x, y: pos.y};

        this.symbolTex = symbolTex ?? gameWorld.symbolGenerator.GenerateSymbol();

        let physSettings = {
            tileTransform: { x: pos.x, y: pos.y, w: this.w, h: this.h },
            mass: 100,
            isSensor: true,
            freeRotate: false,
            isKinematic: true,
            tag: "CELESTIAL",
            material: "playerMaterial",
            collisionGroup: COLLISION_GROUP.STATIONS,
            collisionMask: 0,
            linearDrag: 0.99
        };

        EM.RegisterEntity(this, { physSettings: physSettings  })

        this.influence = new InfluenceZone(this, { w: 3, h: 3});

        this.spacecraftRoster = [];

        this.parcelStore = new ParcelStore(this, 12);
    }

    AvailableUpgrades()
    {
        return [];
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

    SpacecraftAvailabilityScore(spacecraft)
    {
        return 1;
    }

    GetBestSpacecraft()
    {
        let spacecraft = null;

        for(let i = 0; i < this.spacecraftRoster.length; i ++)
        {
            if(spacecraft === null)
            {
                spacecraft = this.spacecraftRoster[i];
            }
            else if(this.SpacecraftAvailabilityScore(spacecraft) < this.SpacecraftAvailabilityScore(this.spacecraftRoster[i]))
            {
                spacecraft = this.spacecraftRoster[i];
            }
        }

        return spacecraft;
    }

    IsSpacecraftDocked(spacecraft)
    {
        return spacecraft.dockedStation === this;
    }

    Click(click)
    {
        consoleLog(`${this.subTag} ${this.title} clicked!`);
        consoleLog(click);

        if(click === MOUSE_BUTTON.LEFT_MOUSE)
        {
            this.gameWorld.Select(this);
        }
        else if(click === MOUSE_BUTTON.RIGHT_MOUSE)
        {
            this.gameWorld.PerformAction(this);
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

    DrawSymbol(screenPos)
    {
        if(this.symbolTex)
        {
            this.symbolTex._drawEnhanced(screenPos.x - PIXEL_SCALE, screenPos.y - PIXEL_SCALE);
        }
    }

    DrawParcelsForPickup(screenPos)
    {
        if(this.parcelStore.Count() > 0)
        {
            let pickupZone = { x: screenPos.x - 8, y: screenPos.y + PIXEL_SCALE };

            sprite(32, pickupZone.x, pickupZone.y );

            setFont("Default");
            pen(1);
            print(`x ${this.parcelStore.Count()}`, pickupZone.x + PIXEL_SCALE, pickupZone.y + 4);
        }
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