import { vec2 } from "p2";
import ParcelStore from "../GameWorld/ParcelStore";
import Spacecraft from "./Spacecraft";
import { consoleLog, EM } from "../main";

export default class Shuttle extends Spacecraft
{
    constructor(atStation, title, gameWorld)
    {
        super(atStation, title, gameWorld, 49)

        this.upkeep = 5;
        this.fuelRate = 1;

        this.parcelStore = new ParcelStore(this, 1);

        this.homePlanet = atStation;
        this.targetStation = gameWorld.GetNearestStation(atStation);

        this.maxDockTime = 12;
    }

    BestParcelToTakeToStation()
    {
        let selection = [];
        let minParcelDist = null;

        for(let i = 0; i < this.dockedStation.parcelStore.Count(); i++)
        {  
            let parcel = this.dockedStation.parcelStore.Parcel(i);
            let parcelDist = vec2.sqrDist(parcel.targetPlanet.phys.position, this.dockedStation.phys.position) < parcel.startDistance;

            if(parcel.sorted === false)
            {
                selection = [ i ];
                break;
            }
            else if(parcelDist < parcel.startSqDistance && (minParcelDist === null || parcelDist < minParcelDist))
            {
                minParcelDist = parcelDist;
                selection = [i];
            }
        }   

        return selection;
    }

    ParcelForHomePlanet()
    {
        let selection = [];

        for(let i = 0; i < this.dockedStation.parcelStore.Count(); i ++)
        {
            let parcel = this.dockedStation.parcelStore.Parcel(i);

            if(parcel.sorted && parcel.targetPlanet === this.homePlanet)
            {
                selection = [i];
                break;
            }
        }

        return selection;
    }

    WaitForParcels()
    {
        let isHomePlanet = (this.dockedStation === this.homePlanet);
        let isTargetStation = (this.dockedStation === this.targetStation);

        return isHomePlanet || (isTargetStation && this.BestParcelToTakeToStation() === null && this.dockedStation.parcelStore.UnsortedParcels() === 0);
    }

    WaitToDepart()
    {
        let fuelConditionMet = this.fuel === this.maxFuel;

        let parcelsConditionMet = this.WaitForParcels();

        let timeConditionMet = this.dockElapsedTimer > this.maxDockTime;

        return fuelConditionMet && (parcelsConditionMet || timeConditionMet);
    }

    InternalUpdate(deltaTime)
    {
        if(this.WaitToDepart())
        {
            if(this.dockedStation === this.homePlanet)
            {
                if(this.parcelStore.Count() === 0 && this.dockedStation.parcelStore.Count() > 0)
                {
                    let selection = this.BestParcelToTakeToStation();

                    if(selection.length > 0)
                    {
                        this.gameWorld.AttemptToTransferParcels(this.dockedStation, this, selection, true);
                        this.SetTarget(this.targetStation);
                    }
                }
            }
            else if(this.dockedStation === this.targetStation)
            {
                if(this.parcelStore.Count() === 0 && this.dockedStation.parcelStore.Count() > 0)
                {
                    let selection = this.ParcelForHomePlanet();

                    if(selection.length === 0) 
                    {
                        this.SetTarget(this.homePlanet);
                    }
                    else 
                    {
                        this.gameWorld.AttemptToTransferParcels(this.dockedStation, this, selection, true);
                        this.SetTarget(this.homePlanet);
                    }
                }
            }
        }
    }

    RefuelComplete()
    {
        if(this.previousTarget)
        {
            this.SetTarget(this.previousTarget);
        }
        else 
        {
            this.SetTarget(this.homePlanet);
        }
    }

    InternalDeliveryCheck()
    {
        consoleLog(`SHUTTLE INTERNAL DELIVERY CHECK`);
        if(this.dockedStation === this.targetStation)
        {
            for(let i = 0; i < this.parcelStore.Count(); i ++)
            {
                let parcel = this.parcelStore.Parcel(i);

                if(parcel.sorted && parcel.targetPlanet !== this.homePlanet)
                {
                    consoleLog(`>>> Attempt transfer from ${this.title} to ${this.dockedStation.title} <<<`);

                    if(this.parcelStore.AttemptTransferOfParcel(parcel, this.dockedStation))
                    {
                        break;
                    }
                }
            }
        }
    }
}