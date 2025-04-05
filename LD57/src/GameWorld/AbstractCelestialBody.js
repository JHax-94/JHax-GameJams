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

        this.upgradeLevel = 1;
        this.upgrades = [];

        this.nextUpgradeUnlock = null;/*this.GetNextUpgradeUnlock();
        consoleLog("--- NEXT UPGRADE UNLOCK ---");
        consoleLog(this.nextUp/gradeUnlock);
        this.upgradeLevel ++;*/
    }

    GenerateNextUpgradeUnlock()
    {
        this.nextUpgradeUnlock = this.GetNextUpgradeUnlock();
        this.upgradeLevel ++;
    }

    IsPlanet()
    {
        return false;
    }

    IsStation()
    {
        return false;
    }

    AvailableUpgrades()
    {
        return this.upgrades;
    }
    
    BuildUnlockCondition(unlock)
    {
        let condition = {
            type: unlock.type,
            startsAt: 0,
            target: 0,
            text: unlock.text,
            checkProgress: null
        };

        if(unlock.type === "GlobalDeliveries")
        {
            consoleLog(`Set initial data from:`);
            consoleLog(this.gameWorld.player);

            condition.startsAt = this.gameWorld.player.parcelsDelivered;
            condition.checkProgress = () => { return this.gameWorld.player.parcelsDelivered; };
        }
        else if(unlock.type === "Sorts")
        {
            if(!this.ParcelsSorted)
            {
                console.error("Object needs ParcelsSorted method");
                consoleLog(this);
            }

            consoleLog("Set initial data from:");
            consoleLog(this);

            condition.startsAt = this.ParcelsSorted();
            condition.checkProgress = () => { return this.ParcelsSorted(); }
        }
        else if(unlock.type === "LocalDeliveries")
        {
            consoleLog("Set initial data from:");
            consoleLog(this);
            condition.startsAt = this.LocalDeliveries();
            condition.checkProgress = () => { return this.LocalDeliveries(); }
        }
        else
        {
            console.error(`Unrecognised unlock type: ${unlock.type}`);
        }

        condition.target = condition.startsAt + unlock.threshold * this.upgradeLevel;

        consoleLog("--- CONDITION BUILT ---");
        consoleLog(condition);

        return condition;
    }

    GetUnlockCondition(typeName)
    {
        let upgradeUnlock = assets.upgradesConfig.upgradeUnlocks;

        let condition = null;

        for(let i = 0; i < upgradeUnlock.length; i ++)
        {
            if(upgradeUnlock[i].type === typeName)
            {
                condition = this.BuildUnlockCondition(upgradeUnlock[i]);
                break;
            }
        }

        return condition;
    }

    ForceUpgrade(upgradeName)
    {
        let upgradeList = assets.upgradesConfig.upgrades;

        for(let i = 0; i < upgradeList.length; i ++)
        {
            if(upgradeList[i].type === upgradeName)
            {
                this.upgrades.push(upgradeList[i]);
                break;
            }
        }
    }

    SetUpgrade()
    {
        let upgradesList = assets.upgradesConfig.upgrades;

        consoleLog("Choose upgrade from list:");
        consoleLog(upgradesList);

        let upgradesForThisBody = [];

        for(let i = 0; i < upgradesList.length; i ++)
        {
            if((upgradesList[i].stations && this.IsStation()) || (upgradesList[i].planets && this.IsPlanet()))
            {
                upgradesForThisBody.push(upgradesList[i]);
            }
        }

        this.upgrades.push(upgradesForThisBody[random(upgradesForThisBody.length)]);

        /*consoleLog("New upgrades list:");
        consoleLog([...this.upgrades]);*/
    }

    GetNextUpgradeUnlock()
    {
        let upgradeUnlocks = assets.upgradesConfig.upgradeUnlocks;

        let availableUnlockMethods = [];

        for(let i = 0; i < upgradeUnlocks.length; i ++)
        {
            if(upgradeUnlocks[i].stations && this.IsStation())
            {
                availableUnlockMethods.push(upgradeUnlocks[i]);
            }
            else if(upgradeUnlocks[i].planets && this.IsPlanet())
            {
                availableUnlockMethods.push(upgradeUnlocks[i]);
            }
        }

        return this.BuildUnlockCondition(availableUnlockMethods[random(availableUnlockMethods.length)]);
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

    CheckUnlockCondition()
    {
        if(this.nextUpgradeUnlock !== null)
        {
            if(this.nextUpgradeUnlock.checkProgress() >= this.nextUpgradeUnlock.target)
            {
                this.SetUpgrade();
                this.nextUpgradeUnlock = null;                
            }
        }
    }

    DrawOffscreen(screenPos)
    {
        let indicatorPos = { x: screenPos.x, y: screenPos.y }
        let drawIndicator = false;

        if(indicatorPos.x < -PIXEL_SCALE)
        {
            drawIndicator = true;
            indicatorPos.x = 0;
        }
        else if(indicatorPos.x >= TILE_WIDTH * PIXEL_SCALE)
        {
            indicatorPos.x = TILE_WIDTH * PIXEL_SCALE - PIXEL_SCALE;
            drawIndicator = true;
        }

        if(indicatorPos.y < -PIXEL_SCALE)
        {
            drawIndicator = true;
            indicatorPos.y = 0;
        }
        else if(indicatorPos.y >= TILE_HEIGHT * PIXEL_SCALE)
        {
            indicatorPos.y = TILE_HEIGHT *PIXEL_SCALE - PIXEL_SCALE
            drawIndicator = true;
        }

        if(drawIndicator)
        {
            rect(indicatorPos.x, indicatorPos.y, PIXEL_SCALE, PIXEL_SCALE);
            this.symbolTex._drawEnhanced(indicatorPos.x, indicatorPos.y);
        }
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