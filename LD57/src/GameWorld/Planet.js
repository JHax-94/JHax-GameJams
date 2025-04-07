import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, CONSTANTS, EM, PIXEL_SCALE } from "../main";
import Shuttle from "../Spacecraft/Shuttle";
import AbstractCelestialBody from "./AbstractCelestialBody";

export default class Planet extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld)
    {
        super(pos, {w:1, h:1}, title, "PLANET", gameWorld)

        this.localDeliveries = 0;

        this.baseReward = 100;
        this.baseGracePeriod = 90;

        this.nextUpgradeUnlock = this.GetNextUpgradeUnlock();
        this.upgradeLevel ++;

        this.distToStation = vec2.dist(this.gameWorld.stations[0].phys.position, this.phys.position);

        this.localStation = this.gameWorld.GetNearestStationWithin(this, CONSTANTS.LOCAL_STATION_DISTANCE);

        this.shuttles = [];
    }

    SpawnShuttle()
    {
        let name = this.gameWorld.GetNextShuttleName()
                
        let newShuttle = new Shuttle(this, name, this.gameWorld);

        this.shuttles.push(newShuttle);

        this.gameWorld.RegisterSpacecraft(newShuttle);
    }

    Update(deltaTime)
    {
        this.CheckUnlockCondition();

        if(this.trySpawnStation)
        {
            consoleLog("Retry station spawn...");
            this.BuildStationNearby();
        }
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
        //this.DrawOffscreen(screenPos);
    }

    SpawnParcel(targetPlanet, spawnAsSorted)
    {
        this.parcelStore.SpawnParcel(targetPlanet, spawnAsSorted);
    }
}