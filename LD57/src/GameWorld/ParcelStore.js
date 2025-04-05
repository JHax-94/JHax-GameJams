import Parcel from "../Deliveries/Parcel";
import { consoleLog, EM } from "../main";

export default class ParcelStore
{
    constructor(parent, capacity)
    {
        this.capacity = capacity;
        this.parent = parent;
        this.parcels = [];

        this.gameWorld = null;
    }

    GameWorld()
    {
        if(this.gameWorld === null)
        {
            this.gameWorld = EM.GetEntity("GAME_WORLD");
        }

        return this.gameWorld;
    }

    Count()
    {
        return this.parcels.length;
    }

    SpawnParcel(targetPlanet)
    {
        let newParcel = new Parcel(targetPlanet)

        this.parcels.push(newParcel);
    }

    AddParcel(parcel)
    {
        consoleLog("Adding Parcel:");
        consoleLog(parcel);

        let indexOf = this.parcels.indexOf(parcel);

        if(indexOf < 0)
        {
            this.parcels.push(parcel);
            consoleLog("Parcel Added!");
        }
    }

    CheckDeliveriesForDestination(targetStation)
    {
        for(let i = 0; i < this.parcels.length; i ++)
        {
            if(this.parcels[i].Destination() === targetStation)
            {
                let rewardValue = this.parcels[i].RewardValue();
                this.parcels[i].Deliver(this.parent);

                let gameWorld = this.GameWorld();

                gameWorld.DeliveryReward(rewardValue);
                break;
            }
        }
    }

    AddParcels(parcels)
    {
        consoleLog("Adding parcels:");
        consoleLog(parcels);

        for(let i = 0; i < parcels.length; i ++)
        {
            this.AddParcel(parcels[i]);
        }
    }

    RemoveParcel(parcel)
    {
        let indexOf = this.parcels.indexOf(parcel);

        if(indexOf >= 0)
        {
            this.parcels.splice(indexOf, 1);
        }
    }

    RemoveParcels(parcels)
    {
        for(let i = 0; i < parcels.length; i ++)
        {
            this.RemoveParcel(parcels[i]);
        }
    }

    GetParcels(indexList)
    {
        let parcels = [];

        for(let i = 0; i < indexList.length; i++)
        {
            parcels.push(this.parcels[indexList[i]]);
        }

        return parcels;
    }

    RemainingCapacity()
    {
        return this.capacity - this.parcels.length;
    }

    Parcel(index)
    {
        let parcel = null;

        if(index >= 0 && index < this.parcels.length)
        {
            parcel = this.parcels[index];
        }

        return parcel;
    }
}