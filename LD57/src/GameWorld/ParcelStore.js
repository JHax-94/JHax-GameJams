import Parcel from "../Deliveries/Parcel";

export default class ParcelStore
{
    constructor(parent, capacity)
    {
        this.capacity = capacity;
        this.parent = parent;
        this.parcels = [];
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
}