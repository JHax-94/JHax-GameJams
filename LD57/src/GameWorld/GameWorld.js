import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, UTIL } from "../main";
import Freighter from "../Spacecraft/Freighter";
import ParcelStoreUi from "../UI/ParcelStoreUi";
import ShopUi from "../UI/ShopUi";
import StatusUi from "../UI/StatusUi";
import ToastManager from "../UI/ToastManager";
import AbstractCelestialBody from "./AbstractCelestialBody";
import ParcelSpawnControl from "./ParcelSpawnControl";
import Planet from "./Planet";
import PlayerStatus from "./PlayerStatus";
import PostStation from "./PostStation";
import SymbolGenerator from "./SymbolGenerator";

export default class GameWorld
{
    constructor()
    {
        EM.RegisterEntity(this);

        this.stations = [];
        this.spacecraft = [];
        this.planets = [];

        this.starDay = 0;
        this.starWeek = 12;
        this.starYear = 3663;
        this.starEra = "MX";

        this.largeNarrFont = getFont("LargeNarr");

        this.daysPerWeek = 10;
        this.weeksPerYear = 50;

        this.dayTimer = 0;
        this.dayTime = 3;

        this.symbolGenerator = new SymbolGenerator();

        this.parcelSpawn = new ParcelSpawnControl(this);
        this.parcelStoreUi = new ParcelStoreUi(this);
        this.player = new PlayerStatus();

        this.statusUi = new StatusUi(this);
        this.shopUi = new ShopUi(this);

        this.toastManager = new ToastManager();

        this.selected = null;
    }

    GetNextFreighterName()
    {
        return `Freighter ${this.spacecraft.length}`;
    }

    StationsUpkeep()
    {
        let upkeep = 0;

        for(let i = 0; i < this.stations.length; i ++)
        {
            upkeep += this.stations[i].upkeep;
        }

        return upkeep;
    }

    SpacecraftUpkeep()
    {
        let upkeep = 0;

        for(let i = 0; i < this.spacecraft.length; i ++)
        {
            upkeep += this.spacecraft[i].upkeep;
        }

        return upkeep;
    }

    RegisterSpacecraft(craft)
    {
        this.spacecraft.push(craft);
    }

    Select(object)
    {
        if(object !== this.selected)
        {
            this.selected = object;
            this.parcelStoreUi.ClearSelection();
        }        
    }

    SendSpacecraftTo(spacecraft, target)
    {
        spacecraft.SetTarget(target);
    }

    AttemptToSendSpacecraft(source, target)
    {
        consoleLog("Attempt to send a spacecraft from:");
        consoleLog(source);
        consoleLog("to:");
        consoleLog(target);

        let bestSpacecraft = source.GetBestSpacecraft();
            
        if(bestSpacecraft !== null)
        {
            consoleLog("Sending spacecraft:");
            consoleLog(bestSpacecraft);
            consoleLog("to:");
            consoleLog(target);

            this.SendSpacecraftTo(bestSpacecraft, target);
        }
        else
        {
            consoleLog("No spacecraft found at source:");
            consoleLog(source);
        }
    }

    AttemptToTransferParcels(source, target)
    {
        if(source.IsSpacecraftDocked(target))
        {
            let selectedParcels = source.parcelStore.GetParcels(this.parcelStoreUi.selection);
            let remainingCapacity = target.parcelStore.RemainingCapacity();

            if(remainingCapacity < selectedParcels.length)
            {
                selectedParcels.length = remainingCapacity;
            }
            
            if(selectedParcels.length > 0)
            {
                this.parcelStoreUi.ClearSelection();
                target.parcelStore.AddParcels(selectedParcels);
                source.parcelStore.RemoveParcels(selectedParcels);
            }
        }
    }

    PerformAction(target)
    {
        consoleLog("Perform action on object:");
        consoleLog(target);
        if(this.selected !== null)
        {
            if(target instanceof AbstractCelestialBody)
            {
                this.AttemptToSendSpacecraft(this.selected, target);
            }
            else if(target instanceof Freighter)
            {
                this.AttemptToTransferParcels(this.selected, target);
            }
        }   
    }

    BuildStartingPlanets()
    {
        let firstPlanet = new Planet({ x: -7, y: -6}, `Planet 0`, this);
        let secondPlanet = new Planet({ x: 8, y: 9 }, `Planet 1`, this);
        let thirdPlanet = new Planet({ x: 14, y: -12}, `Planet 2`, this);

        this.planets.push(firstPlanet);
        this.planets.push(secondPlanet);
        this.planets.push(thirdPlanet);
    }

    SetupGameWorld()
    {
        let mainStation = new PostStation({ x: 0, y: 0 }, "POST STATION 1", this, this.symbolGenerator.MainStationSymbol());

        this.stations.push(mainStation);

        mainStation.SpawnFreighter();

        this.BuildStartingPlanets();

        mainStation.FocusCamera();

        this.parcelSpawn.SpawnParcel();
    }

    CalculateWeeklyUpkeep()
    {
        let upkeep = 0;

        for(let i = 0; i < this.stations.length; i ++)
        {
            upkeep += this.stations[i].upkeep;
        }

        for(let i = 0; i < this.spacecraft.length; i ++)
        {
            upkeep += this.spacecraft[i].upkeep;
        }

        return upkeep;
    }

    DeliveryReward(amount)
    {
        this.player.credits += amount;

        this.toastManager.AddMessage(`Delivery complete +${amount}`, 7);
    }

    ProcessWeeklyExpenses()
    {
        let upkeep = this.CalculateWeeklyUpkeep();

        this.player.credits -= upkeep;

        this.toastManager.AddMessage(`Weekly Upkeep -${upkeep}`, 9);
    }

    ProcessPurchase(amount)
    {
        this.player.credits -= amount;
        this.toastManager.AddMessage(`Upgrade purchased -${amount}`, 10);
    }

    Update(deltaTime)
    {
        this.parcelSpawn.ProcessUpdate(deltaTime);

        this.dayTimer += deltaTime;

        if(this.dayTimer > this.dayTime)
        {
            this.dayTimer -= this.dayTime;

            this.starDay += 1;

            if(this.starDay >= this.daysPerWeek)
            {
                this.starWeek += 1;
                this.starDay = 0;

                this.ProcessWeeklyExpenses();
            }

            if(this.starWeek >= this.weeksPerYear)
            {
                this.starYear += 1;
                this.starWeek = 0;
            }
        }
    }

    Draw()
    {
        let lineHeight = 8;

        if(this.selected)
        {
            //print(`${this.selected.title}`, 0, 0);
            setFont(this.largeNarrFont);

            paper(6);
            let title = `${this.selected.title}`.toUpperCase();

            let baseBounds = this.parcelStoreUi.Bounds(); 

            let labelWidth = UTIL.GetTextWidth(title, this.largeNarrFont) * PIXEL_SCALE + 4;

            let drawSelectAt = { 
                x: baseBounds.x,
                y: baseBounds.y - 1 * PIXEL_SCALE - 6,
                w: labelWidth,
                h: PIXEL_SCALE + 4
            };

            if(this.selected.symbolTex)
            {
                drawSelectAt.w += PIXEL_SCALE + 4;
            }

            rectf(drawSelectAt.x, drawSelectAt.y, drawSelectAt.w, drawSelectAt.h);

            if(this.selected.symbolTex)
            {
                paper(0);
                rectf(drawSelectAt.x + labelWidth + 2, drawSelectAt.y+2, PIXEL_SCALE, PIXEL_SCALE);
                this.selected.symbolTex._drawEnhanced(drawSelectAt.x + labelWidth+2, drawSelectAt.y + 2);
            }

            pen(1);
            print(title, drawSelectAt.x + 2, drawSelectAt.y + (drawSelectAt.h - UTIL.GetTextHeight(title, this.largeNarrFont) * PIXEL_SCALE) * 0.5);

            setFont("Default");

            /*
            if(this.selected.spacecraftRoster && this.selected.spacecraftRoster.length > 0)
            {
                pen(0)
                print("Docked: ", 0, lineHeight + 40);
                for(let i = 0; i < this.selected.spacecraftRoster.length; i ++)
                {
                    let craft = this.selected.spacecraftRoster[i];
                    print(craft.title, 0, 2 * lineHeight + 40);
                }
            }*/
        }
    }
}