import { vec2 } from "p2";
import { COLLISION_GROUP, consoleLog, CONSTANTS, EM, PIXEL_SCALE } from "../main";
import Shuttle from "../Spacecraft/Shuttle";
import AbstractCelestialBody from "./AbstractCelestialBody";
import Texture from "pixelbox/Texture";

export default class Planet extends AbstractCelestialBody
{
    constructor(pos, title, gameWorld, dormant = false)
    {
        super(pos, {w:1, h:1}, title, "PLANET", gameWorld)

        this.dormant = dormant;

        this.localDeliveries = 0;

        this.baseReward = 100;
        this.baseGracePeriod = 90;

        this.landColours = [ 3, 8, 9 ];
        this.waterColours = [ 13, 14, 10  ];

        this.nextUpgradeUnlock = this.GetNextUpgradeUnlock();
        this.upgradeLevel ++;

        this.distToStation = vec2.dist(this.gameWorld.stations[0].phys.position, this.phys.position);

        this.localStation = this.gameWorld.GetNearestStationWithin(this, CONSTANTS.LOCAL_STATION_DISTANCE);

        this.planetTex = this.BuildPlanetTexture();
        this.liveTex = new Texture(PIXEL_SCALE, PIXEL_SCALE);

        this.rotation = 0;
        this.rotationSpeed = 2 + random(6);

        this.shuttles = [];
    }

    BuildPlanetTexture(coverage = 5)
    {   

        let totalW = 4 * ( PIXEL_SCALE);

        let texture = new Texture(totalW, PIXEL_SCALE);

        let fullTexture = new Texture(2 * totalW, PIXEL_SCALE);

        texture.paper(this.waterColours[random(this.waterColours.length)]);
        texture.rectf(0, 0, totalW * 2, PIXEL_SCALE);

        texture.paper(this.landColours[random(this.landColours.length)]);

        let landBlocks = 36 + random(36);

        for(let i = 0; i < landBlocks; i ++)
        {
            let x = random(totalW - 1);
            let y = random(PIXEL_SCALE - 1);

            let max = 3;
            let w = 1 + random(max);
            let h = 1 + random(max);

            texture.rectf(x, y, w, h);
        }
        
        /*
        for(let i = 0; i < totalW; i ++)
        {
            let landRoll = random(11);
            if(landRoll < coverage)
            {
                let blocks = 1 + random(4);

                for(let b = 0; b < blocks; b ++)
                {
                    let start = random(PIXEL_SCALE-1);
                    let length = 1 + random(3);
                    
                    texture.rectf(i, start, 1, length);
                }
            }
        }*/

        texture._copy(0, 0, totalW, PIXEL_SCALE, fullTexture, 0, 0);
        texture._copy(0, 0, totalW, PIXEL_SCALE, fullTexture, totalW, 0);

        return fullTexture;
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
        this.rotation += deltaTime * this.rotationSpeed;

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

    WakeUp()
    {
        consoleLog("Try to wake:");
        consoleLog(this);
        if(this.dormant)
        {
            this.dormant = false;
            this.gameWorld.DiscoverPlanet(this);
        }
    }

    Draw()
    {
        if(!this.dormant)
        {
            let screenPos = this.GetScreenPos();

            //paper(14);
            //rectf(screenPos.x, screenPos.y, this.w * PIXEL_SCALE,  this.h * PIXEL_SCALE);

            this.planetTex._copy(Math.floor(this.rotation) % (4 * PIXEL_SCALE), 0, PIXEL_SCALE, PIXEL_SCALE, this.liveTex, 0, 0);

            //this.planetTex._drawEnhanced(screenPos.x, screenPos.y + PIXEL_SCALE);
            this.liveTex._drawEnhanced(screenPos.x, screenPos.y);

            this.DrawParcelsForPickup(screenPos);
            this.DrawSymbol(screenPos);
            this.DrawFocus(screenPos);
            //this.DrawOffscreen(screenPos);
        }
    }

    SpawnParcel(targetPlanet, spawnAsSorted)
    {
        this.parcelStore.SpawnParcel(targetPlanet, spawnAsSorted);
    }
}