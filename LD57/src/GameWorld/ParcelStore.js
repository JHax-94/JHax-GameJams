import Parcel from "../Deliveries/Parcel";
import { consoleLog, EM } from "../main";
import PostStation from "./PostStation";

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

    SpawnParcel(targetPlanet, spawnAsSorted)
    {
        let newParcel = new Parcel(this.parent, targetPlanet, spawnAsSorted);

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
        /*consoleLog("Checking deliveries for station:");
        consoleLog(targetStation);
        consoleLog(`Is station?: ${targetStation instanceof PostStation}`);*/

        for(let i = 0; i < this.parcels.length; i ++)
        {
            /*consoleLog(`Check parcel:`);
            consoleLog(this.parcels[i]);*/

            if(this.parcels[i].Destination() === targetStation)
            {
                let rewardValue = this.parcels[i].RewardValue();
                this.parcels[i].Deliver(this.parent);

                let gameWorld = this.GameWorld();

                gameWorld.DeliveryReward(rewardValue);
                break;
            }
            else if(this.parcels[i].sorted === false && targetStation instanceof PostStation)
            {
                //consoleLog(`Attempt transfer for sorting (${targetStation.parcelStore.RemainingCapacity()})`);
                if(this.AttemptTransferOfParcel(this.parcels[i], targetStation))
                {
                    break;
                }
            }
        }
    }

    AttemptTransferOfParcel(parcel, targetStation)
    {
        let success = false;

        if(targetStation.parcelStore.RemainingCapacity() > 0)
        {
            targetStation.parcelStore.AddParcel(parcel);
            this.RemoveParcel(parcel);
            success = true;
        }

        return success;
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
            if(indexList[i] < this.parcels.length && indexList[i] >= 0)
            {
                parcels.push(this.parcels[indexList[i]]);
            }
        }

        return parcels;
    }

    RemainingCapacity()
    {
        return this.capacity - this.parcels.length;
    }

    UnsortedParcels()
    {
        let count = 0;

        for(let i = 0; i < this.parcels.length; i ++)
        {
            if(this.parcels[i].sorted === false)
            {
                count ++;
            }
        }

        return count;
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