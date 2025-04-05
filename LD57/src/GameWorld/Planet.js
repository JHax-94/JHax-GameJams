import { COLLISION_GROUP, EM, PIXEL_SCALE } from "../main";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class Planet extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld)
    {
        super(pos, {w:1, h:1}, title, "PLANET", gameWorld)

        this.localDeliveries = 0;

        this.nextUpgradeUnlock = this.GetNextUpgradeUnlock();
        this.upgradeLevel ++;
    }

    Update(deltaTime)
    {
        this.CheckUnlockCondition();
    }

    LocalDeliveries()
    {
        return this.localDeliveries;
    }

    DeliveryComplete()
    {
        this.localDeliveries ++;
    }

    IsPlanet()
    {
        return true;
    }

    Draw()
    {
        let screenPos = this.GetScreenPos();

        paper(14);
        rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE,  this.h * PIXEL_SCALE);

        this.DrawParcelsForPickup(screenPos);
        this.DrawSymbol(screenPos);
        this.DrawFocus(screenPos);
        this.DrawOffscreen(screenPos);
    }

    SpawnParcel(targetPlanet, spawnAsSorted)
    {
        this.parcelStore.SpawnParcel(targetPlanet, spawnAsSorted);
    }
}